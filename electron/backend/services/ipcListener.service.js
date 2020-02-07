const { ipcRenderer } = window.require('electron');

const activeChannels = [];

async function initListener() {
  ipcRenderer.send('listener-ok');
  ipcRenderer.on('request-channels', (event) => {
    const { senderId } = event;

    ipcRenderer.sendTo(senderId, 'response-channels', activeChannels);
  });

  return true;
}

function createListener(channelName, listener) {
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
