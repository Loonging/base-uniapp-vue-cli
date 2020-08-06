import Vue from 'vue'
import App from './App'
import store from './store/index'
import router from './router/router'
import { RouterMount } from 'uni-simple-router'
import uView from 'uview-ui'

Vue.config.productionTip = false
Vue.use(uView)
App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
  router
})
// #ifdef H5
RouterMount(app, '#app')
// #endif

// #ifndef H5
app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif

