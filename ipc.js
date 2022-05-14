module.exports = function() {
  const { ipcMain, dialog } = require('electron');
  const fs = require('fs');
  const crypto = require('crypto');
  const JSZip = require('jszip');

  ipcMain.on('getHash', e => {
    e.returnValue = crypto.randomBytes(20).toString('hex');
  })

  ipcMain.handle('save', (e, data, format) => {
    let zip = new JSZip();
    zip.file('format.txt', format.toString());
    zip.file('data.json', JSON.stringify(data));

    let stream = zip.generateNodeStream({
      type: 'nodebuffer',
      streamFiles: true,
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    })

    const path = dialog.showSaveDialogSync(mainWindow, {
      title: '名前を付けて保存',
      buttonLabel: '保存',
      filters: [
        { name: 'Crall NewMapsプロジェクト', extensions: ['cnm'] },
      ],
      properties: [
        'createDirectory',
      ]
    });
    if (path != undefined) {
      stream.pipe(fs.createWriteStream(path)); //指定したパスに保存
    }
  })
}
