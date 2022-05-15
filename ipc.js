module.exports = mainWindow => {
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
      properties: ['createDirectory']
    });
    if (path != undefined) {
      stream.pipe(fs.createWriteStream(path)); //指定したパスに保存
      mainWindow.webContents.send('setPath', path);
      mainWindow.webContents.send('setSaved', true);
    }
  })

  ipcMain.handle('load', async () => {
    const path = dialog.showOpenDialogSync(mainWindow, {
      title: '開く',
      buttonLabel: '開く',
      filters: [
        { name: 'Crall NewMapsプロジェクト', extensions: ['cnm'] }
      ],
      properties: ['openFile'],
    });
    if (path == undefined) return;

    try {
      let zip = await JSZip.loadAsync(fs.readFileSync(path[0]));

      const format = await zip.file('format.txt').async('string');
      mainWindow.webContents.send('loadResult', {
        format: format,
        data: JSON.parse(await zip.file('data.json').async('string')),
        path: path[0],
      });
    } catch (e) {
      console.error(e);
    }
  });

  ipcMain.handle('setTitle', (e, val) => {
    mainWindow.setTitle(val);
  })

  ipcMain.handle('getTitle', () => {
    return mainWindow.getTitle();
  });
}
