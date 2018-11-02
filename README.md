这个是一个IM的demo

> npm start 开启web  
> npm run e-start 开启electron

1. 使用了 [Create React App](https://github.com/facebook/create-react-app).
这个脚手架创建项目
2. 使用electron 作为桌面端的壳子
3. 使用antd来作为开发框架
4. 为了更简单的操作XMPP 使用 Strophe.js(版本为1.3.0支持ie11以上)的XMPP框架来使用websocket协议与方法
5. 由于websocket数据交互大且有回调数据交互复杂，所以增加了react-redux
6. 为程序添加路由 使用最新的react-router-dom 
7. 添加less less-loader（待测试）