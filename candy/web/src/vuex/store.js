import Vuex from 'vuex'
import Vue from 'vue'

import {
  consoleFn
} from '@/assets/js/console'
import {
  reLogin
} from '@/assets/js/reLogin'
const state = {
  message: function (value, type, duration, self) {
    self.$message({
      message: value,
      type: type,
      duration: duration,
      center: true
    })
  },
  isBuild: false, // 是否打包上线， 用来设定开发环境下语言为汉语
  bets: 0,
  consoleFn: consoleFn,
  reLogin: reLogin,
  betModel: false,
  issue: '',
  lotteryName: '',
  cash: '',
  msgHidden: true, // 收件箱消息提醒
  rechargeMsgHidden: true, // 充值消息提醒
  withdrawMsgHidden: true, // 提现消息提醒
  isRelogin: false,
  routerTagIndex: false, // 头部导航索引
  routerTagUrl: '', // 头部导航路径
}
// console.log(state)
const mutations = {
  changeBets(state, bets) {
    state.bets = bets
  },
  changeBetModel(state, betModel) {
    state.betModel = betModel
  },
  changeIssue(state, issue) {
    state.issue = issue
  },
  changeLotteryName(state, lotteryName) {
    state.lotteryName = lotteryName
  },
  changeCash(state, cash) {
    state.cash = cash
  },
  changeMsgHidden(state, msgHidden) {
    state.msgHidden = msgHidden
  },
  changeRechargeMsgHidden(state, rechargeMsgHidden) {
    state.rechargeMsgHidden = rechargeMsgHidden
  },
  changeWithdrawMsgHidden(state, withdrawMsgHidden) {
    state.withdrawMsgHidden = withdrawMsgHidden
  },
  changeIsRelogin(state, isRelogin) {
    state.isRelogin = isRelogin
  },
  changeRouterTagIndex(state, routerTagIndex) {
    state.routerTagIndex = routerTagIndex
  },
  changeRouterTagUrl(state, routerTagUrl) {
    state.routerTagUrl = routerTagUrl
  }
}


const actions = {
  setBets({
    commit
  }, bets) {
    commit('changeBets', bets)
  },
  setBetModel({
    commit
  }, betModel) {
    commit('changeBetModel', betModel)
  },
  setIssue({
    commit
  }, issue) {
    commit('changeIssue', issue)
  },
  setLotteryName({
    commit
  }, lotteryName) {
    commit('changeLotteryName', lotteryName)
  },
  setCash({
    commit
  }, cash) {
    commit('changeCash', cash)
  },
  setMsgHidden({
    commit
  }, msgHidden) {
    commit('changeMsgHidden', msgHidden)
  },
  setRechargeMsgHidden({
    commit
  }, rechargeMsgHidden) {
    commit('changeRechargeMsgHidden', rechargeMsgHidden)
  },
  setWithdrawMsgHidden({
    commit
  }, withdrawMsgHidden) {
    commit('changeWithdrawMsgHidden', withdrawMsgHidden)
  },
  setIsRelogin({
    commit
  }, isRelogin) {
    commit('changeIsRelogin', isRelogin)
  },
  setRouterTagIndex({
    commit
  }, routerTagIndex) {
    commit('changeRouterTagIndex', routerTagIndex)
  },
  setRouterTagUrl({
    commit
  }, routerTagUrl) {
    commit('changeRouterTagUrl', routerTagUrl)
  },
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions
})
