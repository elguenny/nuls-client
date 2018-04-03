import Vue from 'Vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    // 定义状态
    state: {
        purseVersion: '1.0.0',
        addressList: [],
    },
    //方法修改
    getters: {

    },
    //触发事件
    mutations: {
        showAddressList(state){
            //console.log(state.addressList);
        }
    },
    //异步操作
    actions: {}
})
export default store