import Vue from 'vue'
import Router from 'vue-router'

// const home = r => require.ensure([], () => r(require('@/components/home')), 'chunkname-home');
// const home = r => require.ensure([], () => r(require('@/components/newHome')), 'chunkname-home');
const home = r => require.ensure([], () => r(require('@/components/newHome-2')), 'chunkname-home');
const login = r => require.ensure([], () => r(require('@/components/login')), 'chunkname-login');
const reg = r => require.ensure([], () => r(require('@/components/reg')), 'chunkname-reg');
const losePassword = r => require.ensure([], () => r(require('@/components/losePassword')), 'chunkname-losePassword');
const download = r => require.ensure([], () => r(require('@/components/download')), 'chunkname-download');

// 彩种
const lotteryKind = r => require.ensure([], () => r(require('@/components/lottery/lotteryKind')), 'chunkname-lotteryKind');
const lotteryDetail = r => require.ensure([], () => r(require('@/components/lottery/lotteryDetail')), 'chunkname-lotteryDetail');
// const lotteryDetail = r => require.ensure([], () => r(require('@/components/lottery/lotteryDetail')), 'chunkname-lotteryDetail');
const sscList = r => require.ensure([], () => r(require('@/components/lottery/sscList')), 'chunkname-sscList');
// 开奖结果
// 按时间
const timePrize = r => require.ensure([], () => r(require('@/components/prize/timePrize')), 'chunkname-timePrize');
// 按彩种
const lotteryPrize = r => require.ensure([], () => r(require('@/components/prize/lotteryPrize')), 'chunkname-lotteryPrize');
const betsDetail = r => require.ensure([], () => r(require('@/components/prize/betsDetail')), 'chunkname-betsDetail');
/* 个人中心 */
// 充值
const recharge = r => require.ensure([], () => r(require('@/components/userCenter/recharge')), 'chunkname-recharge');
// 提现
const withdraw = r => require.ensure([], () => r(require('@/components/userCenter/withdraw')), 'chunkname-withdraw');
// 帐变记录
const accountRecord = r => require.ensure([], () => r(require('@/components/userCenter/accountRecord')), 'chunkname-accountRecord');
// 投注记录
const betRecord = r => require.ensure([], () => r(require('@/components/userCenter/betRecord')), 'chunkname-betRecord');
// 投注详情
const betRecordDetail = r => require.ensure([], () => r(require('@/components/userCenter/betRecordDetail')), 'chunkname-betRecordDetail');
// 以订单为基准的 投注详情
const betOrderDetail = r => require.ensure([], () => r(require('@/components/userCenter/betOrderDetail')), 'chunkname-betOrderDetail');
// 充值记录
const rechargeRecord = r => require.ensure([], () => r(require('@/components/userCenter/rechargeRecord')), 'chunkname-rechargeRecord');
// 提现记录
const withdrawRecord = r => require.ensure([], () => r(require('@/components/userCenter/withdrawRecord')), 'chunkname-withdrawRecord');
// 推广链接
const sponsoredLink = r => require.ensure([], () => r(require('@/components/userCenter/sponsoredLink')), 'chunkname-sponsoredLink');
// 会员
const member = r => require.ensure([], () => r(require('@/components/userCenter/member')), 'chunkname-member');

