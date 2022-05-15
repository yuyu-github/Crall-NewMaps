const { app, ipcMain, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { env } = require('process');

let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  exports.mainWindow = mainWindow;

  if (env.TYPE == 'debug') {
    //デバッグ時のみデバッグメニューを表示
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      ...require('./menu.js'),
      {
        label: 'デバッグ',
        submenu: [
          { label: 'デベロッパーツール', role: 'toggleDevTools' },
          { label: '再読み込み', role: 'reload' }
        ]
      }
    ]));
  }
  else Menu.setApplicationMenu(Menu.buildFromTemplate(require('./menu.js')))
  
  mainWindow.loadFile('renderer/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

require('./ipc.js')();
