// pages/my/profile/profile.js
import create from '../../../utils/create'
import store from '../../../store/index'
import util from '../../../utils/util.js';
import config from '../../../config.js';

let app = getApp();

create.Page(store,{
  use:['userInfo','hasUserInfo','isShowEditProfileDialog'],

  initData:function(options){
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;

    let userId = options.userId;

    if(userId != _tsd.userInfo.userId){
      _t.setData({ 
        canEdit:false,
        userInfo:{}
      })
      wx.setNavigationBarTitle({
        title: '同学信息',
      })
    }else{ 
      _t.setData({ 
        canEdit:true,
        userInfo:_tsd.userInfo
      })
    }

    _t.setData({
      isShowEditProfileDialog:_tsd.isShowEditProfileDialog
    });
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

  /**
   * 保存用户资料
   */
  profileFormSubmit: function(e) {
    //姓名，手机号，不能为空
    var formData = e.detail.value;
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    formData.realName = formData.realName.replace(/^\s*|\s*$/g, "");
    if (formData.realName.length < 2) {
      wx.showToast({
        title: '真实姓名至少需要2个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.phoneNumber = formData.phoneNumber.replace(/^\s*|\s*$/g, "");
    if (formData.phoneNumber.length != 11) {
      wx.showToast({
        title: '手机号码应为11位数字',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.userId = _tsd.userInfo.userId;
    

    //发起接口调用,保存用户信息
    wx.request({
      url: app.api.editProfile,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data; 
          _td.userInfo = _data.userInfo;
          _td.userInfo.genderName = util.getGenderName(_data.userInfo.gender);
          _tsd.userInfo = _td.userInfo;
          _t.setData({
            userInfo : _td.userInfo,
            isShowEditProfileDialog:false
          });
          

          //跳转到首页
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },

  /**
   * 处理页面点击事件
   * @param  e 
   */
  actionTap:function(e){
    let _t = this;
    let key = e.currentTarget.dataset.key;
    console.log(e);

    if(key=="editProfile"){
      _t.setData({
        isShowEditProfileDialog:true
      });

    }else if(key=="hideEditProfileDialog"){
      _t.setData({
        isShowEditProfileDialog:false
      });
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
    let _td = this;
     return {
      title: '同学信息',
      path: '/pages/my/profile/profile?userId=' + _td.userInfo.userId
     }

  }
})