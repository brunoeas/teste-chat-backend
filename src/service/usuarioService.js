const { USER_LOGGED_IN, USER_IS_TYPING, USER_LOGGED_OFF, NEW_USER, ERROR } = require('./events');
const { insertUsuario, deleteUsuarioById } = require('../dao/usuarioDAO');

/**
 * Service do Usuário
 *
 * @param {SocketIO.Socket} socket - Socket
 */
function usuarioService(socket) {
  socket.on(USER_LOGGED_IN, data => {
    try {
      insertUsuario(data)
        .then(usuario => {
          socket.emit(USER_LOGGED_IN, usuario);
          socket.broadcast.emit(NEW_USER, usuario);
        })
        .catch(err => socket.emit(ERROR, err));
    } catch (err) {
      socket.emit(ERROR, err);
    }
  });

  socket.on(USER_LOGGED_OFF, id => {
    deleteUsuarioById(id)
      .then(userDeleted => socket.broadcast.emit(USER_LOGGED_OFF, userDeleted))
      .catch(err => socket.emit(ERROR, err));
  });

  socket.on(USER_IS_TYPING, () => socket.broadcast.emit(USER_IS_TYPING));
}

module.exports = usuarioService;
