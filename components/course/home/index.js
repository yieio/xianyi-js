// pages/course/home/index.js
import create from '../../../utils/create'
import config from '../../../config.js';
import store from '../../../store/index'

create.Component(store, {
  use: [
    'userInfo',
    'hasUserInfo',
    'courseDates',
    'latestCourse',
    'classNumber',
    'showNoneCourseTip',
    'showCourseLoadding',
    
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
    actionTap: function (e) {
      let key = e.currentTarget.dataset.key;
      let _t = this;
      let _tsd = _t.store.data;
      if (key == "goCourseList") {
        let classNumber = "";
        if (_tsd.hasUserInfo) {
          classNumber = _tsd.userInfo.classNumber;
        }
        classNumber = classNumber || _tsd.indexClassInfo.classNumber;
        let schoolTerm = 1;
        let courseDate = _tsd.schoolTerm;
        if (_tsd.latestCourse.length > 0) {
          classNumber = _tsd.latestCourse[0].classNumber || classNumber;
          schoolTerm = _tsd.latestCourse[0].schoolTerm;
          courseDate = _tsd.latestCourse[0].courseDate;
        };


        let userId = 0;
        if (_tsd.hasUserInfo) {
          userId = _tsd.userInfo.userId;
        }
        if (!classNumber && userId == 0) {
          wx.switchTab({
            url: '/pages/my/home/home'
          })
          wx.showToast({
            title: '需要您登录加入班集体',
            icon: 'none'
          })
        } else {
          config.router.goCourseList(classNumber, schoolTerm, courseDate);
        }
      }


    }
  },

  lifetimes: {
    created: function () {},
    attached: function () {},
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})