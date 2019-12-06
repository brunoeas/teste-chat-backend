const { insertMensagem, selectMensagensAfterDate } = require('../dao/mensagemDAO');
const { NEW_MESSAGE_RECEIVED } = require('./events');

/**
 * Service da Mensagem
 *
 * @param {core.Express} app - Server HTTP
 * @param {SocketIO.Socket} socket - Socket
 */
function mensagemService(app, socket) {
  app.post('/message', (req, res) =>
    insertMensagem(req.body)
      .then(mensagem => {
        socket.broadcast.emit(NEW_MESSAGE_RECEIVED, mensagem);
        res.send(mensagem);
      })
      .catch(err => res.status(400).send(err))
  );

  app.get('/message/after-date/:date', (req, res) =>
    selectMensagensAfterDate(req.params.date)
      .then(mensagens => res.send(mensagens))
      .catch(err => res.status(400).send(err))
  );
}

module.exports = mensagemService;
