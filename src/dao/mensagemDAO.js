const { convertDataToModel, readScript } = require('./utils');
const Mensagem = require('../model/mensagem');
const moment = require('moment');
const DAO = require('./dao');

/**
 * DAO da Mensagem
 *
 * @author Bruno Eduardo <bruno.soares@kepha.com.br>
 * @class MensagemDAO
 * @extends {DAO} - Classe DAO
 */
class MensagemDAO extends DAO {
  /**
   * Insere uma nova mensagem no banco
   *
   * @param {Mensagem} mensagem - Mensagem que vai ser inserida
   * @returns {Promise<Mensagem>} Promise com a Mensagem e seus dados novos
   */
  async insertMensagem(mensagem) {
    return new Promise((resolve, reject) => {
      const query = readScript('mensagem/insert_mensagem.sql');
      const values = [
        mensagem.usuario.idUsuario,
        mensagem.dsText,
        moment().format('YYYY-MM-DDTHH:mm:ssZZ')
      ];

      this.pool
        .query(query, values)
        .then(
          res =>
            res.rows.map(data => {
              const retorno = convertDataToModel(data, new Mensagem());
              retorno.usuario = mensagem.usuario;
              return retorno;
            })[0]
        )
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Retorna todas as Mensagens que foram enviadas depois da data passada como parâmetro
   *
   * @param {Date} date - Data hora para filtrar
   * @returns {Promise<Mensagem[]>} Promise com as Mensagem filtradas
   */
  async selectMensagensAfterDate(date) {
    return new Promise((resolve, reject) => {
      const query = readScript('mensagem/select_mensagens_after_date.sql');
      const values = [moment(date).format('YYYY-MM-DDTHH:mm:ssZZ')];

      this.pool
        .query(query, values)
        .then(res => res.rows.map(data => convertDataToModel(data, new Mensagem())))
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = MensagemDAO;
