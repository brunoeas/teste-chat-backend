const { Pool } = require('pg');
const fs = require('fs');
const config = require('../../config-db.json');
const path = require('path');

/**
 * Faz a migration no banco de dados
 *
 * @author Bruno Eduardo
 */
async function migrateDatabase() {
  console.log('> Começando migration...');

  const pool = new Pool(config);

  await concatScripts()
    .then(query => {
      pool
        .query(query)
        .then(() => pool.end())
        .catch(err => console.error('> Erro ao tentar fazer migration: \n', err))
        .then(() => console.log('> Migration finalizada'));
    })
    .catch(console.error);
}

/**
 * Retorna todos os scripts existentes na pasta src/db/scripts concatenados
 *
 * @returns {Promise<String>} Promise com os scripts concatenados
 */
function concatScripts() {
  const directory = `${__dirname}/scripts`;

  return new Promise(resolve =>
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      files = files.map(file => path.join(directory, file));

      const scripts = files.map(file => fs.readFileSync(file).toString());

      const scriptConcatened = scripts.reduce((prev, curr) => `${prev}\n${curr}`, '');

      resolve(scriptConcatened);
    })
  );
}

module.exports = migrateDatabase;
