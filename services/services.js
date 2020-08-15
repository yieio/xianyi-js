import config from '../config'
import util from '../utils/util'

var services = {

  /**
   * 刷新token 
   * @param {*} token {grantType:'refresh_token',refreshToken:''}
   * @param {*} success 
   */
  refreshToken: function (token, success) {
    wx.request({
      url: config.api.refreshToken,
      method: "POST",
      data: {
        grantType: 'refresh_token',
        refreshToken: token
      },
      dataType: "json",
      success: success
    })
  },

  /**
   * 取消约饭
   */
  cancelAppointment: function (token, id, success) {

    wx.request({
      url: config.api.cancelAppointment + "?id=" + id,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + token
      },
      dataType: "json",
      success: success
    })
  },

  /**
   * 吃完成
   * @param {约饭记录id} id
   */
  finishAppointment: function (token, id, success) {
    wx.request({
      url: config.api.finishAppointment + "?id=" + id,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + token
      },
      dataType: "json",
      success: success
    })
  },

  /**
   * 约饭数据格式化
   * @param {*} app 
   * @param {*} iscreater 
   */
  formatAppointment: function (app, iscreater) {
    app.appointDate = util.formatDateTime(app.appointDate, 10);
    if (iscreater) {
      if (app.appointmentStatus == 1) {
        //等待回应
        app.title = "约饭邀请已发出";
        app.msg = app.content;
        app.endTime = util.formatTime(app.expiredTime);
      } else if (app.appointmentStatus == 10) {
        //对方接受邀约
        app.title = "约饭成功";
        app.msg = app.content;
      } else if (app.appointmentStatus == 13) {
        //对方拒绝邀约
        app.title = "约饭失败";
        app.msg = app.content;
      } else if (app.appointmentStatus == 40) {
        //约饭过期没人回应
        app.title = "约饭过期未回应";
        app.msg = app.content;
      } else if (app.appointmentStatus == 42) {
        //已经过了约会时间
        app.title = "已过约会时间";
        app.msg = app.content;
      }
    } else {
      if (app.appointmentStatus == 1) {
        //等待回应
        app.title = "有人请你吃饭";
        app.msg = app.content;
        app.hasInviter = true;
        app.showAnimation = true;
      } else if (app.appointmentStatus == 10) {
        //对方接受邀约
        app.title = "与人有约";
        app.msg = app.content;
      } else if (app.appointmentStatus == 42) {
        //已经过了约会时间
        app.title = "已过约饭时间";
        app.msg = app.content;
      }
    }
    return app;
  },

  /**
   * 获取同学
   */
  getClassmates: function (toke, success) {
    wx.request({
      url: config.api.classmates,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + toke
      },
      dataType: "json",
      success: success
    });
  },

  /**
   * 获取组织列表
   */
  getOrganizations: function (success) { 
    wx.request({
      url: config.api.organizations,
      method: "GET",
      dataType: "json",
      success:success
    });
  },

}

export default services;