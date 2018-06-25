const state = {
    allConsensus: [],
    myConsensus: [],
};

const getters = {
    getAllConsensus: state => state.allConsensus,
    getMyConsensus: state => state.myConsensus,
};

const mutations = {
    setAllConsensus(state,data){
        state.allConsensus = data;
    },
    setMyConsensus(state,data){
        state.myConsensus = data;
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