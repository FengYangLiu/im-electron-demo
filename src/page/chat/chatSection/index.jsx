import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { Input, Button, Avatar, Popover } from "antd";
import { IM_SERVE } from '../../../config/config'
import { IM_CHAT_MODULE_TYPE } from '../../../config/code'
import "./index.less";

import Face from '../../components/Face'
import { oldFaceSize } from '../../components/Face/FaceSection/faceSize'
// websocket 暴露接口
import { imSendMsg } from "../../../util/strophe-websocket";

// action 统一管理
import {
  getSendMsgAction,
  hadleFaceChangeAction
} from "../../../store/actionCreators";

import { connect } from "react-redux";

const { TextArea } = Input;
const IM_FACE_TIME = ''
let that;

class ChatSection extends Component {
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      msgText: "",
      tagetUser: `admin@${IM_SERVE.hostname}`,
      chatList: [],
      visible: false,
      chatUserInfo: {
        name: 'admin',
        headerText: '管理员',
        type: IM_CHAT_MODULE_TYPE.SINGLE
      }
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
    const { msgText, tagetUser, chatUserInfo } = this.state;
    /**
     * to：接受者的jid
     * msg：发送的消息
     */
    let info = {
      to: tagetUser,
      msg: msgText,
      type: chatUserInfo.type
    };
    imSendMsg(info, () => {
      // 调用store触发redux
      this.props.handleActionSendMsg(msgText);
    });
    this.setState({
      msgText: ""
    });
  };

  // 隐藏界面
  hide = () => {
    this.setState({
      visible: false,
    });
  }

  // 修改弹出的窗口
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  // 表情的变化 
  handleFaceTextChange = (text) => {
    const tempText = this.state.msgText + text
    this.setState({ msgText: tempText })
  }

  // 表情转义，展现
  handleTansformChat = (str) => {
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/(\n|\r\n)/g, '<br/>');
    str = str.replace(/\s/g, '&nbsp;');

    const reg = /\[old_(\d*)+\]/g;
    //   <div>
    //   sdasdas<div className='im-face old-face' style={{backgroundPositionX:-4,backgroundPositionY:-4}}></div>
    // </div>
    str = str.replace(reg, (word, w1, w2) => `<div class='im-face old-face' 
    style="background-position:${oldFaceSize[w1].backgroundX}px ${oldFaceSize[w1].backgroundY}px"></div>`)
    let tempStr = `<div>${str}</div>`;
    return tempStr;
  }

  componentDidMount() {

  }

  componentWillReceiveProps(next) {
    // const { match } = this.props;
    // const { id } = this.props.match.params
    // const oldId = next.match.params.id
    if (this.props !== next) { // 临时处理
      if (next.match.params.id === '13') {
        this.setState({
          tagetUser: `group@conference.${IM_SERVE.hostname}`,
          chatUserInfo: {
            name: '多人聊天',
            headerText: '群聊',
            type: IM_CHAT_MODULE_TYPE.GROUP
          }
        })
      } else {
        this.setState({
          tagetUser: `admin@${IM_SERVE.hostname}`,
          chatUserInfo: {
            name: 'admin',
            headerText: '管理员',
            type: IM_CHAT_MODULE_TYPE.SINGLE
          }
        })
      }
    }
  }

  render() {
    const { chatList } = this.props;
    const { msgText, chatUserInfo } = this.state;

    return (
      <div id="im-chat-section">
        <div className="section-top">
          <div className="section-top-left">
            <div className="section-top_left-username">
              {chatUserInfo.name}
            </div>
            <div className="section-top_left-userText">
              {chatUserInfo.headerText}
            </div>
          </div>
          <div>
            图标
          </div>
        </div>
        <div className="section-center">
          {chatList.map((item, index) => (
            <div className={`message-content ${item.type ? 'me' : ''}`} key={index}>
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
              <div className="message-text" dangerouslySetInnerHTML={{ __html: this.handleTansformChat(item.msg) }}></div>
              {/* <div className="message-text" >
                  <div>
                    sdasdas<div className='im-face old-face' style={{backgroundPositionX:-4,backgroundPositionY:-4}}></div>
                  </div>
              </div> */}
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
          <div className="bottom-nav_top">
            <Popover
              content={
                // <a onClick={this.hide}>Close</a>
                <Face></Face>

              }
              // title="Title"
              trigger="click"
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Button icon="smile" theme="outlined"></Button>
            </Popover>

            {/* <Icon type="smile" theme="outlined" /> */}
          </div>
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
  if (state.IM_FACE_TEXT.faceStr && IM_FACE_TIME !== state.IM_FACE_TEXT.time) {
    that.handleFaceTextChange(state.IM_FACE_TEXT.faceStr)
    that.props.handleActionFaceChange('')
  }
  return {
    chatList: state.chatList,
    face_text: state.IM_FACE_TEXT
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
        type: 1,
        msg
      });
      // 发送动作
      dispatch(action);
    },
    handleActionFaceChange: (faceStr = '') => {
      const time = new Date().getTime()
      const action = hadleFaceChangeAction({ faceStr, time })
      dispatch(action);
    }
  };
};
const tempConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatSection);
export default withRouter(tempConnect);
