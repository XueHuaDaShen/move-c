import Vue from 'vue'
import Vuex from 'vuex'
// 状态
const state = {
  treeData: []
}
// 修改
const mutations = {
  changeTreeData(state, treeData) {
    state.treeData = treeData
  },
}
const getters = {}
// 触发
const actions = {
  setTreeData({commit}, treeData) {
    commit('changeTreeData', treeData)
  }
}

Vue.use(Vuex);
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})