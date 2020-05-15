# xo-backend
tic tac toe backend

## How to start developing

* Start `docker-compose.yaml` for `mongodb` on your local machine or use any other available mongo database
* For the first time run `npm run build:watch` to create `dist/server.bundle.js` file - main entry point
* For regular development run `npm run start:watch` it will start in parallel `build:watch` and `nodemon` scripts that will restart `nodejs` process on every saved codebase change


## Elastic stack

Elastic stack has separate `docker-compose` file because it uses a lot of resources and is not necessary for development

If possible use infrastracture elk stack and update `.env` file with `ELASTIC_STACK_LOGSTASH_HOST` key

Otherwise run `docker-compose -f docker-compose-elk.yaml up -d` in `docker/` dir for local elastic stack, kibana will be accessable on `http://localhost:5601`
(be patient, elastic stack on development machines takes time to start)
