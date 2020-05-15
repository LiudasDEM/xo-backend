import express from 'express'
import wrap from 'express-async-wrap'

import gameService from '../services/gameService'
import eventService from '../services/eventService'


const router = express.Router()


router.get('/:id', wrap(async function (req, res) {
	const game = await gameService.getOne({
		id: req.params.id, lean: true, restApi: true,
		query: req.query,
	})
	res.json(game)
}))


router.post('/', wrap(async function (req, res) {
	res.sendStatus(201)
}))


router.get('/:id/events', wrap(async function (req, res) {
	const game = await gameService.getOne({ id: req.params.id, lean: true, restApi: true })

	const events = await eventService.get({
		predicate: { game: game._id }, query: req.query,
		req, res, lean: true,
	})

	res.json(events)
}))


export default router
