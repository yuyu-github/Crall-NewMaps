const { mainWindow } = require('./main.js');

module.exports = mainWindow => [
  {
    label: 'ファイル',
    submenu: [
      { label: '開く', click: () => mainWindow.webContents.send('load') },
      { label: '名前を付けて保存', click: () => mainWindow.webContents.send('save') },
    ]
  }
]
