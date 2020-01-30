/* eslint-disable @typescript-eslint/no-var-requires */

const { initListener, createListener } = require('./services/ipcListener.service');

const Consulta = require('./db/models/Consulta');

initListener().then(() => {
  createListener('getConsulta', (consultaId) => {
    console.log(reqData);
    return true;
  });
});
