import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store'
import './index.css';
// import './util/websocket'


import Login from './page/login'
ReactDOM.render(
<Provider store={store}>
	<Login />
</Provider>
, document.getElementById('root'));
