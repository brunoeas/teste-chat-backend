const { insertUsuario, deleteUsuarioById } = require('../dao/usuarioDAO');
const {
  USER_LOGGED_IN,
  USER_IS_TYPING,
  USER_LOGGED_OFF,
  NEW_USER,
  ERROR,
  RESPONSE
} = require('./events');

/**
 * Service do Usuário
 *
 * @param {SocketIO.Socket} socket - Socket
 */
function usuarioService(socket) {
  socket.on(USER_LOGGED_IN, data => {
    insertUsuario(data)
      .then(usuario => {
        socket.emit(RESPONSE, usuario);
        socket.broadcast.emit(NEW_USER, usuario);
      })
      .catch(err => socket.emit(ERROR, err));
  });

  socket.on(USER_LOGGED_OFF, id => {
    deleteUsuarioById(id)
      .then(userDeleted => {
        socket.emit(RESPONSE);
        socket.broadcast.emit(USER_LOGGED_OFF, userDeleted);
      })
      .catch(err => socket.emit(ERROR, err));
  });

  socket.on(USER_IS_TYPING, user => {
    socket.emit(RESPONSE);
    socket.broadcast.emit(USER_IS_TYPING, user);
  });
}

module.exports = usuarioService;
