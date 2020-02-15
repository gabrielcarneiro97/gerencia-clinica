/* eslint-disable @typescript-eslint/no-var-requires */
const Sequelize = require('sequelize');
const moment = require('moment');

const Paciente = require('../../db/models/Paciente');
const Consulta = require('../../db/models/Consulta');

const { Op } = Sequelize;

module.exports = {
  pacientes: () => Paciente.findAll(),

  consultas: (_, { data }) => {
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
    return Consulta.findAll();
  },
  consulta: (_, { id }) => {
    if (id) return Consulta.findByPk(id);
  },
};
