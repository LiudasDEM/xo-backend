export default {
	httpPort: process.env.HTTP_PORT || 8080,
	mongoConnectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/tic-tac-toe',
	logger: {
		index: 'xo-backend',
		logstashHost: process.env.ELASTIC_STACK_LOGSTASH_HOST || 'localhost',
		environment: process.env.ELASTIC_STACK_ENVIRONMENT || 'dev',
	},
}
