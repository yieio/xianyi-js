export default {
  data: {
    userTokenKey:'userToken',
    userToken:null,

    userInfo: {},
    hasUserInfo: false, 
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    indexClassInfo:{classNumber:'',className:''}, 

    courseDate: {hasCourse: false},
    latestCourse: [],
    showNoneCourseTip:false,//最近没有课程
    showCourseLoadding:true,//最近没有课程
    schoolTerm:1,
    
    isShowAddClassDialog:false,
    isShowCreateClassDialog:false,
    isShowChangeClassDialog:false,
    isShowEditProfileDialog:false,

    classmates:[],
    subClassmates:[],

    appointments:[],
    inviters:[],
    randomDateTitle:"我约的", 
    appointCount:{dateCount:0,callDateCount:0,inviteCount:0},
    
    isMyCourseEdit:false,
    isClassCourseEdit:false,
    
    logs: [],
  },
  //无脑全部更新，组件或页面不需要声明 use
  //updateAll: true,
  debug: false
}