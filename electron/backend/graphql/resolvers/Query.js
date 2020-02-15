/* eslint-disable @typescript-eslint/no-var-requires */
const Sequelize = require('sequelize');
const moment = require('moment');

const Paciente = require('../../db/models/Paciente');
const Consulta = require('../../db/models/Consulta');
const ConsultaProcedimento = require('../../db/models/ConsultaProcedimento');

const { Op } = Sequelize;

module.exports = {
  pacientes: (nome) => {
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

  consultas: (_, { data, pacienteId }) => {
    if (data) {
      const asDate = new Date(data);
      const start = moment(asDate).startOf('day').toDate();
      const end = moment(asDate).endOf('day').toDate();

      return Consulta.findAll({
        where: {
          data: {
            [Op.between]: [start, end],
          },
        },
      });
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
};
