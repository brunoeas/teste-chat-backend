/**
 * Service da Mensagem
 *
 * @param {SocketIO.Socket} socket - Socket
 */
function mensagemService(socket) {
  socket.on('newMessage', data => console.log('new message ', data));
}

module.exports = mensagemService;
