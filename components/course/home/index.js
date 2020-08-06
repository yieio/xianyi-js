// pages/course/home/index.js
import create from '../../../utils/create'
import util from '../../../utils/util.js';
import config from '../../../config.js';
import store from '../../../store/index'

create.Component(store,{
  use:['userInfo','hasUserInfo','courseDate','latestCourse'],
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
    getLatestCourse: function(classNumber,userId) {
      var _t = this;
      var _td = _t.store.data;
      wx.request({
        url: config.api.latestCourse,
        method: "GET",
        dataType: "json",
        data:{classNumber:classNumber,userId:userId},
        success: function(result) {
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
  
            _t.store.set(_td,'courseDate',courseDate);
            _t.store.set(_td,'latestCourse', cs);
            _t.store.set(_td,'schoolTerm', item.schoolTerm);

          } else { 
            _t.store.set(_td,'courseDate',null);
            _t.store.set(_td,'latestCourse', []);
          }
        }
      });
    },

    actionTap:function(e){
      let key = e.currentTarget.dataset.key;
      let _t = this;
      let _tsd = _t.store.data;
      let classNumber = "";
      let schoolTerm = 1;
      let courseDate = "";
      console.log(_tsd.latestCourse);
      if(_tsd.latestCourse.length>0){
        classNumber = _tsd.latestCourse[0].classNumber;
        schoolTerm = _tsd.latestCourse[0].schoolTerm;
        courseDate = _tsd.latestCourse[0].courseDate;
      }
      if(key=="goCourseList"){
        config.router.goCourseList(e,classNumber,schoolTerm,courseDate); 
      }
      

    }
  },

  lifetimes:{
    attached: function() {
      // 在组件实例进入页面节点树时执行 
      var classNumber = '2019-MBA-PB-4班';
      var userId = 0;
      this.getLatestCourse(classNumber,userId);
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
