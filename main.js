// import { createWindow as createLoginWindow } from './src/electron/login';
const path = require('path')
const url = require('url')
// electron交互的JS
const {
	app,
	BrowserWindow,
	ipcMain,
	Menu,
	shell,
	dialog,
	autoUpdater
} = require('electron')
const log = require('electron-log');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow;
let mainWindow;

/** 添加log */
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function sendStatusToWindow(text) {
	log.info(text);
	loginWindow.webContents.send('message', text);
  }
  


let template = [{
	label: '编辑',
	submenu: [{
		label: '撤销',
		accelerator: 'CmdOrCtrl+Z',
		role: 'undo'
	}, {
		label: '重做',
		accelerator: 'Shift+CmdOrCtrl+Z',
		role: 'redo'
	}, {
		type: 'separator'
	}, {
		label: '剪切',
		accelerator: 'CmdOrCtrl+X',
		role: 'cut'
	}, {
		label: '复制',
		accelerator: 'CmdOrCtrl+C',
		role: 'copy'
	}, {
		label: '粘贴',
		accelerator: 'CmdOrCtrl+V',
		role: 'paste'
	}, {
		label: '全选',
		accelerator: 'CmdOrCtrl+A',
		role: 'selectall'
	}]
}, {
	label: '查看',
	submenu: [{
		label: '重载',
		accelerator: 'CmdOrCtrl+R',
		click: (item, focusedWindow) => {
			if (focusedWindow) {
				// 重载之后, 刷新并关闭所有之前打开的次要窗体
				if (focusedWindow.id === 1) {
					BrowserWindow.getAllWindows().forEach(win => {
						if (win.id > 1) win.close()
					})
				}
				focusedWindow.reload()
			}
		}
	}, {
		label: '切换全屏',
		accelerator: (() => {
			if (process.platform === 'darwin') {
				return 'Ctrl+Command+F'
			} else {
				return 'F11'
			}
		})(),
		click: (item, focusedWindow) => {
			if (focusedWindow) {
				focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
			}
		}
	}, {
		label: '切换开发者工具',
		accelerator: (() => {
			if (process.platform === 'darwin') {
				return 'Alt+Command+I'
			} else {
				return 'Ctrl+Shift+I'
			}
		})(),
		click: (item, focusedWindow) => {
			if (focusedWindow) {
				focusedWindow.toggleDevTools()
			}
		}
	}, {
		type: 'separator'
	}, {
		label: '应用程序菜单演示',
		click: function (item, focusedWindow) {
			if (focusedWindow) {
				const options = {
					type: 'info',
					title: '应用程序菜单演示',
					buttons: ['好的'],
					message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
				}
				dialog.showMessageBox(focusedWindow, options, function () {})
			}
		}
	}]
}, {
	label: '窗口',
	role: 'window',
	submenu: [{
		label: '最小化',
		accelerator: 'CmdOrCtrl+M',
		role: 'minimize'
	}, {
		label: '关闭',
		accelerator: 'CmdOrCtrl+W',
		role: 'close'
	}, {
		type: 'separator'
	}, {
		label: '重新打开窗口',
		accelerator: 'CmdOrCtrl+Shift+T',
		enabled: false,
		key: 'reopenMenuItem',
		click: () => {
			app.emit('activate')
		}
	}]
}, {
	label: '帮助',
	role: 'help',
	submenu: [{
		label: '学习更多',
		click: () => {
			shell.openExternal('http://electron.atom.io')
		}
	}]
}]

if (process.platform === 'darwin') {
	const name = app.getName()
	template.unshift({
		label: name,
		submenu: [{
			label: `关于${name}`,
			role: 'about'
		}, {
			type: 'separator'
		}, {
			label: '服务',
			role: 'services',
			submenu: []
		}, {
			type: 'separator'
		}, {
			label: `隐藏${name}`,
			accelerator: 'Command+H',
			role: 'hide'
		}, {
			label: '隐藏其它',
			accelerator: 'Command+Alt+H',
			role: 'hideothers'
		}, {
			label: '显示全部',
			role: 'unhide'
		}, {
			type: 'separator'
		}, {
			label: '退出',
			accelerator: 'Command+Q',
			click: () => {
				app.quit()
			}
		}]
	})

	// 窗口菜单.
	template[3].submenu.push({
		type: 'separator'
	}, {
		label: '前置所有',
		role: 'front'
	})

	addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
	const helpMenu = template[template.length - 1].submenu
	addUpdateMenuItems(helpMenu, 0)
}


