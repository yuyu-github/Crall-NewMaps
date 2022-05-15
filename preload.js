const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getHash: () => ipcRenderer.sendSync('getHash'),
  save: async (data, format) => await ipcRenderer.invoke('save', data, format),
  
  onSave: callback => ipcRenderer.on('save', callback),
})
