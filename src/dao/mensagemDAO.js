const { Pool } = require('pg');
const config = require('../../config-db.json');
const { convertDataToModel, readScript } = require('./utils');
const Mensagem = require('../model/mensagem');
const moment = require('moment');
const usuarioDAO = require('./usuarioDAO');

/**
 * Insere uma nova mensagem no banco
 *
 * @author Bruno Eduardo
 * @param {Mensagem} mensagem - Mensagem que vai ser inserida
 * @returns {Promise<Mensagem>} Promise com a Mensagem e seus dados novos
 */
async function insertMensagem(mensagem) {
  return new Promise((resolve, reject) => {
    const pool = new Pool(config);

    const query = readScript('mensagem/insert_mensagem.sql');
    const values = [
      mensagem.usuario.idUsuario,
      mensagem.dsText,
      moment().format('YYYY-MM-DDTHH:mm:ssZZ')
    ];

    pool
      .query(query, values)
      .then(res => {
        pool.end();
        return res.rows.map(data => {
          const retorno = convertDataToModel(data, new Mensagem());
          retorno.usuario = mensagem.usuario;
          return retorno;
        })[0];
      })
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
async function selectMensagensAfterDate(date) {
  return new Promise((resolve, reject) => {
    const pool = new Pool(config);

    const query = readScript('mensagem/select_mensagens_after_date.sql');
    const values = [moment(date).format('YYYY-MM-DDTHH:mm:ssZZ')];

    pool
      .query(query, values)
      .then(async res => {
        pool.end();

        const retorno = [];

        const promises = res.rows
          .map(data => convertDataToModel(data, new Mensagem()))
          .map(
            async data =>
              await usuarioDAO.selectUsuarioById(data.idUsuario).then(usuario => {
                data.usuario = usuario;
                retorno.push(data);
              })
          );

        await Promise.all(promises);

        retorno.sort((a, b) => new Date(a.dhEnviado) - new Date(b.dhEnviado));

        return retorno;
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = { insertMensagem, selectMensagensAfterDate };
