import electron from 'electron'

const {dialog, ipcMain} = require('electron');
const {download} = require('electron-download');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

/**
 * 将“静态”路径设置为生产中的静态文件
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let folderpath;
let downloadpath;
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

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

  /**
   *  窗口最小化
   *  window minimizing
   */
  ipcMain.on('window-min', function () {
    mainWindow.minimize()
  })

  /**
   *  窗口关闭
   *  window close
   */
  ipcMain.on('window-close', function () {
    mainWindow.close()
    process.exit()
    app.quit()
  })

  /**
   * 文件下载
   *File download
   */
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

  mainWindow.loadURL(winURL)

}

/**
 * 获取系统和路径
 *Judge the system and spell out the path
 * @param cmd
 * @returns {{binPath: string, targetPath: string}}
 */
function corePath (cmd) {
  const path = require('path')
  let paths = {binPath: '', targetPath: ''}
  const platform = require('os').platform()

  if (platform === 'darwin') {
    paths.targetPath = path.resolve(process.resourcesPath, '../java/bin')
    paths.binPath = path.resolve(paths.targetPath, cmd + '.sh')
  } else if (platform === 'win32' || platform === 'win64') {
     //paths.targetPath = path.resolve(process.execPath, '../../../../java/bin')
    paths.targetPath = path.join(process.execPath, './../java/bin')
    paths.binPath = path.resolve(paths.targetPath, cmd + '.bat')
  }
  return paths
}

/**
 * 执行java 程序
 *Executing the Java program
 * @param cmdPath
 */
function launchCmd (cmdPath) {
  let child_process = require('child_process')
  /*console.log('=' + cmdPath.binPath)
  console.log('==' + cmdPath.targetPath)*/
  child_process.execFile(cmdPath.binPath, null, {cwd: cmdPath.targetPath}, function (error) {
    if (error !== null) {
      console.log('exec error: ' + error)
    }
    else {
      console.log('Execute the java file')
    }
  })
}

/**
 * 执行 CoreLauncher 方法
 * Invocation method CoreLauncher
 */
ipcMain.on('CoreLauncher', function (event, arg) {
  /*if (process.env.NODE_ENV === 'development') {
      return
  }*/
  let cmdPath = corePath(arg)
  launchCmd(cmdPath)
})

/**
 * 只能开启一个electron 进程
 * Only one electron process can be opened
 * @type {boolean}
 */
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

app.on('quit', (event,exitCode) => {
  if (process.env.NODE_ENV === 'development') {
    return
  }
  let cmdPath = corePath('stop')
  launchCmd(cmdPath)
})

app.on('ready', createWindow)