const Usuario = require('./usuario');
const moment = require('moment');

/**
 * Model da Mensagem
 *
 * @class Mensagem
 */
class Mensagem {
  /**
   * Cria uma instância de Mensagem
   *
   * @param {Number} [idMensagem=undefined] - ID da Mensagem
   * @param {Usuario | Number} [usuario=undefined] - Usuário
   * @param {String} [dsText=undefined] - Texto da Mensagem
   * @param {moment.Moment | String} [dhEnviado=undefined] - Data e hora de envio
   * @memberof Mensagem
   */
  constructor(idMensagem = undefined, usuario = undefined, dsText = undefined, dhEnviado = undefined) {
    this.idMensagem = idMensagem;
    this.usuario = usuario;
    this.dsText = dsText;
    this.dhEnviado = dhEnviado;
  }
}

module.exports = Mensagem;
