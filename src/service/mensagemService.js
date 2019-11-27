const { NEW_MESSAGE } = require('./events');
const { insertMensagem } = require('../dao/mensagemDAO');

/**
 * Service da Mensagem
 *
 * @param {SocketIO.Socket} socket - Socket
 */
function mensagemService(socket) {
  socket.on(NEW_MESSAGE, data =>
    insertMensagem(data)
      .then(mensagem => socket.emit(NEW_MESSAGE, mensagem))
      .catch(err => {
        throw err;
      })
  );
}

module.exports = mensagemService;
