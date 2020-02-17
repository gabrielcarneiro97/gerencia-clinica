const { ipcRenderer } = window.require('electron');

export default async function waitServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const requestInterval = setInterval(() => ipcRenderer.send('server-status'), 2000);
    ipcRenderer.once('server-ok', (() => {
      clearInterval(requestInterval);
      resolve(true);
    }));

    ipcRenderer.on('server-loading', () => console.log('loading'));
  });
}
