/*
 * @Author: lfy 
 * @Date: 2018-10-29 16:07:46 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-11-01 19:09:09
 */

import store from '../store/index.js';
import {
	IM_CHAT_MODULE_TYPE
} from '../config/code';
import {
	XMPP_DOM,
	SPACE_PING,
	IQ_TYPE,
	MASSAGE_TYPE,
	SPACE_IQ_ROSTER,
	PRESENCE_TYPE,
	ITEM_SUB_TYPE
} from '../config/xmppCode'; // xmpp命名空间文件

import {
	getSendMsgAction,
	hadleSendMsgAction,
	hadleChangeUserListAction,
	hadleChangeUserInformListAction
} from '../store/actionCreators'

import ElectronAid from '../electron'

// 配置文件config
import {
	IM_SERVE,
	IM_HOST
} from '../config/config'

let StropheJS = require('strophe.js')
let Strophe = StropheJS.Strophe

// 通过配置统一管理方便后期维护
const hostname = IM_SERVE.hostname;
const port = IM_SERVE.port;
const host = IM_HOST;

// store 统一
let LOGIN_USER_INFO = store.getState().LOGIN_USER_INFO;
let IM_OPEN_ID = store.getState().IM_OPEN_ID;
// let IM_WS = null
// window.IM_WS=null;

// 订阅器，订阅store改变状态
store.subscribe(handleChangeStore)

function handleChangeStore() {
	LOGIN_USER_INFO = store.getState().LOGIN_USER_INFO
	IM_OPEN_ID = store.getState().IM_OPEN_ID
}

// websocket连接后验证后的回调
function linkCallback(status, cb) {

	let connected = window.IM_WS.connected
	/*
	//xmpp协议：更换状态 
	let steam3 = `<presence id="${window.msId}">
		<status>Online</status>
		<priority>1</priority>
	</presence>`
	*/
	if (connected) {
		let steam = StropheJS.$pres({
				id: IM_OPEN_ID,
			})
			.c('status', {}, '请勿打扰')
			.c('show', {}, '请勿打扰')
			.c('priority', {}, '0')
			.tree();
		window.IM_WS.send(steam)

		if (status === Strophe.Status.CONNECTING) {
			console.log("连接中！");
		} else if (status === Strophe.Status.CONNFAIL) {
			console.log("连接失败！");
		} else if (status === Strophe.Status.AUTHFAIL) {
			console.log("登录失败！");
		} else if (status === Strophe.Status.DISCONNECTED) {
			console.log("连接断开！");
		} else if (status === Strophe.Status.CONNECTED) {
			console.log("连接成功，可以开始聊天了！");
			if (cb) cb()

			let domain = Strophe.getDomainFromJid(window.IM_WS.jid)
			// 发送一个ping
			onSendPing(domain)

			//  获取花名册
			getChatUserList()

			// 当接收到<message>节，调用onMessage回调函数
			window.IM_WS.addHandler(onMessage, null, 'message');

			// 当接收到iq,并且是该命名空间的ping，调用handleGetPing回调函数 
			// window.IM_WS.addHandler(handleGetPing, null, 'iq', 'ping1');

			// 监听所有的 presence
			window.IM_WS.addHandler(handleGetPres, null, XMPP_DOM.PRESENCE)

			// 监听用户列表的改变 presence
			window.IM_WS.addHandler(handleGetUserListChange, SPACE_IQ_ROSTER, XMPP_DOM.IQ , IQ_TYPE.SET)

			// 首先要发送一个<presence>给服务器（initial presence）
			window.IM_WS.send(StropheJS.$pres().tree());

			// 为IM增加日志监听
			// Strophe.log = handleLogger;

			// 15s ping一次，成功继续，失败重连
			// window.IM_WS.addTimedHandler(5000, onSendPing)

			// 对窗口通讯打开主窗口
			if (ElectronAid.openMainWindow) { // 存在则打开窗口不存在则跳转路由
				ElectronAid.openMainWindow()
			} else { // 不存在		
				window.location.hash = '#/chat'
			}
		}
	}
}

