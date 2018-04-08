import Vue from 'vue';
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n';
import messages from './langs/index';
Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: sessionStorage.getItem('language') || 'en',
    messages,
});
Vue.use(ElementUI,{
    i18n: (key, value) => i18n.t(key, value)
});
locale.i18n((key, value) => i18n.t(key, value));

export default i18n
