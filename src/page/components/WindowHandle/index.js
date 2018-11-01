import React, { Component } from 'react';
import { Icon } from 'antd';

import './index.css';

class WindowHandle extends Component{
	constructor(props) {
		super(props);
		this.state = {}
	}

	render(){
		return (
			<div id="window-handle-wrap">
				<div className="window-handle-box">
					<span className="window-handle-button">
						<Icon title='最小化' type='minus' />
					</span>
					<span className="window-handle-button">
						<Icon title='关闭' type='close' />
					</span>
				</div>
			</div>
		);
	}
	
}

export default WindowHandle;
