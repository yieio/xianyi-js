var config = {
  host: "https://rice.yieio.com/api"
  //host: "https://192.168.31.182:5001/api"
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
}

module.exports.api = api;

var router = {
  /**
   * 查看课程表
   */
  goCourseList: function (e, classNumber, schoolTerm,courseDate) {
    let _classNumber = classNumber || e.currentTarget.dataSet.classNumber;
    let _schoolTerm = schoolTerm || e.currentTarget.dataSet.schoolTerm;
    let _courseDate = courseDate || e.currentTarget.dataSet.courseDate;

    wx.navigateTo({
      url: '/pages/course/list/list?classNumber=' + _classNumber + '&schoolTerm=' + _schoolTerm+'&courseDate='+_courseDate
    })
  },


  /**
   * 完善个人信息点击
   */
  goEditProfile: function (e, id) {
    let _id = id;
    if (!_id) {
      _id = e.currentTarget.id;
    }
    wx.navigateTo({
      url: '/pages/profile/profile?userId=' + _id
    })
  },

  //去班集体页面
  goProfile: function (e, id) {
    let _id = id;
    if (!_id) {
      _id = e.currentTarget.id;
    }

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


}

module.exports.router = router;