import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './index.less'
import { Avatar } from 'antd';

// import ChatSection from './chatSection'

class ImChat extends Component{
	render(){
		const { userList } = this.props
		return (
			<div className="im-chat">
				<div className="chat-left-list" >
					<div className="chat-top-wrap">
						<div className="chat-top">
							<span className="">
								会话
							</span>
							<div className="chat-title-send">发起会话</div>
						</div>
					</div>
						<NavLink activeClassName="user-list-active"  className="user-list" to="/chat/12">
						<div className="list-item">
							<div className="item-img">
								<Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large">
									L
								</Avatar>
							</div>
							<div className="item-content">
								<div className="item-content-top">
									<span className="item-title">
										lfy
									</span>
									<span className="item-time">
										11:15
									</span>
								</div>
								<p className="item-text">
									sdsdsdsd
								</p>
							</div>
						</div>
					</NavLink> 
					<NavLink activeClassName="user-list-active"  className="user-list" to="/chat/13">
						<div className="list-item">
							<div className="item-img">
								<Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large">
									more
								</Avatar>
							</div>
							<div className="item-content">
								<div className="item-content-top">
									<span className="item-title">
										jerry、lfy、admin等人
									</span>
									<span className="item-time">
										15:22
									</span>
								</div>
								<p className="item-text">
									多人聊天
								</p>
							</div>
						</div>
					</NavLink> 
				</div>

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
  )(ImChat);
export default tempConnect;