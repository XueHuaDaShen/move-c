import Vuex from 'vuex'
import Vue from 'vue'

const state = {
  // 获取推广参数
  getUrlParamFn: function () {
    let queryParam = ''
    try {
      var urlParam = JSON.parse(localStorage.getItem('tui_guang'))
      let arr = []
      for (let i in urlParam) {
        arr.push(i + '=' + urlParam[i])
      }
      queryParam = arr.length > 0 ? '?' + arr.join('&') : ''
    } catch (error) {

    }
    return queryParam
  },

  message: function (value, type, duration, self) {
    self.$message({
      message: value,
      type: type,
      duration: duration,
      center: true
    })
  },
  logout: function (self, isClickLogout = false) {
    var exit = function () {
      localStorage.removeItem('dove-web-login');
      localStorage.removeItem('dove-web-cash');
      localStorage.removeItem('dove-web-loginname');
      localStorage.removeItem('dove-web-token');
      localStorage.removeItem('dove-web-loginid');
      localStorage.removeItem('dove-web-link');
      localStorage.removeItem('web-channel-tabs');
      self.$store.dispatch('setLoginStauts', false);
      self.$router.push({
        name: "index"
      })
    }
    if(isClickLogout){
      exit()
    }else{
      if(!self.$store.state.isLogin) return
      self.$store.state.message(self.$t("message.chong_xin_deng_lu"), 'error', 1500, self);
      exit();
    }
  },
  pro_or_test: true, // 上线或者测试 用来设定第三方支付的url
  isLogin: localStorage.getItem('dove-web-login') === 'true', // 是否登录
  alertBG: false, // 弹出框背景蒙版
  showLoginDialog: false, // 登录弹框
  cash: localStorage.getItem('dove-web-cash') || '', // 账户余额
  doveName: localStorage.getItem('dove-web-loginname') || '', // 账户name
  isBindBank: false, // 账户是否绑定银行卡，默认未绑定
  stake: '', // 用户可提现标准（类似打码量）
  channelTabs: [], // 充值/提现 通道数量
}
// console.log(state)
const mutations = {
  changeLoginStauts(state, isLogin) {
    state.isLogin = isLogin
  },
  changeAlertBG(state, alertBG) {
    state.alertBG = alertBG
  },
  changeShowLoginDialog(state, showLoginDialog) {
    state.showLoginDialog = showLoginDialog
  },
  changeCash(state, cash) {
    state.cash = cash
  },
  changeDoveName(state, doveName) {
    state.doveName = doveName
  },
  changeIsBindBank(state, isBindBank) {
    state.isBindBank = isBindBank
  },
  changeStake(state, stake) {
    state.stake = stake
  },
  changeChannelTabs(state, channelTabs) {
    state.channelTabs = channelTabs
  },
}

const getters = {}

const actions = {
  setLoginStauts({
    commit
  }, isLogin) {
    commit('changeLoginStauts', isLogin)
  },
  setAlertBG({
    commit
  }, alertBG) {
    commit('changeAlertBG', alertBG)
  },
  setShowLoginDialog({
    commit
  }, showLoginDialog) {
    commit('changeShowLoginDialog', showLoginDialog)
  },
  setCash({
    commit
  }, cash) {
    commit('changeCash', cash)
  },
  setDoveName({
    commit
  }, doveName) {
    commit('changeDoveName', doveName)
  },
  setIsBindBank({
    commit
  }, isBindBank) {
    commit('changeIsBindBank', isBindBank)
  },
  setStake({
    commit
  }, stake) {
    commit('changeStake', stake)
  },
  setChannelTabs({
    commit
  }, channelTabs) {
    commit('changeChannelTabs', channelTabs)
  },
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
