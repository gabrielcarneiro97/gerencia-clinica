/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

class PacienteGrupo extends Model {}

PacienteGrupo.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  descricao: new DataTypes.STRING(),
  /*
    tipo =>
      1: TMO, TF, TP, Prótese
      2: Pré/Pós
  */
  tipo: new DataTypes.INTEGER(),
}, {
  tableName: 'pacienteGrupos',
  modelName: 'pacienteGrupo',
  sequelize,
});

module.exports = PacienteGrupo;
