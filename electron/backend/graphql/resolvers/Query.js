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
  pacientes: (_, { nome }) => {
    if (nome) {
      return Paciente.findAll({
        where: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('nome')),
          {
            [Op.like]: `%${nome.toLowerCase()}%`,
          },
        ),
      });
    }

    return Paciente.findAll();
  },
  paciente: (_, { id }) => Paciente.findByPk(id),

  consultas: async (_, { data, pacienteId }) => {
    if (data) {
      const asDate = new Date(data);
      const start = moment(asDate).startOf('day').toDate();
      const end = moment(asDate).endOf('day').toDate();

      const consultas = await Consulta.findAll({
        where: {
          data: {
            [Op.between]: [start, end],
          },
        },
      });

      return consultas;
    }

    if (pacienteId) {
      return Consulta.findAll({
        where: { pacienteId },
      });
    }

    return Consulta.findAll();
  },
  consulta: (_, { id }) => {
    if (id) return Consulta.findByPk(id);

    return Consulta.build();
  },

  consultaProcedimentos(_, { consultaId }) {
    if (consultaId) {
      return ConsultaProcedimento.findAll({
        where: { consultaId },
      });
    }

    return ConsultaProcedimento.findAll();
  },

  endereco: (_, { id }) => Endereco.findByPk(id),

  contato: (_, { id }) => Contato.findByPk(id),

  pacienteGrupos: () => PacienteGrupo.findAll(),
};
