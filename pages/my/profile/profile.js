// pages/my/profile/profile.js
import create from '../../../utils/create'
import store from '../../../store/index'
import util from '../../../utils/util.js';
import config from '../../../config.js';

let app = getApp();

create.Page(store,{
  use:['userInfo','hasUserInfo'],

  initData:function(options){
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;

    let userId = options.userId;

    if(userId != _tsd.userInfo.userId){
      _t.setData({
        userInfo:{},
      })
    }

  },

  /**
   * 获取同学档案信息
   */
  getProfile: function(userId) {
    var _t = this;
    wx.request({
      url: config.api.classmateProfile + "?userid=" + userId,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      dataType: "json",
      success: function(result) { 
        if (result.data.type != 200) {
          wx.showToast({
            title: '获取同学资料失败',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        var cp = result.data.data.classmateProfile;
        cp.genderName = util.getGenderName(cp.gender);

        _t.setData({
          userInfo: cp
        }); 
      }
    });

  },

  actionTap:function(e){
    let key = e.currentTarget.dataset.key;

    if(key=="editProfile"){

    }
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this;
    _t.initData(options);
    if(app.globalData.userToken){
      _t.getProfile(options.userId);

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})