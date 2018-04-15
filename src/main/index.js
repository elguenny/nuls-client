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
        width: 1800,
        useContentSize: true,
        webPreferences: {webSecurity: false},
        frame: false,
        //Set minimum width height.
        minWidth: 800,
        minHeight: 560,
        /*maxWidth:800,
        maxHeight:560,*/
    });

    ipcMain.on('download', (evt, args) => {
        var arr = args.split("+");
        downloadpath = arr[0];
        folderpath = arr[1];
        evt.sender.send('tips', downloadpath);
        mainWindow.webContents.downloadURL(downloadpath);
    });
    app.commandLine.appendSwitch('--disable-http-cache');
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
    });
    //窗口关闭
    ipc.on('window-close', function () {
        mainWindow.close();
        process.exit();
        app.quit();
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

// 注意这个autoUpdater不是electron中的autoUpdater
import { autoUpdater } from "electron-updater"
import {uploadUrl} from "../renderer/config.js";

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    const os = require('os');

    autoUpdater.setFeedURL(uploadUrl);
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
    });
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

        ipcMain.on('isUpdateNow', (e, arg) => {
            console.log(arguments);
            console.log("开始更新");
            //some code here to handle event
            autoUpdater.quitAndInstall();
        });

        mainWindow.webContents.send('isUpdateNow')
    });

    ipcMain.on("checkForUpdate",()=>{
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    mainWindow.webContents.send('message', text)
}

app.on('ready', createWindow);
