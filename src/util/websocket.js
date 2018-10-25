/*
 * @Author: lfy 
 * @Date: 2018-10-25 13:55:53 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-10-25 15:25:46
 */


const connectionState = ["正在连接..", "连接已建立", "正在关闭..", "已经关闭"];
const hostname = '192.168.201.147';
const port = '7070';
const host = `ws://${hostname}:${port}/ws/`;
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





function initWS(_userinfo){
	userinfo = {..._userinfo};
	if (window.WebSocket) {
		//OpenFire是实现了WebSocket的子协议
		var connection = new WebSocket(host, "xmpp");
		window._IMWS = connection;
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
