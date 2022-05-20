const { dialog } = require('electron');
const fs = require('fs');
const JSZip = require('jszip');

module.exports = mainWindow => {
  return (e, format, data, overwritePath) => {
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
    
    let path;
    if (overwritePath == '') {
      path = dialog.showSaveDialogSync(mainWindow, {
        title: '名前を付けて保存',
        buttonLabel: '保存',
        filters: [
          { name: 'Crall NewMapsプロジェクト', extensions: ['cnm'] },
        ],
        properties: ['createDirectory']
      });
    } else path = overwritePath;

    if (path != undefined) {
      stream.pipe(fs.createWriteStream(path)); //指定したパスに保存
      mainWindow.webContents.send('setPath', path);
      mainWindow.webContents.send('setSaved', true);
    }
  }
}
