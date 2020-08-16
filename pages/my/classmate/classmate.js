// pages/my/classmate/classmate.js
import create from '../../../utils/create'
import store from '../../../store/index' 
import config from '../../../config.js';
import services from '../../../services/services' 

let app = getApp();

/**
 * 同学页面，加入的同学列表，
 * 点击头像可以查看同学信息
 */
create.Page(store,{

  /**
   * 页面的初始数据
   */
  use:['userInfo','hasUserInfo','classmates','subClassmates'],

  /**
   * 初始化页面私有数据
   * 使用了 store,不能直接启用 data,
   * 只能通过 setData 和 this.data 
   * 引用页面私有数据
   */
  initData:function(){
    let _t = this; 
    _t.setData({
      isShowAllClassmate:false
    });
  },

  /**
   * 点击事件
   * @param e 
   */
  actionTap:function(e){
    let key = e.currentTarget.dataset.key;
    console.log(key);
    let _t = this;
    let _td = _t.data; 
    let _tsd = _t.store.data; 
    if(key=="showAllClassmate"){   
      var isShow = !_td.isShowAllClassmate;
      _t.setData({isShowAllClassmate:isShow}); 
    }else if(key=="goProfile"){
      config.router.goProfile(e.currentTarget.id);
    }else if(key=="classNumber"){
      //复制班级编号
      wx.setClipboardData({
        data: _td.userInfo.classNumber,
        success (res) { 
        }
      }) 
    }

  },

  /**
   * 获取同学
   */
  getClassmates: function () {
    var _t = this;
    var _td = _t.store.data;
    let success = result=>{
      if(result.statusCode == 401){
        //wx.setStorageSync('userToken', null);
        return;
      }

      if (result.data.type != 200) {
        wx.showToast({
          title: '获取同学信息失败',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      var cs = result.data.data.classmates;
      _td.classmates = cs;
      let sub = 3;
      if (cs.length > sub) {
        _td.subClassmates = [];
        for (let i = 0; i < sub; i++) {
          _td.subClassmates.push(cs[i]);
        }

      } else {
        _td.subClassmates = cs;
      }
    }
    services.getClassmates(success);
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this; 
    _t.initData();

    if(app.globalData.userToken){
      _t.getClassmates();
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
    let _tsd = _t.store.data; 
    let name = _tsd.userInfo.realName || _tsd.userInfo.nickName ||"";
    return {
      title: name +'邀请你加入班集体',
      path:'/pages/index/index?classNumber='+_tsd.userInfo.classNumber+'&className='+_tsd.userInfo.className
    };

  }
})