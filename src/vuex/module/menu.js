const state = {
  menuItems:[
      {'title':'首页','url':'home','icon':'home_icon'},
      {'title':'钱包','url':'home','icon':'wallet_icon'},
      {'title':'共识','url':'home','icon':'consensus_icon'},
      {'title':'应用','url':'home','icon':'application_icon'},
      {'title':'更多','url':'home','icon':'more_icon'},
  ]
};

const getters = {
    getMenuItems: state => state.menuItems
};

const mutations = {

};

const actions = {

};

export default{
  state,
  getters,
  mutations,
  actions
}