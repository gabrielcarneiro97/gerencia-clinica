import { BrowserWindow, app } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as os from 'os';

let mainWindow: BrowserWindow | null;

function createApp(): void {
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

  mainWindow = new BrowserWindow({
    backgroundColor: '#e0e0e0',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'right' });
  }

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
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
