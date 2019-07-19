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
      localStorage.removeItem('dove-app-login')
      localStorage.removeItem('dove-app-cash')
      localStorage.removeItem('dove-app-loginname')
      localStorage.removeItem('dove-app-token')
      localStorage.removeItem('dove-app-link')
      self.$store.dispatch('setLoginStauts', false)
      self.$store.dispatch('setMenuStatus', false)
      self.$router.push({
        name: 'login'
      })
    }
    if (isClickLogout) {
      exit()
    } else {
      if (!self.$store.state.isLogin) return
      self.$store.state.message(self.$t('message.chong_xin_deng_lu'), 'error', 1500, self)
      exit()
    }
  },
  tableRowStyle: function ({ row, rowIndex }) {
    return 'background-color: #282725;color: #9c9ea2;border:none'
  },
  pro_or_test: true, // 上线或者测试 用来设定第三方支付的url 以及 游戏url
  isLogin: localStorage.getItem('dove-app-login') === 'true', // 是否登录
  headerName: '',
  showMenu: false, // 是否显示menu
  alertBG: false, // 弹出框背景蒙版
  cashAccountConfirm: false, // 个人账户确认转账弹框
  showLoginDialog: false, // 登录弹框
  cash: localStorage.getItem('dove-app-cash') || '', // 账户余额
  doveName: localStorage.getItem('dove-app-loginname') || '', // 账户name
  isBindBank: false, // 账户是否绑定银行卡，默认未绑定
  stake: '', // 用户可提现标准（类似打码量）
  fromUrl: '', // 上一级的url
  channelTabs: [] // 充值/提现 通道数量
}
// console.log(state)
const mutations = {
  changeLoginStauts (state, isLogin) {
    state.isLogin = isLogin
  },
  changeHeaderName (state, headerName) {
    state.headerName = headerName
  },
  changeMenuStatus (state, showMenu) {
    state.showMenu = showMenu
  },
  changeAlertBG (state, alertBG) {
    state.alertBG = alertBG
  },
  changeCashAccountConfirm (state, cashAccountConfirm) {
    state.cashAccountConfirm = cashAccountConfirm
  },
  changeShowLoginDialog (state, showLoginDialog) {
    state.showLoginDialog = showLoginDialog
  },
  changeCash (state, cash) {
    state.cash = cash
  },
  changeDoveName (state, doveName) {
    state.doveName = doveName
  },
  changeIsBindBank (state, isBindBank) {
    state.isBindBank = isBindBank
  },
  changeStake (state, stake) {
    state.stake = stake
  },
  changeFromUrl (state, fromUrl) {
    state.fromUrl = fromUrl
  },
  changeChannelTabs (state, channelTabs) {
    state.channelTabs = channelTabs
  }
}

const getters = {}

const actions = {
  setLoginStauts ({
    commit
  }, isLogin) {
    commit('changeLoginStauts', isLogin)
  },
  setHeaderName ({
    commit
  }, headerName) {
    commit('changeHeaderName', headerName)
  },
  setMenuStatus ({
    commit
  }, showMenu) {
    commit('changeMenuStatus', showMenu)
  },
  setAlertBG ({
    commit
  }, alertBG) {
    commit('changeAlertBG', alertBG)
  },
  setCashAccountConfirm ({
    commit
  }, cashAccountConfirm) {
    commit('changeCashAccountConfirm', cashAccountConfirm)
  },
  setShowLoginDialog ({
    commit
  }, showLoginDialog) {
    commit('changeShowLoginDialog', showLoginDialog)
  },
  setCash ({
    commit
  }, cash) {
    commit('changeCash', cash)
  },
  setDoveName ({
    commit
  }, doveName) {
    commit('changeDoveName', doveName)
  },
  setIsBindBank ({
    commit
  }, isBindBank) {
    commit('changeIsBindBank', isBindBank)
  },
  setStake ({
    commit
  }, stake) {
    commit('changeStake', stake)
  },
  setFromUrl ({
    commit
  }, fromUrl) {
    commit('changeFromUrl', fromUrl)
  },
  setChannelTabs ({
    commit
  }, channelTabs) {
    commit('changeChannelTabs', channelTabs)
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
