const usuarioService = require('./usuarioService');
const mensagemService = require('./mensagemService');

/**
 * Inicia os services
 *
 * @param {core.Express} app - Server HTTP
 * @param {SocketIO.Server} io - IO do Socket.io
 */
function initServices(app, io) {
  io.on('connection', socket => {
    usuarioService(app, socket);
    mensagemService(app, socket);
  });
}

module.exports = initServices;
