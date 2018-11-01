/*
 * @Author: lfy 
 * @Date: 2018-10-29 17:39:43 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-11-01 14:33:27
 */
import React, { Component } from "react";
import { Form, Icon, Input, Button, Card, Spin, Avatar, Row, Col } from "antd";
import WindowHandle from '../components/WindowHandle';

import store from "../../store/index.js";
import { connect } from 'react-redux';

// websocket 暴露接口
import { initWS, imSendMsg, outLogin } from "../../util/strophe-websocket";

// action 统一管理
import { getSendMsgAction, getLoginUserInfoAction } from '../../store/actionCreators';

import "./index.css";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Meta } = Card;

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
        initWS(()=>{
          this.setLoginState(false);
        });
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tagetUser, msgText, logging } = this.state;

    return (
      <div id="im-login">
        <Spin size="large" spinning={logging} delay='200'>
        <div className="im-login-title">
          <WindowHandle/>
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
              {/* <Row>
                <Col span={24} style={{ textAlign: "right" }}> */}
                  {/* <div className="button-wrap"> */}
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      登录
                    </Button>
                    {/* <Button
                      type="danger"
                      className="login-form-button"
                      onClick={this.handleOutLogin}
                    >
                      退出
                    </Button> */}
                  {/* </div> */}
                {/* </Col>
              </Row> */}
            </FormItem>
          </Form>
        </div>
        </Spin>

        {/* <TextArea
          rows="3"
          value={msgText}
          onChange={value => {
            this.handleChangeMsgText(value);
          }}
        />
        <div style={{ textAlign: "right" }}>
          <Input
            placeholder="输入接收者"
            style={{ width: "70%" }}
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            value={tagetUser}
            onChange={this.onChangeUserName}
          />
          <Button onClick={this.sendMsg} icon="message">
            发送
          </Button>

          <div className="chatList">
            {this.props.chatList.map((item, index) => (
              <Card style={{ width: 300, marginTop: 16 }} key={index}>
                <Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: `${
                          item.name === "admin" ? "#7265e6" : "#00a2ae"
                        }`
                      }}
                      icon="user"
                    />
                  }
                  title={item.name}
                  description={item.msg}
                />
              </Card>
            ))}
          </div>
        </div>
      */}
      </div>
    );
  }
}

const WrappedLoginMain = Form.create()(LoginMain);
// 映射 state 至 props
const mapStateToProps = (state) => {
  console.log(state)
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
