import Vue from 'vue'
import Vuex from 'vuex'
// 状态
const state = {
  navBar: []
}
// 修改
const mutations = {
  changeNavBar(state, navBar) {
    state.navBar = navBar
  },
}
const getters = {}
// 触发
const actions = {
  setNavBar({commit}, navBar) {
    commit('changeNavBar', navBar)
  }
}

Vue.use(Vuex);
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})