import Vue from 'vue'
import Router from 'vue-router'
// 登录
const login =  r => require.ensure([], () => r(require('@/components/login.vue')), 'login')
// 页面入口
const index =  r => require.ensure([], () => r(require('@/components/index.vue')), 'index')
// 主页
const home =  r => require.ensure([], () => r(require('@/components/home.vue')), 'home')
// 任务
const task =  r => require.ensure([], () => r(require('@/components/task/task.vue')), 'task')
// 数据
const data =  r => require.ensure([], () => r(require('@/components/data/data.vue')), 'data')
// 算法
const suanfa =  r => require.ensure([], () => r(require('@/components/suanfa/suanfa.vue')), 'suanfa')
// 配置文件
const configFile =  r => require.ensure([], () => r(require('@/components/configFile/configFile.vue')), 'configFile')
// 设置
const setting =  r => require.ensure([], () => r(require('@/components/setting/setting.vue')), 'setting')
// 用户管理
const userManager =  r => require.ensure([], () => r(require('@/components/userManager/userManager.vue')), 'userManager')
// 修改密码
const editPwd =  r => require.ensure([], () => r(require('@/components/editPwd/editPwd.vue')), 'editPwd')

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
          path: 'task',
          name: 'task',
          component: task
        },
        {
          path: 'data',
          name: 'data',
          component: data
        },
        {
          path: 'suanfa',
          name: 'suanfa',
          component: suanfa
        },
        {
          path: 'configFile',
          name: 'configFile',
          component: configFile
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
