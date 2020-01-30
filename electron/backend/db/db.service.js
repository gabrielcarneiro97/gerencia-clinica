/* eslint-disable @typescript-eslint/no-var-requires */

const sequelize = require('./connect');

const Paciente = require('./models/Paciente');
const Contato = require('./models/Contato');
const Endereco = require('./models/Endereco');
const Consulta = require('./models/Consulta');
const ConsultaProcedimento = require('./models/ConsultaProcedimento');

async function dbInit() {
  await sequelize.authenticate();
  await Paciente.sync({ alter: true });
  await Contato.sync({ alter: true });
  await Endereco.sync({ alter: true });
  await Consulta.sync({ alter: true });
  await ConsultaProcedimento.sync({ alter: true });
}

module.exports = dbInit;
