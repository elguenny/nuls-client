const state = {
    passwordShow:false,
    //底部高度信息
    netWorkInfo:[],
};

const getters = {
    getPasswordShow: state => state.passwordShow,
    getNetWorkInfo:state => state.netWorkInfo,
};

const mutations = {
    setPasswordShow(state,data){
        state.passwordShow = data
    },
    setNetWorkInfo(state,data){
        state.netWorkInfo = data
    },
};

const actions = {

};

export default{
  state,
  getters,
  mutations,
  actions
}