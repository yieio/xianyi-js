import config from '../config'
import util from '../utils/util'
import store from '../store/index'

import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
axios.defaults.adapter = mpAdapter

var services = {

  /**
   * 统一处理回调中的异常
   * 401-未登录/登录失效
   * 403-无权限
   * @param {*} resp 
   */
  handleCatchError: function (resp) {
    if (resp.status == 401) {
      //跳转去首页，清除token
      let _tsd = store.data;
      _tsd.userToken = null;
      wx.removeStorageSync(_tsd.userTokenKey);

      wx.showToast({
        title: '您需要先登录',
        icon: 'none',
        duration: 2000
      });
      //跳转去首页
      config.router.goIndex("");
      return;
    }

    if (resp.status == 403) {
      wx.showToast({
        title: '无权限进行此操作',
        icon: 'none',
        duration: 2000
      });
      return;
    }

  },

  /**
   * 统一处理操作失败的返回
   * @param {*} result 
   * @param {*} msg 
   */
  handleFailMessage: function (result, msg) {
    if (result.data.type != 200) {
      let title = result.data.content || msg;
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      });
      return;
    }
  },

  /**
   * 检测userToken是否为空
   */
  checkUserTokenIsNull: function () {
    let _tsd = store.data;
    return !_tsd.userToken;
  },

  /**
   * 设置请求头部
   * @param {axios.instance} ins 
   */
  setAuthorization: function (ins) {
    let _tsd = store.data;
    let token = _tsd.userToken.accessToken;
    ins.interceptors.request.use(function (config) {
      config.headers['Authorization'] = 'Bearer ' + token;
      return config;
    })
  },

  /**
   * 删除班级课程
   * @param {data,success} param0 
   */
  deleteClassCourse: function ({
    data,
    success
  }) {
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.deleteClassCourseDate,
      params: data,
      method: 'GET'
    }).then(resp => {
      console.log('请求结果数据', resp);
      _t.handleFailMessage(resp,"删除课程日期失败");
      success(resp);
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });

  },

  /**
   * 更新课程名字和老师
   * @param {data,success} param0 
   */
  updateClassCourse: function ({
    data,
    success
  }) {
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.updateClassCourse,
      data: data,
      method: 'POST'
    }).then(resp => {
      console.log('请求结果数据', resp);
      _t.handleFailMessage(resp,"编辑课程失败");
      success(resp);
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });

  },

  /**
   * 添加班级课程
   * @param {data,success} param0 
   */
  addClassCourse: function ({
    data,
    success
  }) {
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.addClassCourse,
      data: data,
      method: 'POST'
    }).then(resp => {
      console.log('请求结果数据', resp);
      _t.handleFailMessage(resp, "添加班级课程失败"); 
      success(resp);
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });
  },

  /**
   * 获取课程日期列表
   * @param {getMyCourseDate} param0 
   */
  getMyCourseDate:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.getMyCourseDate,
      params: data,
      method: 'GET'
    }).then(resp => {
      console.log('请求结果数据', resp);
      _t.handleFailMessage(resp, "获取课程数据失败"); 
      success(resp);
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });

  },

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
   * @param {data, success} param0 
   */
  cancelAppointment: function ({data, success}) { 
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.cancelAppointment,
      params: data,
      method: 'POST'
    }).then(resp => { 
      _t.handleFailMessage(resp, "取消约饭失败"); 
      success(resp);
    }).catch(({ 
      response
    }) => { 
      _t.handleCatchError(response);
    });
  },

  /**
   * 吃完成
   * @param {data,success} param0
   */
  finishAppointment: function ({data,success}) { 
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.finishAppointment,
      params: data,
      method: 'POST'
    }).then(resp => { 
      _t.handleFailMessage(resp, "结束约饭失败"); 
      success(resp);
    }).catch(({ 
      response
    }) => { 
      _t.handleCatchError(response);
    });
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
  getClassmates: function ({data,success}) {
     

    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.classmates,
      params: data,
      method: 'GET'
    }).then(resp => { 
      _t.handleFailMessage(resp, "获取班级同学失败"); 
      success(resp);
    }).catch(({ 
      response
    }) => { 
      _t.handleCatchError(response);
    });
  },

  /**
   * 获取组织列表
   * @param {*} classNumber 
   * @param {Int 是否获取同级全部班级} isAll 
   * @param {*} success 
   */
  getOrganizations: function (classNumber, isAll, success) {
    wx.request({
      url: config.api.organizations + "?classNumber=" + classNumber + "&isAll=" + isAll,
      method: "GET",
      dataType: "json",
      success: success
    });
  },



}

export default services;