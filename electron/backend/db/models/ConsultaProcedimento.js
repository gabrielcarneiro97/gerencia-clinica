/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

const { Consulta } = require('./Consulta');

class ConsultaProcedimento extends Model {}

ConsultaProcedimento.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  descricao: new DataTypes.STRING(),
  consultaId: {
    type: new DataTypes.INTEGER(),
    references: {
      model: Consulta,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'consultaProcedimentos',
  modelName: 'consultaProcedimento',
  sequelize,
});

module.exports = ConsultaProcedimento;
