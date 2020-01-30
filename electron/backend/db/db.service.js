/* eslint-disable @typescript-eslint/no-var-requires */

const sequelize = require('./connect');

const Paciente = require('./models/Paciente');
const Contato = require('./models/Contato');
const Endereco = require('./models/Endereco');
const Consulta = require('./models/Consulta');
const ConsultaProcedimento = require('./models/ConsultaProcedimento');

export async function dbInit() {
  try {
    await sequelize.authenticate();
    await Paciente.sync({ alter: true });
    await Contato.sync({ alter: true });
    await Endereco.sync({ alter: true });
    await Consulta.sync({ alter: true });
    await ConsultaProcedimento.sync({ alter: true });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function excluirConsulta(consultaId) {
  const consulta = await Consulta.findByPk(consultaId);

  if (consulta) {
    const procedimentos = await ConsultaProcedimento.findAll({
      where: {
        consultaId,
      },
    });

    await Promise.all(procedimentos.map(async (p) => p.destroy()));

    await consulta.destroy();
  }
}
