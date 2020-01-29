import { Model, DataTypes } from 'sequelize';
import sequelize from '../connect';

import Endereco from './Endereco';
import Contato from './Contato';

export default class Paciente extends Model {
  public id!: number;
  public cpf!: string | null;
  public nome!: string | null;
  public filiacao1!: string | null;
  public filiacao2!: string | null;
  public sexo!: string | null;
  public nascimento!: Date | null;
  public enderecoId!: number | null;
  public contatoId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getIniciais(): string {
    const nome = this.getDataValue('nome');

    if (!nome) return '';

    const nomes = nome.split(' ');

    return nomes.reduce((acc, crr, i) => {
      if (i === 0) return crr;
      if (crr.length <= 2) return acc;
      return `${acc} ${crr[0].toUpperCase()}.`;
    }, '');
  }

  public async getEndereco(): Promise<Endereco> {
    const enderecoId = this.getDataValue('enderecoId');
    if (!enderecoId) return Endereco.build();

    return (await Endereco.findByPk(enderecoId as number)) || Endereco.build();
  }

  public async getContato(): Promise<Contato> {
    const contatoId = this.getDataValue('contatoId');
    if (!contatoId) return Contato.build();

    return (await Contato.findByPk(contatoId as number)) || Contato.build();
  }

  public async saveAll(endereco?: Endereco | null, contato?: Contato | null): Promise<void> {
    if (endereco) {
      await endereco.save();
      const enderecoId = endereco.getDataValue('id');
      this.setDataValue('enderecoId', enderecoId);
    }

    if (contato) {
      await contato.save();
      const contatoId = contato.getDataValue('id');
      this.setDataValue('contatoId', contatoId);
    }

    await this.save();
  }
}

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
  contatoId: {
    type: new DataTypes.INTEGER(),
    references: {
      model: Contato,
      key: 'id',
    },
  },
}, {
  tableName: 'pacientes',
  modelName: 'paciente',
  sequelize,
});
