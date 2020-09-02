// components/addClassDialog/addClassDialog.js
import create from '../../utils/create'
import config from '../../config.js';
import store from '../../store/index'

create.Component(store,{
  use: [
    'userInfo',
    'hasUserInfo', 
    'isShowAddClassDialog',
    'isShowChangeClassDialog'
  ],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  initData:function(options) {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 是否已经加入班级
     */
    hasClassroom: function () {
      let _t = this;
      let _tsd = _t.store.data;
      let result = true;
      if(_tsd.userInfo)
      {
        if( _tsd.userInfo.classNumber){
          result = false;
        }
      }
      _tsd.isShowAddClassDialog = result;
      return !result;
    },

    /**
     * 点击事件
     * @param e 
     */
    actionTap:function(e){
      var _t = this;
      var _tsd = _t.store.data;
      let key = e.currentTarget.dataset.key; 
      if (key == "hideModal") {
        _tsd.isShowAddClassDialog = false;
      } else if (key == "goClassroom") {
        _tsd.isShowChangeClassDialog = true;
        config.router.goClassroom();
      }
    },

  }
})
