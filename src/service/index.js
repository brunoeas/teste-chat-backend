const usuarioService = require('./usuarioService');
const mensagemService = require('./mensagemService');

/**
 * Inicia os services
 *
 * @param {SocketIO.Server} io - IO do Socket.io
 */
function initServices(io) {
  io.on('connection', socket => {
    usuarioService(socket);
    mensagemService(socket);
  });
}

module.exports = initServices;
