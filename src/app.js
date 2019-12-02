const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const socketIO = require('socket.io');
const http = require('http');
const migrateDatabase = require('./db/migration');
const initServices = require('./service/index');

async function app() {
  await migrateDatabase();

  const app = express();
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const server = http.createServer(app);
  const io = socketIO(server);

  const port = process.env.PORT || 2210;
  await server.listen(port, () => console.log('> Servidor on-line na porta:', port));

  initServices(io);
}

module.exports = app();
