/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

class Contato extends Model {}

Contato.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  email: new DataTypes.STRING(),
  telefone1: new DataTypes.STRING(11),
  telefone2: new DataTypes.STRING(11),
}, {
  tableName: 'contatos',
  modelName: 'contato',
  sequelize,
});

module.exports = Contato;
