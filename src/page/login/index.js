/*
 * @Author: lfy 
 * @Date: 2018-10-29 17:39:43 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-11-01 14:33:27
 */
import React, { Component } from "react";
import { Form, Icon, Input, Button, Spin, Tabs } from "antd";
import WindowHandle from '../components/WindowHandle';
import store from "../../store/index.js";
import { connect } from 'react-redux';

// websocket 暴露接口
import { initWS, imSendMsg, outLogin } from "../../util/strophe-websocket";

// action 统一管理
import { getSendMsgAction, getLoginUserInfoAction } from '../../store/actionCreators';
import ElectronAid from '../../electron'

import "./index.less";
import img_qr from '../../images/QRcode.png'
// import "./index.css";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class LoginMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgText: "",
      tagetUser: "admin",
      logging:false,
      chatList: []
    };
  }

  componentWillMount() {
    this.setState({
      chatList: this.props.chatList
    });
  }

  // 登录submit回调
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("发送的变量: ", values);
        this.props.handleActionUserLogin(values);
        this.setLoginState(true);
        // if(ElectronAid){

        //   ElectronAid.loginToMainSync(window.IM_WS)
        // }else{
          initWS(()=>{
            this.setLoginState(false);
          });
        // }
      }
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
      msg: msgText
    };

    // 调用store触发redux
    this.props.handleActionSendMsg(msgText)

    imSendMsg(info);
    this.setState({
      msgText: ""
    });
  };

  // 修改发送文本
  handleChangeMsgText = e => {
    const { value } = e.target;
    this.setState({
      msgText: value
    });
  };

  // 修改用户
  onChangeUserName = e => {
    this.setState({ tagetUser: e.target.value });
  };

  // 退出登录
  handleOutLogin = () => {
    outLogin();
  };

  // 回调发送消息
  handleChangeChatList = () => {
    this.setState({
      chatList: store.getState().chatList
    })
  }

  setLoginState = (state) => {
    this.setState({
      logging:state
    })
  }
  
  handleChangeTab = (key) => {

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { logging } = this.state;

    return (
      <div id="im-login">
        <Spin size="large" spinning={logging} delay='200'>
        { ElectronAid ? 
          (<div className="top-window">
            <span className="top-title">
              IM
            </span>

            <WindowHandle/> 
          </div>)
        : null }
        <Tabs className="tab-login" defaultActiveKey="1" onChange={this.handleChangeTab}>
          <TabPane tab="密码登录" key="1">
            <div className="im-login-title">
              <span className="im-login_title-text">IM'LOGIN</span>
            </div>
            <div className="im-login-content">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator("username", {
                    rules: [
                      { required: true, message: "请输入用户名" }
                    ],
                    initialValue: "lfy1"
                  })(
                    <Input
                      prefix={
                        <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      placeholder="Username"
                    />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator("password", {
                    rules: [
                      { required: true, message: "请输入密码" }
                    ],
                    initialValue: "lfy1"
                  })(
                    <Input
                      prefix={
                        <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      type="password"
                      placeholder="Password"
                    />
                  )}
                </FormItem>
                <FormItem>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                        >
                          登录
                        </Button>
                </FormItem>
              </Form>
            </div>
          </TabPane>
          <TabPane tab="扫码登录" key="2">
              <div className="login-qr-box">
                 <img className="login-qr" src={img_qr} alt="二维码"/> 
              </div>
          </TabPane>
        </Tabs>
        </Spin>
      </div>
    );
  }
}

const WrappedLoginMain = Form.create()(LoginMain);
// 映射 state 至 props
const mapStateToProps = (state) => {
  return {
    chatList: state.chatList
  }
}

// store.dispatch, props
const mapDispatchToProps = (dispatch) => {
  return {
      // 回调发送消息动作
  handleActionSendMsg :(msg) => {
    // 添加一个动作
    const action = getSendMsgAction({
      name: 'lfy1',
      msg
    });
    // 发送动作
    dispatch(action);
  },
  // 登录回调动作
  handleActionUserLogin: (value) =>{
    const action = getLoginUserInfoAction(value)
    dispatch(action)
  }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedLoginMain) ;
