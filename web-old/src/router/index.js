import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  //	scrollBehavior: () => ({ x: 0,y: 0 }),
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'firstIndex',
      component: () => import('@/views/index')
    },
    {
      path: '/403',
      name: 'Err403',
      component: () => import('@/views/error/Error403')
    },
    {
      path: '/webOne',
      redirect: '/webOne/main'
    },
    {
      path: '/webOne/main',
      name: 'main',
      component: () => import('@/views/webOne/main'),
      children: [{
          path: '/',
          redirect: 'index'
        },
        {
          path: 'index',
          name: 'index',
          component: () => import('@/views/webOne/index/index')

        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/webTwo/search/search')
        },
        {
          path: 'searchDetail',
          name: 'searchDetail',
          component: () => import('@/views/webTwo/search/searchDetail')
        },
        {
          path: 'column',
          name: 'column',
          component: () => import('@/views/webOne/column/column'),
          children: [{
              path: '/',
              redirect: 'newlist'
            },
            {
              path: 'newlist',
              component: () => import('@/views/webOne/column/newList/index'),
              meta: {
                isCached: true
              }
            },
            {
              path: 'newdetail',
              component: () => import('@/views/webOne/column/newDetail/index')
            },
            {
              path: 'picList',
              component: () => import('@/views/webOne/column/picList/index')
            }
          ]
        },
        {
          path: 'detail',
          name: 'detail',
          component: () => import('@/views/webOne/detail/detail')
        }
      ]
    },
    {
      path: '/webTwo',
      redirect: '/webTwo/main'
    },
    {
      path: '/webTwo/main',
      name: 'main',
      component: () => import('@/views/webTwo/main'),
      children: [{
          path: '/',
          redirect: 'index'
        },
        {
          path: 'index',
          name: 'index',
          component: () => import('@/views/webTwo/index/index')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/webTwo/search/search')
        },
        {
          path: 'searchDetail',
          name: 'searchDetail',
          component: () => import('@/views/webTwo/search/searchDetail')
        },
        { // 校长邮箱 - 列表页
          path: 'headmaster/index',
          name: 'headmasterIndex',
          component: () => import('@/views/webTwo/headmasterBox/index')
        },
        { // 校长邮箱 - 新增页
          path: 'headmaster/form',
          name: 'headmasterForm',
          component: () => import('@/views/webTwo/headmasterBox/form')
        },
        { // 校长邮箱 - 列表页
          path: 'headmaster/detail',
          name: 'headmasterDetail',
          component: () => import('@/views/webTwo/headmasterBox/detail')
        },
        {
          path: 'column',
          name: 'column',
          component: () => import('@/views/webTwo/column/column'),
          children: [{
              path: '/',
              redirect: 'newlist'
            },
            {
              path: 'newlist',
              component: () => import('@/views/webTwo/column/newList/index'),
              meta: {
                isCached: true
              }
            },
            {
              path: 'newdetail',
              component: () => import('@/views/webTwo/column/newDetail/index')
            },
            {
              path: 'picList',
              component: () => import('@/views/webTwo/column/picList/index')
            }
          ]
        },
        {
          path: 'detail',
          name: 'detail',
          component: () => import('@/views/webTwo/detail/detail')
        }
      ]
    }
  ]
})
