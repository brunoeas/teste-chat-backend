const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const socketio = require('socket.io');
const http = require('http');
const migrateDatabase = require('./db/index');
const initServices = require('./service/index');

migrateDatabase();

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 2210;
server.listen(port, () => console.log('> Servidor on-line na porta:', port));

initServices(io);

module.exports = { io, server, app };
