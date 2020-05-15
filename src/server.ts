import 'dotenv/config'

import config from '../config'

import app from './app'

app.listen(config.httpPort, () => {
	console.info(`SERVER listening on port ${config.httpPort}`)
})
