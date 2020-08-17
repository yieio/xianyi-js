import create from '../../utils/create'
import store from '../../store/index'
import config from '../../config.js';
import services from '../../services/services';
import util from '../../utils/util.js';

//获取应用实例
const app = getApp()

create.Page(store, {
  use: [
    'userInfo',
    'hasUserInfo',
    'canIUse',
    'selectPage',
    'showNoneCourseTip',
    'showCourseLoadding',
    'indexClassInfo',
  ],

  /**
   * 初始化页面数据
   * @param {*} options 
   */
  initData: function (options) {

    let _t = this;
    _t.setData({
      isShowSwitchClassDialog: false,
      classArrary: [],
      classIndex: -1,
    });

  },
  computed: {
    curPage() {
      return this.selectPage ? this.selectPage : "course";
    }
  },

  /**
   * 页面事件处理
   * @param  e 
   */
  actionTap: function (e) {
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    let dataset = e.currentTarget.dataset;
    let key = dataset.key;

    if (key == "changeClassNumber") {

      _t.getOrganizations();
      _t.setData({
        isShowSwitchClassDialog: true
      });
    } else if (key == "hideSwitchClassDialog") {
      _t.setData({
        isShowSwitchClassDialog: false
      });
    } else if (key == "selectClassItem") {
      let index = dataset.index;
      let item = _td.classArrary[index];
      _t.setData({
        classIndex: index
      });
      if (item.classNumber != _tsd.indexClassInfo.classNumber) {
        _t.getLatestCourse(item.classNumber, 0);
        _tsd.indexClassInfo.classNumber = item.classNumber;
        _tsd.indexClassInfo.className = item.name;
      }
    } else if (key == "copyWechatNumber") {
      //复制班级编号
      wx.setClipboardData({
        data: "yieioo",
        success(res) {}
      })
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

  /**
   * 获取组织列表
   */
  getOrganizations: function () {
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    let success = function (result) {
      console.log(result);
      if (result.data.type != 200) {
        return;
      }

      var cs = result.data.data.classes;
      if (cs.length > 0) {
        _t.setData({
          classArrary: cs
        });
      }

      for (var i = 0; i < _td.classArrary.length; i++) {
        if (_td.classArrary[i].classNumber == _tsd.indexClassInfo.classNumber) {
          _t.setData({
            classIndex: i
          });
          break;
        }
      }
    };
    let classNumber = _tsd.userInfo.classNumber || _tsd.indexClassInfo.classNumber;
    console.log("getOrganizations=>")
    console.log(classNumber);

    services.getOrganizations(classNumber, 1, success);
  },

  /**
   * 获取最新课程
   */
  getLatestCourse: function (classNumber, userId) {
    var _t = this;
    var _tsd = _t.store.data;
    _tsd.showCourseLoadding = true;
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
            _tsd.latestCourse = [];
            _tsd.courseDate.hasCourse = false;
            _tsd.showNoneCourseTip = true;
            return;
          }

          _tsd.showNoneCourseTip = false;

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

          _t.store.set(_tsd, 'courseDate', courseDate);
          _t.store.set(_tsd, 'latestCourse', cs);
          _t.store.set(_tsd, 'schoolTerm', item.schoolTerm);

        } else {
          _t.store.set(_tsd, 'courseDate', null);
          _t.store.set(_tsd, 'latestCourse', []);
        }
      },
      complete: function (e) {
        _tsd.showCourseLoadding = false;
      }
    });
  },

  /**
   * 获取同学
   */
  getClassmates: function () {
    var _t = this;
    var _tsd = _t.store.data;
    let success = result => {
      if (result.statusCode == 401) {
        return;
      }

      if (result.data.type != 200) {
        return;
      }

      var cs = result.data.data.classmates;
      _tsd.classmates = cs;
      let sub = 3;
      if (cs.length > sub) {
        _tsd.subClassmates = [];
        for (let i = 0; i < sub; i++) {
          _tsd.subClassmates.push(cs[i]);
        }

      } else {
        _tsd.subClassmates = cs;
      }
    }
    let token = _tsd.userToken.accessToken;
    services.getClassmates(token, success);
  },

  /**
   * 获取约饭统计数据
   */
  getAppointmentCount: function () {
    var _t = this;
    var _tsd = _t.store.data;
    wx.request({
      url: config.api.getAppointmentCount,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + _tsd.userToken.accessToken
      },
      dataType: "json",
      success: function (result) {
        console.log("getAppointmentCount=>")
        console.log(result);
        if (result.statusCode == 401) {
          //wx.setStorageSync('userToken', null);
          return;
        }


        if (result.data.type != 200) {
          wx.showToast({
            title: '后端服务请求失败2',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        let rdata = result.data.data;
        _tsd.appointCount = rdata;
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
          url: config.api.login + "?code=" + res.code,
          method: "post",
          dataType: "json",
          data: userInfo,
          success: function (result) {
            if (result.data.type == 200) {
              var _data = result.data.data;
              //记录用户token
              _tsd.userToken = _data.token;
              wx.setStorageSync(_tsd.userTokenKey, _data.token);

              if (_data.userInfo.nickName) {
                let ui = _data.userInfo;
                ui.genderName = util.getGenderName(_data.userInfo.gender);

                _tsd.userInfo = ui;
                _tsd.hasUserInfo = true; //这个值改变后，监控会自动获取数去 
              } else {
                console.log(_tsd.selectPage);
                if (!_tsd.indexClassInfo.classNumber) {
                  _tsd.selectPage = "my";
                  wx.showToast({
                    title: '需要您先登录加入班集体',
                    icon: 'none'
                  })
                }
              }

            } else {
              console.log(result);
              wx.showToast({
                title: '后端服务请求失败1',
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
              //请求登录
              _t.login(res.userInfo);
            }
          })
        } else {
          //没有授权过，说明应该是新用户 
          _t.login({});
        }
      }
    });
  },

  /**
   * 监控用户数据的变化 
   * @param  e 
   */
  userInfoChangeHandler: function (e) {
    let _t = this;
    let _tsd = _t.store.data;
    if (e.hasUserInfo) {
      //首次登录后，刷新最近课程
      let classNumber = _tsd.userInfo.classNumber || _tsd.indexClassInfo.classNumber;
      _t.getLatestCourse(classNumber, _tsd.userInfo.userId);
      if (_tsd.userToken && _tsd.userInfo.classNumber) {
        _t.getClassmates();
      }

      if (_tsd.userInfo.classNumber) {
        _tsd.indexClassInfo.classNumber = _tsd.userInfo.classNumber;
        _tsd.indexClassInfo.className = _tsd.userInfo.className;
      }
    }

    let keys = Object.keys(e);
    for (let i = 0; i < keys.length; i++) {
      //监听班级变动重新获取用户数据
      if (keys[i].indexOf("userInfo.classNumber") == 0) {
        console.log("userInfo.classNumber=>");
        _t.getLatestCourse(_tsd.userInfo.classNumber, _tsd.userInfo.userId);
        if (_tsd.userToken && _tsd.userInfo.classNumber) {
          _t.getClassmates();
        }

        if (_tsd.userInfo.classNumber) {
          _tsd.indexClassInfo.classNumber = _tsd.userInfo.classNumber;
        }
      } else if (keys[i].indexOf("userInfo.className") == 0) {
        if (_tsd.userInfo.className) {
          _tsd.indexClassInfo.className = _tsd.userInfo.className;
        }
      }
    }


  },

  onLoad: function (options) {
    let _t = this;
    let _tsd = _t.store.data;

    if (options.classNumber) {
      _tsd.indexClassInfo.classNumber = options.classNumber;
    }
    if (options.className) {
      _tsd.indexClassInfo.className = options.className;
    }
    if (options.curPage) {
      _tsd.selectPage = options.curPage;
    }

    //监控用户数据的变化
    _t.store.onChange(_t.userInfoChangeHandler);

    if (_tsd.hasUserInfo) { 
      if (_tsd.userInfo.classNumber) {
        _tsd.indexClassInfo.classNumber = _tsd.userInfo.classNumber;
        _tsd.indexClassInfo.className = _tsd.userInfo.className;
      }

    } else {
      _t.getWxSetting();
      if (_tsd.indexClassInfo.classNumber) {
        _t.getLatestCourse(_tsd.indexClassInfo.classNumber, 0);
      }

    }

  },

  /**
   * 每次显示刷新
   */
  onShow: function () {
    let _t = this;
    let _tsd = _t.store.data;
    if (_tsd.userToken) {
      _t.getAppointmentCount();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    let _t = this;
    let _tsd = _t.store.data;
    _t.getWxSetting();
    if (_tsd.userToken && _tsd.userInfo.classNumber) {
      _t.getClassmates();
      _t.getAppointmentCount();
    }

    //首次登录后，刷新最近课程
    let classNumber = _tsd.indexClassInfo.classNumber || _tsd.userInfo.classNumber;
    let userId = _tsd.userInfo.userId || 0;
    if (classNumber || userId) {
      _t.getLatestCourse(classNumber, userId);
    }

    setTimeout(() => {
      wx.stopPullDownRefresh();

    }, 500);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _t = this;
    let _tsd = _t.store.data;
    let _td = _t.data;
    let classNumber = _tsd.indexClassInfo.classNumber || _tsd.userInfo.classNumber || "";
    let className = _tsd.indexClassInfo.className || _tsd.userInfo.className || "";
    let title = _td.curPage == "course" ? className + '最近课程' : "邀请你加入" + className;

    return {
      title: title,
      path: '/pages/index/index?classNumber=' + classNumber + "&className=" + className + "&curPage=" + _td.curPage
    };

  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline: function () {
    let _t = this;
    let _tsd = _t.store.data;
    let classNumber = _tsd.indexClassInfo.classNumber || _tsd.userInfo.classNumber;
    let className = _tsd.indexClassInfo.className || _tsd.userInfo.className;

    return {
      title: className + '最近课程',
      query: 'classNumber=' + classNumber + "&className=" + className + "&curPage=course"
    };

  }
})