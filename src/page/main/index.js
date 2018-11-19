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
            &lt;西湖基础管控--及时支援平台&gt;
          </span>
        </div>
        <div className="im-main_content">
          <div className="main-left_nav-wrap">
            <NavLink to="/chat" activeClassName="main-left_nav-active">
              <Icon className="item-icon" type="message" theme="outlined" />
            </NavLink>
            <NavLink to="/userList" activeClassName="main-left_nav-active">
              <Icon className="item-icon" type="user" theme="outlined" />
            </NavLink>
          </div>
          <div className="main-chat-nav">
            <Switch>
              <Route path="/chat" render={() => <ImChat />} />
              <Route path="/userList" component={ImUserList} />
            </Switch>
          </div>
          <div className="mian-chat-content">
            <Switch>
              <Route path="/chat/inform" render={() => (<InformSection/>)} ></Route>
              <Route path="/chat/:id" render={() => (<ChatSection/>)} ></Route>
              <Route path="/userList/:id" render={() => (<UserListSection/>)} ></Route>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default ImMain;
