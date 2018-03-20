import electron from 'electron'

const {dialog, ipcMain} = require('electron');
const {download} = require('electron-download');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let folderpath;
let downloadpath;
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`;

function createWindow() {
    //Hide the menu of the electron form
    Menu.setApplicationMenu(null);
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 560,
        width: 800,
        useContentSize: true,
        webPreferences: {webSecurity: false},
        frame: false,
        //Set minimum width height.
        minWidth: 800,
        minHeight: 560,
        maxWidth:800,
         maxHeight:560,
    });

    ipcMain.on('download', (evt, args) => {
        var arr = args.split("+");
        downloadpath = arr[0];
        folderpath = arr[1];
        evt.sender.send('tips', downloadpath);
        mainWindow.webContents.downloadURL(downloadpath);
    });
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        // Set the save path, making Electron not to prompt a save dialog.
        item.setSavePath(folderpath + `\\${item.getFilename()}`);
        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        });
        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    });
//窗口最小化
    ipc.on('window-min', function () {
        mainWindow.minimize();
    })
//窗口关闭
    ipc.on('window-close', function () {
        mainWindow.close();
    })


    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow);
