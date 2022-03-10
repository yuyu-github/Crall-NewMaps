const { app, BrowserWindow, Menu } = require('electron');
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

  if (env.TYPE == 'release') Menu.setApplicationMenu(null); //デバッグ時のみメニューを表示
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
