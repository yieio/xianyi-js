// pages/course/mycourse/mycourse.js
import create from '../../../utils/create'
import store from '../../../store/index' 
import config from '../../../config.js';
import util from '../../../utils/util.js';

const app = getApp();
/**
 * 选修课程页面
 */
create.Page(store,{
  use:['userInfo','hasUserInfo'],

  /**
   * 页面的初始数据
   */
  initData:function(options){ 

    let _t = this;
    let _td = _t.data;
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function (res) {
        _t.setData({
          scrollViewHeight: res.windowHeight - 54
        });
      }
    }); 
    _t.setData({
      classNumber:options.classNumber||'',
      myCourses:[],
      isShowAddMyCourseDialog:false,
      courseDate:'',
      startTime:'',
      endTime:'', 
    }); 
  },

  /**
   * 选择器数据变更事件处理
   * @param  e 
   */
  pickerDataChange:function(e){
    let id = e.currentTarget.id;
    let _t = this;
    if(id=="courseDate"){
      _t.setData({
        courseDate: e.detail.value
      }) 
    }else if(id=="startTime"){
      _t.setData({
        startTime: e.detail.value
      }) 
    }else if(id=="endTime"){
      _t.setData({
        endTime: e.detail.value
      }) 
    }
  },

  /**
   * 获取自选课信息
   */
  getMyCourse:function(){
    var _t = this;
    var _td = _t.data;
    wx.request({
      url: app.api.getMyCourse,
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      dataType: "json",
      success: function(result) {
        console.log(result);
        if (result.data.type == 401) {
          wx.showToast({
            title: '您需要先登录',
            icon: 'none',
            duration: 2000
          });
         //跳转去首页
         config.router.goIndex(_td.classNumber); 
         return;
        }
        if (result.data.type != 200) {
          wx.showToast({
            title: '数据请求失败',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        var cs = result.data.data.courses;
        for(var i=0;i<cs.length;i++){
          cs[i].startTime = util.formatDateTime(cs[i].startTime);
          cs[i].endTime = util.formatDateTime(cs[i].endTime);
        }
        _t.setData({
          myCourses: cs
        });
      }
    });

  },

  /**
   * 提交选修课程表单
   * @param {} e 
   */
  courseFormSubmit:function(e){
    var _t = this;
    var _td = _t.data;
    var formData = e.detail.value;
    console.log(formData);

    formData.name = formData.name.replace(/^\s*|\s*$/g, "");
    if (formData.name.length < 2) {
      wx.showToast({
        title: '课程名称至少需要2个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    };
    console.log(formData.name);

    formData.teacher = formData.teacher.replace(/^\s*|\s*$/g, "");
    if (formData.teacher.length < 2) {
      wx.showToast({
        title: '课程名称至少需要2个字符',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.classRoom = formData.classRoom.replace(/^\s*|\s*$/g, "");
    if (formData.classRoom.length < 1) {
      wx.showToast({
        title: '请输入课室名',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.courseDate = formData.courseDate.replace(/^\s*|\s*$/g, "");
    if (formData.courseDate.length < 1) {
      wx.showToast({
        title: '请选择首节课日期',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    formData.startTime = formData.courseDate+" "+formData.startTime;
    formData.endTime = formData.courseDate+" "+formData.endTime;

    //发起接口调用,保存用户信息
    wx.request({
      url: app.api.addMyCourse,
      method: "POST",
      header: {
        'Authorization': 'Bearer ' + app.globalData.userToken.accessToken
      },
      data: formData,
      success: function (result) {
        console.log(result);
        if (result.data.type == 200) {
          var _data = result.data.data;
          //添加返回的数据到
          var course = _data.course;
          course.startTime = util.formatDateTime(course.startTime);
          course.endTime = util.formatDateTime(course.endTime);
          _td.myCourses.unshift(course);
          _t.setData({
            myCourses:_td.myCourses
          });

          //切换隐藏添加面板
          _t.setData({isShowAddMyCourseDialog:false});
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
   * 处理页面事件点击
   * @param e 
   */
  actionTap:function(e){
    let _t = this;
    let _td = _t.data;
    let _tsd = _t.store.data;
    let key = e.currentTarget.dataset.key;
    if(key == "showAddMyCourseDialog"){ 
      _t.setData({isShowAddMyCourseDialog:true});
    }else if(key=="hideAddMyCourseDialog"){
      _t.setData({isShowAddMyCourseDialog:false});
    }else if(key=="goMyCourseInfo"){
      let courseId = e.currentTarget.dataset.courseid;
      config.router.goMyCourseInfo(courseId);
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this; 
    _t.initData(options);

    //判断登录情况，已登录获取用户选修课程
    if (app.globalData.userToken) {
      _t.getMyCourse(); 
    }else{
      wx.showToast({
        title: '您需要先登录',
        icon: 'none',
        duration: 2000
      });

      config.router.goIndex('');
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
  // onShareAppMessage: function () {

  // }
})