// pages/course/home/index.js
import create from '../../../utils/create'
import config from '../../../config.js';
import store from '../../../store/index'

create.Component(store, {
  use: ['userInfo', 'hasUserInfo', 'courseDate', 'latestCourse', 'classNumber', 'showNoneCourseTip', 'showCourseLoadding'],
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
        let classNumber = _tsd.userInfo.classNumber || _tsd.indexClassInfo.classNumber;
        let schoolTerm = 1;
        let courseDate = _tsd.schoolTerm;
        if (_tsd.latestCourse.length > 0) {
          classNumber = _tsd.latestCourse[0].classNumber;
          schoolTerm = _tsd.latestCourse[0].schoolTerm;
          courseDate = _tsd.latestCourse[0].courseDate;
        };
 

        let userId = _tsd.userInfo.userId || 0;
        if (!classNumber && userId == 0) {
          wx.showToast({
            title: '没有课程表',
            icon: 'none',
            duration: 2000
          });

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