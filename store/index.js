export default {
  data: {
    userTokenKey:'userToken',
    userToken:null,

    userInfo: null,
    hasUserInfo: false, 
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    indexClassInfo:{classNumber:'',className:''}, 
    indexClassInfoKey:'indexClassInfo',

    courseDate: {hasCourse: false},
    latestCourse: [],
    showNoneCourseTip:false,//最近没有课程
    showCourseLoadding:true,//最近课程loadding
    schoolTerm:1,
    
    isShowAddClassDialog:false,
    isShowCreateClassDialog:false,
    isShowChangeClassDialog:false,
    isShowEditProfileDialog:false,
    isShowGoLoginTipDialog:false,//首页，引导登录和加入班级


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