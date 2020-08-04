export default {
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    courseDate: {hasCourse: false},
    latestCourse: [],
    schoolTerm:1,
    
    
    logs: [],
  },
  //无脑全部更新，组件或页面不需要声明 use
  //updateAll: true,
  debug: true
}