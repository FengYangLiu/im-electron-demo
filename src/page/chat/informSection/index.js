import React, { Component } from 'react';
import { Avatar, Button, message } from 'antd';
import { connect } from 'react-redux';
import {
    imAddFriendSub
} from '../../../util/strophe-websocket';

import './index.less';
class InformSection extends Component{

    handleAddFirend = (item) => {
        
        imAddFriendSub({
            jid:item.jid,
            success:()=>{
                message.success('添加好友成功！')
            },
            error:()=>{
                message.error('失败好友失败')
            }
        })
    }
    render(){
        const { userInformList} = this.props
        return(
            <div className="im-inform">
                <div className="inform-content">
                    <div className="inform-title">新的好友</div>
                    <div className="inform-list">
                        {/* <div className="inform-item">
                            <div className="item-info">
                                <Avatar size="large"></Avatar>
                                <span className="info-name">lfy</span>
                            </div>
                            <div className="item-buttons">
                                <Button className="item-btn" type="primary" size="small">接受</Button>
                                <Button size="small">拒绝</Button>
                            </div>                            
                        </div> */}
                        {
                            userInformList.map((item)=>(
                                <div className="inform-item">
                                <div className="item-info">
                                    <Avatar size="large"></Avatar>
                                    <span className="info-name">{item.jid.split('@')[0]}</span>
                                </div>
                                <div className="item-buttons">
                                    <Button className="item-btn" type="primary" size="small" onClick={()=>{this.handleAddFirend(item)}}>接受</Button>
                                    <Button size="small">拒绝</Button>
                                </div>                            
                            </div>  
                            ))
                        }
                    </div>
                </div>
                
            </div>
        );
    } 
}
// 映射 state 至 props
const mapStateToProps = state => {
    console.log(state)
	return {
		userInformList: state.userInformList
	};
};

// store.dispatch, props
const mapDispatchToProps = dispatch => {
	return {
        
	};
};
const tempConnect = connect(
	mapStateToProps,
	mapDispatchToProps
)(InformSection);
export default tempConnect;
