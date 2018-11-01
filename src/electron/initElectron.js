// electron交互的JS
const {ipcRenderer} = window.require('electron')

class ElectronAid {
	openMainWindow = () => {
		ipcRenderer.send('ipcOpenMainWindow',{});
	}
}

export default ElectronAid
