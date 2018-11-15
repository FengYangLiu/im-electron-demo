import React, { Component } from 'react';

import './index.less'

class ImUserListSection extends Component{
	render(){
		return (
			<div className="im-user-cont">
				<div className="user-cont">
					<div className="user-info">
						<div className="info-top broder-bottom">
							<div className="info-top-left">
								<div>
									name
								</div>
								<div>
									账号
								</div>
							</div>
							<div className="info-top-right">
								图片
							</div>

						</div>
						<div className="info-bottom">
							<div>
								地区： 中国
							</div>
							<div>
								聊天
							</div>
						</div>
					</div>
					<div>

					</div>
				</div>
			</div>
		)
	}
}

export default ImUserListSection;