const { insertMensagem, selectMensagensAfterDate } = require('../dao/mensagemDAO');
const {
  NEW_MESSAGE_SENDED,
  NEW_MESSAGE_RECEIVED,
  ALL_MESSAGES_AFTER_DATE,
  ERROR,
  RESPONSE
} = require('./events');

/**
 * Service da Mensagem
 *
 * @param {SocketIO.Socket} socket - Socket
 */
function mensagemService(socket) {
  socket.on(NEW_MESSAGE_SENDED, data =>
    insertMensagem(data)
      .then(mensagem => socket.server.emit(NEW_MESSAGE_RECEIVED, mensagem))
      .catch(err => socket.emit(ERROR, err))
  );

  socket.on(ALL_MESSAGES_AFTER_DATE, date =>
    selectMensagensAfterDate(date)
      .then(mensagens => socket.emit(RESPONSE, mensagens))
      .catch(err => socket.emit(ERROR, err))
  );
}

module.exports = mensagemService;