/**
 * 初始化strophe 的 websocket
 * @param {Function} cb 回调
 */
function initWS(cb) {
	if (localStorage.LOGIN_USER_INFO) {
		LOGIN_USER_INFO = JSON.parse(localStorage.LOGIN_USER_INFO)
	}
	if (LOGIN_USER_INFO.username) {
		localStorage.setItem('LOGIN_USER_INFO', JSON.stringify(LOGIN_USER_INFO))
		//OpenFire是实现了WebSocket的子协议
		let connection = new Strophe.Connection(host, {
			protocol: 'ws',
			sync: true
		});

		window.IM_WS = connection;

		// 监听用于接收进入连接的XML数据
		window.IM_WS.xmlInput = getImXMLRespone;

		const connectParam = [
			`${LOGIN_USER_INFO.username}@${hostname}`, // JID
			`${LOGIN_USER_INFO.password}`, // password
			(status) => {
				linkCallback(status, cb) // 连接后的回调
			}
		]

		window.IM_WS.connect(...connectParam)
	}
}

/**
 * 监听用于接收进入连接的XML数据
 * @param {Element} xml 返回的xml
 */
function getImXMLRespone(xml) {
	let nodeName = xml.nodeName;
	if (nodeName === 'open') {
		getOpenId(xml)
	}
}


// 接收 <open> 获取uid
function getOpenId(ele) {
	let openId = ele.getAttribute('id');
	if (openId && openId !== IM_OPEN_ID) {
		handleStoreToOpenId(openId)
	}

}

// 接收到<message> 的回调
function onMessage(msg) {
	// 解析出<message>的from、type属性，以及body子元素
	let from = msg.getAttribute('from');
	let type = msg.getAttribute('type');
	let elems = msg.getElementsByTagName('body');

	if (type === MASSAGE_TYPE.CHAT && elems.length > 0) { // 单聊获取消息
		let body = elems[0];
		const send_msg_name = from.split('@')[0];
		const send_msg_text = Strophe.getText(body);
		let msg = {
			name: send_msg_name,
			msg: send_msg_text
		};
		handleStoreGetMsg(msg)
	} else if (type === MASSAGE_TYPE.GROUP_CHAT && elems.length > 0) { // 群聊
		let body = elems[0];
		const send_msg_name = from.split('@')[0];
		const send_msg_text = Strophe.getText(body);
		let msg = {
			name: send_msg_name,
			msg: send_msg_text
		};
		handleStoreGetMsg(msg)
	}
	return true;
}

/**
 * 处理ping的回调函数
 * @param {Element} iqEle iq回调
 */
function handleGetPing(iqEle) {
	// let from = iqEle.getAttribute('from');
	// let type = iqEle.getAttribute('type');
	// let elems = iqEle.getElementsByTagName('body');
	// const pong = StropheJS.$iq({

	// })
	return false;
}


/**
 * 发送消息
 * @param {Object} info data
 * @param {Function} cb 回调
 */
function imSendMsg(info, cb) {
	if (!window.IM_WS) {
		// alert("请输入联系人！");
		window.location.hash = '#/'
		return;
	}
	let connected = window.IM_WS.connected || false
	if (connected) {
		if (!info.to) {
			alert("请输入联系人！");
			return;
		}
		let chatType = MASSAGE_TYPE.CHAT;

		// 群组的话需要加入群聊才能聊天
		if (info.type === IM_CHAT_MODULE_TYPE.GROUP) { // 如果是群组的话
			/**
			 * 加入群聊协议
			 * <presence from='xxg@host' to='xxgroom@muc.host/xxg'>
			 *		<x xmlns='http://jabber.org/protocol/muc'/>
			 *	</presence>
			 */
			chatType = MASSAGE_TYPE.GROUP_CHAT;


			let sendEle = StropheJS.$pres({
					from: window.IM_WS.authzid,
					to: `${info.to}/${window.IM_WS.authcid}`,
					id: IM_OPEN_ID
				}).c('x', {
					xmlns: 'http://jabber.org/protocol/muc'
				}, null)
				.tree()
			window.IM_WS.send(sendEle)


		}
		// 创建一个<message>元素并发送
		let msg = StropheJS.$msg({
			to: info.to,
			from: window.IM_WS.authzid,
			type: chatType
		}).c("body", null, info.msg);
		window.IM_WS.sendPresence(msg.tree(), (evt) => {
			console.log(evt)
		}, (err) => {
			cb && cb()
		}, 500);
	} else {
		alert("请先登录！");
	}
}

