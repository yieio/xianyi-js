// components/my/randomDate/list/inviteList.js
import create from '../../../utils/create'
import config from '../../../config.js';
import store from '../../../store/index'
import services from '../../../services/services.js'
import util from '../../../utils/util'

let app = getApp();
create.Component(store, {
  use: ['userInfo', 'hasUserInfo', 'inviters', 'randomDateTitle'],
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
    initData: function () {
      let _t = this;

      _t.setData({
        isShowOpAppointmentDialog: false,
        oppt: {},
        isShowNoneBlock:false,

      });

    },
 

    /**
     * 取消约饭
     * @param id 
     */
    cancelAppointment:function(id){
      let _t = this; 
      let _tsd = _t.store.data;
      let success = function (result) {
        if (result.data.type == 401) {
          wx.showToast({
            title: '您需要先登录',
            icon: 'none',
            duration: 2000
          });
          //跳转去首页
          config.router.goIndex('');
          return;
        }
        if (result.data.type != 200) {
          wx.showToast({
            title: result.data.content,
            icon: "none"
          })
          return;
        }

        _t.setData({
          isShowOpAppointmentDialog: false
        });

        for (let i = 0; i < _tsd.inviters.length; i++) {
          let item = _tsd.inviters[i];
          if (item.id == id) {
            _tsd.inviters.splice(i, 1);
            break;
          }
        }

        wx.showToast({
          title: '取消约饭成功',
          icon: 'success',
          duration: 2000
        });

      }

      let token = app.globalData.userToken.accessToken;
      services.cancelAppointment(token,id,success); 
    },

    /**
     * 完成约饭
     * @param  id 
     */
    finishAppointment:function(id){
      let _t = this; 
      let _tsd = _t.store.data;

      let success = function(result) {
        console.log(result);
        if (result.data.type == 401) {
          wx.showToast({
            title: '您需要先登录',
            icon: 'none',
            duration: 2000
          });
          //跳转去首页
          config.router.goIndex('');
          return;
        }
        if (result.data.type != 200) {
          wx.showToast({
            title: result.data.content,
            icon: "none"
          })
          return;
        }

        _t.setData({
          isShowOpAppointmentDialog: false
        });

        for (let i = 0; i < _tsd.inviters.length; i++) {
          let item = _tsd.inviters[i];
          if (item.id == id) {
            _tsd.inviters.splice(i, 1);
            break;
          }
        }
      }

      let token = app.globalData.userToken.accessToken;
      services.finishAppointment(token,id,success); 
    },

    /**
     * 拒绝约饭
     */
    rejectAppointment: function (id) {
      var _t = this;
      var _td = _t.data;
      let _tsd = _t.store.data;
      wx.request({
        url: app.api.rejectAppointment + "?id=" + id,
        method: "POST",
        header: {
          'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
        },
        dataType: "json",
        success: function (result) {
          if (result.data.type == 401) {
            wx.showToast({
              title: '您需要先登录',
              icon: 'none',
              duration: 2000
            });
            //跳转去首页
            config.router.goIndex('');
            return;
          }
          if (result.data.type != 200) {
            wx.showToast({
              title: result.data.content,
              icon: "none"
            })
            return;
          }

          //拒绝成功，更新
          var app = result.data.data.appointment;
          var inviters = _tsd.inviters;
          for (var i = 0; i < inviters.length; i++) {
            var item = inviters[i];
            if (item.id == app.id) {
              inviters.splice(i, 1);
            }
          }

          _t.setData({
            isShowOpAppointmentDialog: false
          });

          _tsd.inviters = inviters;

        }
      })
    },

    /**
     * 接受约饭
     */
    acceptAppointment: function (id) {
      var _t = this;
      var _td = _t.data;
      let _tsd = _t.store.data;
      wx.request({
        url: app.api.acceptAppointment + "?id=" + id,
        method: "POST",
        header: {
          'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
        },
        dataType: "json",
        success: function (result) {
          if (result.data.type == 401) {
            wx.showToast({
              title: '您需要先登录',
              icon: 'none',
              duration: 2000
            });
            //跳转去首页
            config.router.goIndex('');
            return;
          }
          if (result.data.type != 200) {
            wx.showToast({
              title: result.data.content,
              icon: "none"
            })
            return;
          }

          var app = result.data.data.appointment;
          var inviters = _tsd.inviters;
          for (var i = 0; i < inviters.length; i++) {
            var item = inviters[i];
            if (item.id == app.id) {
              inviters[i] = services.formatAppointment(app, false);
              break;
            }
          }

          _t.setData({
            isShowOpAppointmentDialog: false
          });

          _tsd.inviters = inviters;
        }
      })
    },

    /**
     * 页面触摸事件处理
     * @param {触摸组件} e 
     */
    actionTap: function (e) {
      let dataset = e.currentTarget.dataset;
      let key = dataset.key;

      let _t = this;
      let _tsd = _t.store.data;

      if (key == "opAppointment") {
        let index = dataset.index;
        _t.setData({
          isShowOpAppointmentDialog: true,
          oppt: _tsd.inviters[index],
        });
      } else if (key == "hideOpAppointmentDialog") {
        _t.setData({
          isShowOpAppointmentDialog: false
        });
      } else if (key == "rejectAppointment") {
        let id = dataset.id;
        _t.rejectAppointment(id);
      } else if (key == "acceptAppointment") {
        let id = dataset.id;
        _t.acceptAppointment(id);
      }else if (key == "cancelAppointment") {
        let id = dataset.id;
        _t.cancelAppointment(id);
      }else if(key=="finishAppointment"){
        let id = dataset.id;
        _t.finishAppointment(id);
      }else if(key=="goProfile"){
        let userid = dataset.userid;
        config.router.goProfile(userid);
      }
    }

  },

  lifetimes: {
    created: function () {},
    attached: function () {
      this.initData();
      let _t = this;
      let _tsd = _t.store.data;
      if(_tsd.inviters.length<=0){
        _t.setData({
          isShowNoneBlock:true
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})