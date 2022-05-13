const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getHash: () => ipcRenderer.sendSync('getHash'),
  save: async (data, format) => await ipcRenderer.invoke('save', data, format),
})
