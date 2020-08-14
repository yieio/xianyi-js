var config = {
  //host: "https://rice.yieio.com/api"
  host: "https://xy.yieio.com/api"
  //host: "http://192.168.1.195:7001/api"
  //host: "http://192.168.31.182:5000/api"
}

var api = {
  login: config.host + "/Identity/LoginByWeApp",
  signup: config.host + "/Identity/UpdateUserInfoByWeApp",
  latestCourse: config.host + "/study/GetLatestCourse",
  classCourse: config.host + "/study/GetClassCourse",
  makeAppointment: config.host + "/Study/MakeAppointment",
  getAppointments: config.host + "/Study/GetAppointments",
  cancelAppointment: config.host + "/Study/CancelAppointment",
  rejectAppointment: config.host + "/Study/rejectAppointment",
  acceptAppointment: config.host + "/Study/acceptAppointment",
  finishAppointment: config.host + "/Study/FinishAppointment",
  classmates: config.host + "/classmate/GetClassmates",
  createClassroom: config.host + "/classmate/CreateOrganization",
  changeClassroom: config.host + "/classmate/ChangeOrganization",
  organizations: config.host + "/classmate/GetOrganizations",
  classmateProfile: config.host + "/classmate/GetClassmateProfile",
  editProfile: config.host + "/classmate/EditProfile",
  getMyCourse: config.host + "/study/GetMyCourse",
  getMyCourseDate: config.host + "/study/GetMyCourseDate",
  addMyCourse: config.host + "/study/AddMyCourse",
  deleteMyCourseDate: config.host + "/study/deleteMyCourse",
  updateMyCourse: config.host + "/study/UpdateMyCourse",
  uploadClassCourse:config.host+"/study/UploadClassCourse",
}

module.exports.api = api;

var router = {
  /**
   * 跳转到首页
   */
  goIndex:function(classNumber){
    classNumber = classNumber ||'';
    wx.navigateTo({
      url: '/pages/index/index?classNumber='+classNumber 
    })
  },


  /**
   * 查看课程表
   */
  goCourseList: function (classNumber, schoolTerm,courseDate) {
    let _classNumber = classNumber  || '';
    let _schoolTerm = schoolTerm;
    let _courseDate = courseDate  || '';
    

    wx.navigateTo({
      url: '/pages/course/list/list?classNumber=' + _classNumber + '&schoolTerm=' + _schoolTerm+'&courseDate='+_courseDate
    })
  },

  /**
   * 我的选修课页面
   * 
   */
  goMyCourse:function(){
    wx.navigateTo({
      url: '/pages/course/mycourse/mycourse'
    })
  },

  /**
   * 设置我的选修课程信息页面
   * 
   * @param {课程id} courseId 
   */
  goMyCourseInfo:function(courseId){
    wx.navigateTo({
      url: '/pages/course/mycourse/courseinfo?courseId=' + courseId
    }) 
  },

  /**
   * 班级课程表页面
   * 
   */
  goClassCourse:function(){
    wx.navigateTo({
      url: '/pages/course/classcourse/classcourse'
    })
  },

  /**
   * 设置班级课程表信息页面
   *
   * @param {课程id} courseId 
   */
  goClassCourseInfo:function(courseId){
    wx.navigateTo({
      url: '/pages/course/classcourse/courseinfo?courseId=' + courseId
    }) 
  },
  //去班集体页面
  goProfile: function (id) {
    let _id = id;
    wx.navigateTo({
      url: '/pages/my/profile/profile?userId=' + _id,
    })
  },

  //去同学页面
  goClassmate: function () {
    wx.navigateTo({
      url: '/pages/my/classmate/classmate',
    })
  },

  //去班集体页面
  goClassroom: function () {
    wx.navigateTo({
      url: '/pages/my/classroom/classroom',
    })
  },

  //去约饭页面
  goRandomDate:function(){
    wx.navigateTo({
      url: '/pages/my/randomDate/randomDate',
    }) 
  },


}

module.exports.router = router;