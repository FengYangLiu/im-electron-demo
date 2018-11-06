import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './index.less'
import { Avatar } from 'antd';

// import ChatSection from './chatSection'

class ImChat extends Component{
	render(){
		return (
			<div className="im-chat">
				<div className="chat-left-list" >
					<div className="chat-top">
						会话
						<div>发起会话</div>
					</div>
					{/* <div className="user-list"> */}
						<Link className="user-list" to="/chat/12">
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
					</Link> 
					{/* </div> */}
				</div>

			</div>
		)
	}
}

export default ImChat;