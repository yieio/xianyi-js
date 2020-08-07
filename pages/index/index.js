import create from '../../utils/create'
import store from '../../store/index'

//获取应用实例
const app = getApp()

create.Page(store, {
  use: [ 
    'userInfo',
    'hasUserInfo',
    'canIUse',
    'selectPage'
  ], 
  computed: {
    curPage(){
      return this.selectPage?this.selectPage:"course";
    }
  },

  /**
   * 方法块
   * 切换底部导航
   */
  navChange:function(e){
    let title = e.currentTarget.dataset.cur=="my"?"我":"闲倚";
    wx.setNavigationBarTitle({title:title});
    this.store.set(this.store.data, 'selectPage', e.currentTarget.dataset.cur);
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getUserInfo: function (e) {
    this.store.data.userInfo = e.detail.userInfo
    this.store.data.hasUserInfo = true
  },


  onLoad: function (options) {
    var _t = this;
    var _tsd = _t.store.data;
    if(options.classNumber){
      _tsd.classNumber = options.classNumber; 
    } 

    if (app.globalData.userInfo) {
      this.store.data.userInfo = app.globalData.userInfo
      this.store.data.hasUserInfo = true

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => { 
        this.store.data.userInfo = app.globalData.userInfo
        this.store.data.hasUserInfo = true
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.store.data.userInfo = res.userInfo
          this.store.data.hasUserInfo = true
        }
      })
    } 

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _t = this;
    let _tsd = _t.store.data; 
    let classNumber = _tsd.userInfo.classNumber || _tsd.classNumber;
    let className = _tsd.userInfo.className || "";

    console.log("onShareAppMessage=>"+classNumber);
    
    return { 
      title: className+'最近课程',
      path:'/pages/index/index?classNumber='+ classNumber
    };

  }
})
