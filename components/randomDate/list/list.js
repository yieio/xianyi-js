// components/my/randomDate/list/list.js
import create from '../../../utils/create'
import config from '../../../config.js';
import services from '../../../services/services.js'
import store from '../../../store/index'

let app = getApp();

create.Component(store, {
  use: ['userInfo', 'hasUserInfo', 'appointments', 'randomDateTitle'],
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

      });

    },

    /**
     * 取消约饭
     * @param id 
     */
    cancelAppointment:function(id){
      let _t = this;
      let _td = _t.data;
      let _tsd = _t.store.data;
      let success = result =>{
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

          for (let i = 0; i < _tsd.appointments.length; i++) {
            let item = _tsd.appointments[i];
            if (item.id == id) {
              _tsd.appointments.splice(i, 1);
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
      let _td = _t.data;
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

        for (let i = 0; i < _tsd.appointments.length; i++) {
          let item = _tsd.appointments[i];
          if (item.id == id) {
            _tsd.appointments.splice(i, 1);
            break;
          }
        }

      }

      let token = app.globalData.userToken.accessToken;
      services.finishAppointment(token,id,success); 
    },


    /**
     * 页面操作事件处理
     * @param  e 
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
          oppt: _tsd.appointments[index],
        });
      } else if (key == "hideOpAppointmentDialog") {
        _t.setData({
          isShowOpAppointmentDialog: false
        });
      } else if (key == "cancelAppointment") {
        let id = dataset.id;
        console.log(id);
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
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})