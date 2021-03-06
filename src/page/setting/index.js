import React, { Component } from 'react';
import './index.less'
import { Switch, Button } from 'antd';
import { withRouter } from 'react-router-dom'
import { outLogin } from '../../util/strophe-websocket';
class ImUserSetting extends Component{
    handleOutLogin = () =>{
        outLogin(()=>{

        })
    }
    render(){
        return (
            <div className="im-setting">
                <div className="setting-title">
                    通知
                </div>
                <div className="setting-list">
                    <div className="setting-item">
                        <div>
                            消息提示音
                        </div>
                        <Switch />
                    </div>
                    <div className="setting-item">
                        <div>
                            桌面提示
                        </div>
                        <Switch />
                    </div>
                    <div className="setting-item out-login">
                        <Button type="danger" size="small" onClick={this.handleOutLogin}> 退出登录 </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ImUserSetting);