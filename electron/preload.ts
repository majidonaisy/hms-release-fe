import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on: (channel: string, listener: (...args: any[]) => void) => {
    const validChannels = ["main-process-message", "app-closing"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => listener(...args));
    }
  },
  off: (channel: string, _listener?: (...args: any[]) => void) => {
    const validChannels = ["main-process-message", "app-closing"];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  send: (channel: string, ...args: any[]) => {
    const validChannels = ["logout-complete", "test-message"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  invoke: (channel: string, ...args: any[]) => {
    const validChannels = ["app-version"];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
  },
});
