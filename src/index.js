const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const socketio = require('socket.io');
const http = require('http');
const connectAndMigrateDatabase = require('./db/index');

connectAndMigrateDatabase();

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', socket => {
  console.log('alguém conectou');
  socket.on('teste', res => console.log(res));
  setTimeout(() => socket.emit('teste', 'eduardo'), 5000);
});

server.listen(2210, () => console.log('> Servidor on-line na porta 2210'));

module.exports = app;
