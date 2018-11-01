import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store'
import './index.css';
import Login from './page/login'
// import './util/websocket'

ReactDOM.render(
<Provider store={store}>
	<Fragment>
		<BrowserRouter>
			<Route path='/' render={
				()=>(<Login />)
			}>	
			</Route>
		</BrowserRouter>
	</Fragment>
</Provider>
, document.getElementById('root'));
