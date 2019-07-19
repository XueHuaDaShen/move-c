import Vue from 'vue'
import Router from 'vue-router'

const login = r => require.ensure([], () => r(require('@/components/login')), 'chunkname-dl')
const home = r => require.ensure([], () => r(require('@/components/home')), 'chunkname-sy')
const wellcome = r => require.ensure([], () => r(require('@/components/wellcome')), 'chunkname-wellcome')

// fund
const fundManager = r => require.ensure([], () => r(require('@/components/fundManager/fundManager')), 'chunkname-fundManager')
// 账变
const accountChange = r => require.ensure([], () => r(require('@/components/fundManager/accountChange/accountChange')), 'chunkname-accountChange')
// 充值
const deposit = r => require.ensure([], () => r(require('@/components/fundManager/deposit/deposit')), 'chunkname-deposit')
// 第三方充值
const thirdDeposit = r => require.ensure([], () => r(require('@/components/fundManager/deposit/thirdDeposit')), 'chunkname-thirdDeposit')
// 充值记录
const depositHistory = r => require.ensure([], () => r(require('@/components/fundManager/deposit/depositHistory')), 'chunkname-depositHistory')
// 管理员充值
const adminDeposit = r => require.ensure([], () => r(require('@/components/fundManager/deposit/adminDeposit')), 'chunkname-adminDeposit')
// 提现
const withdrawal = r => require.ensure([], () => r(require('@/components/fundManager/withdrawal/withdrawal')), 'chunkname-withdrawal')
// 返点
const refund = r => require.ensure([], () => r(require('@/components/fundManager/refund/refund')), 'chunkname-refund')
// 转账
const bankTransaction = r => require.ensure([], () => r(require('@/components/fundManager/bankTransaction/bankTransaction')), 'chunkname-bankTransaction')
// 支持的银行卡
const supportedBank = r => require.ensure([], () => r(require('@/components/fundManager/supportedBank/supportedBank')), 'chunkname-supportedBank')
// 收款账户
const componyAccount = r => require.ensure([], () => r(require('@/components/fundManager/componyAccount/componyAccount')), 'chunkname-componyAccount')

// user
const userManager = r => require.ensure([], () => r(require('@/components/userManager/userManager')), 'chunkname-userManager')
// 用户列表
const userList = r => require.ensure([], () => r(require('@/components/userManager/userList/userList')), 'chunkname-userList')
// 推广码
const recommend = r => require.ensure([], () => r(require('@/components/userManager/recommend/recommend')), 'chunkname-recommend')

// game
const gameManager = r => require.ensure([], () => r(require('@/components/gameManager/gameManager')), 'chunkname-gameManager')
// 游戏记录
const gameLog = r => require.ensure([], () => r(require('@/components/gameManager/gameHistory/gameLog')), 'chunkname-gameLog')
// 游戏列表
const gameList = r => require.ensure([], () => r(require('@/components/gameManager/gameList/gameList')), 'chunkname-gameList')


// operation
const operationManager = r => require.ensure([], () => r(require('@/components/operationManager/operationManager')), 'chunkname-operationManager')
// 活动推广
const promotion = r => require.ensure([], () => r(require('@/components/operationManager/promotion/promotion')), 'chunkname-promotion')
// 会员公告
const announcement = r => require.ensure([], () => r(require('@/components/operationManager/announcement/announcement')), 'chunkname-announcement')
// 充值套餐
const depositPackage = r => require.ensure([], () => r(require('@/components/operationManager/depositPackage/depositPackage')), 'chunkname-depositPackage')
// 用户优惠券
const userCoupon = r => require.ensure([], () => r(require('@/components/operationManager/userCoupon/userCoupon')), 'chunkname-userCoupon')

// report
const reportManager = r => require.ensure([], () => r(require('@/components/reportManager/reportManager')), 'chunkname-reportManager')
// 平台
const platformReport = r => require.ensure([], () => r(require('@/components/reportManager/platformReport/platformReport')), 'chunkname-platformReport')
// 用户
const userReport = r => require.ensure([], () => r(require('@/components/reportManager/userReport/userReport')), 'chunkname-userReport')
// 游戏
const gameReport = r => require.ensure([], () => r(require('@/components/reportManager/gameReport/gameReport')), 'chunkname-gameReport')
// User Analyze
const userAnalyze = r => require.ensure([], () => r(require('@/components/reportManager/userAnalyze/userAnalyze')), 'chunkname-userAnalyze')
// Lotto Analyze
const lottoAnalyze = r => require.ensure([], () => r(require('@/components/reportManager/lottoAnalyze/lottoAnalyze')), 'chunkname-lottoAnalyze')

// data
const data = r => require.ensure([], () => r(require('@/components/dataManager/data')), 'chunkname-data')
// userData
const userData = r => require.ensure([], () => r(require('@/components/dataManager/userData/userData')), 'chunkname-userData')
// userRetention
const userRetention = r => require.ensure([], () => r(require('@/components/dataManager/userRetention/userRetention')), 'chunkname-userRetention')
// depositRetention
const depositRetention = r => require.ensure([], () => r(require('@/components/dataManager/depositRetention/depositRetention')), 'chunkname-depositRetention')

