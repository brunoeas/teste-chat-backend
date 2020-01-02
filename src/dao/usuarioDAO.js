const { Pool } = require('pg');
const config = require('../../config-db.json');
const { convertDataToModel, readScript } = require('./utils');
const Usuario = require('../model/usuario');
const moment = require('moment');
const { NOME_DUPLICADO } = require('./exceptions');

/**
 * Retorna todos os Usuários
 *
 * @author Bruno Eduardo
 * @returns {Promise<Usuario[]>} Promise com um array com todos os Usuários
 */
async function selectAllUsuarios() {
  return new Promise((resolve, reject) => {
    const pool = new Pool(config);

    const query = readScript('usuario/select_all_usuarios.sql');

    pool
      .query(query)
      .then(res => {
        pool.end();
        return res.rows.map(data => convertDataToModel(data, new Usuario()));
      })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Retorna um Usuário pelo ID
 *
 * @author Bruno Eduardo
 * @param {Number} id - ID do Usuário
 * @returns {Promise<Usuario>} Promise com o Usuário
 */
async function selectUsuarioById(id) {
  return new Promise((resolve, reject) => {
    const pool = new Pool(config);

    const query = readScript('usuario/select_usuario_byid.sql');
    const values = [id];

    pool
      .query(query, values)
      .then(res => {
        pool.end();
        return res.rows.map(data => convertDataToModel(data, new Usuario()))[0];
      })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Retorna uma lista de Usuários pelo nome
 *
 * @author Bruno Eduardo
 * @param {String} nome - Nome para filtrar
 * @returns {Promise<Usuario[]>} Promise com a lista de Usuários
 */
async function selectUsuarioByNome(nome) {
  return new Promise((resolve, reject) => {
    const pool = new Pool(config);

    const query = readScript('usuario/select_usuario_bynome.sql');
    const values = [nome];

    pool
      .query(query, values)
      .then(res => {
        pool.end();
        return res.rows.map(data => convertDataToModel(data, new Usuario()));
      })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Insere um novo Usuário no banco
 *
 * @author Bruno Eduardo
 * @param {Usuario} usuario - Usuário que vai ser inserido
 * @returns {Promise<Usuario>} Uma Promise com o Usuário inserido e seus dados novos
 * @throws NOME_DUPLICADO - caso o nome do usuário ja esteja cadastrado;
 */
async function insertUsuario(usuario) {
  return new Promise(async (resolve, reject) => {
    const isDuplicado = await isUsuarioNomeDuplicado(usuario.nmUsuario);
    if (isDuplicado) reject(NOME_DUPLICADO);

    const pool = new Pool(config);

    const query = readScript('usuario/insert_usuario.sql');
    const values = [usuario.nmUsuario, moment().format('YYYY-MM-DDTHH:mm:ssZZ')];

    pool
      .query(query, values)
      .then(res => {
        pool.end();
        return res.rows.map(data => convertDataToModel(data, new Usuario()))[0];
      })
      .then(resolve)
      .catch(reject);
  });

  /**
   * Valida se o nome já existe na base de dados
   *
   * @param {String} nome - Nome que vai ser validado
   * @returns {Boolean} false = o nome não é duplicado; true = o nome é duplicado;
   */
  async function isUsuarioNomeDuplicado(nome) {
    let isNomeDuplicado = false;

    await selectUsuarioByNome(nome).then(usuarios => {
      if (usuarios.length > 0) isNomeDuplicado = true;
    });

    return isNomeDuplicado;
  }
}

/**
 * Deleta um Usuário pelo ID
 *
 * @author Bruno Eduardo
 * @param {Number} id - ID do Usuário
 * @returns {Promise<Usuario>} Promise com o Usuário deletado
 */
async function deleteUsuarioById(id) {
  return new Promise(async (resolve, reject) => {
    let usuarioToReturn;
    await selectUsuarioById(id)
      .then(usuario => (usuarioToReturn = usuario))
      .catch(reject);

    const pool = new Pool(config);

    const query = readScript('usuario/delete_usuario_byid.sql');
    const values = [id];

    pool
      .query(query, values)
      .then(res => {
        pool.end();
        resolve(usuarioToReturn);
      })
      .catch(reject);
  });
}

module.exports = {
  selectAllUsuarios,
  insertUsuario,
  deleteUsuarioById,
  selectUsuarioById,
  selectUsuarioByNome
};
