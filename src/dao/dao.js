const { Pool } = require('pg');
const config = require('../../config-db.json');

/**
 * Classe DAO
 *
 * @author Bruno Eduardo <bruno.soares@kepha.com.br>
 * @class DAO
 */
class DAO {
  /**
   * Cria uma instância da classe DAO e inicializa o pool do banco de dados
   */
  constructor() {
    this.pool = new Pool(config);
  }
}

module.exports = DAO;
