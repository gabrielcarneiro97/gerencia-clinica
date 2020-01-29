import { Model, DataTypes } from 'sequelize';
import sequelize from '../connect';

import Paciente from './Paciente';
import ConsultaProcedimentoClass from './ConsultaProcedimento';

export default class Consulta extends Model {
  public id!: number;
  public data!: Date | null;
  public responsavel!: string | null;
  public observacoes!: string | null;
  public status!: number | null;
  /*
    status =>
      1: agendado
      2: na sala de espera
      3: em atendimento
      4: concluido
      5: nao compareceu
  */

  public pacienteId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async getPaciente(): Promise<Paciente | null> {
    const pacienteId = this.getDataValue('pacienteId');
    if (!pacienteId) return null;

    return Paciente.findByPk(pacienteId as number);
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
