const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getHash: () => ipcRenderer.sendSync('getHash'),
  save: async (data, format) => await ipcRenderer.invoke('save', data, format),
  load: async () => await ipcRenderer.invoke('load'),
  
  onSave: callback => ipcRenderer.on('save', callback),
  onLoad: callback => ipcRenderer.on('load', callback),
  onLoadResult: callback => ipcRenderer.on('loadResult', callback),
})
