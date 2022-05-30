const { ipcMain, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const { env } = require('process');

let subWindows = {};

module.exports = async (mainWindow, name, options = {}, data = null, init = () => {}) => {
  if (subWindows[name] != null) return;

  let preloadFile = path.join(__dirname, `preload/${name}.js`)
  if (fs.existsSync(preloadFile)) options.webPreferences.preload = preloadFile;

  options.parent = mainWindow;
  options.webPreferences ??= {};
  options.webPreferences.nodeIntegration = false;
  options.webPreferences.nodeIntegrationInWorker = false;
  options.webPreferences.nodeIntegrationInSubFrames = false;

  let win = new BrowserWindow(options);
  subWindows[name] = win;

  let menu = null;
  if (env.TYPE == 'debug') {
    //デバッグ時のみデバッグメニューを表示
    menu = Menu.buildFromTemplate([
      {
        label: 'デバッグ',
        submenu: [
          { label: 'デベロッパーツール', role: 'toggleDevTools' },
          { label: '再読み込み', role: 'reload' }
        ]
      }
    ]);
  }
  win.setMenu(menu);

  win.loadFile(`renderer/sub/${name}/index.html`);

  if (data != null) win.webContents.send('load', data);

  win.on('closed', () => {
    subWindows[name] = null;
  })

  init(win, mainWindow);
}
