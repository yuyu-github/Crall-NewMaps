const { dialog } = require('electron');
const fs = require('fs');
const JSZip = require('jszip');

module.exports = mainWindow => {
  return async () => {
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
  }
}
