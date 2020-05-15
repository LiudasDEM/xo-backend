import 'mocha'

import request from 'supertest'
import assert from 'assert'

import util from '../util'
import { createGame, createGameDTO, createEvent, createEventDTO, mId, mapEventToTestDTO } from '../create'

import app from '../../src/app'


describe('/api/games', function () {
	beforeEach(util.clearTestingData)

	describe('GET /api/games/:id', function () {
		it('should throw NotFound when no documents are in database', async function () {
			await request(app)
				.get(`/api/games/${mId('1')}`)
				.expect(404, { message: 'NotFound' })
		})

		it('should throw NotFound when no game is found by given _id', async function () {
			await createGame()

			await request(app)
				.get(`/api/games/${mId('1')}`)
				.expect(404, { message: 'NotFound' })
		})

		it('should throw ValidationError when invalid format mongo id is given', async function () {
			await request(app)
				.get('/api/games/mongoid')
				.expect(400, { message: 'ValidationError', extra: 'mongoid does not look like mongo object id' })
		})

		it('should return document matched by _id', async function () {
			const doc = await createGame()

			await request(app)
				.get(`/api/games/${doc._id}`)
				.expect(200)
		})

		it('should return only in query selected options', async function () {
			const doc = await createGame({
				...createGameDTO(),
				status: 'finished',
				winner: 'Player O',
			})

			await request(app)
				.get(`/api/games/${doc._id}`)
				.query({ select: 'status winner' })
				.expect(200, {
					_id: doc._id.toString(),
					status: 'finished',
					winner: 'Player O',
				})
		})
	})

	describe('GET /api/games/:id/events', function () {
		it('should throw ValidationError when invalid format mongo id is given', async function () {
			await request(app)
				.get('/api/games/mongoid/events')
				.expect(400, { message: 'ValidationError', extra: 'mongoid does not look like mongo object id' })
		})

		it('should throw NotFound error when game by given id does not exists', async function () {
			await request(app)
				.get(`/api/games/${mId('1')}/events`)
				.expect(404, { message: 'NotFound' })
		})

		it('should return empty array when no events are in database', async function () {
			const doc = await createGame()

			await request(app)
				.get(`/api/games/${doc._id}/events`)
				.set('Return-Total-Count', 'true')
				.expect('total-count', '0')
				.expect(200, [])
		})

		it('should return empty array when all created events do not belong to given game', async function () {
			const doc = await createGame()

			await Promise.all([
				createEvent(),
				createEvent(),
				createEvent(),
			])

			await request(app)
				.get(`/api/games/${doc._id}/events`)
				.set('Return-Total-Count', 'true')
				.expect('total-count', '0')
				.expect(200, [])
		})

		it('should return all given id game events', async function () {
			const doc = await createGame()

			const [e1, e2] = await Promise.all([
				createEvent({ ...createEventDTO(), game: doc._id }),
				createEvent({ ...createEventDTO(), game: doc._id }),
				createEvent(),
			])

			await request(app)
				.get(`/api/games/${doc._id}/events`)
				.set('Return-Total-Count', 'true')
				.expect('total-count', '2')
				.expect(200)
				.expect(res =>
					assert.deepStrictEqual(res.body.map(mapEventToTestDTO), [e1, e2].map(mapEventToTestDTO)))
		})
	})
})
