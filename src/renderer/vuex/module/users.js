const {app} = require('electron').remote

const state = {
  purseVersion: app.getVersion(),
  addressListItems: [],
  accountTxList: [],
}

const getters = {
  getPurseVersiont: state => state.purseVersion,
  getAddressList: state => state.addressListItems,
}

const mutations = {
  setAddressList (state, data) {
    state.addressListItems = data
  },
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}