/* 代理中心 */
/* 团队管理 */
// 会员列表
const memberList = r => require.ensure([], () => r(require('@/components/agency/teamManagement/memberList')), 'chunkname-memberList');
// 直接开户
const userCreate = r => require.ensure([], () => r(require('@/components/agency/teamManagement/userCreate')), 'chunkname-userCreate');
// 链接开户
const linkCreate = r => require.ensure([], () => r(require('@/components/agency/teamManagement/linkCreate')), 'chunkname-linkCreate');
/* 团队记录 */
// 团队帐变
const teamZB = r => require.ensure([], () => r(require('@/components/agency/teamRecord/teamZB')), 'chunkname-teamZB');
// 团队投注
const teamBet = r => require.ensure([], () => r(require('@/components/agency/teamRecord/teamBet')), 'chunkname-teamBet');
// 团队充值
const teamRecharge = r => require.ensure([], () => r(require('@/components/agency/teamRecord/teamRecharge')), 'chunkname-teamRecharge');
// 团队提现
const teamWithdraw = r => require.ensure([], () => r(require('@/components/agency/teamRecord/teamWithdraw')), 'chunkname-teamWithdraw');
/* 团队充提 */
// 充值申请
const rechargeApply = r => require.ensure([], () => r(require('@/components/agency/teamPayment/rechargeApply')), 'chunkname-rechargeApply');
// 提现申请
const withdrawApply = r => require.ensure([], () => r(require('@/components/agency/teamPayment/withdrawApply')), 'chunkname-withdrawApply');

/* 报表中心 */
// 个人盈亏
const userProfit = r => require.ensure([], () => r(require('@/components/report/userProfit')), 'chunkname-userProfit');
// 团队盈亏
const teamProfit = r => require.ensure([], () => r(require('@/components/report/teamProfit')), 'chunkname-teamProfit');

/* 消息中心 */

/* 平台公告 */
// 平台公告
const notice = r => require.ensure([], () => r(require('@/components/message/notice')), 'chunkname-notice');
const noticeDetail = r => require.ensure([], () => r(require('@/components/message/noticeDetail')), 'chunkname-noticeDetail');

/* 站内信 */
// 收件箱
const inbox = r => require.ensure([], () => r(require('@/components/message/inmail/inbox')), 'chunkname-inbox');
// 发件箱
const outbox = r => require.ensure([], () => r(require('@/components/message/inmail/outbox')), 'chunkname-outbox');
// 发送信息
const messageSend = r => require.ensure([], () => r(require('@/components/message/inmail/messageSend')), 'chunkname-messageSend');
// 收件箱详情
const inboxDetail = r => require.ensure([], () => r(require('@/components/message/inmail/inboxDetail')), 'chunkname-inboxDetail');
const outboxDetail = r => require.ensure([], () => r(require('@/components/message/inmail/outboxDetail')), 'chunkname-outboxDetail');

/* 个人设置 */

/* 个人资料 */
// 基本信息
const basicInfo = r => require.ensure([], () => r(require('@/components/userSetting/userProfile/basicInfo')), 'chunkname-basicInfo');
// 联系方式
const contactInfo = r => require.ensure([], () => r(require('@/components/userSetting/userProfile/contactInfo')), 'chunkname-contactInfo');
// 修改密码
const passwordSetting = r => require.ensure([], () => r(require('@/components/userSetting/userProfile/passwordSetting')), 'chunkname-passwordSetting');

