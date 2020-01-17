import Vue from 'vue'
import Router from 'vue-router'

// 入口
const index =  r => require.ensure([], () => r(require('@/components/index')), 'index')

// 首页
const home =  r => require.ensure([], () => r(require('@/components/home')), 'home')

// 核心技术
const technologyContent =  r => require.ensure([], () => r(require('@/components/technology/content')), 'technologyContent')

// 产品系列
const productContent =  r => require.ensure([], () => r(require('@/components/product/content')), 'productContent')
const productInfo =  r => require.ensure([], () => r(require('@/components/product/info')), 'productInfo')

// 解决方案
const solutionContent =  r => require.ensure([], () => r(require('@/components/solution/content')), 'solutionContent')
const solutionInfo =  r => require.ensure([], () => r(require('@/components/solution/info')), 'solutionInfo')

// 新闻中心
const newsContent =  r => require.ensure([], () => r(require('@/components/news/content')), 'newsContent')
const newsInfo =  r => require.ensure([], () => r(require('@/components/news/info')), 'newsInfo')

// 关于我们
const aboutUs =  r => require.ensure([], () => r(require('@/components/aboutUs/aboutUs.vue')), 'aboutUs')

// 加入我们
const joinUs =  r => require.ensure([], () => r(require('@/components/joinUs/joinUs.vue')), 'joinUs')



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      component: index,
      children: [
        {
          path: '',
          redirect: 'home',
        },
        {
          path: 'home',
          name: 'home',
          component: home,
        },
        {
          path: 'technologyContent',
          name: 'technologyContent',
          component: technologyContent,
        },
        {
          path: 'productContent',
          name: 'productContent',
          component: productContent,
        },
        {
          path: 'productInfo',
          name: 'productInfo',
          component: productInfo,
        },
        {
          path: 'solutionContent',
          name: 'solutionContent',
          component: solutionContent,
        },
        {
          path: 'solutionInfo',
          name: 'solutionInfo',
          component: solutionInfo,
        },
        {
          path: 'newsContent',
          name: 'newsContent',
          component: newsContent,
        },
        {
          path: 'newsInfo',
          name: 'newsInfo',
          component: newsInfo,
        },
        {
          path: 'aboutUs',
          name: 'aboutUs',
          component: aboutUs,
        },
        {
          path: 'joinUs',
          name: 'joinUs',
          component: joinUs,
        },
      ]
    }
  ]
})
