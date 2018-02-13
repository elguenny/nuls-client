import electron from 'electron'
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if(process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
	`http://localhost:9080` :
	`file://${__dirname}/index.html`

function createWindow() {
	//Hide the menu of the electron form
	Menu.setApplicationMenu(null)
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		height: 800,
		useContentSize: true,
		width: 1624,
		//Set minimum width height.
		minWidth:800,
		minHeight:680
	})

	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)
