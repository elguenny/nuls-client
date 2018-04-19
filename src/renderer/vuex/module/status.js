const state = {
    passwordShow:false,
    //获取版本信息
    versionInfo:[],
    //底部高度信息
    netWorkInfo:[],
};

const getters = {
    getPasswordShow: state => state.passwordShow,
    getVersionInfo:state => state.versionInfo,
    getNetWorkInfo:state => state.netWorkInfo,
};

const mutations = {
    setPasswordShow(state,data){
        state.passwordShow = data
    },
    setVersionInfo(state,data){
        state.versionInfo = data
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