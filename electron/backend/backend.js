/* eslint-disable @typescript-eslint/no-var-requires */

const { initListener, createListener } = require('./services/ipcListener.service');
const dbInit = require('./db/db.service');

const Consulta = require('./db/models/Consulta');
const Contato = require('./db/models/Contato');
const Paciente = require('./db/models/Paciente');
const ConsultaProcedimento = require('./db/models/ConsultaProcedimento');

dbInit().then(() => {
  initListener().then(() => {
    createListener('consulta.getById', async (consultaId) => {
      const consulta = await Consulta.findByPk(consultaId);
      return consulta.toJSON();
    });

    createListener('consulta.findAll', async (find) => {
      const consultas = await Consulta.findAll(find);

      return consultas.map((c) => c.toJSON());
    });

    createListener('consulta.delById', async (consultaId) => {
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

      return true;
    });

    createListener('consultaProcedimento.findAll', async (find) => {
      const consultaProcedimentos = await ConsultaProcedimento.findAll(find);

      return consultaProcedimentos.map((c) => c.toJSON());
    });

    createListener('consultaProcedimento.save', async (p) => {
      const procedimento = ConsultaProcedimento.build(p);
      await procedimento.save();
      return true;
    });

    createListener('consultaProcedimento.destroy', async (p) => {
      const procedimento = ConsultaProcedimento.build(p);
      await procedimento.destroy();
      return true;
    });

    createListener('contato.getById', async (contatoId) => {
      const contato = await Contato.findByPk(contatoId);
      return contato.toJSON();
    });

    createListener('paciente.getById', async (pacienteId) => {
      const paciente = await Paciente.findByPk(pacienteId);
      return paciente.toJSON();
    });
  });
});
