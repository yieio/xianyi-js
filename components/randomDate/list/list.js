// components/my/randomDate/list/list.js
import create from '../../../utils/create' 
import config from '../../../config.js';
import store from '../../../store/index'

create.Component(store,{
  use:['userInfo','hasUserInfo','appointments','randomDateTitle'],
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

  },

  lifetimes:{
    created:function(){ 
    },
    attached: function() { 
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
