const usuarioService = require('./usuarioService');
const mensagemService = require('./mensagemService');

/**
 * Inicia os services
 *
 * @param {SocketIO.Server} io
 */
function initServices(io) {
  io.on('connection', socket => {
    usuarioService(socket);
    mensagemService(socket);
    io.on('teste', data => console.log('teste ', data));
    io.emit('teste', 'funfo');
    // socket.on('teste', res => console.log(res));
    // setTimeout(() => socket.emit('teste', 'eduardo'), 5000);
  });
}

module.exports = initServices;
