/*
 * @Author: lfy 
 * @Date: 2018-10-29 16:07:46 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-10-30 16:27:05
 */

import store from '../store/index.js';

// import Strophe from "strophe.js";
let StropheJS = require('strophe.js')
let Strophe = StropheJS.Strophe

const hostname = '192.168.201.147';
const port = '7070';
const host = `ws://${hostname}:${port}/ws/`;

let userinfo = {
	username: '',
	password: ''
}

// 订阅回调
// store.subscribe(this.handleStoreSendMsg);

function linkCallback(status) {
	let ws = window._IMWS
	let connected = ws.connected
	/*
	//xmpp协议：更换状态 
	var steam3 = `<presence id="${window.msId}">
		<status>Online</status>
		<priority>1</priority>
	</presence>`
	*/
	
	if (connected) {
		let steam = StropheJS.$pres({
				id: window.msId,
			})
			.c('status', {}, 'Online')
			.c('priority', {}, '1')
			.tree();
		ws.send(steam)

		if (status === Strophe.Status.CONNECTING) {
			console.log("连接中！");
		} else if (status === Strophe.Status.CONNFAIL) {
			console.log("连接失败！");
		} else if (status === Strophe.Status.AUTHFAIL) {
			console.log("登录失败！");
		} else if (status === Strophe.Status.DISCONNECTED) {
			console.log("连接断开！");
			connected = false;
		} else if (status === Strophe.Status.CONNECTED) {
			console.log("连接成功，可以开始聊天了！");
			connected = true;
			// 当接收到<message>节，调用onMessage回调函数
			ws.addHandler(onMessage, null, 'message', null, null, null);

			// 首先要发送一个<presence>给服务器（initial presence）
			ws.send(StropheJS.$pres().tree());
		}
	}
}


function initWS(_userinfo) {
	userinfo = { ..._userinfo
	};
	if (window.WebSocket) {
		//OpenFire是实现了WebSocket的子协议
		var connection = new Strophe.Connection(host, {
			protocol: 'ws',
			port,
			sync: true
		});
		window._IMWS = connection;

		const connectParam = [
			`${userinfo.username}@${hostname}`, // JID
			`${userinfo.password}`, // password
			linkCallback // 连接后的回调
		]

		connection.connect(...connectParam)


		// //注册连接建立时的方法
		// connection.onopen = wsOpen;

		// //注册连接关闭时的方法
		// connection.onclose = wsClose;
		// //注册收到消息时的方法
		// connection.onmessage = wsMsg;
	}
}

// 接收到<message>
function onMessage(msg) {
	// 解析出<message>的from、type属性，以及body子元素
	var from = msg.getAttribute('from');
	var type = msg.getAttribute('type');
	var elems = msg.getElementsByTagName('body');

	if (type === "chat" && elems.length > 0) { // 获取消息
		var body = elems[0];
		// $("#msg").append(from + ":<br>" + Strophe.getText(body) + "<br>")
		const send_msg_name = from.split('@')[0];
		const send_msg_text = Strophe.getText(body);
		let msg = {
			name:send_msg_name,
			msg:send_msg_text
		};
		handleStoreGetMsg(msg)
		// console.log(Strophe.getText(body))
	}
	return true;
}

function imSendMsg(info) {
	let ws = window._IMWS
	let connected = ws.connected || false
	if (connected) {
		if (!info.to) {
			alert("请输入联系人！");
			return;
		}

		// 创建一个<message>元素并发送
		var msg = StropheJS.$msg({
			to: `${info.to}@${hostname}`,
			from: `${userinfo.username}@${hostname}`,
			type: 'chat'
		}).c("body", null, info.msg);
		ws.send(msg.tree());
	} else {
		alert("请先登录！");
	}
}

function outLogin() {
	let ws = window._IMWS;
	let steam = StropheJS.$build('close', {
			xmlns: "urn:ietf:params:xml:ns:xmpp-framing"
		})
		.tree();
	ws.send(steam)
}

function handleStoreGetMsg(value){
	// 一个行为
	const action = {
		type: 'send_msg',
		value
	}

	// 发送动作
	store.dispatch(action);

}

export {
	initWS,
	imSendMsg,
	outLogin
}