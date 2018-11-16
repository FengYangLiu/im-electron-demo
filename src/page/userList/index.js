import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import {
	Modal,
	Input,
	Icon,
	message
} from 'antd';
import {
	imAddFriend
} from '../../util/strophe-websocket'
import './index.less'

class ImUserList extends Component {
	state = {
		visible: false,
		userName: ''
	}

	handleSendAddFriend = () => {
		// imAddFriend()

	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	}

	handleOk = (e) => {
		console.log(e);
		if(!this.state.userName){
			message.info('内容不能为空！');
			return false;
		}
		imAddFriend(this.state.userName);

		this.setState({
			visible: false,
			userName: ''
		});
	}

	handleCancel = (e) => {
		console.log(e);
		this.setState({
			visible: false,
			userName:''
		});
	}
	emitEmpty = () => {
		this.userNameInput.focus();
		this.setState({
			userName: ''
		});
	}

	onChangeUserName = (e) => {
		this.setState({
			userName: e.target.value
		});
	}

	render() {
		const {
			userList
		} = this.props
		const {
			userName
		} = this.state;

		const suffix = userName ? < Icon type="close-circle" onClick={ this.emitEmpty }/> : null;

		return (
		<div className="im-user" >
			<div className="im-user-list" >
				<div className="group-chat-btn border-bottom" > 群聊 </div> 
			<div className="new-friend-text border-bottom" > 新的朋友 </div>
				<div onClick={ this.showModal } className="new-friend-btn border-bottom" >
					<div className="user-img" />
					新的朋友
				</div> 
			<div className="user-list" > {
						userList.map((item) => (
						<NavLink to={`/userList/${item.name}`}
							className="user-list-item" >
							<div className="user-img" >
								{ item.name.substr(item.name.length - 2, item.name.length)} 
							</div> 
							<div className="user-name" > 
								{ item.name} 
							</div> 
						</NavLink>
						))
					} 
					{
						/* <NavLink to="/userList/1" className="user-list-item">
													<div className="user-img">
													lfy2
													</div>
													<div className="user-name">
		
													sss
													</div>
												</NavLink> */
					} 
				</div> 
					</div>
				 <Modal title="新的好友"
						visible={ this.state.visible }
						onOk={ this.handleOk }
						onCancel={ this.handleCancel } >
				<Input placeholder="Enter your username"
					prefix={< Icon type="user"
						style={{ color: 'rgba(0,0,0,.25)' }}
					/>}
					suffix={ suffix }
					value={ userName }
					onChange={ this.onChangeUserName }
					ref={
						node => this.userNameInput = node
					}
				/> 
			</Modal> 
		</div>
		)
	}
}
// 映射 state 至 props
const mapStateToProps = state => {
	return {
		userList: state.userList
	};
};

// store.dispatch, props
const mapDispatchToProps = dispatch => {
	return {

	};
};
const tempConnect = connect(
	mapStateToProps,
	mapDispatchToProps
)(ImUserList);
export default tempConnect;