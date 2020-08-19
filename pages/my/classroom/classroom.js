// pages/my/classroom/classroom.js
import create from '../../../utils/create'
import store from '../../../store/index'
import services from '../../../services/services'
import config from '../../../config.js';

let app = getApp();

create.Page(store, {
  use: ['userInfo', 'hasUserInfo', 'isShowCreateClassDialog', 'isShowChangeClassDialog'],

  /**
   * 初始化页面私有数据
   * @param options 
   */
  initData: function (options) {
    let _t = this;
    let _tsd = _t.store.data;

    _t.setData({
      classArrary: [],
      classValue: _tsd.userInfo.classNumber,
      classIndex: -1,
    });

  },

  actionTap: function (e) {
    let key = e.currentTarget.dataset.key;
    let _t = this;
    let _tsd = _t.store.data;
    if (key == "createClass") {
      _tsd.isShowCreateClassDialog = true;
    } else if (key == "changeClass") {
      _tsd.isShowChangeClassDialog = true;
    } else if (key == "selectClassItem") {
      let dataset = e.currentTarget.dataset;
      _t.setData({
        classIndex: dataset.index,
        classValue: dataset.value
      });
    } else if (key == "hideChangeClassDialog") {
      _tsd.isShowChangeClassDialog = false;
    } else if (key == "hideCreateClassDialog") {
      _tsd.isShowCreateClassDialog = false;
    }
  },

  menuTap: function (e) {
    let key = e.currentTarget.dataset.key;
    let _t = this;
    let _td = _t.store.data;
    if (key == "inviteClassmate") {
      //邀请同学加入

    } else if (key == "classNumber") {
      //复制班级编号
      wx.setClipboardData({
        data: _td.userInfo.classNumber,
        success(res) {}
      })

    }
  },


  /**
   * 新建班级体
   * @param e 
   */
  createClassroomFormSubmit: function (e) {
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

    formData.classNumber = formData.classNumber.replace(/\s/g, "");

    let success = result => {
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
    };

    services.createClassroom({
      data: formData,
      success
    });
 
  },

  /**
   * 获取组织列表
   */
  getOrganizations: function () {
    var _t = this;
    var _td = _t.data;
    let _tsd = _t.store.data;
    let success = function (result) {
      console.log(result);
      if (result.data.type != 200) {
        let title = result.data.content || '班级列表获取失败';
        wx.showToast({
          title: title,
          icon: 'none'
        })
        return;
      }

      var cs = result.data.data.classes;
      if (cs.length > 0) {
        _t.setData({
          classArrary: cs
        });
      }

      for (var i = 0; i < _td.classArrary.length; i++) {
        if (_td.classArrary[i].classNumber == _td.classValue) {
          _t.setData({
            classIndex: i
          });
        }
      }
    };
    let classNumber = _tsd.userInfo.classNumber || _tsd.indexClassInfo.classNumber;

    //classNumber, isAll
    let data ={classNumber,isAll:1};

    services.getOrganizations({data, success});
  },

  /**
   * 更换/加入班集体
   * @param e 
   */
  changeClassroomFormSubmit: function (e) {
    var _t = this;
    var _tsd = _t.store.data;
    var formData = e.detail.value;

    formData.classNumber = formData.classNumber.replace(/\s/g, "");
    if (formData.classNumber.length < 5) {
      wx.showToast({
        title: '请输入正确的班级编号',
        icon: 'none',
        duration: 2000
      });
      return false;
    };

    let success = result =>{
      var _data = result.data.data;
          wx.showToast({
            title: '加入班级成功',
            icon: 'success',
            duration: 2000
          });

          _tsd.isShowChangeClassDialog = false;
          if (_data && _data.classInfo) {
            //处理返回的数据
            _tsd.userInfo.classNumber = _data.classInfo.classNumber;
            _tsd.userInfo.className = _data.classInfo.name;
          }
    };

    let data = {classNumber:formData.classNumber};

    services.changeClassroom({data,success}); 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _t = this;
    let _tsd = _t.store.data;
    _t.initData(options);
    if (_tsd.hasUserInfo && _tsd.userInfo.classNumber) {
      _t.getOrganizations();
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
    let className = _tsd.userInfo.className || "";
    let nickName = _tsd.userInfo.realName || _tsd.userInfo.nickName || '';
    let classNumber = _tsd.userInfo.classNumber || "";

    let cname = className || "班集体";

    return {
      title: nickName + '邀请你加入' + cname,
      path: '/pages/index/index?classNumber=' + classNumber + "&className=" + className
    };

  }
})