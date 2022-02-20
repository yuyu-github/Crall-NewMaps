const { contextBridge, ipcRenderer } = require('electron');
const crypto = require('crypto');

contextBridge.exposeInMainWorld('api', {
  getHash: () => crypto.randomBytes(20).toString('hex')
})
