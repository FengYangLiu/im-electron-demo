import React, { Component } from "react";
import { Input, Button, Avatar } from "antd";
import "./index.less";

// websocket 暴露接口
import { imSendMsg } from "../../../util/strophe-websocket";

// action 统一管理
import { getSendMsgAction } from "../../../store/actionCreators";

import { connect } from "react-redux";

const { TextArea } = Input;

class ChatSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgText: "",
      tagetUser: "admin",
      chatList: []
    };
  }
  // 修改发送文本
  handleChangeMsgText = e => {
    const { value } = e.target;
    this.setState({
      msgText: value
    });
  };

  // 发送消息
  sendMsg = evt => {
    const { msgText, tagetUser } = this.state;
    /**
     * to：接受者的jid
     * msg：发送的消息
     */
    let info = {
      to: tagetUser,
	  msg: msgText,
	};
	
    imSendMsg(info,()=>{
		// 调用store触发redux
		this.props.handleActionSendMsg(msgText);
	});
    this.setState({
      msgText: ""
    });
  };
  render() {
	  const {chatList } = this.props;
    const { msgText } = this.state;

    return (
      <div id="im-chat-section">
        <div className="section-top">
          <div className="section-top-left">
            <div className="section-top_left-username">
              lfy
            </div> 
            <div className="section-top_left-userText">
              ssssss
            </div>
          </div>
          <div>
            图标
          </div>
        </div>
        <div className="section-center">
          {chatList.map(item => (
            <div className={`message-content ${item.type?'me':''}`}>
              <div className='message-avatar-wrap'>
                <Avatar
                  style={{
                    backgroundColor: "#f56a00",
                    verticalAlign: "middle"
                  }}
                  size="large"
                >
                 {item.name}
                </Avatar>
              </div>
              <div className="message-text">{item.msg}</div>
            </div>
          ))}
          {/* <div className="message-content">
            <div className="message-avatar-wrap">
              <Avatar
                style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
                size="large"
              >
                Admin
              </Avatar>
            </div>
            <div className="message-text">right</div>
          </div>
          <div className="message-content me">
            <div className="message-avatar-wrap">
              <Avatar
                style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
                size="large"
              >
                Lfy
              </Avatar>
            </div>
            <div className="message-text">right</div>
          </div> */}
        </div>
        <div className="section-bottom">
          <TextArea
            className="section-text"
            rows={5}
            value={msgText}
            onChange={value => {
              this.handleChangeMsgText(value);
            }}
          />
          <div className="section-button-box">
            <Button onClick={this.sendMsg} icon="message">
              send
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
// 映射 state 至 props
const mapStateToProps = state => {
  console.log(state);
  return {
    chatList: state.chatList
  };
};

// store.dispatch, props
const mapDispatchToProps = dispatch => {
  return {
    // 回调发送消息动作
    handleActionSendMsg: msg => {
      // 添加一个动作
      const action = getSendMsgAction({
		name: "lfy1",
		type:1,
        msg
      });
      // 发送动作
      dispatch(action);
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatSection);
