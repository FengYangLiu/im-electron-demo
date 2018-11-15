import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'

import './index.less'

class ImUserList extends Component{
	render(){
		const { userList } = this.props
		return (
			<div className="im-user">
				<div className="im-user-list">
					<div className="group-chat-btn border-bottom">
						群聊
					</div>
					<div className="new-friend-text border-bottom">
						新的朋友
					</div>
					<div className="new-friend-btn border-bottom">
							<div className="user-img">

							</div>
								新的朋友

						
					</div>
					<div className="user-list">
						{
							userList.map((item)=>(
								<NavLink to={`/userList/${item.name}`} className="user-list-item">
											<div className="user-img">

											{item.name.substr(item.name.length-2,item.name.length)}
											</div>
											<div className="user-name">
											{item.name}
											</div>
										</NavLink>
							))
						}
						{/* <NavLink to="/userList/1" className="user-list-item">
							<div className="user-img">
							lfy2
							</div>
							<div className="user-name">

							sss
							</div>
						</NavLink> */}
					</div>
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
  )(ImUserList);
export default tempConnect;