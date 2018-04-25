const state = {
  passwordShow: false,
  //获取版本信息
  versionInfo: [],
  //底部高度信息
  netWorkInfo: [],
  //连接节点数小于1不能接操作
  nodeNumberOk:true,
}

const getters = {
  getPasswordShow: state => state.passwordShow,
  getVersionInfo: state => state.versionInfo,
  getNetWorkInfo: state => state.netWorkInfo,
  getNodeNumberOk: state => state.nodeNumberOk,
}

const mutations = {
  setPasswordShow (state, data) {
    state.passwordShow = data
  },
  setVersionInfo (state, data) {
    state.versionInfo = data
  },
  setNetWorkInfo (state, data) {
    state.netWorkInfo = data
  },
  setNodeNumberOk (state, data) {
    state.nodeNumberOk = data
  },
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}