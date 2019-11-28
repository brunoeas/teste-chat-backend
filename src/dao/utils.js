const fs = require('fs');

/**
 * Converte um dado de uma tabela do banco para um model
 *
 * @author Bruno Eduardo
 * @param {Object} data - Objeto que representa uma linha do banco de dados
 * @param {Object} model - Model para qual vai ser convertido
 * @returns Um objeto populado equivalente ao model passado
 */
function convertDataToModel(data, model) {
  if (!data) return null;
  if (typeof data !== 'object') throw `O parâmetro "data" deve ser um objeto\nrecebido: ${data}`;

  let retorno = {};

  for (const propData in data) {
    const namePropData = propData
      .split('_')
      .join('')
      .toLowerCase();

    findAndAddToReturnPropEquivalentInModel(namePropData, propData);
  }

  return retorno;

  /**
   * Encontra a propriedade no model equivalente a propriedade passada por parâmetro e concatena ela no retorno
   *
   * @author Bruno Eduardo
   * @param {String} namePropData - Nome da propriedade que está sendo manipulada
   * @param {String} propData - Nome da propriedade original que veio do banco
   */
  function findAndAddToReturnPropEquivalentInModel(namePropData, propData) {
    for (const propModel in model) {
      const namePropModel = propModel.toLowerCase();

      if (namePropModel === namePropData) {
        retorno = { ...retorno, [propModel]: data[propData] };
        break;
      }
    }
  }
}

/**
 * Lê um script na pasta src/dao/scripts e converte para string
 *
 * @author Bruno Eduardo
 * @param {String} fileName - Nome do script para ser lido
 * @returns {String} O conteúdo do script em string
 */
function readScript(fileName) {
  return fs.readFileSync(`${__dirname}/scripts/${fileName}`).toString();
}

/**
 * Converte uma data para string e formata ela para o padrão YYYY-MM-DDTHH:mm:ssZZ
 *
 * @author Bruno Eduardo
 * @param {String} date - Data que vai ser convertida e formatada
 * @returns {String} Data convertida e formatada
 */
function convertAndFormatDate(date) {
  return moment(date).format('YYYY-MM-DDTHH:mm:ssZZ');
}

module.exports = { convertDataToModel, readScript, convertAndFormatDate };
