const { app, ipcMain, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { env } = require('process');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  require('./ipc.js')(mainWindow);

  if (env.TYPE == 'debug') {
    //デバッグ時のみデバッグメニューを表示
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      ...require('./menu.js')(mainWindow),
      {
        label: 'デバッグ',
        submenu: [
          { label: 'デベロッパーツール', role: 'toggleDevTools' },
          { label: '再読み込み', role: 'reload' }
        ]
      }
    ]));
  }
  else Menu.setApplicationMenu(Menu.buildFromTemplate(require('./menu.js')(mainWindow)))

  mainWindow.loadFile('renderer/index.html');

  mainWindow.on('close', e => {
    mainWindow.webContents.send('confirmSave');
    e.preventDefault();
  })
  ipcMain.on('confirmSaveResult', (e, result) => {
    if (result) mainWindow.destroy();
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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
