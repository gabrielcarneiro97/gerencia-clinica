const { ipcRenderer } = window.require('electron');

let listenerId: number | null = null;
let activeChannels: string[] = [];

export async function initSender(): Promise<boolean> {
  return new Promise((resolve) => {
    ipcRenderer.send('request-listenerId');
    ipcRenderer.once('response-listenerId', ((e: any, id: number) => {
      listenerId = id;
      ipcRenderer.sendTo(id, 'request-channels');
      ipcRenderer.once('response-channels', (e2: any, channels: string[]) => {
        activeChannels = channels;
        resolve(true);
      });
    }));
  });
}

export async function request<T = any>(channelName: string, data?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!activeChannels.includes(channelName)) return reject(new Error(`Channel not fould! ${channelName}`));
    if (listenerId === null) return reject(new Error('Sender isn\'t working, please execute initSender'));

    ipcRenderer.sendTo(listenerId, `request-${channelName}`, data);
    ipcRenderer.once(`response-${channelName}`, (e: any, res: T) => resolve(res));

    return true;
  });
}
