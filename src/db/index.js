const { Pool } = require('pg');
const fs = require('fs');
const config = require('./config');

/**
 * Faz a migration no banco de dados
 *
 * @author Bruno Eduardo
 */
function migrateDatabase() {
  console.log('> Começando migration...');

  const pool = new Pool(config);
  const query = fs.readFileSync(`${__dirname}/migrations/projeto-chat-database.sql`).toString();

  pool
    .query(query)
    .then(() => pool.end())
    .catch(err => console.error('> Erro ao tentar fazer migration: \n', err))
    .then(() => console.log('> Migration finalizada'));
}

module.exports = migrateDatabase;
