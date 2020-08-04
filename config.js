var config = {
  host:"https://rice.yieio.com/api"
  //host: "https://192.168.31.182:5001/api"
}

var api = {
  login: config.host + "/Identity/LoginByWeApp",
  signup: config.host + "/Identity/UpdateUserInfoByWeApp",
  latestCourse: config.host + "/study/GetLatestCourse",
  classCourse: config.host + "/study/GetClassCourse",
  makeAppointment: config.host + "/Study/MakeAppointment",
  getAppointments: config.host + "/Study/GetAppointments",
  cancelAppointment: config.host +"/Study/CancelAppointment",
  rejectAppointment: config.host +"/Study/rejectAppointment",
  acceptAppointment: config.host + "/Study/acceptAppointment",
  finishAppointment: config.host +"/Study/FinishAppointment",
  classmates: config.host + "/classmate/GetClassmates",
  organizations: config.host +"/classmate/GetOrganizations",
  classmateProfile: config.host + "/classmate/GetClassmateProfile",
  editProfile: config.host + "/classmate/EditProfile",
  getMyCourse:config.host+"/study/GetMyCourse",
  getMyCourseDate:config.host+"/study/GetMyCourseDate",
  addMyCourse:config.host+"/study/AddMyCourse",
  deleteMyCourseDate:config.host+"/study/deleteMyCourse",
  updateMyCourse:config.host+"/study/UpdateMyCourse",
}

module.exports.api = api;

var router = {
  /**
   * 完善个人信息点击
   */
  goEditProfile: function(e,id) {
    console.log(e);
    var _id = id;
    if(!_id){
      _id = e.currentTarget.dataset.id;
    } 
    wx.navigateTo({
      url: '/profile/profile?userId=' + _id
    })
  },

   //事件处理函数
   goCourse: function(classNumber,schoolTerm,courseDate) { 
    wx.navigateTo({
      url: '/pages/logs/logs?classNumber=' + classNumber + "&schoolTerm=" + schoolTerm + "&courseDate=" + courseDate,
    })
  },
}

module.exports.router = router;