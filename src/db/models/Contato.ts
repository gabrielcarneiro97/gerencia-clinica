import { Model, DataTypes } from 'sequelize';
import sequelize from '../connect';

export default class Contato extends Model {
  public id!: number;
  public email!: string | null;
  public telefone1!: string | null;
  public telefone2!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
