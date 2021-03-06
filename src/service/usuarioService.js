const UsuarioDAO = require('../dao/usuarioDAO');
const { USER_LOGGED_OFF, NEW_USER } = require('./events');

/**
 * Service do Usuário
 *
 * @author Bruno Eduardo <bruno.soares@kepha.com.br>
 * @param {core.Express} app - Server HTTP
 * @param {SocketIO.Socket} socket - Socket
 */
function usuarioService(app, socket) {
  const usuarioDAO = new UsuarioDAO();

  app.post('/login', (req, res) =>
    usuarioDAO
      .insertUsuario(req.body)
      .then(usuario => {
        socket.broadcast.emit(NEW_USER, usuario);
        res.send(usuario);
      })
      .catch(err => res.status(400).send(err))
  );

  app.delete('/logoff/:id', (req, res) =>
    usuarioDAO
      .deleteUsuarioById(req.params.id)
      .then(userDeleted => {
        socket.broadcast.emit(USER_LOGGED_OFF, userDeleted);
        res.send();
      })
      .catch(err => res.status(400).send(err))
  );

  app.get('/usuario/:id', (req, res) =>
    usuarioDAO
      .selectUsuarioById(req.params.id)
      .then(user => res.send(user))
      .catch(err => res.status(400).send(err))
  );
}

module.exports = usuarioService;
