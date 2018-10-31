/*
 * @Author: lfy 
 * @Date: 2018-10-31 11:32:33 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-10-31 14:59:16
 * 统一管理action方便维护
 */
import { IM_SEND_MSG } from './actionTypes';
export const getSendMsgAction = (value) => ({
	type:IM_SEND_MSG,
	value
})