const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getHash: () => ipcRenderer.sendSync('getHash'),
  save: async (format, data, path) => await ipcRenderer.invoke('save', format, data, path),
  load: async () => await ipcRenderer.invoke('load'),
  setTitle: async val => await ipcRenderer.invoke('setTitle', val),
  getTitle: async val => await ipcRenderer.invoke('getTitle'),
  showMessageBox: async options => await ipcRenderer.invoke('showMessageBox', options),
  createSubwindow: async (name, options, data) => await ipcRenderer.invoke('createSubwindow', name, options, data),
  
  onSave: callback => ipcRenderer.on('save', callback),
  onLoad: callback => ipcRenderer.on('load', callback),
  onLoadResult: callback => ipcRenderer.on('loadResult', callback),
  onSetPath: callback => ipcRenderer.on('setPath', callback),
  onSetSaved: callback => ipcRenderer.on('setSaved', callback),
  onCreateNew: callback => ipcRenderer.on('createNew', callback),
  onConfirmSave: callback => ipcRenderer.on('confirmSave', callback),
})
