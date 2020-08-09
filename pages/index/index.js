import create from '../../utils/create'
import store from '../../store/index'
import config from '../../config.js';
import util from '../../utils/util.js';

//获取应用实例
const app = getApp()

create.Page(store, {
  use: [
    'userInfo',
    'hasUserInfo',
    'canIUse',
    'selectPage'
  ],
  computed: {
    curPage() {
      return this.selectPage ? this.selectPage : "course";
    }
  },

  /**
   * 方法块
   * 切换底部导航
   */
  navChange: function (e) {
    let title = e.currentTarget.dataset.cur == "my" ? "我" : "闲倚";
    wx.setNavigationBarTitle({
      title: title
    });
    this.store.set(this.store.data, 'selectPage', e.currentTarget.dataset.cur);
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  /**
   * 获取最新课程
   */
  getLatestCourse: function (classNumber, userId) {
    var _t = this;
    var _td = _t.store.data;
    wx.request({
      url: config.api.latestCourse,
      method: "GET",
      dataType: "json",
      data: {
        classNumber: classNumber,
        userId: userId
      },
      success: function (result) {
        console.log(config.api.latestCourse + "?classNumber=" + classNumber + "=>");
        console.log(result);
        if (result.data.type == 200) {
          var cs = result.data.data.courses;
          var courseDate = {};

          if (cs.length <= 0) {
            return;
          }

          var item = cs[0];
          var date = new Date(item.courseDate);
          courseDate.hasCourse = true;
          courseDate.date = util.formatDate(date);
          courseDate.gap = util.formatDayGap(util.getDateGap(date));
          courseDate.week = util.formatWeekDay(date);

          for (var i = 0; i < cs.length; i++) {
            var item = cs[i];
            var start = util.formatTime(item.startTime);
            var end = util.formatTime(item.endTime);
            cs[i].timeGap = start + "-" + end;
          }

          _t.store.set(_td, 'courseDate', courseDate);
          _t.store.set(_td, 'latestCourse', cs);
          _t.store.set(_td, 'schoolTerm', item.schoolTerm);

        } else {
          _t.store.set(_td, 'courseDate', null);
          _t.store.set(_td, 'latestCourse', []);
        }
      }
    });
  },

  /**
   * 获取同学
   */
  getClassmates: function () {
    var _t = this;
    var _td = _t.store.data;
    wx.request({
      url: config.api.classmates,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      dataType: "json",
      success: function (result) {
        if (result.data.type != 200) {
          wx.showToast({
            title: '获取同学信息失败',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        var cs = result.data.data.classmates;
        _td.classmates = cs;
        let sub = 3;
        if (cs.length > sub) {
          _td.subClassmates = [];
          for (let i = 0; i < sub; i++) {
            _td.subClassmates.push(cs[i]);
          }

        } else {
          _td.subClassmates = cs;
        }
      }
    });
  },

  /**
   * 调用服务端登录，会自动注册登记到服务端
   * @param  userInfo 
   */
  login: function (userInfo) {
    let _t = this; 
    let _tsd = _t.store.data;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("res.code=>")
        console.log(res);
        if (!res.code) {
          return;
        }
        userInfo.code = res.code;
        //发送code 到服务端
        wx.request({
          url: config.api.login+"?code="+res.code,
          method: "post",
          dataType: "json",
          data: userInfo,
          success: function (result) {
            if (result.data.type == 200) {
              var _data = result.data.data;
              //记录用户token
              app.globalData.userToken = _data.token;
              wx.setStorageSync('userToken', _data.token);

              if (_data.userInfo.nickName) {
                let ui = _data.userInfo;
                ui.genderName = util.getGenderName(_data.userInfo.gender); 

                _tsd.userInfo = ui;
                _tsd.hasUserInfo = true;

                let classNumber = _tsd.userInfo.classNumber || _tsd.classNumber;
                //获取最新课程
                _t.getLatestCourse(classNumber, _tsd.userInfo.userId);

                if (_tsd.userInfo.classNumber) {
                  _t.getClassmates();
                }
              }

            } else {
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

  },


  /**
   * 判断用户是否授权过
   */
  getWxSetting: function () {
    let _t = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              if (!res.userInfo) {
                return;
              }

              //app.globalData.userInfo = res.userInfo;
              //请求登录
              _t.login(res.userInfo);
            }
          })
        } else {
          //没有授权过，说明应该是新用户
          console.log("没有授权过");
          _t.login({});
        }
      }
    });
  },

  /**
   * 监控用户数据的变化，写入app.globalData和storeage
   * @param  e 
   */
  userInfoChangeHandler:function(e){
    if(e.userInfo){
      app.globalData.userInfo = e.userInfo;
      wx.setStorageSync('userInfo', app.globalData.userInfo);
    }

  },

  onLoad: function (options) {
    let _t = this;
    let _tsd = _t.store.data;
    if (options.classNumber) {
      _tsd.classNumber = options.classNumber;
    }

    //监控用户数据的变化，写入app.globalData和storeage
    _t.store.onChange(_t.userInfoChangeHandler);

    //需要考虑token过期的问题
    if (app.globalData.userInfo) {
      _tsd.userInfo = app.globalData.userInfo;
      _tsd.hasUserInfo = true;
      let classNumber = _tsd.userInfo.classNumber || _tsd.classNumber;
      //获取最新课程
      _t.getLatestCourse(classNumber, _tsd.userInfo.userId);
      if (_tsd.userInfo.classNumber) {
        _t.getClassmates();
      }

    } else {
      _t.getWxSetting();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _t = this;
    let _tsd = _t.store.data;
    let classNumber = _tsd.userInfo.classNumber || _tsd.classNumber;
    let className = _tsd.userInfo.className || "";
 
    return {
      title: className + '最近课程',
      path: '/pages/index/index?classNumber=' + classNumber
    };

  }
})