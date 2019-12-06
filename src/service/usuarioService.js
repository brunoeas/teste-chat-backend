const { insertUsuario, deleteUsuarioById, selectUsuarioById } = require('../dao/usuarioDAO');
const { USER_IS_TYPING, USER_LOGGED_OFF, NEW_USER } = require('./events');

/**
 * Service do Usuário
 *
 * @param {core.Express} app - Server HTTP
 * @param {SocketIO.Socket} socket - Socket
 */
function usuarioService(app, socket) {
  app.post('/login', (req, res) =>
    insertUsuario(req.body)
      .then(usuario => {
        socket.broadcast.emit(NEW_USER, usuario);
        res.send(usuario);
      })
      .catch(err => res.status(400).send(err))
  );

  app.delete('/logoff/:id', (req, res) =>
    deleteUsuarioById(req.params.id)
      .then(userDeleted => {
        socket.broadcast.emit(USER_LOGGED_OFF, userDeleted);
        res.send();
      })
      .catch(err => res.status(400).send(err))
  );

  app.get('/usuario/:id', (req, res) =>
    selectUsuarioById(req.params.id)
      .then(usuario => res.send(usuario))
      .catch(err => res.status(400).send(err))
  );

  socket.on(USER_IS_TYPING, user => socket.server.emit(USER_IS_TYPING, user));
}

module.exports = usuarioService;
