/*
 * @Author: lfy 
 * @Date: 2018-10-29 17:39:43 
 * @Last Modified by: lfy
 * @Last Modified time: 2018-10-31 10:10:27
 */
import React from "react";
import { Form, Icon, Input, Button, Card, Avatar, Row, Col } from "antd";
import store from "../../store/index.js";

// websocket 暴露接口
import { initWS, imSendMsg, outLogin } from "../../util/strophe-websocket";

// actionTypes 映射
import { IM_SEND_MSG } from '../../store/actionTypes.js';
import "./index.css";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Meta } = Card;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgText: "",
      tagetUser: "admin",
      chatList: []
    };
    console.log(store.getState());

    // 订阅回调
    store.subscribe(this.handleChangeChatList);
  }
  componentWillMount() {
    this.setState({
      chatList: store.getState().chatList
    });
  }

  // submit回调
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        initWS(values);
        // auth(window._IMWS)
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

    // 添加一个动作
    const action = {
      type: IM_SEND_MSG,
      value: {
        name: 'lfy1',
        msg: msgText
      }
    };

    // 发送动作
    store.dispatch(action);

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



  render() {
    const { getFieldDecorator } = this.props.form;
    const { tagetUser, chatList } = this.state;

    return (
      <div id="components-form-demo-normal-login">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator("username", {
              rules: [
                { required: true, message: "Please input your username!" }
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
                { required: true, message: "Please input your Password!" }
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
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <div className="button-wrap">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    登入
                  </Button>
                  <Button
                    type="danger"
                    className="login-form-button"
                    onClick={this.handleOutLogin}
                  >
                    退出
                  </Button>
                </div>
              </Col>
            </Row>
          </FormItem>
        </Form>

        <TextArea
          rows="3"
          value={this.state.msgText}
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
            {chatList.map((item, index) => (
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
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
