const { app, ipcMain, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { env } = require('process');

let mainWindow;
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload/main.js'),
    },
  });

  require('./ipc/ipc.js')(mainWindow);

  let menu;
  if (env.TYPE == 'debug') {
    //デバッグ時のみデバッグメニューを表示
    menu = Menu.buildFromTemplate([
      ...require('./menu.js')(mainWindow),
      {
        label: 'デバッグ',
        submenu: [
          { label: 'デベロッパーツール', role: 'toggleDevTools' },
          { label: '再読み込み', role: 'reload' }
        ]
      }
    ]);
  }
  else menu = Menu.buildFromTemplate(require('./menu.js')(mainWindow))
  if (process.platform == 'darwin') Menu.setApplicationMenu(menu);
  else mainWindow.setMenu(menu);

  mainWindow.loadFile('renderer/main/index.html');

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

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
