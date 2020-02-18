/* eslint-disable @typescript-eslint/no-var-requires */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connect');


const Endereco = require('./Endereco');
const Contato = require('./Contato');
const FichaMedica = require('./FichaMedica');
const PacienteGrupo = require('./PacienteGrupo');
const Consulta = require('./Consulta');

class Paciente extends Model {
  async completo() {
    const pacienteId = this.id;

    const finder = { where: { pacienteId } };

    const [consultasDb, endereco, contato, grupo1, grupo2] = await Promise.all([
      Consulta.findAll(finder),
      Endereco.findByPk(this.enderecoId),
      Contato.findByPk(this.contatoId),
      PacienteGrupo.findByPk(this.grupo1Id),
      PacienteGrupo.findByPk(this.grupo2Id),
      // FichaMedica.findByPk(pacienteDb.fichaMedicaId),
    ]);

    const consultas = await Promise.all(consultasDb.map(async (c) => c.withProcedimentos()));

    return {
      ...this.toJSON(),
      endereco: endereco.toJSON(),
      contato: contato.toJSON(),
      grupo1: grupo1.toJSON(),
      grupo2: grupo2.toJSON(),
      // fichaMedica,
      consultas,
    };
  }

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
