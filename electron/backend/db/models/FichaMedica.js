/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

const FichaMedicaDetalhe = require('./FichaMedicaDetalhe');

class FichaMedica extends Model {
  static async withDetalhes(id, pacienteId) {
    const ficha = id
      ? (await FichaMedica.findByPk(id))
      : (await FichaMedica.findAll({ where: pacienteId }))[0];

    const detalhes = await FichaMedicaDetalhe.findAll({ where: { fichaMedicaId: ficha.id } });

    return {
      ...ficha.toJSON(),
      detalhes,
    };
  }
}

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