// 银行账户
const bankAccount = r => require.ensure([], () => r(require('@/components/userSetting/bankAccount')), 'chunkname-bankAccount');
// 联系代理
const agentContact = r => require.ensure([], () => r(require('@/components/userSetting/agentContact')), 'chunkname-agentContact');


Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/login',
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: {
        title: '首页',
        title_th: 'หน้าหลัก',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '登录',
        title_th: 'ล็อกอิน',
      },
    },
    {
      path: '/reg/*',
      name: 'reg',
      component: reg,
      meta: {
        title: '注册',
        title_th: 'สมัคร',
      },
    },
    {
      path: '/losePassword',
      name: 'losePassword',
      component: losePassword,
      meta: {
        title: '忘记密码',
        title_th: 'ลืมรหัส',
      },
    },
    {
      path: '/download',
      name: 'download',
      component: download,
      meta: {
        title: 'download',
        title_th: 'ดาวน์โหลด',
      },
    },
    {
      path: '/lotteryKind',
      name: 'lotteryKind',
      component: lotteryKind,
      meta: {
        title: '彩种',
        title_th: 'แทงหวย',
      },
    },
    {
      path: '/sscList',
      name: 'sscList',
      component: sscList,
      meta: {
        title: '时时彩',
        title_th: 'หวยยี่กี',
      },
    },
    {
      path: '/lotteryDetail',
      name: 'lotteryDetail',
      component: lotteryDetail,
      meta: {
        title: '投注',
        title_th: 'พนัน',
      },
    },
    {
      path: '/betsDetail',
      name: 'betsDetail',
      component: betsDetail,
      meta: {
        title: '开奖结果',
        title_th: 'ผลรางวัล',
      },
    },
    {
      path: '/timePrize',
      name: 'timePrize',
      component: timePrize,
      meta: {
        title: '开奖结果',
        title_th: 'ผลรางวัล',
      },
    },
    {
      path: '/lotteryPrize',
      name: 'lotteryPrize',
      component: lotteryPrize,
      meta: {
        title: '开奖结果',
        title_th: 'ผลรางวัล',
      },
    }, {
      path: '/recharge',
      name: 'recharge',
      component: recharge,
      meta: {
        title: '充值',
        title_th: 'ฝากเงิน',
      },
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: withdraw,
      meta: {
        title: '提现',
        title_th: 'ถอนเงิน',
      },
    },
    {
      path: '/accountRecord',
      name: 'accountRecord',
      component: accountRecord,
      meta: {
        title: '帐变记录',
        title_th: 'รายการยอดปรับเปลี่ยนในบัญชี',
      },
    },
    {
      path: '/betRecord',
      name: 'betRecord',
      component: betRecord,
      meta: {
        title: '投注记录',
        title_th: 'รายการแทง',
      },
    },
    {
      path: '/rechargeRecord',
      name: 'rechargeRecord',
      component: rechargeRecord,
      meta: {
        title: '充值记录',
        title_th: 'รายการฝากเงิน',
      }
    },
    {
      path: '/withdrawRecord',
      name: 'withdrawRecord',
      component: withdrawRecord,
      meta: {
        title: '提现记录',
        title_th: 'รายการถอนเงิน',
      }
    },
    {
      path: '/sponsoredLink',
      name: 'sponsoredLink',
      component: sponsoredLink,
      meta: {
        title: '推广链接',
        title_th: 'ลิ้งค์โปรโมท',
      }
    },
    {
      path: '/member',
      name: 'member',
      component: member,
      meta: {
        title: '会员',
        title_th: 'สมาชิก',
      }
    },
    {
      path: '/memberList',
      name: 'memberList',
      component: memberList,
      meta: {
        title: '会员列表',
        title_th: 'เมนูสมาชิก',
      }
    },
    {
      path: '/userCreate',
      name: 'userCreate',
      component: userCreate,
      meta: {
        title: '直接开户',
        title_th: 'เปิดบัญชีโดยตรง',
      }
    },
    {
      path: '/linkCreate',
      name: 'linkCreate',
      component: linkCreate,
      meta: {
        title: '链接开户',
        title_th: 'เปิดบัญชีผ่านลิ้งค์',
      }
    },
    {
      path: '/teamZB',
      name: 'teamZB',
      component: teamZB,
      meta: {
        title: '团队帐变',
        title_th: 'ยอดปรับเปลี่ยนของทีมสมาชิก',
      }
    },
    {
      path: '/teamRecharge',
      name: 'teamRecharge',
      component: teamRecharge,
      meta: {
        title: '团队充值',
        title_th: 'ฝาก',
      }
    },
    {
      path: '/teamBet',
      name: 'teamBet',
      component: teamBet,
      meta: {
        title: '团队投注',
        title_th: 'รายการแทงของทีมสมาชิก',
      }
    },
    {
      path: '/teamWithdraw',
      name: 'teamWithdraw',
      component: teamWithdraw,
      meta: {
        title: '团队提现',
        title_th: 'ถอน',
      }
    },
    {
      path: '/rechargeApply',
      name: 'rechargeApply',
      component: rechargeApply,
      meta: {
        title: '充值申请',
        title_th: 'แจ้งฝากเงิน',
      }
    },
    {
      path: '/withdrawApply',
      name: 'withdrawApply',
      component: withdrawApply,
      meta: {
        title: '提现申请',
        title_th: 'แจ้งถอนเงิน',
      }
    },
    {
      path: '/teamProfit',
      name: 'teamProfit',
      component: teamProfit,
      meta: {
        title: '团队盈亏',
        title_th: 'รายได้ของทีมสมาชิก',
      }
    },
    {
      path: '/userProfit',
      name: 'userProfit',
      component: userProfit,
      meta: {
        title: '个人盈亏',
        title_th: 'รายได้ส่วนบุคคล',
      }
    },
    {
      path: '/notice',
      name: 'notice',
      component: notice,
      meta: {
        title: '平台公告',
        title_th: 'ประกาศเว็บ',
      }
    },
    {
      path: '/noticeDetail',
      name: 'noticeDetail',
      component: noticeDetail,
      meta: {
        title: '平台公告详情',
        title_th: 'รายละเอียดประกาศเว็บ',
      }
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: inbox,
      meta: {
        title: '收件箱',
        title_th: 'กล่องรับจดหมาย',
      }
    },
    {
      path: '/outbox',
      name: 'outbox',
      component: outbox,
      meta: {
        title: '发件箱',
        title_th: 'กล่องส่งจดหมาย',
      }
    },
    {
      path: '/messageSend',
      name: 'messageSend',
      component: messageSend,
      meta: {
        title: '发送信息',
        title_th: 'ส่งข้อความ',
      }
    },
    {
      path: '/inboxDetail',
      name: 'inboxDetail',
      component: inboxDetail,
      meta: {
        title: '收件箱详情',
        title_th: 'รายละเอียดกล่องรับจดหมาย',
      }
    },
    {
      path: '/outboxDetail',
      name: 'outboxDetail',
      component: outboxDetail,
      meta: {
        title: '发件箱详情',
        title_th: 'รายละเอียดกล่องส่งจดหมาย',
      }
    },
    {
      path: '/basicInfo',
      name: 'basicInfo',
      component: basicInfo,
      meta: {
        title: '基本信息',
        title_th: 'ข้อมูลทั่วไป',
      }
    },
    {
      path: '/contactInfo',
      name: 'contactInfo',
      component: contactInfo,
      meta: {
        title: '联系方式',
        title_th: 'วิธีติดต่อ',
      }
    },
    {
      path: '/passwordSetting',
      name: 'passwordSetting',
      component: passwordSetting,
      meta: {
        title: '修改密码',
        title_th: 'เปลี่ยนรหัส',
      }
    },
    {
      path: '/bankAccount',
      name: 'bankAccount',
      component: bankAccount,
      meta: {
        title: '银行账户',
        title_th: 'บัญชีธนาคาร',
      }
    },
    {
      path: '/agentContact',
      name: 'agentContact',
      component: agentContact,
      meta: {
        title: '联系代理',
        title_th: 'ติดต่อเอเยนต์',
      }
    },
    {
      path: '/betRecordDetail',
      name: 'betRecordDetail',
      component: betRecordDetail,
      meta: {
        title: '投注详情',
        title_th: 'รายละเอียดยอดพนัน',
      }
    },
    {
      path: '/betOrderDetail',
      name: 'betOrderDetail',
      component: betOrderDetail,
      meta: {
        title: '投注详情',
        title_th: 'รายละเอียดยอดพนัน',
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    let lang = localStorage.getItem("candy-locale");
    // document.title = to.meta.title + ' - KingLotto';
    if(lang === 'zh'){
      document.title = to.meta.title + ' - KingLotto';
    }else{
      document.title = to.meta.title_th + ' - KingLotto';
    }
  }
  next()
})

export default router;
