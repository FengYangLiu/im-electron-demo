import React from 'react'
import { Form, Icon, Input, Button } from 'antd';
import './index.css';

import { initWS, auth } from '../../util/websocket';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
		<div id="components-form-demo-normal-login">
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
            initialValue: 'lfy'
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
            initialValue: 'lfy'
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
	  </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm