const { insertMensagem, selectMensagensAfterDate } = require('../dao/mensagemDAO');
const { selectUsuarioById } = require('../dao/usuarioDAO');
const { NEW_MESSAGE_RECEIVED } = require('./events');
const { USUARIO_INEXISTENTE } = require('../dao/exceptions');

/**
 * Service da Mensagem
 *
 * @author Bruno Eduardo <bruno.soares@kepha.com.br>
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

  app.get('/message/after-user-creation/:id', (req, res) => {
    selectUsuarioById(req.params.id).then(findMessages);

    /**
     * Retorna as mensagens filtradas no response
     *
     * @param {Usuario} user - Usuário para filtrar
     */
    function findMessages(user) {
      if (!user) return res.status(400).send(USUARIO_INEXISTENTE);

      return selectMensagensAfterDate(user.dhCriacao)
        .then(async messages => {
          const retorno = [];

          const promises = messages.map(
            async data =>
              await selectUsuarioById(data.idUsuario).then(usuario => {
                data.usuario = usuario;
                retorno.push(data);
              })
          );

          await Promise.all(promises);

          return retorno;
        })
        .then(messages => messages.sort((a, b) => new Date(a.dhEnviado) - new Date(b.dhEnviado)))
        .then(mensagens => res.send(mensagens))
        .catch(err => res.status(400).send(err));
    }
  });
}

module.exports = mensagemService;
