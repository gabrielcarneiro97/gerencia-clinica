/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const os = require('os');
const fs = require('fs');

const MASTER = require('./master.json');

const appPath = path.join(os.homedir(), MASTER.HOME_APP_DIR);
const dbPath = path.join(appPath, MASTER.DB_FILE_NAME);
const dbVerPath = path.join(appPath, MASTER.DB_VERSION_FILE_NAME);

function checkAppDir() {
  const homeDirFiles = fs.readdirSync(os.homedir());
  if (!homeDirFiles.includes(MASTER.HOME_APP_DIR)) {
    fs.mkdirSync(appPath);
  }

  return true;
}

// function checkConfigs() {}


function checkDbFile() {
  const appFiles = fs.readdirSync(appPath);

  if (!appFiles.includes(MASTER.DB_FILE_NAME)) {
    fs.writeFileSync(dbPath, '');
  }

  return true;
}

function initialCheck() {
  checkAppDir();
  checkDbFile();
}

module.exports = {
  appPath,
  dbPath,
  dbVerPath,
  initialCheck,
};
