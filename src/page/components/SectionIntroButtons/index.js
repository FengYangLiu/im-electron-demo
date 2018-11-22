import React, { Component } from 'react';
import { Modal,Icon,Drawer, Switch } from 'antd';
import UserInfoCard from '../UserInfoCard';

import './index.less'
import { Button } from 'antd/lib/radio';

class SectionIntroButtons extends Component {
    constructor(props){
        super(props);
        this.state = { 
            visible: false,
            drVisible:false
        }
    }

    handleSetting = ()=>{
        this.setState({
            drVisible:true
        })
    }
  
    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
  
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
  
  
    handleShowInfo = () =>{
        const { userInfo } = this.props;
        this.setState({
            visible: true,
          });
        console.log(userInfo)
    }

   
    
      onCloseSetting = () => {
        this.setState({
            drVisible: false,
        });
      };
    
     
    render(){
        return(
            <div className="im-section_intro--buttons">
                <div className="icon icon-section_intro-add"></div>
                <div className="icon icon-section_intro-history"></div>
                <div onClick={this.handleShowInfo} className="icon icon-section_intro-info"></div>
                <div onClick={this.handleSetting} className="icon icon-section_intro-setting"></div>
                <Modal 
                    bodyStyle={{
                        width:'100%',
                        height:500,
                        padding:0
                    }}
                    width={350}
                    wrapClassName="im-moda"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                    centered={true}
                    keyboard={true} >
                    <Icon className="im-close-modal" theme="filled"  onClick={this.handleCancel} type="close-circle" />
                    <UserInfoCard />
                </Modal>
                <Drawer
                    title='好友设置'
                    placement="right"
                    onClose={this.onCloseSetting}
                    visible={this.state.drVisible}
                    >
                    <div style={{marginBottom:10}}>
                        消息免打扰:&nbsp;&nbsp;&nbsp;
                        <Switch>
                        </Switch>
                    </div>
                   
                    <Button>
                        清空聊天记录
                    </Button>

                </Drawer>
            </div>
        )
    }
} 
export default SectionIntroButtons;