// 登出回调
function outLogin() {
	let steam = StropheJS.$build('close', {
			xmlns: "urn:ietf:params:xml:ns:xmpp-framing"
		})
		.tree();
	window.IM_WS.send(steam)
}

/**
 * 获取消息回调
 * redux action
 */
function handleStoreGetMsg(value) {
	// 一个行为
	const action = getSendMsgAction(value)
	// 发送动作
	store.dispatch(action);
}

/** 
 * Store 获取最初的ID
 * reudx action
 */
function handleStoreToOpenId(value) {
	const action = hadleSendMsgAction(value)
	store.dispatch(action)
}

/**
 * 获取用户列表
 * redux action 
 */
function handleChangeUserList(value) {
	const action = hadleChangeUserListAction(value)
	store.dispatch(action)
}

/**
 * 获取好友请求列表
 * redux action 
 */
function handleChangeUserInformList(value) {
	const action = hadleChangeUserInformListAction(value)
	store.dispatch(action)
}

/**
 * 请求花名册（用户列表）
 */
function getChatUserList() {
	let iqEle = StropheJS.$iq({
		from: window.IM_WS.authzid,
		type: IQ_TYPE.GET,
		id: 'roster'
	}).c("query", {
		xmlns: SPACE_IQ_ROSTER
	}, null).tree();
	window.IM_WS.sendIQ(iqEle, (iq) => {
		let itemEle = iq.querySelectorAll('item');
		let itemArr = [];
		let askItem = [];
		itemEle.forEach((item, index) => {
			const itemAttr = item.getAttributeNames();
			let itemAttrObj = {};
			let askAttrObj ={}
				if(itemAttr.indexOf('ask')<= 0){
					const subscription = item.getAttribute('subscription')
					if(subscription===ITEM_SUB_TYPE.TO || subscription===ITEM_SUB_TYPE.BOTH){
						// 订阅或者被订阅
						itemAttr.map(name => itemAttrObj[name] = item.getAttribute(name))

						if(itemAttr.indexOf('name') <= 0){
							itemAttrObj['name'] = itemAttrObj['jid'].split('@')[0];
						}
					}

				}else{
					itemAttr.map(name =>{
						askAttrObj[name] = item.getAttribute(name)
					})	
				}
			const groupEle = item.querySelector('group');
			let obj = { ...itemAttrObj};
			let askObj = {...askAttrObj}
			if(groupEle){ // 容错处理，获取列表的时候会获取 用户列表和好友请求消息
				// <item jid="lfy3@192.168.201.231" ask="subscribe" subscription="none"/>
				const groupText = groupEle.innerHTML
				obj = {...obj,groupName: groupText}
				// 好友请求消息
			}

			if(Object.keys(obj).length>0){
				itemArr.push(obj)
			}else if(Object.keys(askObj).length>0){
				askItem.push(askObj);
			}
		})

		// 发送消息
		handleChangeUserList(itemArr);
		handleChangeUserInformList(askItem);
		console.log(itemArr)
	}, (e) => {
		console.log(`err: ${e}`)
	})

}

/**
 * 监听所有的pre对象
 * @param {Element} pres pres对象
 */
function handleGetPres(pres){
	const pType = pres.getAttribute('type');
	if(pType !== PRESENCE_TYPE.ERROR){ // 未报错

	}else if(pType === PRESENCE_TYPE.UNAVAILABLE){ // 不可用状态

	}else{ // 报错
		
	}
	console.log(pres)
	return true;
}


/**
 * 监听所有用户列表变动
 * @param {Element} iqELe iqDOM对象
 */
