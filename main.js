// import { createWindow as createLoginWindow } from './src/electron/login';
const path = require('path')
const url = require('url')
// electron交互的JS
const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow;
let mainWindow;

// 初始化LoginWindow
function initLoginWindwo(){
	if(mainWindow) {// 判断主窗口是否存在存在则关闭并重置
		mainWindow.close();
		mainWindow = null;
	}

	// 创建
	createLoginWindow()
}

// 初始化主窗口
function initMainWindow() {
	if(loginWindow){
		loginWindow.close();
		loginWindow = null;
	}
	createWindow()
}

// 初始化 从主进程到渲染进程的异步通信。
function initIpc() {
	// 打开主窗口回调
	ipcMain.on('ipcOpenMainWindow',(options) => {
		// console.log(options)
		if(mainWindow){ // 实例存在则弹出
			mainWindow.show()
		}else{// 不存在则初始化，如login转到main
			initMainWindow();
		}
	})

	// 登陆到主界面
	ipcMain.on('ipcMainIsReady', (ops)=>{
		if(mainWindow){ // 实例存在则弹出
			mainWindow.show()
			mainWindow.webContents.send('ipcInitWs',{})
		}
	})
}

// 创建 login窗口
function createLoginWindow() {
	loginWindow = new BrowserWindow({
		width: 380,
		height: 540,
		// width: 1000,
		// height: 700,
		frame: false, // 边框菜单设置
		show: true,
		transparent: true
	})

	
	// 窗口加载网址
	// loginWindow.loadURL(url.format({
	// 	pathname: path.join(__dirname, './build/index.html'),
	// 	protocol: 'file:',
	// 	slashes: true
	//   }))

	loginWindow.loadURL('http://localhost:3000/');
	// loginWindow.webContents.openDevTools()

	loginWindow.on('closed', function () {
		loginWindow = null
	})
}


function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 602,
		minWidth:350,
		minHeight:350,
		frame: false, // 边框菜单设置
		show: false // 是否显示
	})

	// mainWindow.loadURL(url.format({
	// 	pathname: path.join(__dirname, './build/index.html'),
	// 	protocol: 'file:',
	// 	hash:'#/chat',
	// 	slashes: true
	//   }))
	// 窗口加载网址
	mainWindow.loadURL('http://localhost:3000/#/chat');             

	//  and load the index.html of the app.
	//   mainWindow.loadFile('index.html')

	// 开启调试窗口
	//   mainWindow.webContents.openDevTools()

	// 监听按键
	mainWindow.webContents.on('before-input-event', (event, input) => {
		if(input.code === 'F12'){
			mainWindow.webContents.toggleDevTools()
		}
	  })

	

	// 创建后初显示 更优雅的显示(官方标注，减少白屏)
	mainWindow.on('ready-to-show', () => {
		if(mainWindow) mainWindow.show();

		// 重新
		mainWindow.webContents.send('ipcInitWs',{})
	})

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
	// 初始化LoginWindow
	initLoginWindwo()
	// createLoginWindow()

	// 初始化ipcMain 主页面和渲染页面（网页）之间的通讯
	initIpc();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})