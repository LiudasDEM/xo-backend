import express, { Request, Response, NextFunction } from 'express'

import './mongoose'
import logger from './logger'
import routes from './routes'


const app = express()


app.set('trust proxy', '127.0.0.1')
app.use('/api', routes)


app.use((req, res, next) => {
	next(new Error('NotFound'))
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	if (err.message === 'NotFound') {
		res.sendStatus(404)
		return
	}

	logger.error(err.message, { req, error: err })
	res.sendStatus(500)
})


export default app
