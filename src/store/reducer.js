import {
	IM_LOGIN_USER_INFO,
	IM_SEND_MSG
} from './actionTypes';

// 默认数据
const defaultState = {
	inputValue: '',
	LOGIN_USER_INFO: {
		username: '',
		password: ''
	},
	chatList: [{
			name: 'lfy1',
			msg: 'hello'
		},
		{
			name: 'admin',
			msg: 'hi'
		}
	]
}

// reducer 可以接收state，但是绝对不能修改state
export default (state = defaultState, action) => {
	if (action.type === IM_SEND_MSG) {
		// 深拷贝一个state
		const newState = JSON.parse(JSON.stringify(state))
		newState.chatList.push(action.value)
		console.log(newState)
		return newState;
	} else if (action.type === IM_LOGIN_USER_INFO) {
		const newState = JSON.parse(JSON.stringify(state))
		newState.LOGIN_USER_INFO = action.value;
		return newState;
	}
	return state
}