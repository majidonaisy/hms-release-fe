"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on: (channel, listener) => {
    const validChannels = ["main-process-message", "app-closing"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.on(channel, (_event, ...args) => listener(...args));
    }
  },
  off: (channel, _listener) => {
    const validChannels = ["main-process-message", "app-closing"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.removeAllListeners(channel);
    }
  },
  send: (channel, ...args) => {
    const validChannels = ["logout-complete", "test-message"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.send(channel, ...args);
    }
  },
  invoke: (channel, ...args) => {
    const validChannels = ["app-version", "setup-submitted", "get-config"];
    if (validChannels.includes(channel)) {
      return electron.ipcRenderer.invoke(channel, ...args);
    }
  }
});
