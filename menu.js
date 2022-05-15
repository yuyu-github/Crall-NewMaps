const { mainWindow } = require('./main.js');

module.exports = [
  {
    label: 'ファイル',
    submenu: [
      { label: '名前を付けて保存', click: () => mainWindow.webContents.send('save', 1) }
    ]
  }
]
