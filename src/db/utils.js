/**
 * Converte um dado de uma tabela do banco para um model
 *
 * @param {Object} data - Objeto que representa uma linha do banco de dados
 * @param {Object} model - Model para qual vai ser convertido
 * @returns Um objeto populado equivalente ao model passado
 */
function convertDataToModel(data, model) {
  let retorno = {};

  for (const propData in data) {
    const namePropData = propData
      .split('_')
      .join('')
      .toLowerCase();

    findAndAddToReturnPropEquivalentInModel(namePropData);
  }

  /**
   * Encontra a propriedade no model equivalente a propriedade passada por parâmetro e concatena ela no retorno
   *
   * @param {String} namePropData - Nome da propriedade que está sendo manipulada
   */
  function findAndAddToReturnPropEquivalentInModel(namePropData) {
    for (const propModel in model) {
      const namePropModel = propModel.toLowerCase();

      if (namePropModel === namePropData) {
        retorno = { ...retorno, [propModel]: data[namePropData] };
        break;
      }
    }
  }

  return retorno;
}

module.exports = { convertDataToModel };
