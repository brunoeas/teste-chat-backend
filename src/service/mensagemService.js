const MensagemDAO = require('../dao/mensagemDAO');
const UsuarioDAO = require('../dao/usuarioDAO');
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
  const mensagemDAO = new MensagemDAO();
  const usuarioDAO = new UsuarioDAO();

  app.post('/message', (req, res) =>
    mensagemDAO
      .insertMensagem(req.body)
      .then(mensagem => {
        socket.broadcast.emit(NEW_MESSAGE_RECEIVED, mensagem);
        res.send(mensagem);
      })
      .catch(res.status(400).send)
  );

  app.get('/message/after-user-creation/:idUsuario', (req, res) => {
    usuarioDAO
      .selectUsuarioById(req.params.idUsuario)
      .then(findMessages)
      .catch(res.status(400).send);

    /**
     * Retorna as mensagens filtradas no response
     *
     * @param {Usuario} user - Usuário para filtrar
     */
    function findMessages(user) {
      if (!user) return res.status(400).send(USUARIO_INEXISTENTE);

      return mensagemDAO
        .selectMensagensAfterDate(user.dhCriacao)
        .then(async messages => {
          const retorno = [];

          const promises = messages.map(
            async data =>
              await usuarioDAO.selectUsuarioById(data.idUsuario).then(usuario => {
                data.usuario = usuario;
                retorno.push(data);
              })
          );

          await Promise.all(promises);

          return retorno;
        })
        .then(messages => messages.sort((a, b) => new Date(a.dhEnviado) - new Date(b.dhEnviado)))
        .then(res.send)
        .catch(res.status(400).send);
    }
  });
}

module.exports = mensagemService;
