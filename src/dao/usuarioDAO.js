const { convertDataToModel, readScript } = require('./utils');
const Usuario = require('../model/usuario');
const moment = require('moment');
const { NOME_DUPLICADO } = require('./exceptions');
const DAO = require('./dao');

/**
 * DAO do Usuário
 *
 * @author Bruno Eduardo <bruno.soares@kepha.com.br>
 * @class UsuarioDAO
 * @extends {DAO} - Classe DAO
 */
class UsuarioDAO extends DAO {
  /**
   * Retorna todos os Usuários
   *
   * @returns {Promise<Usuario[]>} Promise com um array com todos os Usuários
   */
  async selectAllUsuarios() {
    return new Promise((resolve, reject) => {
      const query = readScript('usuario/select_all_usuarios.sql');

      this.pool
        .query(query)
        .then(res => res.rows.map(data => convertDataToModel(data, new Usuario())))
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Retorna um Usuário pelo ID
   *
   * @param {Number} id - ID do Usuário
   * @returns {Promise<Usuario>} Promise com o Usuário
   */
  async selectUsuarioById(id) {
    return new Promise((resolve, reject) => {
      const query = readScript('usuario/select_usuario_byid.sql');
      const values = [id];

      this.pool
        .query(query, values)
        .then(res => res.rows.map(data => convertDataToModel(data, new Usuario()))[0])
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Retorna uma lista de Usuários pelo nome
   *
   * @param {String} nome - Nome para filtrar
   * @returns {Promise<Usuario[]>} Promise com a lista de Usuários
   */
  async selectUsuarioByNome(nome) {
    return new Promise((resolve, reject) => {
      const query = readScript('usuario/select_usuario_bynome.sql');
      const values = [nome];

      this.pool
        .query(query, values)
        .then(res => res.rows.map(data => convertDataToModel(data, new Usuario())))
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Insere um novo Usuário no banco
   *
   * @param {Usuario} usuario - Usuário que vai ser inserido
   * @returns {Promise<Usuario>} Uma Promise com o Usuário inserido e seus dados novos
   * @throws NOME_DUPLICADO - caso o nome do usuário ja esteja cadastrado;
   */
  async insertUsuario(usuario) {
    /**
     * Valida se o nome já existe na base de dados
     *
     * @param {String} nome - Nome que vai ser validado
     * @returns {Boolean} false = o nome não é duplicado; true = o nome é duplicado;
     */
    const isUsuarioNomeDuplicado = async nome => {
      let isNomeDuplicado = false;

      await this.selectUsuarioByNome(nome).then(usuarios => {
        if (usuarios.length > 0) isNomeDuplicado = true;
      });

      return isNomeDuplicado;
    };

    return new Promise(async (resolve, reject) => {
      const isDuplicado = await isUsuarioNomeDuplicado(usuario.nmUsuario);
      if (isDuplicado) reject(NOME_DUPLICADO);

      const query = readScript('usuario/insert_usuario.sql');
      const values = [usuario.nmUsuario, moment().format('YYYY-MM-DDTHH:mm:ssZZ')];

      this.pool
        .query(query, values)
        .then(res => res.rows.map(data => convertDataToModel(data, new Usuario()))[0])
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Deleta um Usuário pelo ID
   *
   * @param {Number} id - ID do Usuário
   * @returns {Promise<Usuario>} Promise com o Usuário deletado
   */
  async deleteUsuarioById(id) {
    return new Promise(async (resolve, reject) => {
      let usuarioToReturn;
      await this.selectUsuarioById(id)
        .then(usuario => (usuarioToReturn = usuario))
        .catch(reject);

      const query = readScript('usuario/delete_usuario_byid.sql');
      const values = [id];

      this.pool
        .query(query, values)
        .then(res => resolve(usuarioToReturn))
        .catch(reject);
    });
  }
}

module.exports = UsuarioDAO;
