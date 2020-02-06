/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const sequelize = require('./connect');

const Config = require('./models/Config');
const Paciente = require('./models/Paciente');
const Contato = require('./models/Contato');
const Endereco = require('./models/Endereco');
const Consulta = require('./models/Consulta');
const ConsultaProcedimento = require('./models/ConsultaProcedimento');

const defaultConfigs = require('../default_configs.json');

const { DB_VERSION, DB_VERSION_FILE_NAME } = require('../../master.json');
const { dbVerPath, appPath } = require('../../master');

function checkDbVersion() {
  const appDir = fs.readdirSync(appPath);

  const update = () => {
    fs.writeFileSync(dbVerPath, DB_VERSION);
    return 'UPDATE';
  };

  if (!appDir.includes(DB_VERSION_FILE_NAME)) return update();

  const dbActualVer = fs.readFileSync(dbVerPath, 'utf8');

  if (dbActualVer !== DB_VERSION) return update();

  return 'BYPASS';
}

async function checkConfigs() {
  const configs = await Config.getAll();

  if (Object.keys(configs).length === 0) await Config.saveConfigs(defaultConfigs);
}

async function dbInit() {
  const dbStatus = checkDbVersion();
  await sequelize.authenticate();
  if (dbStatus === 'UPDATE') {
    await Config.sync({ alter: true });
    await Contato.sync({ alter: true });
    await Endereco.sync({ alter: true });
    await Paciente.sync({ alter: true });
    await Consulta.sync({ alter: true });
    await ConsultaProcedimento.sync({ alter: true });
  }
  await checkConfigs();
}

module.exports = dbInit;
