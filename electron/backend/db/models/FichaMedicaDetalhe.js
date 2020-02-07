/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

const FichaMedica = require('./FichaMedica');

class FichaMedicaDetalhe extends Model {
  static async getDetalhes(fichaMedicaId) {
    const detalhesArr = await FichaMedicaDetalhe.findAll({ where: { fichaMedicaId } });

    const detalhes = detalhesArr.reduce((acc, crr) => {
      if (!crr.tipo) return acc;
      if (crr.tipo === 1) return { ...acc, doencas: [...acc.doencas, crr] };
      if (crr.tipo === 2) return { ...acc, medicamentos: [...acc.medicamentos, crr] };
      return { ...acc, alergias: [...acc.alergias, crr] };
    }, {
      doencas: [],
      medicamentos: [],
      alergias: [],
    });

    return detalhes;
  }
}

FichaMedicaDetalhe.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  descricao: new DataTypes.STRING(),
  /*
    tipo =>
      1: doença
      2: medicamento
      3: alergia
  */
  tipo: new DataTypes.INTEGER(),
  fichaMedicaId: {
    type: new DataTypes.INTEGER(),
    references: {
      model: FichaMedica,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'fichaMedicaDetalhes',
  modelName: 'fichaMedicaDetalhe',
  sequelize,
});

module.exports = FichaMedicaDetalhe;
