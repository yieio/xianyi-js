// pages/course/mycourse/courseinfo.js
import create from '../../../utils/create'
import store from '../../../store/index'
import config from '../../../config.js';
import util from '../../../utils/util.js';

const app = getApp();

create.Page(store, {
  use:['userInfo'],

  /**
   * 页面的初始数据
   */
  initData: function (options) {
    let _t = this;
    let _td = _t.data;

    _t.setData({
      isShowEditMyCourseDialog: false,
      isShowAddMyCourseDateDialog: false,
      courseDate: '',
      startTime: '',
      endTime: '',
      myCourseDates: [],
      myCourseInfo: {},
      myCourseInfoEdit: {},
      hasEditRight: false,
    });

  },

  /**
   * 选择器数据变更事件处理
   * @param  e 
   */
  pickerDataChange: function (e) {
    let id = e.currentTarget.id;
    let _t = this;
    if (id == "courseDate") {
      _t.setData({
        courseDate: e.detail.value
      })
    } else if (id == "startTime") {
      _t.setData({
        startTime: e.detail.value
      })
    } else if (id == "endTime") {
      _t.setData({
        endTime: e.detail.value
      })
    }
  },

  /**
   * 页面点击事件处理
   * @param  e 
   */
  actionTap: function (e) {
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    let key = e.currentTarget.dataset.key;
    if (key == "showEditMyCourseDialog") {
      _t.setData({
        isShowEditMyCourseDialog: true
      });
    } else if (key == "hideEditMyCourseDialog") {
      _t.setData({
        isShowEditMyCourseDialog: false
      });
    } else if (key == "showAddMyCourseDateDialog") {
      _t.setData({
        isShowAddMyCourseDateDialog: true
      });
    } else if (key == "hideAddMyCourseDateDialog") {
      _t.setData({
        isShowAddMyCourseDateDialog: false
      });
    }
  },

  /**
   * 格式化courseDate 数据
   * @param {object} item 
   */
  formatCourseDateInfo: function (item) {
    var start = util.formatTime(item.startTime);
    var end = util.formatTime(item.endTime);
    item.timeGap = start + "-" + end;
    var date = new Date(item.courseDate);
    item.courseDate = util.formatDate(date);
    item.gap = util.formatDayGap(util.getDateGap(date));
    item.week = util.formatWeekDay(date);
    return item;
  },

  /**
   * 获取选修课信息及课程日期安排
   * @param {int} courseId 
   */
  getMyCourseDate: function (courseId) {
    var _t = this;
    var _td = _t.data; 
    wx.request({
      url: app.api.getMyCourseDate,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: {
        id: courseId
      },
      dataType: "json",
      success: function (result) {
        console.log(result);
        if (result.data.type == 401) {
          wx.showToast({
            title: '您需要先登录',
            icon: 'none',
            duration: 2000
          });
          //跳转去首页
          config.router.goIndex(_td.classNumber);
          return;
        }
        if (result.data.type != 200) {
          wx.showToast({
            title: '数据请求失败',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        var cs = result.data.data.courses;
        if (cs.length < 0) {
          return;
        }

        for (var i = 0; i < cs.length; i++) {
          cs[i] = _t.formatCourseDateInfo(cs[i]);
        }
        var editCourse = {
          name: cs[0].name,
          teacher: cs[0].teacher,
        }
        _t.setData({
          myCourseDates: cs,
          myCourseInfo: cs[0],
          myCourseInfoEdit: editCourse,
        });
      }
    });
  },

  /**
   * 提交选修课程表单
   * @param {} e 
   */
  courseFormSubmit: function (e) {
    var _t = this;
    var _td = _t.data;
    let _tsd = _t.store.data;
    var formData = e.detail.value; 

    formData.classRoom = formData.classRoom.replace(/^\s*|\s*$/g, "");
    if (formData.classRoom.length < 1) {
      wx.showToast({
        title: '请输入课室名',
        icon: 'none',
        duration: 2000
      });
      return false;
    };
    _td.myCourseInfo.classRoom = formData.classRoom;
    _t.setData({
      myCourseInfo: _td.myCourseInfo
    });

    formData.courseDate = formData.courseDate.replace(/^\s*|\s*$/g, "");
    if (formData.courseDate.length < 1) {
      wx.showToast({
        title: '请选择首节课日期',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.startTime = formData.courseDate + " " + formData.startTime;
    formData.endTime = formData.courseDate + " " + formData.endTime;
    formData.name = _td.myCourseInfo.name;
    formData.teacher = _td.myCourseInfo.teacher;
    formData.classNumber = _tsd.userInfo.classNumber;

    //发起接口调用,保存用户信息
    wx.request({
      url: app.api.addMyCourse,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          //添加返回的数据到
          var course = _t.formatCourseDateInfo(_data.course);

          _td.myCourseDates.unshift(course);
          _t.setData({
            myCourseDates: _td.myCourseDates,
            isShowAddMyCourseDateDialog:false
          });

           
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  /**
   * 删除选修课程日期
   */
  deleteMyCourseDate: function (e) {
    var courseId = e.currentTarget.dataset.id;
    var _t = this;
    var _td = _t.data;
    wx.request({
      url: app.api.deleteMyCourseDate,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: {
        id: courseId
      },
      dataType: "json",
      success: function (result) {
        console.log(result);
        if (result.data.type == 401) {
          wx.redirectTo({
            url: '/pages/signup/signup',
          })
          return;
        }
        if (result.data.type != 200) {
          return;
        }
        var courseId = result.data.data.id;
        for (var i = 0; i < _td.myCourseDates.length; i++) {
          var item = _td.myCourseDates[i];
          if (item.id == courseId) {
            _td.myCourseDates.splice(i, 1);
            _t.setData({
              myCourseDates: _td.myCourseDates
            })
          }
        }
      }
    });

  },
 
  /**
   * 提交课程名和老师姓名的修改
   */
  editCourseFormSubmit: function (e) {
    var _t = this;
    var _td = _t.data;

    var formData = e.detail.value;

    formData.name = formData.name.replace(/^\s*|\s*$/g, "");
    if (formData.name.length < 2) {
      wx.showToast({
        title: '课程名不能少于2个字符',
        icon: 'none',
        duration: 2000
      });
      return val;
    }

    formData.teacher = formData.teacher.replace(/^\s*|\s*$/g, "");
    if (formData.teacher.length < 1) {
      wx.showToast({
        title: '请输入老师姓名',
        icon: 'none',
        duration: 2000
      });
      return val;
    }

    //判断是否有修改
    if (_td.myCourseInfo.name == formData.name && _td.myCourseInfo.teacher == formData.teacher) {
      wx.showToast({
        title: '信息没有改动',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    formData.id = _td.myCourseInfo.id;

    //发起接口调用,保存用户信息
    wx.request({
      url: app.api.updateMyCourse,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          //var _data = result.data.data; 
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
          _td.myCourseInfo.name = formData.name;
          _td.myCourseInfo.teacher = formData.teacher;

          _t.setData({
            myCourseInfo:_td.myCourseInfo,
            isShowEditMyCourseDialog:false
          });
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this; 
    _t.initData(options);
   
    _t.getMyCourseDate(options.courseId);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})