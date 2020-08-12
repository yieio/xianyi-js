// pages/my/classroom/classroom.js
import create from '../../../utils/create'
import store from '../../../store/index'
import util from '../../../utils/util.js';
import config from '../../../config.js';

let app = getApp();

create.Page(store,{
  use:['userInfo','hasUserInfo','isShowCreateClassDialog','isShowChangeClassDialog'],

  /**
   * 初始化页面私有数据
   * @param options 
   */
  initData:function(options){
    let _t = this;

    _t.setData({
      classArrary:[{classNumber:"2019PTMBA4",name:"扬帆四班"},{classNumber:"2019PTMBA5",name:"草原五班"},{classNumber:"2019PTMBA6",name:"深圳六班"}],
      classValue:'',
      classIndex:-1, 
    });

  },

  actionTap:function(e){
    let key = e.currentTarget.dataset.key;
    let _t = this;
    let _tsd = _t.store.data; 
    if(key=="createClass"){ 
      _tsd.isShowCreateClassDialog = true; 
    }else if(key=="changeClass"){
      _tsd.isShowChangeClassDialog = true; 
    }else if(key=="selectClassItem"){ 
      let dataset = e.currentTarget.dataset; 
      _t.setData({ 
        classIndex:dataset.index,
        classValue:dataset.value
      });

    }
  },

  menuTap:function(e){
    let key = e.currentTarget.dataset.key;
    let _t = this;
    let _td = _t.store.data; 
    if(key=="inviteClassmate"){
      //邀请同学加入

    }else if(key=="classNumber"){
      //复制班级编号
      wx.setClipboardData({
        data: _td.userInfo.classNumber,
        success (res) { 
        }
      })

    }
  },

  hideModal:function(e){
    let _t = this;
    let _td = _t.store.data; 
    _td.isShowCreateClassDialog = false; 
    _td.isShowChangeClassDialog = false; 
  },

  /**
   * 新建班级体
   * @param e 
   */
  createClassroomFormSubmit:function(e){
    var _t = this;
    var _tsd = _t.store.data;
    var formData = e.detail.value; 

    formData.name = formData.name.replace(/^\s*|\s*$/g, "");
    if (formData.name.length < 2) {
      wx.showToast({
        title: '课程名称至少需要2个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    }; 

    formData.startYear = formData.startYear.replace(/^\s*|\s*$/g, "");
    if (formData.startYear.length != 4) {
      wx.showToast({
        title: '请输入正确的年份如2019',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    //发起接口调用,新建班级
    wx.request({
      url: config.api.createClassroom,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          //处理返回的数据
          _tsd.userInfo.classNumber = _data.classInfo.classNumber;
          _tsd.userInfo.className = _data.classInfo.name;    
          
          wx.showToast({
            title: '新建班级成功',
            icon: 'success',
            duration: 2000
          });

          _tsd.isShowCreateClassDialog = false;
        } else {
          wx.showToast({
            title: '新建班级失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })

  },

  /**
   * 获取组织列表
   */
  getOrganizations: function(name) {
    var _t = this;
    var _td = _t.data;
    wx.request({
      url: app.api.organizations,
      method: "GET",
      dataType: "json",
      success: function(result) {
        console.log(result);
        if (result.data.type != 200) {
          wx.showToast({
            title: '班级列表获取失败',
            icon: 'none'
          })
          return;
        }

        var cs = result.data.data.classNumbers;
        if (cs.length > 0) {
          _t.setData({
            classArrary: cs
          });
        }

        for (var i = 0; i < _td.classArrary.length; i++) {
          if (_td.classArrary[i].name == _td.classValue) {
            _t.setData({
              classIndex: i
            });
          }
        }
      }
    });
  },

  /**
   * 更换/加入班集体
   * @param e 
   */
  changeClassroomFormSubmit:function(e){
    var _t = this;
    var _td = _t.store.data;
    var formData = e.detail.value; 

    formData.classNumber = formData.classNumber.replace(/^\s*|\s*$/g, "");
    if (formData.classNumber.length < 5) {
      wx.showToast({
        title: '请输入正确的班级编号',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    //发起接口调用,新建班级
    wx.request({
      url: config.api.changeClassroom+"?classNumber="+formData.classNumber,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      }, 
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          //处理返回的数据
          _td.userInfo.classNumber = _data.classInfo.classNumber;
          _td.userInfo.className = _data.classInfo.name;

          
          wx.showToast({
            title: '加入班级成功',
            icon: 'success',
            duration: 2000
          });

          _td.isShowChangeClassDialog = false;
        } else {
          wx.showToast({
            title: '加入班级失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this;
    _t.initData(options);
    _t.getOrganizations(); 
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
    let _td = _t.store.data; 
    
    return {
      title:_td.userInfo.nickName+'邀请你加入班集体',
      path:'/pages/index/index?classNumber='+_td.userInfo.classNumber 
    };

  }
})