function addUpdateMenuItems(items, position) {
	if (process.mas) return

	const version = app.getVersion()
	let updateItems = [{
		label: `版本${version}`,
		enabled: false
	}, {
		label: '正在检查更新',
		enabled: false,
		key: 'checkingForUpdate'
	}, {
		label: '检查更新',
		// visible: false,
		key: 'checkForUpdate',
		click: () => {
			// require('electron').autoUpdater.checkForUpdates()
			const log = require("electron-log")
			log.transports.file.level = "debug"
			autoUpdater.logger = log
			// autoUpdater.checkForUpdates();
			// autoUpdater.checkForUpdatesAndNotify()
			updateHandle()
		}
	}, {
		label: '重启并安装更新',
		enabled: true,
		visible: false,
		key: 'restartToUpdate',
		click: () => {
			require('electron').autoUpdater.quitAndInstall()
		}
	}]

	items.splice.apply(items, [position, 0].concat(updateItems))
}
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(){
    let message={
      error:'检查更新出错',
      checking:'正在检查更新……',
      updateAva:'检测到新版本，正在下载……',
      updateNotAva:'现在使用的就是最新版本，不用更新',
    };
    const os = require('os');
    autoUpdater.setFeedURL('http://192.168.201.231:8080/download');
    autoUpdater.on('error', function(error){
      sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function() {
      sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function(info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function(info) {
        sendUpdateMessage(message.updateNotAva)
    });
    
    // 更新下载进度事件
    autoUpdater.on('download-progress', function(progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        ipcMain.on('isUpdateNow', (e, arg) => {
            //some code here to handle event
            autoUpdater.quitAndInstall();
        })
        mainWindow.webContents.send('isUpdateNow')
    });
    
    //执行自动更新检查
    autoUpdater.checkForUpdates();
}

// 通过main进程发送事件给renderer进程，提示更新信息
// mainWindow = new BrowserWindow()
function sendUpdateMessage(text){
    mainWindow.webContents.send('message', text)
}










// 初始化LoginWindow
function initLoginWindwo() {
	if (mainWindow) { // 判断主窗口是否存在存在则关闭并重置
		mainWindow.close();
		mainWindow = null;
	}

	// 创建
	createLoginWindow()
}

// 初始化主窗口
function initMainWindow() {
	if (loginWindow) {
		loginWindow.close();
		loginWindow = null;
	}
	createWindow()
}

// 初始化 从主进程到渲染进程的异步通信。
function initIpc() {
	// 打开主窗口回调
	ipcMain.on('ipcOpenMainWindow', (options) => {
		// console.log(options)
		if (mainWindow) { // 实例存在则弹出
			mainWindow.show()
		} else { // 不存在则初始化，如login转到main
			initMainWindow();
		}
	})

	// 登陆到主界面
	ipcMain.on('ipcMainIsReady', (ops) => {
		if (mainWindow) { // 实例存在则弹出
			mainWindow.show()
			mainWindow.webContents.send('ipcInitWs', {})
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
		minWidth: 350,
		minHeight: 350,
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
		if (input.code === 'F12') {
			mainWindow.webContents.toggleDevTools()
		}
	})



	// 创建后初显示 更优雅的显示(官方标注，减少白屏)
	mainWindow.on('ready-to-show', () => {
		if (mainWindow) mainWindow.show();

		// 重新
		mainWindow.webContents.send('ipcInitWs', {})
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
app.on('ready', () => {
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	// 初始化LoginWindow
	initLoginWindwo()
	// createLoginWindow()

	// 初始化ipcMain 主页面和渲染页面（网页）之间的通讯
	initIpc();
	updateHandle()
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