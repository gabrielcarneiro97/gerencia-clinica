/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');


const Endereco = require('./Endereco');
const Contato = require('./Contato');
const FichaMedica = require('./FichaMedica');

class Paciente extends Model {
  getIniciais() {
    const nome = this.getDataValue('nome');

    if (!nome) return '';

    const nomes = nome.split(' ');

    return nomes.reduce((acc, crr, i) => {
      if (i === 0) return crr;
      if (crr.length <= 2) return acc;
      return `${acc} ${crr[0].toUpperCase()}.`;
    }, '');
  }

  async getEndereco() {
    const enderecoId = this.getDataValue('enderecoId');
    if (!enderecoId) return Endereco.build();

    return (await Endereco.findByPk(enderecoId)) || Endereco.build();
  }

  async getContato() {
    const contatoId = this.getDataValue('contatoId');
    if (!contatoId) return Contato.build();

    return (await Contato.findByPk(contatoId)) || Contato.build();
  }

  async saveAll(endereco, contato) {
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
