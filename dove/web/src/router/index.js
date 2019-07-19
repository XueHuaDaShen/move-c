import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('@/components/index')), 'chunkname-index');
const reg = r => require.ensure([], () => r(require('@/components/reg')), 'chunkname-reg');
const download = r => require.ensure([], () => r(require('@/components/download')), 'chunkname-download');
const help = r => require.ensure([], () => r(require('@/components/help')), 'chunkname-help');
const slots = r => require.ensure([], () => r(require('@/components/slots')), 'chunkname-slots');
const liveCasino = r => require.ensure([], () => r(require('@/components/liveCasino')), 'chunkname-liveCasino');
// const gameDetail = r => require.ensure([], () => r(require('@/components/gameDetail')), 'chunkname-gameDetail');
const activityDetail = r => require.ensure([], () => r(require('@/components/activityDetail')), 'chunkname-activityDetail');
const personalPanel = r => require.ensure([], () => r(require('@/components/personalPanel/personalPanel')), 'chunkname-personalPanel');

const cashAccount = r => require.ensure([], () => r(require('@/components/personalPanel/cashAccount')), 'chunkname-cashAccount');

const coupon = r => require.ensure([], () => r(require('@/components/personalPanel/coupon/coupon')), 'chunkname-coupon');
const unused = r => require.ensure([], () => r(require('@/components/personalPanel/coupon/unused')), 'chunkname-unused');
const used = r => require.ensure([], () => r(require('@/components/personalPanel/coupon/used')), 'chunkname-used');
const expired = r => require.ensure([], () => r(require('@/components/personalPanel/coupon/expired')), 'chunkname-expired');

const deposit = r => require.ensure([], () => r(require('@/components/personalPanel/deposit/deposit')), 'chunkname-deposit');
const deposit_channel_1 = r => require.ensure([], () => r(require('@/components/personalPanel/deposit/channel_1')), 'chunkname-deposit_channel_1');
const deposit_channel_2 = r => require.ensure([], () => r(require('@/components/personalPanel/deposit/channel_2')), 'chunkname-deposit_channel_2');
const deposit_channel_3 = r => require.ensure([], () => r(require('@/components/personalPanel/deposit/channel_3')), 'chunkname-deposit_channel_3');

const withdrawal = r => require.ensure([], () => r(require('@/components/personalPanel/withdrawal/withdrawal')), 'chunkname-withdrawal');
const withdrawal_channel_1 = r => require.ensure([], () => r(require('@/components/personalPanel/withdrawal/channel_1')), 'chunkname-withdrawal_channel_1');
const withdrawal_channel_2 = r => require.ensure([], () => r(require('@/components/personalPanel/withdrawal/channel_2')), 'chunkname-withdrawal_channel_2');
const withdrawal_channel_3 = r => require.ensure([], () => r(require('@/components/personalPanel/withdrawal/channel_3')), 'chunkname-withdrawal_channel_3');

const refund = r => require.ensure([], () => r(require('@/components/personalPanel/refund/refund')), 'chunkname-refund');
const sponsoredLinks = r => require.ensure([], () => r(require('@/components/personalPanel/refund/sponsoredLinks')), 'chunkname-sponsoredLinks');
const myRefund = r => require.ensure([], () => r(require('@/components/personalPanel/refund/myRefund')), 'chunkname-myRefund');
const refundHistory = r => require.ensure([], () => r(require('@/components/personalPanel/refund/refundHistory')), 'chunkname-refundHistory');

const historyRecord = r => require.ensure([], () => r(require('@/components/personalPanel/historyRecord/historyRecord')), 'chunkname-historyRecord');
const rechargeRecord = r => require.ensure([], () => r(require('@/components/personalPanel/historyRecord/rechargeRecord')), 'chunkname-rechargeRecord');
const withdrawalsRecord = r => require.ensure([], () => r(require('@/components/personalPanel/historyRecord/withdrawalsRecord')), 'chunkname-withdrawalsRecord');
const transferRecord = r => require.ensure([], () => r(require('@/components/personalPanel/historyRecord/transferRecord')), 'chunkname-transferRecord');
const gameRecord = r => require.ensure([], () => r(require('@/components/personalPanel/historyRecord/gameRecord')), 'chunkname-gameRecord');

