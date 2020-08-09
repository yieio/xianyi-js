//app.js
import config from 'config.js';
 
App({
  onLaunch: function () {
    let _t = this;
 
    var userToken = wx.getStorageSync('userToken') || null;
    if (userToken && userToken.accessToken.length>0) { 
      //还要判断下 Token 过期情况
      _t.globalData.userToken = userToken;
    }

    var userInfo = wx.getStorageSync('userInfo') || null;
    if (userInfo&&userInfo.nickName.length>0) {
      _t.globalData.userInfo = userInfo;
    }
  
    var firstView = wx.getStorageSync('firstView') || null;
    if (firstView) {
      _t.globalData.firstView = firstView;
    }
 
  },

  globalData: {
    userInfo: null,
    userToken:null,
    //标记首次访问，显示收藏
    firstView:0
  },


  //接口地址
  api:config.api
})