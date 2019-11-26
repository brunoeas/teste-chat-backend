/**
 * Model da Mensagem
 *
 * @class Mensagem
 */
class Mensagem {
  constructor(idMensagem, usuario, dsText, dhEnviado) {
    this.idMensagem = idMensagem;
    this.usuario = usuario;
    this.dsText = dsText;
    this.dhEnviado = dhEnviado;
  }
}

module.exports = Mensagem;
