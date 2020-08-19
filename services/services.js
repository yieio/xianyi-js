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
  handleCatchError: function (resp,request) {
    
    if(!resp){
      console.log("handleCatchError",resp,request);
      return;
    }
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

    if (resp.status == 404) {
      wx.showToast({
        title: '未找到相应服务',
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
    console.log("handleFailMessage",result.data.type,msg);
    if (result.data.type != 200) {
      let title = result.data.content || msg;
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    return true;
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
   * 使用 wx.login 返回的code 进行后端登录
   * @param {data,success} param0 
   */
  login:function({data,success}){
    let _t = this;
    const ins = axios.create();

    ins.request({
      url: config.api.login,
      data: data,
      method: 'POST'
    }).then(resp => { 
      if(_t.handleFailMessage(resp,"服务请求失败，重新进入小程序")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => { 
      _t.handleCatchError(response,request);
    });

  },

  /**
   * 授权登录，保存用户信息到服务端
   * @param {data,success} param0 
   */
  signup:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.signup,
      data: data,
      method: 'POST'
    }).then(resp => { 
      if(_t.handleFailMessage(resp,"")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => { 
      _t.handleCatchError(response,request);
    });

  },

  /**
   * 刷新token 
   * @param {*} token {grantType:'refresh_token',refreshToken:''}
   * @param {*} success 
   */
  refreshToken: function (token, success) { 
    let _t = this;
    const ins = axios.create();
    let data ={
      grantType: 'refresh_token',
      refreshToken: token
    };

    ins.request({
      url: config.api.cancelAppointment,
      data: data,
      method: 'POST'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"")){
        success(resp);
      }
    }).catch(({ 
      response
    }) => { 
      _t.handleCatchError(response);
    });
  },

  /**
   * 获取最新课程
   * @param {data,success} param0 
   */
  getLatestCourse:function({data,success,complete}){
    let _t = this;
    const ins = axios.create(); 
    
    ins.request({
      url: config.api.latestCourse,
      params: data,
      method: 'GET'
    }).then(resp => { 
      complete(resp);
      if(_t.handleFailMessage(resp,"")){
        success(resp); 
      } 
    }).catch(({
      request,
      response
    }) => { 
      _t.handleCatchError(response,request);
    });

  },

  /**
   * 获取指定一学期的课程表
   * @param {data,success} param0 
   */
  getCourseList:function({data,success}){
    let _t = this;
    const ins = axios.create(); 
    
    ins.request({
      url: config.api.classCourse,
      params: data,
      method: 'GET'
    }).then(resp => { 
      //complete(resp);
      if(_t.handleFailMessage(resp,"")){
        success(resp); 
      } 
    }).catch(({
      request,
      response,
      stack
    }) => { 
      console.log('捕获到了异常=>', request, response,stack);
      _t.handleCatchError(response,request);
    });


  },

  /**
   * 获取约饭数据
   */
  getAppointmentCount:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.getAppointmentCount,
      params: data,
      method: 'GET'
    }).then(resp => { 
      if(_t.handleFailMessage(resp,"")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => { 
      _t.handleCatchError(response,request);
    });

  },

  /**
   * 创建班级
   * @param {data,success} param0 
   */
  createClassroom:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.createClassroom,
      data: data,
      method: 'POST'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"新建班级失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => { 
      _t.handleCatchError(response,request);
    });

  },

  /**
   * 加入/更换班级
   * @param {data,success} param0 
   */
  changeClassroom:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.changeClassroom,
      params: data,
      method: 'POST'
    }).then(resp => { 
      console.log("changeClassroom",resp)
      if(_t.handleFailMessage(resp,"加入班级失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => { 
      _t.handleCatchError(response,request);
    });

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
      if(_t.handleFailMessage(resp,"删除课程日期失败")){
        success(resp);
      }  
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
      if(_t.handleFailMessage(resp,"编辑课程失败")){
        success(resp);
      }  
     
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
      if(_t.handleFailMessage(resp,"添加班级课程失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });
  },

  /**
   * 获取班级课程，data:{classNumber}
   * @param {data,success} param0 
   */
  getClassCourse:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.getMyCourse,
      params: data,
      method: 'GET'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"获取课程失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => { 
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
      if(_t.handleFailMessage(resp,"获取课程数据失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });

  },

  /**
   * 获取我的自选课程
   * @param {data,success} param0 
   */
  getMyCourse:function({data,success}){
    let _t = this;
    _t.getClassCourse({data,success});

  },

  /**
   * 添加自选课程
   * @param {data,success} param0 
   */
  addMyCourse: function ({
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
      url: config.api.addMyCourse,
      data: data,
      method: 'POST'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"添加课程失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });
  },

  /**
   * 删除自选课程上课时间
   * @param {data,success} param0 
   */
  deleteMyCourseDate:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.deleteMyCourseDate,
      params: data,
      method: 'GET'
    }).then(resp => { 
      if(_t.handleFailMessage(resp,"删除课程日期失败")){
        success(resp);
      }  
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });

  },

  /**
   * 更新自选课信息
   * @param {data,success} param0 
   */
  updateMyCourse:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.updateMyCourse,
      data: data,
      method: 'POST'
    }).then(resp => { 
      if(_t.handleFailMessage(resp,"编辑课程失败")){
        success(resp);
      }  
     
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    }); 
  },

  /**
   * 发起约饭
   * @param {data,success} param0 
   */
  makeAppointment:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.makeAppointment,
      data: data,
      method: 'POST'
    }).then(resp => { 
      if(_t.handleFailMessage(resp,"约饭失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });

  },

  /**
   * 获取约饭列表
   * @param {data,success} param0 
   */
  getAppointments:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.getAppointments,
      params: data,
      method: 'GET'
    }).then(resp => { 
      if(_t.handleFailMessage(resp,"获取约饭数据失败")){
        success(resp);
      } 
    }).catch(({
      request,
      response
    }) => {
      console.log('捕获到了异常=>', request, response);
      _t.handleCatchError(response);
    });

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
      if(_t.handleFailMessage(resp,"取消约饭失败")){
        success(resp);
      } 
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
      if(_t.handleFailMessage(resp,"结束约饭失败")){
        success(resp);
      }
    }).catch(({ 
      response
    }) => { 
      _t.handleCatchError(response);
    });
  },

  /**
   * 拒绝约饭
   * @param {data,success} param0 
   */
  rejectAppointment:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.rejectAppointment,
      params: data,
      method: 'POST'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"拒绝约饭失败")){
        success(resp);
      }
    }).catch(({ 
      response
    }) => { 
      _t.handleCatchError(response);
    });

  },

  /**
   * 接受约饭
   * @param {data,success} param0 
   */
  acceptAppointment:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.acceptAppointment,
      params: data,
      method: 'POST'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"接受约饭失败")){
        success(resp);
      }
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
      if(_t.handleFailMessage(resp,"获取班级同学失败")){
        success(resp);
      }
    }).catch(({ 
      response,request
    }) => { 
      _t.handleCatchError(response,request);
    });
  },

  /**
   * 获取自己/同学资料，data:{userId:0}
   * @param {data,success} param0 
   */
  getProfile:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.classmateProfile,
      params: data,
      method: 'GET'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"获取同学信息失败")){
        success(resp);
      }
    }).catch(({ 
      response,request
    }) => { 
      _t.handleCatchError(response,request);
    });

  },

  /**
   * 编辑自己的资料，data:{}
   * @param {data,success} param0 
   */
  editProfile:function({data,success}){
    let _t = this;
    const ins = axios.create();

    if (_t.checkUserTokenIsNull()) {
      return;
    } else {
      _t.setAuthorization(ins);
    }

    ins.request({
      url: config.api.editProfile,
      data: data,
      method: 'POST'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"信息保存失败")){
        success(resp);
      }
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
  getOrganizations: function ({data, success}) { 
    let _t = this;
    const ins = axios.create(); 
    ins.request({
      url: config.api.organizations,
      params: data,
      method: 'GET'
    }).then(resp => {  
      if(_t.handleFailMessage(resp,"")){
        success(resp);
      }
    }).catch(({ 
      response,request
    }) => { 
      _t.handleCatchError(response,request);
    });
  },
}

export default services;