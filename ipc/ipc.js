module.exports = mainWindow => {
  const { ipcMain, dialog } = require('electron');
  const crypto = require('crypto');

  ipcMain.on('getHash', e => {
    e.returnValue = crypto.randomBytes(20).toString('hex');
  })

  ipcMain.handle('save', require('./save.js')(mainWindow))

  ipcMain.handle('load', require('./load.js')(mainWindow));

  ipcMain.handle('setTitle', (e, val) => {
    mainWindow.setTitle(val);
  })

  ipcMain.handle('getTitle', () => {
    return mainWindow.getTitle();
  });

  ipcMain.handle('showMessageBox', async (e, options) => {
    return await dialog.showMessageBox(mainWindow, options);
  })
}
