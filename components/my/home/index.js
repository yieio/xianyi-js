// components/my/home/index.js
import create from '../../../utils/create'
import util from '../../../utils/util.js';
import config from '../../../config.js';
import store from '../../../store/index'

create.Component(store,{
  /**
   * 用了use不能再用 data
   */
  use: [ 
    'userInfo',
    'hasUserInfo',
    'canIUse'
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
   * 组件的方法列表
   */
  methods: {
    getUserInfo:function(e){
      console.log("getUserInfo=>");
      console.log(e);
      this.store.data.userInfo = e.detail.userInfo;
      this.store.data.hasUserInfo = true;
    }

  },

  lifetimes:{
    attached: function() {
      // 在组件实例进入页面节点树时执行 
      console.log(this.store.data.userInfo);
      console.log(this.store.data.hasUserInfo);
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  }

  
})
