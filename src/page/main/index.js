import React, { Component } from "react";
import { Route, BrowserRouter, Link, Switch } from "react-router-dom";
import { Icon } from "antd";

import ImChat from "../chat";
import ImUserList from "../userList";
import ChatSection from '../chat/chatSection'

import "./index.less";
class ImMain extends Component {
  render() {
    return (
      <div id="im-main">
        <div className="im-main-nav">顶层</div>
        <div className="im-main_content">
          <div className="main-left_nav-wrap">
            <Link to="/chat">
              <Icon className="item-icon" type="message" theme="outlined" />
            </Link>
            <Link to="/userList">
              <Icon className="item-icon" type="user" theme="outlined" />
            </Link>
          </div>
          <Switch>
            <Route path="/chat" render={() => <ImChat />} />
            <Route path="/userList" component={ImUserList} />
          </Switch>
          <Switch>
            <Route path="/chat/:id" render={() => (<ChatSection/>)} ></Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default ImMain;