// cms
const cmsManager = r => require.ensure([], () => r(require('@/components/cmsManager/cmsManager')), 'chunkname-cmsManager')
// 账户列表
const adminList = r => require.ensure([], () => r(require('@/components/cmsManager/cmsAdmin/adminList')), 'chunkname-adminList')
// 角色列表
const roleList = r => require.ensure([], () => r(require('@/components/cmsManager/cmsAdmin/roleList')), 'chunkname-roleList')
// 修改密码
const editPassword = r => require.ensure([], () => r(require('@/components/cmsManager/cmsAdmin/editPassword')), 'chunkname-editPassword')
// 登录日志
const loginLog = r => require.ensure([], () => r(require('@/components/cmsManager/cmsHistory/loginLog')), 'chunkname-loginLog')
// 操作日志
const operationLog = r => require.ensure([], () => r(require('@/components/cmsManager/cmsHistory/operationLog')), 'chunkname-operationLog')

// system
const systemManager = r => require.ensure([], () => r(require('@/components/systemSetting/systemManager')), 'chunkname-systemManager')
// 系统设置
const menu = r => require.ensure([], () => r(require('@/components/systemSetting/generalSetting/menu')), 'chunkname-menu')


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      component: home,
      children: [
        {
          path: '',
          redirect: 'wellcome'
        },
        {
          path: 'wellcome',
          name: 'wellcome',
          component: wellcome
        },
        // fund
        {
          path: 'fundManager',
          component: fundManager,
          children: [
            {
              path: 'accountChange',
              name: 'accountChange',
              component: accountChange
            },
            {
              path: 'deposit',
              name: 'deposit',
              component: deposit
            },
            {
              path: 'thirdDeposit',
              name: 'thirdDeposit',
              component: thirdDeposit
            },
            {
              path: 'depositHistory',
              name: 'depositHistory',
              component: depositHistory
            },
            {
              path: 'adminDeposit',
              name: 'adminDeposit',
              component: adminDeposit
            },
            {
              path: 'withdrawal',
              name: 'withdrawal',
              component: withdrawal
            },
            {
              path: 'refund',
              name: 'refund',
              component: refund
            },
            {
              path: 'bankTransaction',
              name: 'bankTransaction',
              component: bankTransaction
            },
            {
              path: 'supportedBank',
              name: 'supportedBank',
              component: supportedBank
            },
            {
              path: 'componyAccount',
              name: 'componyAccount',
              component: componyAccount
            }
          ]
        },
        // user
        {
          path: 'userManager',
          component: userManager,
          children: [
            {
              path: 'userList',
              name: 'userList',
              component: userList
            },
            {
              path: 'recommend',
              name: 'recommend',
              component: recommend
            }
          ]
        },
        // game
        {
          path: 'gameManager',
          component: gameManager,
          children: [
            {
              path: 'gameLog',
              name: 'gameLog',
              component: gameLog
            },
            {
              path: 'gameList',
              name: 'gameList',
              component: gameList
            }
          ]
        },
        // operation
        {
          path: 'operationManager',
          component: operationManager,
          children: [
            {
              path: 'promotion',
              name: 'promotion',
              component: promotion
            },
            {
              path: 'announcement',
              name: 'announcement',
              component: announcement
            },
            {
              path: 'depositPackage',
              name: 'depositPackage',
              component: depositPackage
            },
            {
              path: 'userCoupon',
              name: 'userCoupon',
              component: userCoupon
            }
          ]
        },
        // report
        {
          path: 'reportManager',
          component: reportManager,
          children: [
            {
              path: 'platformReport',
              name: 'platformReport',
              component: platformReport
            },
            {
              path: 'userReport',
              name: 'userReport',
              component: userReport
            },
            {
              path: 'gameReport',
              name: 'gameReport',
              component: gameReport
            },
            {
              path: 'userAnalyze',
              name: 'userAnalyze',
              component: userAnalyze
            },
            {
              path: 'lottoAnalyze',
              name: 'lottoAnalyze',
              component: lottoAnalyze
            }
          ]
        },
        // data
        {
          path: 'data',
          component: data,
          children: [
            {
              path: 'userData',
              name: 'userData',
              component: userData
            },
            {
              path: 'userRetention',
              name: 'userRetention',
              component: userRetention
            },
            {
              path: 'depositRetention',
              name: 'depositRetention',
              component: depositRetention
            }
          ]
        },
        // cms
        {
          path: 'cmsManager',
          component: cmsManager,
          children: [
            {
              path: 'adminList',
              name: 'adminList',
              component: adminList
            },
            {
              path: 'roleList',
              name: 'roleList',
              component: roleList
            },
            {
              path: 'editPassword',
              name: 'editPassword',
              component: editPassword
            },
            {
              path: 'loginLog',
              name: 'loginLog',
              component: loginLog
            },
            {
              path: 'operationLog',
              name: 'operationLog',
              component: operationLog
            }
          ]
        },
        // sys
        {
          path: 'systemManager',
          component: systemManager,
          children: [
            {
              path: 'menu',
              name: 'menu',
              component: menu
            }
          ]
        }
      ]
    }
  ]
})
