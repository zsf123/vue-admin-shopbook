// 入口文件
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局css样式

import App from './App'
import store from './store'//引入全局状态管理
import router from './router'//导入路由文件

import i18n from './lang'//导入国际化语言
import '@/icons' // icon 导入所有svg图标
import '@/permission' // 路由跳转前后执行的操作

import common from '@/utils'//引入格式化时间方法
Vue.prototype.common=common;

// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  // size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)//返回一个t()方法
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
   i18n,
  render: h => h(App)
})
