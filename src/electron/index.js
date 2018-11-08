/*
 * @Author: lfy 
 * @Date: 2018-11-01 18:12:21 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-11-01 19:06:02
 * 用来初始化electron并处理网页与electron直接的问题
 */
// import ElectronAid from './initElectron';

 function isInElectron() {
	 if(window.require && typeof window.require('electron') === 'object'){
		 return true;
	 }
	 return false;
 }

 function checkElectron() {
	 if(isInElectron()){
		 let Elec =  require('./initElectron').default
		return new Elec();
	 }
	 return ''
 }

 export default checkElectron()
