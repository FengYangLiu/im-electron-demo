import React, { Component } from 'react';
import './index.less'
import { oldFaceSize } from './faceSize'

class FaceSection extends Component {
    constructor(props){
        super()
    }
    handleFaceClick = (item,index)=>{
        const {faceType, onSelectFace} = this.props;
        const typeStr = `[${faceType}_${index}]`;
        onSelectFace(typeStr, index)
    }

    render() {
        return (
            <div id="face-content">
                {
                    oldFaceSize.map((item, index) => {
                        return (
                                <div onClick={()=>{this.handleFaceClick(item, index)}} 
                                className="face-icon" 
                                key={index}
                                style={{
                                backgroundPositionX: item.backgroundX,
                                backgroundPositionY: item.backgroundY
                                }}>
                                </div>
                        )
                    })
                }

            </div>
        )
    }
}

export default FaceSection;
