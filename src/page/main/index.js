import React, { Component } from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import { Icon } from "antd";

import ImChat from "../chat";
import ImUserList from "../userList";
import ChatSection from '../chat/chatSection'
import InformSection from '../chat/informSection';
import UserListSection from '../userList/userListSection'
import ElectronAid from '../../electron'
import { initWS,} from "../../util/strophe-websocket";

import "./index.less";

class ImMain extends Component {
  constructor(props) {
    super(props);
    this.state= {}
  }
  
  componentDidMount(){
    // console.log(ElectronAid)
    if(ElectronAid){
      ElectronAid.mainIsReady()
      ElectronAid.mainInitWs(initWS)
    }
  }

  render() {
    return (
      <div id="im-main">

        
        <div className="im-main-nav">
          <div className="nav-img">

          </div>
          <span className="nav-title">
            &lt;西湖基础管控&gt;及时支援平台
          </span>
        </div>
        <div className="im-main_content">
          <div className="main-left_nav-wrap">
            <NavLink className="main-nav-item" to="/chat" activeClassName="main-left_nav-active">
              <div className="item-icon icon-nav-section"></div>
            </NavLink>
            <NavLink className="main-nav-item" to="/search" activeClassName="main-left_nav-active">
              <div className="item-icon icon-nav-search"></div>
            </NavLink>
            <NavLink className="main-nav-item" to="/userList" activeClassName="main-left_nav-active">
              <div className="item-icon icon-nav-linkman"></div>
            </NavLink>
            <NavLink className="main-nav-item" to="/friends" activeClassName="main-left_nav-active">
              <div className="item-icon icon-nav-friends"></div>
            </NavLink>
            <NavLink className="main-nav-item" to="/setting" activeClassName="main-left_nav-active">
              <div className="item-icon icon-nav-setting"></div>
            </NavLink>
          </div>
          <div className="main-right" id="main-right">
            <div className="main-chat-nav">
              <Switch>
                <Route path="/chat" component={ImChat} />
                <Route path="/userList" component={ImUserList} />
              </Switch>
            </div>
            <div className="mian-chat-content">
              <Switch>
                <Route path="/chat/inform" component={InformSection} />
                <Route path="/chat/:id" component={ChatSection} />
                <Route path="/userList/:id" component={UserListSection} />
              </Switch>
            </div>
        </div>

        </div>
      </div>
    );
  }
}

export default ImMain;
