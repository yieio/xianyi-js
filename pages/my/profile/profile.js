// pages/my/profile/profile.js
import create from '../../../utils/create'
import store from '../../../store/index'
import util from '../../../utils/util.js';
import config from '../../../config.js';
import services from '../../../services/services';

let app = getApp();

create.Page(store, {
  use: ['userInfo', 'hasUserInfo', 'isShowEditProfileDialog'],

  initData: function (options) {
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;

    let userId = options.userId;
    let title = "我的信息";

    if (userId != _tsd.userInfo.userId) {
      _t.setData({
        canEdit: false,
        userInfo: {}
      })
      title = '同学信息';
      wx.setNavigationBarTitle({
        title: title,
      })
    } else {
      _t.setData({
        canEdit: true,
        userInfo: _tsd.userInfo
      })
    }

    _t.setData({
      title: title,
      userId: userId,
    });

    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function (res) {
        _t.setData({
          scrollViewHeight: res.windowHeight - 60
        });
      }
    });
  },

  /**
   * 获取同学档案信息
   */
  getProfile: function (userId) {
    var _t = this;

    let success = result => {
      var cp = result.data.data.classmateProfile;
      cp.genderName = util.getGenderName(cp.gender);
      _t.setData({
        userInfo: cp
      });
    };
    let data = {
      userId
    };
    services.getProfile({
      data,
      success
    });
  },

  /**
   * 保存用户资料
   */
  profileFormSubmit: function (e) {
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

    let success = result => {
      var _data = result.data.data;
      _td.userInfo = _data.userInfo;
      _td.userInfo.genderName = util.getGenderName(_data.userInfo.gender);
      _tsd.userInfo = _td.userInfo;
      _t.setData({
        userInfo: _td.userInfo
      });

      _tsd.isShowEditProfileDialog = false;
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
    };

    let data = formData;
    services.editProfile({
      data,
      success
    });

  },

  /**
   * 处理页面点击事件
   * @param  e 
   */
  actionTap: function (e) {
    let _t = this;
    let _tsd = _t.store.data;
    let key = e.currentTarget.dataset.key;
    console.log(e);

    if (key == "editProfile") {
      _tsd.isShowEditProfileDialog = true;

    } else if (key == "hideEditProfileDialog") {
      _tsd.isShowEditProfileDialog = false;
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this;
    let _tsd = _t.store.data;
    _t.initData(options);
    if (_tsd.userToken) {
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
    let _t = this;
    let _td = _t.data;
    let title = _td.title || '同学信息';
    return {
      title: title,
      path: '/pages/my/profile/profile?userId=' + _td.userId
    }

  }
})