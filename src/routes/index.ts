import express from 'express'

const router = express.Router()


router.get('/health', function (req, res) {
	res.json(require('os').hostname())
})


export default router
