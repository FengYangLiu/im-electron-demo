// import Strophe from "strophe.js";
let StropheJS = require('strophe.js')
let Strophe = StropheJS.Strophe

const connectionState = ["正在连接..", "连接已建立", "正在关闭..", "已经关闭"];
const hostname = '192.168.201.147';
const port = '7070';
const host = `ws://${hostname}:${port}/ws/`;
// const host = `/ws/`;
let userinfo = {
	username:'',
	password:''
}
// 打开接口
function wsOpen(event) {
	const connection = window._IMWS;
	//打印链接状态
	console.log(connectionState[connection.readyState]);
	//发送建立流请求
	var steam = `<open 
		to='${hostname}'
		from='${userinfo.username}@${hostname}'
		xmlns='urn:ietf:params:xml:ns:xmpp-framing'
		version='1.0'
		/>`;
	connection.send(steam);
}

// 传递消息
function wsMsg(event) {
	console.log("Server: " + event.data);
	if (event.data.indexOf('id=\'') > 0) {
		window.msId = event.data.match(/id='(.+?)'/)[1]
	}
	let currentReadyState = event.currentTarget.readyState
	if(currentReadyState === 1){
		auth(window._IMWS)
	}
}

function wsClose(event) {
	console.log('关闭');
}


function linkCallback(e) {
	let ws = window._IMWS
	var steam3 = `<presence id="${window.msId}">
		<status>Online</status>
		<priority>1</priority>
	</presence>`
	steam3 = StropheJS.$pres({
		id:window.msId,
	})
	.c('status',{},'Online')
	.c('priority',{},'1')
	.tree();
	// var dom = parseDom(steam3)
	ws.send(steam3)
}

function parseDom(nodelist) {
	var objE = document.createElement("div");  
	objE.innerHTML = nodelist;
	return objE.childNodes;
  }

function initWS(_userinfo){
	userinfo = {..._userinfo};
	if (window.WebSocket) {
		//OpenFire是实现了WebSocket的子协议
		var connection = new Strophe.Connection(host, {protocol:'ws',port});
		window._IMWS = connection;

		const connectParam = [
			`${userinfo.username}@${hostname}`, // JID
			`${userinfo.password}`, // password
			linkCallback
		]

		connection.connect(...connectParam)
		console.log(connectionState[connection.readyState]);
		//注册连接建立时的方法
		connection.onopen = wsOpen;
	
		//注册连接关闭时的方法
		connection.onclose = wsClose;
		//注册收到消息时的方法
		connection.onmessage = wsMsg;
	}
}

function auth(ws) {
	//Base64编码
	var token = window.btoa(`${userinfo.username}@${hostname}\0${userinfo.password}`);
	var message = `<auth 
	xmlns='urn:ietf:params:xml:ns:xmpp-sasl' 
	mechanism='PLAIN'
	>${token}</auth>`;
	console.log("Client: " + message);
	ws.send(message);

	// 通过id
	var steam2 = `<iq id="${window.msId}" type="set">  
	<bind xmlns="urn:ietf:params:xml:ns:xmpp-bind">
	<resource>Showings</resource>  
	</bind>  
	</iq>`
	ws.send(steam2)

	// 在线
	var steam3 = `<presence id="${window.msId}">
		<status>Online</status>
		<priority>1</priority>
	</presence>`
	ws.send(steam3)
}

export {
	initWS,
	auth
}
