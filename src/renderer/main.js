import Vue from 'vue'
import App from './app.vue'
import router from './router'
import Vuex from 'vuex'
import store from './vuex/store.js'
import Element from 'element-ui'
import VueI18n from 'vue-i18n'
//引入Element的语言包
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import axios from 'axios'
import {post,fetch,patch,put} from './api/https'
//定义全局变量
Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;

Vue.use(Element);
Vue.use(Vuex);
Vue.use(VueI18n);

const i18n = new VueI18n({
   //locale:lang,
  locale: sessionStorage.getItem('language')||'zh',
   messages:{
     'en':Object.assign(require('./lang/en.js'),enLocale),//将我们项目中的语言包与Element的语言包进行合并
     'zh':Object.assign(require('./lang/zhCHS.js'),zhLocale)
   },
});
Vue.use(Element,{
  i18n:(key,value) =>i18n.t(key,value) //重点！！在注册Element时设置i18n的处理方法（这里有个小坑）
});
/**引入css文件**/
import '../renderer/assets/css/base.css'
import '../renderer/assets/css/font.css'
import 'element-ui/lib/theme-chalk/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/**
 *  创建实例
 */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')

