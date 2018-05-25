import Vue from 'vue'
import App from './app.vue'
import router from './router'
import Vuex from 'vuex'
import store from './vuex/store.js'
import i18n from './i18n/i18n'
import axios from 'axios'
import {fetch,post,put} from './api/https'
//定义全局变量
Vue.prototype.$fetch = fetch
Vue.prototype.$post = post
Vue.prototype.$put = put

Vue.use(Vuex)

/**引入css文件**/
import '../renderer/assets/css/base.css'
import 'element-ui/lib/theme-chalk/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/**
 *  创建实例
 */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {App},
  template: '<App/>'
})

