import express from 'express'
import wrap from 'express-async-wrap'

import eventService from '../services/eventService'

const router = express.Router()


router.get('/:id', wrap(async function (req, res) {
	const event = await eventService.getOne({
		id: req.params.id, lean: true, restApi: true, query: req.query,
	})
	res.json(event)
}))


router.post('/', wrap(async function (req, res) {
	res.sendStatus(201)
}))


export default router
