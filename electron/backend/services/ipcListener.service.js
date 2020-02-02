const { ipcRenderer } = window.require('electron');

const activeChannels = [];
let working = false;

async function initListener() {
  ipcRenderer.on('request-channels', (event) => {
    const { senderId } = event;

    ipcRenderer.sendTo(senderId, 'response-channels', activeChannels);
  });

  working = true;

  return true;
}

async function createListener(channelName, listener) {
  if (!working) return false;

  activeChannels.push(channelName);
  ipcRenderer.on(`request-${channelName}`, async (event, { data, id }) => {
    const response = await listener(data);
    const { senderId } = event;

    ipcRenderer.sendTo(senderId, `response-${channelName}-${id}`, response);
  });

  return true;
}

module.exports = {
  initListener,
  createListener,
};
