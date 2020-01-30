/* eslint-disable @typescript-eslint/no-var-requires */

const { initListener, createListener } = require('./services/ipcListener.service');
const { dbInit } = require('./db/db.service');

const Consulta = require('./db/models/Consulta');
const Contato = require('./db/models/Contato');
const Paciente = require('./db/models/Paciente');

dbInit().then(() => {
  initListener().then(() => {
    createListener('consulta.getById', async (consultaId) => {
      const consulta = await Consulta.findByPk(consultaId);
      return consulta.toJSON();
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
