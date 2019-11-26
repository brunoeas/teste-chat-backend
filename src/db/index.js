const pg = require('pg');
const config = require('./config');
const fs = require('fs');

/**
 * Faz a conexão com o banco de dados e o migration
 *
 * @author Bruno Eduardo
 */
function connectAndMigrateDatabase() {
  const client = new pg.Client(config);

  client.connect(err => {
    if (err) {
      throw err;
    } else {
      migrate();
    }
  });

  /**
   * Faz a migration no banco de dados
   *
   * @author Bruno Eduardo
   */
  function migrate() {
    console.log('> Começando migration...');

    const query = fs.readFileSync(`${__dirname}/migration/projeto-chat-database.sql`).toString();

    client
      .query(query)
      .then(() => client.end())
      .catch(err => console.error('> Erro ao tentar fazer migration: \n', err))
      .then(() => console.log('> Migration concluída com sucesso!'));
  }
}

module.exports = connectAndMigrateDatabase;
