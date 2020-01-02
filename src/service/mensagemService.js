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
      .catch(err => res.status(400).send(err))
  );

  app.get('/message/after-user-creation/:idUsuario', (req, res) => {
    console.log(
      '\n\n> ID usuario para filtrar msgs: ',
      req.params.idUsuario,
      '\n> tipo: ',
      typeof req.params.idUsuario
    );
    usuarioDAO.selectUsuarioById(req.params.idUsuario).then(findMessages);

    /**
     * Retorna as mensagens filtradas no response
     *
     * @param {Usuario} user - Usuário para filtrar
     */
    function findMessages(user) {
      console.log('\n\n> Usuário que vai ser usado como filtro: ', user);
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
        .then(mensagens => {
          console.log('\n\n> Msgs: ', mensagens);
          res.send(mensagens);
        })
        .catch(err => {
          console.log('\n\n> Erro ao retornar msgs: ', err);
          res.status(400).send(err);
        });
    }
  });
}

module.exports = mensagemService;
