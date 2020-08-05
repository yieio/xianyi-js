// components/my/home/index.js
import create from '../../../utils/create'
import util from '../../../utils/util.js';
import config from '../../../config.js';
import store from '../../../store/index';

let app = getApp();

create.Component(store,{
  /**
   * 用了use不能再用 data
   */
  use: [ 
    'userInfo',
    'hasUserInfo',
    'canIUse',
    'isShowAddClassDialog'
  ],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    addGlobalClass: true,
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo:function(e){ 
      //拒绝授权的时候
      if(!e.detail.userInfo){
        return;
      }
      let userInfo = e.detail.userInfo; 
      userInfo.genderName = util.getGenderName(userInfo.gender);

      this.store.data.userInfo = userInfo;
      this.store.data.hasUserInfo = true;
      
      //获取到了用户信息，提交到服务器，这里可能有之前登录失败的情况需要处理
      if(!app.globalData.userToken){
        return;
      }
      var _t = this;
      wx.request({
        url: app.api.signup,
        method: "POST",
        header: {
          'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
        },
        data: userInfo,
        success: function(result) {
          console.log(result);
          if (result.data.type == 200) {
            var _data = result.data.data;
            app.globalData.userInfo = _data.userInfo;
            app.globalData.userInfo.genderName = util.getGenderName(_data.userInfo.gender);
            _t.store.data.userInfo = e.detail.userInfo;
            _t.store.data.hasUserInfo = true;
            //设置storage
            wx.setStorageSync('userInfo', app.globalData.userInfo);
            //检查班级设置情况，没有班级弹窗引导去设置
            if(!_data.userInfo.classNumber){



            }
            
          } else {
            wx.showToast({
              title: '授权登录失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      })


    },

    hideModal:function(e){
      let _t = this;
      let _td = _t.store.data; 
      _td.isShowAddClassDialog = false; 
    }

  },

  lifetimes:{
    attached: function() {
      let _t = this;
      let _td = this.store.data;
      // 在组件实例进入页面节点树时执行 
      console.log(this.store.data.userInfo);
      console.log(this.store.data.hasUserInfo);

      if(!_td.userInfo.classNumber){
        _td.isShowAddClassDialog = true; 
      }
      
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  }

  
})
