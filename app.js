//app.js
import config from 'config.js';
import services from './services/services';
import store from './store/index'

App({
  onLaunch: function () { 
    let _t = this;
    let _tsd = store.data;

    var userToken = wx.getStorageSync(_tsd.userTokenKey) || null;
    if (userToken && userToken.accessToken.length > 0) {

      _tsd.userToken = userToken;

      let success = result => {
        if (result.data.type == 200) {
          _tsd.userToken = result.data.data;
          wx.setStorage({
            data: _tsd.userToken,
            key: _tsd.userTokenKey,
          })
        }
      };

      //有效期小于 10 分钟 600,000 毫秒，刷新，服务器配置应该 刷新token 比正式token 先到期
      let timestamp = (new Date()).valueOf();
      if (userToken.refreshUctExpires - timestamp < 600000) {
        //还要判断下 Token 过期情况
        services.refreshToken(userToken.refreshToken, success);
      }
    }

  },

  globalData: {
    userInfo: null,
    userToken: null,
    userTokenKey:"userToken",
  },


  //接口地址
  api: config.api
})