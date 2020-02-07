/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const sequelize = require('./connect');

const Config = require('./models/Config');
const Paciente = require('./models/Paciente');
const Contato = require('./models/Contato');
const Endereco = require('./models/Endereco');
const Consulta = require('./models/Consulta');
const ConsultaProcedimento = require('./models/ConsultaProcedimento');
const FichaMedica = require('./models/FichaMedica');
const FichaMedicaDetalhe = require('./models/FichaMedicaDetalhe');
const PacienteGrupo = require('./models/PacienteGrupo');

const defaultConfigs = require('../default_configs.json');

const gruposDefault = require('./grupos_default.json');

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

function removeVerFile() {
  fs.unlinkSync(dbVerPath);
}

async function checkConfigs() {
  const configs = await Config.getAll();

  if (Object.keys(configs).length === 0) await Config.saveConfigs(defaultConfigs);
}

async function initGrupos() {
  const gruposDb = await PacienteGrupo.findAll();

  if (gruposDb.length === 0) {
    await Promise.all(gruposDefault.map((g) => PacienteGrupo.create(g)));
  }
}

async function dbInit() {
  const dbStatus = checkDbVersion();
  await sequelize.authenticate();
  if (dbStatus === 'UPDATE') {
    try {
      await Config.sync({ alter: true });
      await Contato.sync({ alter: true });
      await Endereco.sync({ alter: true });
      await FichaMedica.sync({ alter: true });
      await FichaMedicaDetalhe.sync({ alter: true });
      await PacienteGrupo.sync({ alter: true });
      await Paciente.sync({ alter: true });
      await Consulta.sync({ alter: true });
      await ConsultaProcedimento.sync({ alter: true });

      await initGrupos();
    } catch (err) {
      removeVerFile();
      console.error(err);
    }
  }
  await checkConfigs();
}

module.exports = dbInit;
