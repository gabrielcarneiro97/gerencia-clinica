/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');

const Paciente = require('./Paciente');
const ConsultaProcedimento = require('./ConsultaProcedimento');

class Consulta extends Model {
  async withProcedimentos() {
    const procedimentos = await ConsultaProcedimento.findAll({ where: { consultaId: this.id } });

    return {
      ...this.toJSON(),
      procedimentos: procedimentos.map((p) => p.toJSON()),
    };
  }

  async getPaciente() {
    const pacienteId = this.getDataValue('pacienteId');
    if (!pacienteId) return null;

    return Paciente.findByPk(pacienteId);
  }
}

Consulta.init({
  id: {
    type: new DataTypes.INTEGER(),
    autoIncrement: true,
    primaryKey: true,
  },
  data: new DataTypes.DATE(),
  responsavel: new DataTypes.STRING(),
  observacoes: new DataTypes.STRING(),
  status: new DataTypes.INTEGER(),
  /*
    status =>
      1: agendado
      2: na sala de espera
      3: em atendimento
      4: concluido
      5: nao compareceu
  */
  pacienteId: {
    type: new DataTypes.INTEGER(),
    references: {
      model: Paciente,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'consultas',
  modelName: 'consulta',
  sequelize,
});

module.exports = Consulta;
