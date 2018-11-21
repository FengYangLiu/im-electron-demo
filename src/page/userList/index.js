import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Modal, Input, Icon, message, Avatar, Popconfirm } from "antd";
import { imAddFriend } from "../../util/strophe-websocket";
import "./index.less";

class ImUserList extends Component {
  state = {
    visible: false,
    userName: ""
  };

  handleSendAddFriend = () => {
    // imAddFriend()
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    if (!this.state.userName) {
      message.info("内容不能为空！");
      return false;
    }
    imAddFriend(this.state.userName);

    this.setState({
      visible: false,
      userName: ""
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      userName: ""
    });
  };
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({
      userName: ""
    });
  };

  onChangeUserName = e => {
    this.setState({
      userName: e.target.value
    });
  };

  transformlastTowChat = item => {
    if (!item.name) {
      return (item.name = "数据有误");
    } else {
      return item.name.substr(item.name.length - 2, item.name.length);
    }
  };

  render() {
    const { userList } = this.props;
    const { userName } = this.state;

    const suffix = userName ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;

    return (
      <div className="im-user">
        <div className="im-user-list">
          <div className="group-chat-btn border-bottom">
            <span> 通讯录 </span>
            <Icon className="add-friend" type="plus" onClick={this.showModal} />
          </div>
          <div className="new-friend-text border-bottom"> 新的朋友 </div>
          {/* <div className="new-friend-btn border-bottom">
				            <div className="user-img" />
				            新的朋友
						  </div> */}
          <div className="user-list">
            {
              // userList.map((item) => (
              // <NavLink to={`/userList/${item.name}`}
              // 	className="user-list-item" >
              // 	<div className="user-img" >
              // 	</div>
              // 	<div className="user-name" >
              // 		{ item.name}
              // 	</div>
              // </NavLink>
              // ))
            }
            {
              <NavLink to="/userList/1" className="user-list-item">
                <div className="user-avater-wrap">
                  <Avatar className="user-avater"> lfy2 </Avatar>
                </div>
                <div className="user-info-content">
                  <div className="info-wrap">
                    <div className="user-name"> sss </div>
                    <div className="user-title"> sss </div>
                  </div>
				  {/* <div className="delete-friend"> */}
				  <Popconfirm title="确定要删除好友么？" 
				  okText="确定"
				  cancelText="再想想"
				  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
	                  <Icon type="close-circle" className="delete-friend" />
				  </Popconfirm>
                  {/* </div> */}
                </div>
              </NavLink>
            }
          </div>
        </div>
        <Modal
          title="添加好友"
          className="add-friend-modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Input
            placeholder="请输入账号"
            prefix={
              <Icon
                type="user"
                style={{
                  color: "rgba(0,0,0,.25)"
                }}
              />
            }
            suffix={suffix}
            value={userName}
            onChange={this.onChangeUserName}
            ref={node => (this.userNameInput = node)}
          />
        </Modal>
      </div>
    );
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
  return {};
};
const tempConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImUserList);
export default tempConnect;
