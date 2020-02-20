/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');


const Endereco = require('./Endereco');
const Contato = require('./Contato');
const FichaMedica = require('./FichaMedica');
const PacienteGrupo = require('./PacienteGrupo');

class Paciente extends Model {}

Paciente.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  cpf: {
    type: new DataTypes.STRING(),
    unique: true,
  },
  nome: new DataTypes.STRING(),
  filiacao1: new DataTypes.STRING(),
  filiacao2: new DataTypes.STRING(),
  sexo: new DataTypes.STRING(1),
  nascimento: new DataTypes.DATE(),
  enderecoId: {
    type: new DataTypes.INTEGER(),
    references: {
      model: Endereco,
      key: 'id',
    },
  },
  grupo1Id: {
    type: new DataTypes.INTEGER(),
    references: {
      model: PacienteGrupo,
      key: 'id',
    },
  },
  grupo2Id: {
    type: new DataTypes.INTEGER(),
    references: {
      model: PacienteGrupo,
      key: 'id',
    },
  },
  contatoId: {
    type: new DataTypes.INTEGER(),
    references: {
      model: Contato,
      key: 'id',
    },
  },
  fichaMedicaId: {
    type: new DataTypes.INTEGER(),
    references: {
      model: FichaMedica,
      key: 'id',
    },
  },
}, {
  tableName: 'pacientes',
  modelName: 'paciente',
  sequelize,
});

module.exports = Paciente;
