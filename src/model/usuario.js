/**
 * Model do Usuário
 *
 * @class Usuario
 */
class Usuario {
  /**
   * Cria uma instância de Usuário
   *
   * @param {Number} [idUsuario=undefined] - ID do Usuário
   * @param {String} [nmUsuario=undefined] - Nome do Usuário
   * @param {Date} [dhCriacao=undefined] - Data hora de criação
   * @memberof Usuario
   */
  constructor(idUsuario = undefined, nmUsuario = undefined, dhCriacao = undefined) {
    this.idUsuario = idUsuario;
    this.nmUsuario = nmUsuario;
    this.dhCriacao = dhCriacao;
  }
}

module.exports = Usuario;
