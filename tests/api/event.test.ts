import 'mocha'
import request from 'supertest'

import util from '../util'
import { createEvent, createEventDTO, mId } from '../create'

import app from '../../src/app'


describe('/api/events', function () {
	beforeEach(util.clearTestingData)

	describe('GET /api/events/:id', function () {
		it('should throw NotFound when no documents are in database', async function () {
			await request(app)
				.get(`/api/events/${mId('1')}`)
				.expect(404, { message: 'NotFound' })
		})

		it('should throw NotFound when no event is found by given _id', async function () {
			await createEvent()

			await request(app)
				.get(`/api/events/${mId('1')}`)
				.expect(404, { message: 'NotFound' })
		})

		it('should throw ValidationError when invalid format mongo id is given', async function () {
			await request(app)
				.get('/api/events/mongoid')
				.expect(400, { message: 'ValidationError', extra: 'mongoid does not look like mongo object id' })
		})

		it('should return document matched by _id', async function () {
			const doc = await createEvent()

			await request(app)
				.get(`/api/events/${doc._id}`)
				.expect(200)
		})

		it('should return only in query selected options', async function () {
			const doc = await createEvent({
				...createEventDTO(),
				action: 'finished',
				player: 'Player O',
				row: 0,
				column: 0,
			})

			await request(app)
				.get(`/api/events/${doc._id}`)
				.query({ select: 'action player row column' })
				.expect(200, {
					_id: doc._id.toString(),
					action: 'finished',
					player: 'Player O',
					row: 0,
					column: 0,
				})
		})
	})
})
