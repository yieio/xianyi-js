// pages/my/home/home.js
import create from '../../../utils/create'
import store from '../../../store/index'
import config from '../../../config.js';
import services from '../../../services/services';
import util from '../../../utils/util.js';

create.Page(store,{
  use:["userInfo","hasUserInfo","classmates","subClassmates","appointCount"],

  /**
   * 页面的初始数据
   */
  initData: function(options){

  },

  /**
   * 获取同学
   */
  getClassmates: function () {
    var _t = this;
    var _tsd = _t.store.data;
    let success = result => {
      var cs = result.data.data.classmates;
      _tsd.classmates = cs;
      let sub = 3;
      if (cs.length > sub) {
        _tsd.subClassmates = [];
        for (let i = 0; i < sub; i++) {
          _tsd.subClassmates.push(cs[i]);
        }

      } else {
        _tsd.subClassmates = cs;
      }
    }
    services.getClassmates({success});
  },

  /**
   * 获取约饭统计数据
   */
  getAppointmentCount: function () {
    var _t = this;
    var _tsd = _t.store.data;

    let success = function (result) {  
      let rdata = result.data.data;
      _tsd.appointCount = rdata;
    }
    
    services.getAppointmentCount({success});

  },

  /**
   * 监控用户数据的变化 
   * @param  e 
   */
  userInfoChangeHandler: function (e) {
    let _t = this;
    let _tsd = _t.store.data; 
    if(e.hasUserInfo){
      _t.getAppointmentCount();
    }
    let keys = Object.keys(e);
    for (let i = 0; i < keys.length; i++) {
      //监听班级变动重新获取用户数据
      if (keys[i].indexOf("userInfo.classNumber") == 0) {
        if (_tsd.userInfo.classNumber) {
          _t.getClassmates();
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this;
    let _tsd = _t.store.data;
    //监控用户数据的变化
    _t.store.onChange(_t.userInfoChangeHandler);
    
    if(_tsd.hasUserInfo){
      _t.getClassmates();
      _t.getAppointmentCount();
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _t = this; 
    _t.getAppointmentCount(); 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let _t = this;
    setTimeout(() => {
      wx.stopPullDownRefresh(); 
    }, 500);

    _t.getAppointmentCount();
    _t.getClassmates();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})