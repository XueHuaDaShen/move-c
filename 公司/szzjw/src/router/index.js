import Vue from 'vue'
import Router from 'vue-router'
// // 登录
// const login =  r => require.ensure([], () => r(require('@/components/login.vue')), 'login')
// // 页面入口
// const index =  r => require.ensure([], () => r(require('@/components/index.vue')), 'index')
// // 主页
// const home =  r => require.ensure([], () => r(require('@/components/home.vue')), 'home')
// // 设备注册
// const deviceReg =  r => require.ensure([], () => r(require('@/components/deviceReg/deviceReg.vue')), 'deviceReg')
// // 设备管理
// const deviceStatus =  r => require.ensure([], () => r(require('@/components/deviceStatus/deviceStatus.vue')), 'deviceStatus')
// // 班组管理
// const groupManager =  r => require.ensure([], () => r(require('@/components/groupManager/groupManager.vue')), 'groupManager')
// // 通行记录
// const throughLog =  r => require.ensure([], () => r(require('@/components/throughLog/throughLog.vue')), 'throughLog')
// // 考勤统计
// const workLog =  r => require.ensure([], () => r(require('@/components/workLog/workLog.vue')), 'workLog')
// // 人员管理
// const peopleManager =  r => require.ensure([], () => r(require('@/components/peopleManager/peopleManager.vue')), 'peopleManager')
// // LED公告
// const led =  r => require.ensure([], () => r(require('@/components/led/led.vue')), 'led')
// // 系统设置
// const setting =  r => require.ensure([], () => r(require('@/components/setting/setting.vue')), 'setting')
// // 用户管理
// const userManager =  r => require.ensure([], () => r(require('@/components/userManager/userManager.vue')), 'userManager')
// // 修改密码
// const editPwd =  r => require.ensure([], () => r(require('@/components/editPwd/editPwd.vue')), 'editPwd')


// 登录
const login =  r => require.ensure([], () => r(require('@/components/login-axios.vue')), 'login')
// 页面入口
const index =  r => require.ensure([], () => r(require('@/components/index-axios.vue')), 'index')
// 主页
const home =  r => require.ensure([], () => r(require('@/components/home-axios.vue')), 'home')
// 设备注册
const deviceReg =  r => require.ensure([], () => r(require('@/components/deviceReg/deviceReg-axios.vue')), 'deviceReg')
// 设备管理
const deviceStatus =  r => require.ensure([], () => r(require('@/components/deviceStatus/deviceStatus-axios.vue')), 'deviceStatus')
// 班组管理
const groupManager =  r => require.ensure([], () => r(require('@/components/groupManager/groupManager-axios.vue')), 'groupManager')
// 通行记录
const throughLog =  r => require.ensure([], () => r(require('@/components/throughLog/throughLog-axios.vue')), 'throughLog')
// 考勤统计
const workLog =  r => require.ensure([], () => r(require('@/components/workLog/workLog-axios.vue')), 'workLog')
// 人员管理
const peopleManager =  r => require.ensure([], () => r(require('@/components/peopleManager/peopleManager-axios.vue')), 'peopleManager')
// LED公告
const led =  r => require.ensure([], () => r(require('@/components/led/led-axios.vue')), 'led')
// 系统设置
const setting =  r => require.ensure([], () => r(require('@/components/setting/setting-axios.vue')), 'setting')
// 用户管理
const userManager =  r => require.ensure([], () => r(require('@/components/userManager/userManager-axios.vue')), 'userManager')
// 修改密码
const editPwd =  r => require.ensure([], () => r(require('@/components/editPwd/editPwd-axios.vue')), 'editPwd')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      component: index,
      children: [
        {
          path: '',
          redirect: 'home'
        },
        {
          path: 'home',
          name: 'home',
          component: home
        },
        {
          path: 'deviceReg',
          name: 'deviceReg',
          component: deviceReg
        },
        {
          path: 'deviceStatus',
          name: 'deviceStatus',
          component: deviceStatus
        },
        {
          path: 'groupManager',
          name: 'groupManager',
          component: groupManager
        },
        {
          path: 'throughLog',
          name: 'throughLog',
          component: throughLog
        },
        {
          path: 'workLog',
          name: 'workLog',
          component: workLog
        },
        {
          path: 'peopleManager',
          name: 'peopleManager',
          component: peopleManager
        },
        {
          path: 'led',
          name: 'led',
          component: led
        },
        {
          path: 'setting',
          name: 'setting',
          component: setting
        },
        {
          path: 'userManager',
          name: 'userManager',
          component: userManager
        },
        {
          path: 'editPwd',
          name: 'editPwd',
          component: editPwd
        },
      ]
    }
  ]
})
