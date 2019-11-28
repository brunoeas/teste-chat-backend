const { NEW_MESSAGE, ERROR } = require('./events');
const { insertMensagem } = require('../dao/mensagemDAO');

/**
 * Service da Mensagem
 *
 * @param {SocketIO.Socket} socket - Socket
 */
function mensagemService(socket) {
  socket.on(NEW_MESSAGE, data =>
    insertMensagem(data)
      .then(mensagem => socket.server.emit(NEW_MESSAGE, mensagem))
      .catch(err => socket.emit(ERROR, err))
  );
}

module.exports = mensagemService;
