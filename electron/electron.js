/* eslint-disable @typescript-eslint/no-var-requires */

const { BrowserWindow, app, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const os = require('os');

const { initialCheck } = require('./master');

require('electron-reload')(path.join(__dirname));

let mainWindow;
let backWindow;

function createApp() {
  if (isDev) {
    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.4.0_0',
      ),
    );
    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        '/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0',
      ),
    );
  }

  initialCheck();

  mainWindow = new BrowserWindow({
    backgroundColor: '#e0e0e0',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      // webSecurity: false,
    },
  });

  backWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      // webSecurity: false,
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'right' });
    backWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  backWindow.loadFile('./backend/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
    backWindow.close();
  });

  backWindow.on('closed', () => {
    backWindow = null;
  });

  let serverOk = false;

  ipcMain.on('server-ok', () => {
    serverOk = true;
  });

  ipcMain.on('server-status', (event) => {
    if (serverOk) event.reply('server-ok');
    else event.reply('server-loading');
  });
}

app.on('ready', createApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createApp();
  }
});
