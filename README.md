# xo-backend
tic tac toe backend

## How to start developing

* Start `docker-compose.yaml` for `mongodb` on your local machine or use any other available mongo database
* For the first time run `npm run build:watch` to create `dist/server.bundle.js` file - main entry point
* For regular development run `npm run start:watch` it will start in parallel `build:watch` and `nodemon` scripts that will restart `nodejs` process on every saved codebase change
