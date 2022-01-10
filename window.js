const { app, BrowserWindow } = require('electron');

let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
    });

    mainWindow.loadFile('index.html');
    
    mainWindow.openDevTools();

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