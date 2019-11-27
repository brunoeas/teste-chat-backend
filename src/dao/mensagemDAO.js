const { Pool } = require('pg');
const config = require('../../config-db.json');
const { convertDataToModel, readScript, convertAndFormatDate } = require('./utils');
const Mensagem = require('../model/mensagem');
const moment = require('moment');

/**
 * Insere uma nova mensagem no banco
 *
 * @author Bruno Eduardo
 * @param {Mensagem} mensagem - Mensagem que vai ser inserida
 * @returns {Promise<Mensagem>} Promise com a Mensagem e seus dados novos
 */
async function insertMensagem(mensagem) {
  const pool = new Pool(config);

  const query = readScript('usuario/insert_usuario.sql');
  const values = [mensagem.usuario.idUsuario, mensagem.dsText, convertAndFormatDate(mensagem.dhEnviado)];

  return await pool.query(query, values).then(res => {
    pool.end();
    return res.rows.map(data => convertDataToModel(data, new Mensagem()))[0];
  });
}

module.exports = { insertMensagem };
