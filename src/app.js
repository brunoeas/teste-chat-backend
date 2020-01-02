const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const socketIO = require('socket.io');
const http = require('http');
const migrateDatabase = require('./db/migration');
const initServices = require('./service/index');

/**
 * Função principal que inicia os serviços
 *
 * @author Bruno Eduardo <bruno.soares@kepha.com.br>
 */
async function app() {
  await migrateDatabase();

  const app = express();
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
  });

  const server = http.createServer(app);
  const io = socketIO(server);

  const port = process.env.PORT || 2210;
  server.listen(port, () => console.log('> Servidor on-line na porta:', port));

  initServices(app, io);
}

module.exports = app();
