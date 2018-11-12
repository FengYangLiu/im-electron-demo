import React, { Component } from "react";
import { Input, Button, Avatar, Popover, Tabs } from "antd";
import "./index.less";

import Face from '../../components/Face'
import {oldFaceSize} from '../../components/Face/FaceSection/faceSize'
// websocket 暴露接口
import { imSendMsg } from "../../../util/strophe-websocket";

// action 统一管理
import { 
  getSendMsgAction,
  hadleFaceChangeAction
 } from "../../../store/actionCreators";

import { connect } from "react-redux";

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const IM_FACE_TIME = '';
let that;

class ChatSection extends Component {
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      msgText: "",
      tagetUser: "admin",
      chatList: [],
      visible: false,
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

    imSendMsg(info, () => {
      // 调用store触发redux
      this.props.handleActionSendMsg(msgText);
    });
    this.setState({
      msgText: ""
    });
  };

  state = {

  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  handleFaceTextChange = (text)=>{
    const tempText = this.state.msgText+text
    this.setState({msgText:tempText})
  }

  handleTansformChat = (str) => {
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/(\n|\r\n)/g, '<br/>');
    str = str.replace(/\s/g, '&nbsp;');

    const reg = /\[old_(\d*)+\]/g;
    //   <div>
    //   sdasdas<div className='im-face old-face' style={{backgroundPositionX:-4,backgroundPositionY:-4}}></div>
    // </div>
    str = str.replace(reg,(word,w1,w2) => `<div class='im-face old-face' style="background-position:${oldFaceSize[w1].backgroundX}px ${oldFaceSize[w1].backgroundY}px"></div>`)
    let tempStr = `<div>${str}</div>`;
    return tempStr;
  }

  render() {
    const { chatList } = this.props;
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
          {chatList.map((item,index) => (
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
              <div className="message-text" dangerouslySetInnerHTML={{__html:this.handleTansformChat(item.msg)}}></div>
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
  console.log(state);
  if(state.IM_FACE_TEXT.faceStr && IM_FACE_TIME !== state.IM_FACE_TEXT.time){
    console.log('点击了表情')
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
    handleActionFaceChange: (faceStr='')=>{
      console.log(faceStr)
    const time = new Date().getTime()
    const action = hadleFaceChangeAction({faceStr,time})
    dispatch(action);
  }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatSection);
