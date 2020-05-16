import express from 'express'
const router = express.Router()
import wrap from 'express-async-wrap'


import request from 'request-promise'
import NodeCache from 'node-cache'
import { SourceMapConsumer } from 'source-map'


import logger from '../logger'
import config from '../../config'

const stackCache = new NodeCache({ stdTTL: 5 * 60 })


async function remapStackFromSourceMap(stack: any, rawSourceMap: string): Promise<string> {
	// @ts-ignore
	return await SourceMapConsumer.with(rawSourceMap, null, (consumer: any) => {
		const sourcePositon = /http.*:(\d+):(\d+)/
		return stack.split('\n').map((x: string) => {
			const match: any = x.match(sourcePositon)
			if (!match) { return x }
			const op = consumer.originalPositionFor({ line: match[1] | 0, column: match[2] | 0 })
			const originalPosition = op.source + ':' + op.line + ':' + op.column
			return x.replace(match[0], originalPosition)
		}).join('\n')
	})
}


router.get('/', wrap(async function (req, res) {
	const uri = `${config.siteUrl}/main.bundle.js.map`
	let stack: string = stackCache.get(uri)

	if (!stack) {
		const sm = await request(uri)
		if (!sm) { res.json({}); return }
		stack = await remapStackFromSourceMap(req.query.msg || '', sm)
		stackCache.set(uri, stack)
	}

	const message = stack.split('\n')[0]


	logger.log('error', message, {
		ip: (req.headers && req.headers['x-forwarded-for']) || req.connection.remoteAddress,
		hostname: require('os').hostname(),
		environment: config.logger.logstashHost,
		stack,
	})

	res.json({})
}))


export default router
