const { ipcRenderer } = window.require('electron');

let listenerId: number | null = null;
let activeChannels: string[] = [];

let idCounter = 0;

function getId(): number {
  idCounter += 1;
  return idCounter;
}

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

    const id = getId();

    ipcRenderer.sendTo(listenerId, `request-${channelName}`, { data, id });
    ipcRenderer.once(`response-${channelName}-${id}`, (e: any, res: T) => resolve(res));

    return true;
  });
}
