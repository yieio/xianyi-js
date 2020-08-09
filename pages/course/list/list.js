// pages/course/list/list.js
import create from '../../../utils/create'
import store from '../../../store/index'
import util from '../../../utils/util.js';
import config from '../../../config.js';

let app = getApp();

create.Page(store, {
  use: ['userInfo', 'hasUserInfo', 'latestCourse'],


  /**
   * 页面的初始数据
   */
  initData: function (options) {
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    //记录班级这个参数，给后面加入班级做准备
    if(options.classNumber){
      _tsd.classNumber = options.classNumber;
    }

    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function (res) {
        _t.setData({
          scrollViewHeight: res.windowHeight - 102
        });
      }
    });

    _t.setData({
      scrollToViewId: "date5",
      classNumber: options.classNumber,
      className: options.className || '',
      userId: options.userId || _tsd.userInfo.userId || 0, //传userid将获取用户的选修课
      schoolTerm: options.schoolTerm,
      courseDate: options.courseDate,
      courseStartDate: '',
      courseEndDate: ''
    });
  },

  /**
   * 获取学期课程表
   */
  getClassCourse: function (classNumber, schoolTerm) {
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    let userId = _td.userId; 

    wx.request({
      url: config.api.classCourse,
      method: "GET",
      dataType: "json",
      data: {
        classNumber: classNumber,
        schoolTerm: schoolTerm,
        userId: userId
      },
      success: function (result) {
        if (result.data.type == 200) {
          var cs = result.data.data.courses;
          var classInfo = result.data.data.classInfo;
          if(classInfo){
            _t.setData({
              className:classInfo.name
            })
          }

          if (cs.length <= 0) {
            return;
          }

          var courses = [];
          var lastDate = "";
          var courseDate = {};
          var currentViewId = "";

          for (var i = 0, j = 0; i < cs.length; i++) {
            var item = cs[i];

            var start = util.formatTime(item.startTime);
            var end = util.formatTime(item.endTime);
            cs[i].timeGap = start + "-" + end;

            if (item.courseDate != lastDate) {
              if (courseDate.date) {
                courses.push(courseDate);
                if (courseDate.date == util.formatDate(new Date(_td.courseDate))) {
                  currentViewId = "date" + j;
                }
                j++;
              }
              lastDate = item.courseDate;
              var date = new Date(item.courseDate);
              courseDate = {
                date: util.formatDate(date),
                simpleDate: util.formatSimpleDate(date),
                gap: util.formatDayGap(util.getDateGap(date)),
                week: util.formatWeekDay(date),
                color: item.nameEnSimple,
                courseItems: []
              };
              if (i == 0) {
                _t.setData({
                  courseStartDate: courseDate.date
                });
              } else {
                _t.setData({
                  courseEndDate: courseDate.date
                });
              }
            };
            courseDate.courseItems.push(cs[i]);
          };

          //背景颜色加个简拼音控制下 
          courses.push(courseDate);
          _t.setData({
            courses: courses
          });
          //这里要分开先后赋值才能滚动到对应位置
          _t.setData({
            scrollToViewId: currentViewId
          });

        } else {
          _t.setData({
            courses: []
          })

          wx.showToast({
            title: '获取课程表失败',
            icon: 'none',
            duration: 2000
          });
          console.log(result.data);

        }

      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("page/course/list=>options=>");
    console.log(options);
    this.initData(options);
    this.getClassCourse(options.classNumber, options.schoolTerm);
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
    var _t = this;
    var _td = _t.data;
    return {
      title: "课程表",
      path: '/pages/course/list/list?classNumber='+ _td.classNumber 
      + '&schoolTerm=' + _td.schoolTerm 
      + '&courseDate=' + _td.courseDate 
      + '&className=' + _td.className
      + '&userId=' + _td.userId
    };

  }
})