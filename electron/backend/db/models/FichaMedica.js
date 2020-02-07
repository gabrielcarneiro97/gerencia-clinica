/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

class FichaMedica extends Model {}

FichaMedica.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  tipoSangue: new DataTypes.STRING(),
  altura: new DataTypes.INTEGER(),

}, {
  tableName: 'fichasMedicas',
  modelName: 'fichaMedica',
  sequelize,
});

module.exports = FichaMedica;
