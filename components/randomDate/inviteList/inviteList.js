// components/my/randomDate/list/inviteList.js
import create from '../../../utils/create'
import config from '../../../config.js';
import store from '../../../store/index'
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
     * 格式化约饭信息
     */
    formatAppointment: function (app, iscreater) {
      app.appointDate = util.formatDateTime(app.appointDate, 10);
      if (iscreater) {
        if (app.appointmentStatus == 1) {
          //等待回应
          app.title = "约饭邀请已发出";
          app.msg = app.content;
          app.endTime = util.formatTime(app.expiredTime);
        } else if (app.appointmentStatus == 10) {
          //对方接受邀约
          app.title = "约饭成功";
          app.msg = app.content;
        } else if (app.appointmentStatus == 13) {
          //对方拒绝邀约
          app.title = "约饭失败";
          app.msg = app.content;
        } else if (app.appointmentStatus == 40) {
          //约饭过期没人回应
          app.title = "约饭过期未回应";
          app.msg = app.content;
        } else if (app.appointmentStatus == 42) {
          //已经过了约会时间
          app.title = "已过约会时间";
          app.msg = app.content;
        }
      } else {
        if (app.appointmentStatus == 1) {
          //等待回应
          app.title = "有人请你吃饭";
          app.msg = app.content;
          app.hasInviter = true;
          app.showAnimation = true;
        } else if (app.appointmentStatus == 10) {
          //对方接受邀约
          app.title = "与人有约";
          app.msg = app.content;
          app.hasInviter = true;
        } else {
          app.hasInviter = false;
        }
      }
      return app;
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
              inviters[i] = _t.formatAppointment(app, false);
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