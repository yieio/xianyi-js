// pages/my/randomDate/randomDate.js
import create from '../../../utils/create'
import store from '../../../store/index'
import services from '../../../services/services'
import config from '../../../config.js';

let app = getApp();

create.Page(store, {
  use: ['userInfo', 'hasUserInfo', 'courseDate', 'appointments', 'inviters', 'randomDateTitle'],

  /**
   * 页面的初始数据
   */
  initData: function (options) {
    let _t = this;
    let _td = _t.data;


    _t.setData({
      tabCur: 0,
      isShowRandomDateDialog: false,

      dateList: ["今天", "明天", "后天", "最近课程那一天"],
      dateIndex: 3,
      dateDesc: "",

      timeList: ["早餐", "午餐", "晚餐", "宵夜"],
      timeIndex: 1,
    });

    _t.selectDate(_td.dateIndex);
  },

  /**
   * 页面点击时间处理
   * @param  e 
   */
  actionTap: function (e) {
    let key = e.currentTarget.dataset.key;
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;

    if (key == "hideRandomDateDialog") {
      _t.setData({
        isShowRandomDateDialog: false
      });
    } else if (key == "randomDate") {
      _t.setData({
        isShowRandomDateDialog: true
      });
    } else if (key == "selectDate") {
      let index = e.currentTarget.dataset.index;
      _t.selectDate(index);
    } else if (key == "selectTime") {
      let index = e.currentTarget.dataset.index;
      _t.selectTime(index);
    } else if (key == "tabSelect") {
      let _index = e.currentTarget.dataset.index;
      _t.setData({
        tabCur: _index
      });

      _tsd.randomDateTitle = _index == 1 ? "约我的" : "我约的";
    }

  },

  /**
   * 选择日期
   */
  selectDate: function (id) {

    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate() + id;

    var dateDesc = _td.dateList[id] + "：" + [year, month, day].join('/');

    if (id == 3) {
      let latestDate = _tsd.courseDate.date || "最近无课程";
      dateDesc = _td.dateList[id] + "：" + latestDate;
    }

    this.setData({
      dateIndex: id,
      dateDesc: dateDesc
    });
  },

  /**
   * 选择时间
   */
  selectTime: function (id) {
    this.setData({
      timeIndex: id,
    });
  },



  /**
   * 确定约饭
   */
  randomDateFormSubmit: function (e) {
    var _t = this;
    var _td = _t.data;
    let _tsd = _t.store.data;

    var now = new Date();
    var appointmentDate = "";


    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate() + _td.dateIndex;

    appointmentDate = [year, month, day].join('/') + " 00:00:00";

    if (_td.dateIndex == 3) {
      if (!_tsd.courseDate.date) {
        wx.showToast({
          title: '最近无课程，请选择其他日期',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      appointmentDate = _td.courseDate.date + " 00:00:00";
    }

    var postData = {
      appointmentDate: appointmentDate,
      timeType: _td.timeIndex
    };

    let success = result => {
      var ap = services.formatAppointment(result.data.data.appointment, true);
      _t.setData({
        isShowRandomDateDialog: false
      });
      _tsd.appointments.push(ap);
      wx.showToast({
        title: resultData.content,
        icon: 'success',
      })
    }

    services.makeAppointment({
      data: postData,
      success
    });
  },

  /**
   * 获取约饭
   */
  getAppointments: function () {
    var _t = this;
    var _tsd = _t.store.data;
    let success = result => {
      var apps = result.data.data.creaters;
      let appoints = [];
      if (apps.length > 0) {
        for (let i = 0; i < apps.length; i++) {
          let creater = services.formatAppointment(apps[i], true);
          appoints.push(creater);
        }
      }
      _tsd.appointments = appoints;

      //邀请数据
      apps = result.data.data.inviters;
      var inviters = [];
      if (apps.length > 0) {
        for (var i = 0; i < apps.length; i++) {
          var creater = services.formatAppointment(apps[i], false);
          inviters.push(creater);
        }
        _tsd.inviters = inviters
      }
    };

    services.getAppointments({
      success
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this;
    let _tsd = _t.store.data;
    _t.initData(options);

    if (_tsd.hasUserInfo && _tsd.userInfo.classNumber) {
      _t.getAppointments();
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
    let _t = this;
    let _tsd = _t.store.data;

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);

    if (_tsd.hasUserInfo && _tsd.userInfo.classNumber) {
      _t.getAppointments();
    }
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