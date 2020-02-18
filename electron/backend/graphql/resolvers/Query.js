/* eslint-disable @typescript-eslint/no-var-requires */
const Sequelize = require('sequelize');
const moment = require('moment');

const Paciente = require('../../db/models/Paciente');
const Endereco = require('../../db/models/Endereco');
const Contato = require('../../db/models/Contato');

const Consulta = require('../../db/models/Consulta');
const ConsultaProcedimento = require('../../db/models/ConsultaProcedimento');

const PacienteGrupo = require('../../db/models/PacienteGrupo');

const { Op } = Sequelize;

module.exports = {
  pacientes: async (_, { nome }) => {
    const pacientes = nome ? await Paciente.findAll({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('nome')),
        {
          [Op.like]: `%${nome.toLowerCase()}%`,
        },
      ),
    }) : await Paciente.findAll();

    return Promise.all(pacientes.map((p) => p.toJSON()));
  },
  paciente: async (_, { id }) => (await Paciente.findByPk(id)).toJSON(),

  consultas: async (_, { data, pacienteId }) => {
    let finder = {};

    if (data) {
      const asDate = new Date(data);
      const start = moment(asDate).startOf('day').toDate();
      const end = moment(asDate).endOf('day').toDate();

      finder = {
        where: {
          data: {
            [Op.between]: [start, end],
          },
        },
      };
    }

    if (pacienteId || pacienteId === 0) {
      finder = {
        where: { pacienteId },
      };
    }

    const consultas = await Consulta.findAll(finder);

    return consultas.map((c) => c.toJSON());
  },
  consulta: async (_, { id }) => {
    const consulta = id ? await Consulta.findByPk(id) : Consulta.build();
    return consulta.toJSON();
  },

  consultaProcedimentos: async (_, { consultaId }) => {
    const finder = consultaId ? {
      where: { consultaId },
    } : {};

    const procedimentos = await ConsultaProcedimento.findAll(finder);

    return procedimentos.map((p) => p.toJSON());
  },

  endereco: async (_, { id }) => (await Endereco.findByPk(id)).toJSON(),

  contato: async (_, { id }) => (await Contato.findByPk(id)).toJSON(),

  pacienteGrupos: async () => (await PacienteGrupo.findAll()).map((pg) => pg.toJSON()),
};
