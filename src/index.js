import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store'
import './index.css';
// import './util/websocket'


import Login from './page/login'
ReactDOM.render(
<Provider store={store}>
	<div>
		<BrowserRouter>
			<Route path='/' render={
				()=>(<Login />)
			}>	
			</Route>
		</BrowserRouter>
	</div>
</Provider>
, document.getElementById('root'));
