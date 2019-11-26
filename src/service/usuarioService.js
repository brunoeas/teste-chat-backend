const usuarioController = require('../controller/usuarioController');

function usuarioService(socket) {
  socket.on('login', data => usuarioController.login());
}

module.exports = usuarioService;
