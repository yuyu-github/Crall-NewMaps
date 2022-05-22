const { ipcMain, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const { env } = require('process');

module.exports = async (mainWindow, name, options = {}, data = null) => {
  let preloadFile = path.join(__dirname, `preload/${name}.js`)
  if (fs.existsSync(preloadFile)) options.webPreferences.preload = preloadFile;

  options.parent = mainWindow;
  options.webPreferences ??= {};
  options.webPreferences.nodeIntegration = false;
  options.webPreferences.nodeIntegrationInWorker = false;
  options.webPreferences.nodeIntegrationInSubFrames = false;

  let win = new BrowserWindow(options);

  win.loadFile(`renderer/sub/${name}/index.html`);

  if (data != null) win.webContents.send('load', data);
}
