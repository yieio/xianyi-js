// components/my/home/index.js
import create from '../../../utils/create'
import util from '../../../utils/util.js';
import config from '../../../config.js';
import store from '../../../store/index';

let app = getApp();

create.Component(store, {
  /**
   * 用了use不能再用 data
   */
  use: [
    'userInfo',
    'hasUserInfo',
    'canIUse',
    'isShowAddClassDialog',
    'classmates',
    'subClassmates',
    'classNumber',
    'inviters'
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
    /**
     * 授权获取用户信息，提交到服务端保存
     * @param  e 
     */
    getUserInfo: function (e) {
      //拒绝授权的时候
      if (!e.detail.userInfo) {
        return;
      }

      //获取到了用户信息，提交到服务器，这里可能有之前登录失败的情况需要处理
      if (!app.globalData.userToken) {
        //弹窗让用户重试
        wx.showToast({
          title: '服务请求失败，请重新进入小程序',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      let _t = this;
      let _tsd = _t.store.data;

      let userInfo = e.detail.userInfo;
      userInfo.genderName = util.getGenderName(userInfo.gender);
      //从入口进来带了classNumber 参数，自动加入该班级
      userInfo.classNumber = _tsd.classNumber || '';

      //_tsd.userInfo = userInfo;
      //_tsd.hasUserInfo = true;

      wx.request({
        url: app.api.signup,
        method: "POST",
        header: {
          'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
        },
        data: userInfo,
        success: function (result) {
          console.log(result);
          if (result.data.type == 200) {
            var _data = result.data.data;
            let ui = _data.userInfo;
            ui.genderName = util.getGenderName(_data.userInfo.gender);

            _tsd.userInfo = ui;
            _tsd.hasUserInfo = true;

            //检查班级设置情况，没有班级弹窗引导去设置
            _t.hasClassroom();

          } else {
            //弹窗让用户重试
            wx.showToast({
              title: '授权登录失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
    },
    /**
     * 是否已经加入班级
     */
    hasClassroom: function () {
      let _t = this;
      let _tsd = _t.store.data;
      let result = !_tsd.userInfo.classNumber;
      _tsd.isShowAddClassDialog = result;
      return !result;
    },

    isLogin: function () {
      let _t = this;
      let _tsd = _t.store.data;
      let result = !app.globalData.userToken || !_tsd.userInfo || !_tsd.userInfo.nickName;
      if (result) {
        wx.showToast({
          title: '您需要先登录',
          icon: 'none',
          duration: 2000
        });
      }
      return !result;

    },

    /**
     * 菜单点击事件处理
     * @param e 
     */
    menuTap: function (e) {
      let _t = this;
      let _tsd = _t.store.data;
      let key = e.currentTarget.dataset.key;
      if (key == "classroom") {
        if (_t.isLogin()) {
          config.router.goClassroom();
        }

      } else if (key == "classmate") {
        if (_t.isLogin()) {
          if (_t.hasClassroom()) {
            config.router.goClassmate();
          }
        }
      } else if (key == "myCourse") {
        if (_t.isLogin()) {
          config.router.goMyCourse();
        }
      } else if (key == "classCourse") {
        if (_t.isLogin()) {
          if (_t.hasClassroom()) {
            config.router.goClassCourse();
          }
        }
      }else if(key=="randomDate"){
        if(_t.isLogin()){
          if (_t.hasClassroom()) {
            if(!_tsd.userInfo.realName||!_tsd.userInfo.phoneNumber){
              wx.showToast({
                title: '需要填写真实姓名和手机号码',
                icon: 'none',
                duration: 2000
              });
              _tsd.isShowEditProfileDialog = true;
              config.router.goProfile(_tsd.userInfo.userId); 
            }else{
              config.router.goRandomDate(); 
            }
            
          }
        }
      }
    },

    /**
     * 其他绑定的点击事件
     * @param e 
     */
    actionTap: function (e) {
      //console.log(e);
      var _t = this;
      var _tsd = _t.store.data;
      let key = e.currentTarget.dataset.key;
      if (key == "goProfile") {
        config.router.goProfile(_tsd.userInfo.userId);
      } else if (key == "hideModal") {
        _tsd.isShowAddClassDialog = false;
      } else if (key == "goClassroom") {
        config.router.goClassroom();
      }
    }

  },

  lifetimes: {
    attached: function () {
      let _t = this;
      let _td = _t.store.data;
      if (_td.userInfo.hasUserInfo && !_td.userInfo.classNumber) {
        _td.isShowAddClassDialog = true;
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }


})