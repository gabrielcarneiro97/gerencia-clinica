import { Model, DataTypes } from 'sequelize';
import sequelize from '../connect';

export default class Endereco extends Model {
  public id!: number;
  public logradouro!: string | null;
  public numero!: string | null;
  public complemento!: string | null;
  public bairro!: string | null;
  public cidade!: string | null;
  public estado!: string | null;
  public pais!: string | null;
  public cep!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
