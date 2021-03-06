/*
 * @Author: lfy 
 * @Date: 2018-10-31 11:32:33 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-11-01 16:35:49
 * 统一管理action方便维护
 */
import {
	IM_SEND_MSG,
	IM_LOGIN_USER_INFO,
	IM_OPEN_ID,
	IM_FACE_CHANGE,
	IM_USER_LIST,
	IM_USER_INFORM_LIST
} from './actionTypes';

/**
 * 获取用户登陆信息
 * @param {Object} value 登陆用户信息包含（username和password）
 */
export const getLoginUserInfoAction = (value) => ({
	type:IM_LOGIN_USER_INFO,
	value
})


/**
 * 获取用户列表（花名册）信息
 * @param {Object} value 登陆用户信息包含（username和password）
 */
export const hadleChangeUserListAction = (value) => ({
	type:IM_USER_LIST,
	value
})

/**
 * 获取用户列表（花名册）信息
 * @param {Object} value 登陆用户信息包含（username和password）
 */
export const hadleChangeUserInformListAction = (value) => ({
	type:IM_USER_INFORM_LIST,
	value
})



/**
 * 获取发送消息的action
 * @param {Object} value msg信息包含两个（name和msg）
 */
export const getSendMsgAction = (value) => ({
	type: IM_SEND_MSG,
	value
})

/**
 * 获取OPEN_ID
 * @param {String} value openid
 */
export const hadleSendMsgAction = (value) => ({
	type:IM_OPEN_ID,
	value
})

/**
 * 表情
 * @param {String} value openid
 */
export const hadleFaceChangeAction = (value) => ({
	type:IM_FACE_CHANGE,
	value
})