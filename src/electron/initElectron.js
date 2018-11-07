// electron交互的JS
const {ipcRenderer} = window.require('electron')

class ElectronAid {
	openMainWindow = () => {
		ipcRenderer.send('ipcOpenMainWindow',{});
	}

	// 通讯， 登陆建立连接
	loginToMainSync = (ops) => {
		console.log(ops)
		ipcRenderer.sendSync('ipcLoginToMain',{})
	}

	mainIsReady = () =>{
		// main 完成渲染
		ipcRenderer.send('ipcMainIsReady',{})

	}

	mainInitWs = (cb) =>{
		// 初始化ws
		ipcRenderer.on('ipcInitWs', ()=>{
			cb && cb()
		})
	}

	// 接受登陆数据
	handleLoginToMain = (cb) =>{
		
		
	}

}

export default ElectronAid
