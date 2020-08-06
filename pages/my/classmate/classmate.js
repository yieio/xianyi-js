// pages/my/classmate/classmate.js
import create from '../../../utils/create'
import store from '../../../store/index'
import util from '../../../utils/util.js';
import config from '../../../config.js';

let app = getApp();

/**
 * 同学页面，加入的同学列表，
 * 点击头像可以查看同学信息
 */
create.Page(store,{

  /**
   * 页面的初始数据
   */
  use:['userInfo','hasUserInfo','classmates'],

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
    }else if(key="goProfile"){
      config.router.goProfile(e,e.currentTarget.id);
    }

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this;
    //let _td = _t.data;
    //let _tsd = _t.store.data;
    _t.initData();

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