import React from 'react'
import { Form, Icon, Input, Button } from 'antd';
import './index.css';

// import { initWS, auth } from '../../util/websocket';
import { initWS, auth } from '../../util/strophe-websocket';

const FormItem = Form.Item;
const { TextArea } = Input;

class NormalLoginForm extends React.Component {
  constructor() {
    super();
    this.state={
      msgText:'',
      userName:''
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        initWS(values)
        // auth(window._IMWS)
      }
    });
  }

  sendMsg = () => {


    this.setState(
      {
        msgText:''
      }
    )
  }

  // 修改发送文本
  handleChangeMsgText = (e) => {
    const {value} = e.target
    this.setState({
      msgText:value
    })
  }

  // 修改用户
  onChangeUserName = (e) => {
    this.setState({ userName: e.target.value });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { userName } = this.state;
    
    return (
		<div id="components-form-demo-normal-login">
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: 'lfy1'
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
            initialValue: 'lfy1'
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
	    <TextArea rows='3' value={this.state.msgText} onChange={(value)=>{this.handleChangeMsgText(value)}}/>
      <div style={{textAlign:"right"}}>
      <Input
        placeholder="输入接收者"
        style={{width:'70%'}}
        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
        value={userName}
        onChange={this.onChangeUserName}
        ref={node => this.userNameInput = node}
      />
        <Button onClick={this.sendMsg} icon="message">发送</Button>
      </div>
    </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm