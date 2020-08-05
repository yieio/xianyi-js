//app.js
import config from 'config.js';
import util from './utils/util.js';


App({
  onLaunch: function () {
    var userToken = wx.getStorageSync('userToken') || null;
    if (userToken && userToken.accessToken.length>0) { 
      //还要判断下 Token 过期情况
      this.globalData.userToken = userToken;
    }

    var userInfo = wx.getStorageSync('userInfo') || null;
    if (userInfo&&userInfo.nickName.length>0) {
      this.globalData.userInfo = userInfo;
    }
  
    var firstView = wx.getStorageSync('firstView') || null;
    if (firstView) {
      this.globalData.firstView = firstView;
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("res.code=>")
        console.log(res);
        if(!res.code){
          return;
        }

        let _t = this;

        wx.request({
          url: config.api.login+"?code="+res.code,
          method:"post",
          dataType:"json",
          success:function(result){
            if(result.data.type==200){
              var _data = result.data.data;

              if(_data.userInfo.nickName!=null&&_data.userInfo.nickName){
                _t.globalData.userInfo = _data.userInfo;
                _t.globalData.userInfo.genderName = util.getGenderName(_data.userInfo.gender);
                //设置storage
                wx.setStorageSync('userInfo', _t.globalData.userInfo);
              }

              //记录用户token
              _t.globalData.userToken = _data.token; 
              wx.setStorageSync('userToken', _data.token); 
            }else{
              console.log(result);
              wx.showToast({
                title: '后端服务请求失败',
                icon: 'none'
              })
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => { 
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              if(!res.userInfo){
                return;
              }

              if(!this.globalData.userInfo){
                this.globalData.userInfo = res.userInfo
              }else{
                for (var prop in res.userInfo) {
                  if (res.userInfo.hasOwnProperty(prop)) {
                      this.globalData.userInfo[prop] = res.userInfo[prop];
                  }
                }
              }

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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