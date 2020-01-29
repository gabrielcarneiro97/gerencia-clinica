import { Model, DataTypes } from 'sequelize';
import sequelize from '../connect';

import Consulta from './Consulta';

export default class ConsultaProcedimento extends Model {
  public id!: number;
  public descricao!: string | null;

  public consultaId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