function handleGetUserListChange(iqELe){
	console.log(iqELe)
	// const itemDom = iqELe.querySelector('item');
	// const sub = itemDom.getAttribute('subscription');

	// if(sub !== ITEM_SUB_TYPE.REMOVE){

	// }else{ // 删除用户状态 
	// 	console.log('=================== s 用户列表状态监听 ============')
	// 	console.log(iqELe)
	// 	console.log('=================== e 用户列表状态监听 ============')
	// }	
	return true;
}

// 日志监听
function handleLogger(level, msg) {
	// level
	const logLevelInfo = {
		0: '[DEBUG] 调试输出:',
		1: '[INFO] 信息输出:',
		2: '[WARN] 警告:',
		3: '[ERROR] 错误:',
		4: '[FATAL] 致命错误:'
	}
	console.log(`${logLevelInfo[level]} ${msg}`)
}

/**
 * 发送ping
 * @param {String} to 发送给谁
 */
function onSendPing(to = IM_SERVE.hostname) {
	console.log('ping~')
	/* 
	<iq from='juliet@capulet.lit/balcony' to='capulet.lit' id='c2s1' type='get'>
	<ping xmlns='urn:xmpp:ping'/>
	</iq> 
	*/
	const ping = StropheJS.$iq({
		to,
		type: IQ_TYPE.GET,
		id: 'ping1'
	}).c('ping', {
		xmlns: SPACE_PING
	}, null).tree();

	console.log(`[start_time:${new Date().toLocaleString()}] Ping to: ${to}`);

	window.IM_WS.sendIQ(ping,(iq)=>{
		const iType = iq.getAttribute('type');
		if(iType === IQ_TYPE.RESULT){ 
			// code
		}
	},(err)=>{
		console.log(err)
	})
	console.log('状态：' + window.IM_WS.connected)
	if(window.IM_WS.connected){
		return true;
	}else{
		// 删除定时器方法 
		// window.IM_WS.deledeleteTimedHandler(onSendPing); // 这里有问题不是返回调用函数而是add 的引用 暂时注销

		// 重新创建 (未测试，这里只能是网络断掉 window)
		window.IM_WS.reset()
		return false;
	}
}

function imAddFriend(jid){
/* <iq id ='a78b4q6ha463'to ='juliet @ 
       example.com/chamber'type 
       ='set'> 
    <query xmlns ='jabber：iq：roster'> 
      <item jid='nurse@example.com'/ > 
    </ query> 
  </ iq> */
    const toJid = `${jid}@${hostname}`
	const iqEle = StropheJS.$iq({
		type: IQ_TYPE.SET,
		id:'addFriend'
	})
	.c('query',{xmlns:SPACE_IQ_ROSTER},null)
	.c('item',{
		jid:toJid,
		name: jid
	})
	.tree();

	window.IM_WS.sendIQ(iqEle,(iq)=>{
		const iType = iq.getAttribute('type')
		if(iType === IQ_TYPE.RESULT){// 成功返回
			console.log(`增加好友成功：`)
			const subscribePre = StropheJS.$pres({to:toJid, type:PRESENCE_TYPE.SUBSCRIBE}).tree()
			window.IM_WS.send(subscribePre);
		}
		// getChatUserList()
	},(err)=>{
		console.log(`增加好友失败：${err}`)
	})

	
}


function imAddFriendSub(subObj){
	debugger
	// const toJid = `${jid}@${hostname}`
	const preEle = StropheJS.$pres({
		type: PRESENCE_TYPE.SUBSCRIBED,
		to: subObj.jid,
	})
	.tree();

	window.IM_WS.sendPresence(preEle,(pre)=>{
		debugger
		console.log(`订阅好友成功：`)
		console.log('刷新用户列表');
		subObj.success&&subObj.success()
		getChatUserList()
	},(err)=>{
		subObj.error&&subObj.error()
		console.log(`增加好友失败：${err}`)
	})
}

export {
	initWS,
	imSendMsg,
	outLogin,
	imAddFriend,
	imAddFriendSub
}