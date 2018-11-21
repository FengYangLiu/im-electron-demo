import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, HashRouter, Switch } from 'react-router-dom';
import store from './store';
import './index.css';
import Login from './page/login';
import Main from './page/main/index';
// import './util/websocket'

ReactDOM.render((
  <Provider store={store}>
    <Fragment>
      <HashRouter>
        <Switch>
          <Route exact path="/" render={() => (<Login />)} />
          <Route render={() => (<Main />)} />
        </Switch>
      </HashRouter>
    </Fragment>
  </Provider>
), document.getElementById('root'));
