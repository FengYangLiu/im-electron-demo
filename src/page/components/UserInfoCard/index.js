import React, { Component } from "react";
import { Card, Modal, Icon, Avatar, Button } from "antd";
import "./index.less";

const Meta = Card.Meta;

class UserInfoCard extends Component {
  state = {
    loading: true
  };

  render() {
    const cardCover = (
      <div className="detail-top">
        <Avatar
          className="top-avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
        <div className="top-name">lfy</div>
      </div>
    );
    return (
      <div className="im-detail-card">
        <Card bordered={false} className="im-detail-card" cover={cardCover}>
          <Meta
            className="im-detail-info"
            description={
              <div className="im-info">
                <div className="info-list">
                  <div>skdksad</div>
                  <div>skdksad</div>
                  <div>skdksad</div>
                  <div>skdksad</div>
                  <div>skdksad</div>
                  <div>skdksad</div>
                </div>
                <div className="info-btns">
                  <Button type="primary" className="">验证通过</Button>
                  <Button type="danger" className="">删除</Button>
                </div>
              </div>
            }
          />
        </Card>
      </div>
    );
  }
}
export default UserInfoCard;
