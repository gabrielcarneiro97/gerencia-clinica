const { ipcRenderer } = window.require('electron');

let listenerId = null;
let activeChannels = [];

async function initSender() {
  ipcRenderer.send('request-listenerId');
  ipcRenderer.once('response-listenerId', ((e, id) => {
    listenerId = id;
    ipcRenderer.sendTo(id, 'request-channels');
    ipcRenderer.once('response-channels', (e2, channels) => {
      activeChannels = channels;
    });
  }));

  return true;
}

async function request(channelName, data) {
  return new Promise((resolve, reject) => {
    if (!activeChannels.includes(channelName)) return reject(new Error('Channel not fould!'));
    if (listenerId === null) return reject(new Error('Sender isn\'t working, please execute initSender'));

    ipcRenderer.sendTo(listenerId, `request-${channelName}`, data);
    ipcRenderer.once(`response-${channelName}`, (e, res) => resolve(res));

    return true;
  });
}

module.exports = {
  initSender,
  request,
};
