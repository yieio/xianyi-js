export default {
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    selectPage:"course",//首页tab选中项
    
    classNumber:'',

    courseDate: {hasCourse: false},
    latestCourse: [],
    showNoneCourseTip:false,//最近没有课程
    showCourseLoadding:true,//最近没有课程
    schoolTerm:1,
    
    isShowAddClassDialog:false,
    isShowCreateClassDialog:false,
    isShowChangeClassDialog:false,

    classmates:[],
    subClassmates:[],

    appointments:[],
    inviters:[],
    randomDateTitle:"我约的",
    
    
    logs: [],
  },
  //无脑全部更新，组件或页面不需要声明 use
  //updateAll: true,
  debug: true
}