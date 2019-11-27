const { Pool } = require('pg');
const config = require('../../config-db.json');
const { convertDataToModel, readScript } = require('./utils');
const Usuario = require('../model/usuario');

/**
 * Retorna todos os Usuários
 *
 * @author Bruno Eduardo
 * @returns {Promise<Usuario[]>} Promise com um array com todos os Usuários
 */
async function selectAllUsuarios() {
  const pool = new Pool(config);

  const query = readScript('usuario/select_all_usuarios.sql');

  return await pool.query(query).then(res => {
    pool.end();
    return res.rows.map(data => convertDataToModel(data, new Usuario()));
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
  const pool = new Pool(config);

  const query = readScript('usuario/select_usuario_byid.sql');
  const values = [id];

  return await pool.query(query, values).then(res => {
    pool.end();
    return res.rows.map(data => convertDataToModel(data, new Usuario()))[0];
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
  const pool = new Pool(config);

  const query = readScript('usuario/select_usuario_bynome.sql');
  const values = [nome];

  return await pool.query(query, values).then(res => {
    pool.end();
    return res.rows.map(data => convertDataToModel(data, new Usuario()));
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
  const isDuplicado = isUsuarioNomeDuplicado(usuario.nmUsuario);
  if (isDuplicado) throw 'NOME_DUPLICADO';

  const pool = new Pool(config);

  const query = readScript('usuario/insert_usuario.sql');
  const values = [usuario.nmUsuario];

  return await pool.query(query, values).then(res => {
    pool.end();
    return res.rows.map(data => convertDataToModel(data, new Usuario()))[0];
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
  let usuarioToReturn;
  await selectUsuarioById(id).then(usuario => (usuarioToReturn = usuario));

  const pool = new Pool(config);

  const query = readScript('usuario/delete_usuario_byid.sql');
  const values = [id];

  return await pool.query(query, values).then(res => {
    pool.end();
    return usuarioToReturn;
  });
}

module.exports = {
  selectAllUsuarios,
  insertUsuario,
  deleteUsuarioById,
  selectUsuarioById,
  selectUsuarioByNome
};
