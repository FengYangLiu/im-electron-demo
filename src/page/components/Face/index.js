import React, { Component } from 'react';
import { Tabs } from 'antd';

import FaceSection from './FaceSection/index'
import { hadleFaceChangeAction } from '../../../store/actionCreators';
import {connect} from 'react-redux';


import './index.less';

const TabPane = Tabs.TabPane;



class Face extends Component{
    constructor(){
        super()
        this.state = {
            faceList:[
                {
                    id:'old',
                    title: '经典表情'
                },{
                    key:'fh',
                    title:'符号表情'
                }
            ]
        }
    }


    onSelectFaceFn = (faceStr, index) => {
        this.props.handleActionFaceChange(faceStr)
    }
    
    render(){
        const { faceList } = this.state
        return (
            <div id="im-face-wrap">
                    <Tabs className="im-face" >
                    {
                        faceList.map((face, index)=>{
                            return (
                                <TabPane key={face.id} className="im-face-section" tab={face.title} >
                                    <FaceSection onSelectFace={this.onSelectFaceFn} faceType={face.id}/>
                                </TabPane>
                            )
                        })
                    }
                    
                        
                        {/* <TabPane className="im-face-section" tab="符号表情" key="2">
                            <FaceSection></FaceSection>
                        </TabPane> */}
                    </Tabs>
            </div>
        )
    }
}
// 映射 state 至 props
const mapStateToProps = state => {
    return {
    //   chatList: state.chatList
    };
  };
  
  // store.dispatch, props
  const mapDispatchToProps = dispatch => {
    return {
      handleActionFaceChange: (faceStr)=>{
        const time = new Date().getTime()
        const action = hadleFaceChangeAction({faceStr,time})
        dispatch(action);
      }
    };
  };
export default connect(mapStateToProps,mapDispatchToProps)(Face);