/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

class Endereco extends Model {}

Endereco.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  logradouro: new DataTypes.STRING(),
  numero: new DataTypes.STRING(),
  complemento: new DataTypes.STRING(),
  bairro: new DataTypes.STRING(),
  cidade: new DataTypes.STRING(),
  estado: new DataTypes.STRING(2),
  pais: new DataTypes.STRING(),
  cep: new DataTypes.STRING(),
}, {
  tableName: 'enderecos',
  modelName: 'endereco',
  sequelize,
});

module.exports = Endereco;