const personalSettings = r => require.ensure([], () => r(require('@/components/personalPanel/personalSettings/personalSettings')), 'chunkname-personalSettings');
const personalInformation = r => require.ensure([], () => r(require('@/components/personalPanel/personalSettings/personalInformation')), 'chunkname-personalInformation');
const changePassword = r => require.ensure([], () => r(require('@/components/personalPanel/personalSettings/changePassword')), 'chunkname-changePassword');

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      meta: {
        title: 'home',
        title_th: 'หน้าหลัก',
      },
    },
    {
      path: '/reg/*',
      name: 'reg',
      component: reg,
      meta: {
        title: 'register',
        title_th: 'สมัครแล้ว',
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
      path: '/help',
      name: 'help',
      component: help,
      meta: {
        title: 'help',
        title_th: 'ศูนย์ช่วยเหลือ',
      },
    },
    // {
    //   path: '/gameDetail',
    //   name: 'gameDetail',
    //   component: gameDetail,
    //   meta: {
    //     title: 'All Games',
    //     title_th: 'หน้าเกมล์',
    //   },
    // },,
    {
      path: '/slots',
      name: 'slots',
      component: slots,
      meta: {
        title: 'Slots',
        title_th: 'หน้าเกมล์',
      },
    },
    {
      path: '/liveCasino',
      name: 'liveCasino',
      component: liveCasino,
      meta: {
        title: 'Live Casino',
        title_th: 'หน้าเกมล์',
      },
    },
    {
      path: '/activityDetail',
      name: 'activityDetail',
      component: activityDetail,
      meta: {
        title: 'All Games',
        title_th: 'กิจกรรม',
      },
    },
    {
      path: '/personalPanel',
      component: personalPanel,
      children: [
        {
          path: '',
          redirect: '/cashAccount',
        },
        {
          path: '/cashAccount',
          name: 'cashAccount',
          component: cashAccount,
          meta: {
            title: 'Cash Account',
            title_th: 'Cash Account',
          },
        },
        {
          path: '/coupon',
          component: coupon,
          meta: {
            title: 'coupon',
            title_th: 'coupon',
          },
          children: [
            {
              path: '',
              redirect: '/unused',
            },
            {
              path: '/unused',
              name: 'unused',
              component: unused,
              meta: {
                title: 'coupon',
                title_th: 'coupon',
              },
            },
            {
              path: '/used',
              name: 'used',
              component: used,
              meta: {
                title: 'coupon',
                title_th: 'coupon',
              },
            },
            {
              path: '/expired',
              name: 'expired',
              component: expired,
              meta: {
                title: 'coupon',
                title_th: 'coupon',
              },
            }
          ]
        },
        {
          path: '/deposit',
          component: deposit,
          meta: {
            title: 'deposit',
            title_th: 'ฝากเงิน',
          },
          children: [
            {
              path: '',
              redirect: '/deposit_channel_1',
            },
            {
              path: '/deposit_channel_1',
              name: 'deposit_channel_1',
              component: deposit_channel_1,
              meta: {
                title: 'deposit',
                title_th: 'ฝากเงิน',
              },
            },
            {
              path: '/deposit_channel_2',
              name: 'deposit_channel_2',
              component: deposit_channel_2,
              meta: {
                title: 'deposit',
                title_th: 'ฝากเงิน',
              },
            },
            {
              path: '/deposit_channel_3',
              name: 'deposit_channel_3',
              component: deposit_channel_3,
              meta: {
                title: 'deposit',
                title_th: 'ฝากเงิน',
              },
            }
          ]
        },
        {
          path: '/withdrawal',
          component: withdrawal,
          meta: {
            title: 'withdrawal',
            title_th: 'แลกเป็นเงินสด',
          },
          children: [
            {
              path: '',
              redirect: '/withdrawal_channel_1',
            },
            {
              path: '/withdrawal_channel_1',
              name: 'withdrawal_channel_1',
              component: withdrawal_channel_1,
              meta: {
                title: 'withdrawal',
                title_th: 'แลกเป็นเงินสด',
              },
            },
            {
              path: '/withdrawal_channel_2',
              name: 'withdrawal_channel_2',
              component: withdrawal_channel_2,
              meta: {
                title: 'withdrawal',
                title_th: 'แลกเป็นเงินสด',
              },
            },
            {
              path: '/withdrawal_channel_3',
              name: 'withdrawal_channel_3',
              component: withdrawal_channel_3,
              meta: {
                title: 'withdrawal',
                title_th: 'แลกเป็นเงินสด',
              },
            }
          ]
        },
        {
          path: '/refund',
          component: refund,
          meta: {
            title: 'recommendation',
            title_th: 'แนะนำ',
          },
          children: [
            {
              path: '',
              redirect: '/sponsoredLinks',
            },
            {
              path: '/sponsoredLinks',
              name: 'sponsoredLinks',
              component: sponsoredLinks,
              meta: {
                title: 'recommendation',
                title_th: 'แนะนำ',
              },
            },
            {
              path: '/myRefund',
              name: 'myRefund',
              component: myRefund,
              meta: {
                title: 'recommendation',
                title_th: 'แนะนำ',
              },
            },
            {
              path: '/refundHistory',
              name: 'refundHistory',
              component: refundHistory,
              meta: {
                title: 'recommendation',
                title_th: 'แนะนำ',
              },
            }
          ]
        },
        {
          path: '/historyRecord',
          component: historyRecord,
          children: [
            {
              path: '',
              redirect: '/rechargeRecord',
            },
            {
              path: '/rechargeRecord',
              name: 'rechargeRecord',
              component: rechargeRecord,
              meta: {
                title: 'historyRecord',
                title_th: 'รายการบันทึกประวัติ',
              },
            },
            {
              path: '/withdrawalsRecord',
              name: 'withdrawalsRecord',
              component: withdrawalsRecord,
              meta: {
                title: 'historyRecord',
                title_th: 'รายการบันทึกประวัติ',
              },
            },
            {
              path: '/transferRecord',
              name: 'transferRecord',
              component: transferRecord,
              meta: {
                title: 'historyRecord',
                title_th: 'รายการบันทึกประวัติ',
              },
            },
            {
              path: '/gameRecord',
              name: 'gameRecord',
              component: gameRecord,
              meta: {
                title: 'historyRecord',
                title_th: 'รายการบันทึกประวัติ',
              },
            }
          ]
        },
        {
          path: '/personalSettings',
          component: personalSettings,
          children: [{
            path: '',
            redirect: '/personalInformation',
          }, {
            path: '/personalInformation',
            name: 'personalInformation',
            component: personalInformation,
            meta: {
              title: 'personalSettings',
              title_th: 'การตั้งค่าส่วนบุคคล',
            },
          }, {
            path: '/changePassword',
            name: 'changePassword',
            component: changePassword,
            meta: {
              title: 'personalSettings',
              title_th: 'การตั้งค่าส่วนบุคคล',
            },
          }]
        },
      ],
    }
  ]
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    let lang = localStorage.getItem("dove-web-locale");
    // document.title = to.meta.title + ' - King Slot';
    if(lang === 'en'){
      document.title = to.meta.title + ' - King Slot';
    }else{
      document.title = to.meta.title_th + ' - King Slot';
    }
  }
  next()
})

export default router;