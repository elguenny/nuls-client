import electron from 'electron'

const {app,ipcMain} = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let folderpath
let downloadpath
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow () {
  /**
   *  隐藏electron 菜单
   *  Hide the menu of the electron form
   */
  Menu.setApplicationMenu(null)
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
    maxWidth: 800,
    maxHeight: 560,
  })

  ipcMain.on('download', (evt, args) => {
    let arr = args.split('+')
    downloadpath = arr[0]
    folderpath = arr[1]
    evt.sender.send('tips', downloadpath)
    mainWindow.webContents.downloadURL(downloadpath)
  })

  app.commandLine.appendSwitch('--disable-http-cache')
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    item.setSavePath(folderpath + `\\${item.getFilename()}`)
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
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
  //窗口最小化
  ipcMain.on('window-min', function () {
    mainWindow.minimize()
  })
  //窗口关闭
  ipcMain.on('window-close', function () {
    mainWindow.close()
    process.exit()
    app.quit()
  })
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function corePath (cmd) {
  // 获取路径
  let targetPath = require('path').resolve(__dirname, '../../java/bin')
  console.log(targetPath)

  //判断操作系统
  const platform = require('os').platform()
  //启动java
  if (platform === 'darwin' ) {
    return targetPath + cmd + '.sh'
  } else if (platform === 'win32' || platform === 'win64') {
    return targetPath + cmd + '.bat'
  }
  console.log('Current platform: ' + platform)
}

function launchCmd(cmdPath) {
  let child_process = require('child_process');
  child_process.execFile(cmdPath, null, function (error) {

    sessionStorage.setItem("homeJava", "1");
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    else {
      console.log('Execute the java file');
    }
  });
}

ipcMain.on('CoreLauncher',function (event, arg) {
  let cmdPath = corePath(arg)
  launchCmd(cmdPath)
})

app.on('ready', createWindow)
