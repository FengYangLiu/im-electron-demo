import { IM_SEND_MSG } from './actionTypes';

const defaultState = {
	inputValue: '',
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
	}
	return state
}