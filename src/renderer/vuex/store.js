import Vue from 'Vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
	// 定义状态
	state: {
		purseVersion: '1.0.0',
		isActive:0,
        //codeInfo: '',
	},
    mutations: {
        increment (state) {
            // 变更状态
            state.count++
        }
    },
	actions: {
		
	}
})
export default store