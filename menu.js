module.exports = mainWindow => [
  {
    label: 'ファイル',
    submenu: [
      { label: '新規作成', click: () => mainWindow.webContents.send('createNew'), accelerator: 'CommandOrControl+N' },
      { label: '開く', click: () => mainWindow.webContents.send('load'), accelerator: 'CommandOrControl+O' },
      { label: '保存', click: () => mainWindow.webContents.send('save', true), accelerator: 'CommandOrControl+S' },
      { label: '名前を付けて保存', click: () => mainWindow.webContents.send('save'), accelerator: 'CommandOrControl+Shift+S' },
    ]
  },
  {
    label: '拡張パック',
    submenu: [
      { label: '拡張パックの管理', click: () => require('./create_subwindow.js')(mainWindow, 'extpack_mgmt') }
    ]
  }
]
