const state = {
    passwordShow:false
};

const getters = {
    getPasswordShow: state => state.passwordShow
};

const mutations = {
    setPasswordShow(state,data){
        state.passwordShow = data
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