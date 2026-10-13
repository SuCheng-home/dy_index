import Vue from 'vue'
import Router from 'vue-router'

/*errorPage*/
const Err404 = () => import('@/views/error/404');
const Err401 = () => import('@/views/error/401');

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [{
    path: '*',
    redirect: '/404'
  }, {
    path: '/',
    redirect: '/main'
  }, {
    path: '/404',
    component: Err404
  }, {
    path: '/401',
    component: Err401
  }, {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main'),
    children: [
      // {
      //   path:'/',
      //   redirect:'homePage'
      // },
      {
        path: 'homePage',
        name: 'homePage',
        component: () => import('@/views/homePage/homePage')
      },
      //网站设置的路由
      {
        path: 'webSetDetail',
        name: 'webSetDetail',
        component: () => import('@/views/homePage/webSetDetail'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      }, {
        path: 'webMoreAdd',
        name: 'webMoreAdd',
        component: () => import('@/views/homePage/webMoreAdd')
      }, {
        path: 'webSetEdit',
        name: 'webSetEdit',
        component: () => import('@/views/homePage/webSetEdit'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      }, {
        path: 'news',
        name: 'news',
        component: () => import('@/views/news/index'),
        children: [{
          path: '/',
          redirect: 'newsList',
        }, {
          path: 'newsList',
          name: 'newsList',
          component: () => import('@/views/news/newsList'),
          meta: {
            permissionPath: '/schoolWebTwo/schoolWebTwoMessage',
            isCached: true
          }
        }, {
          path: 'newsJia',
          name: 'newsJia',
          component: () => import('@/views/news/newsJia'),
          meta: {
            permissionPath: '/schoolWebTwo/schoolWebTwoMessage'
          }
        }, {
          path: 'editNews',
          name: 'editNews',
          component: () => import('@/views/news/editNews'),
          meta: {
            permissionPath: '/schoolWebTwo/schoolWebTwoMessage'
          }
        }, {
          path: 'newsDetail',
          name: 'newsDetail',
          component: () => import('@/views/news/newsDetail'),
          meta: {
            permissionPath: '/schoolWebTwo/schoolWebTwoMessage'
          }
        }, {
          path: 'myNewsList',
          name: 'myNewsList',
          component: () => import('@/views/news/myNewsList'),
          meta: {
            permissionPath: '/schoolWebTwo/getSchoolWebCreateUserMessageList',
            isCached: true
          }
        }, {
          path: 'myNewsJia',
          name: 'myNewsJia',
          component: () => import('@/views/news/myNewsJia'),
          meta: {
            permissionPath: '/schoolWebTwo/getSchoolWebCreateUserMessageList'
          }
        }, {
          path: 'myEditNews',
          name: 'myEditNews',
          component: () => import('@/views/news/myEditNews'),
          meta: {
            permissionPath: '/schoolWebTwo/getSchoolWebCreateUserMessageList'
          }
        }, {
          path: 'myNewsDetail',
          name: 'myNewsDetail',
          component: () => import('@/views/news/myNewsDetail'),
          meta: {
            permissionPath: '/schoolWebTwo/getSchoolWebCreateUserMessageList'
          }
        }, {
          path: 'newsSet',
          name: 'newsSet',
          component: () => import('@/views/news/newsSet'),
          meta: {
            permissionPath: '/schoolWebTwo/webManager'
          }
        }, {
          path: 'floatNewsList',
          name: 'floatNewsList',
          component: () => import('@/views/news/floatNewsList'),
          meta: {
            permissionPath: '/schoolWebTwo/webManager',
            isCached: true
          }
        }, {
          path: 'floatNewsJia',
          name: 'floatNewsJia',
          component: () => import('@/views/news/floatNewsJia'),
          meta: {
            permissionPath: '/schoolWebTwo/webManager'
          }
        }, {
          path: 'editFloatNews',
          name: 'editFloatNews',
          component: () => import('@/views/news/editFloatNews'),
          meta: {
            permissionPath: '/schoolWebTwo/webManager'
          }
        }, {
          path: 'headmasterNewsList',
          name: 'headmasterNewsList',
          component: () => import('@/views/news/headmasterNewsList'),
          meta: {
            permissionPath: '/schoolWebTwo/schoolWebTwoschoolMail',
            isCached: true
          }
        }, {
          path: 'headmasterNewsDetail',
          name: 'headmasterNewsDetail',
          component: () => import('@/views/news/headmasterNewsDetail'),
          meta: {
            permissionPath: '/schoolWebTwo/schoolWebTwoschoolMail'
          }
        }]
      }, {
        path: 'moduleType',
        name: 'moduleType',
        component: () => import('@/views/pcType/index')
      }, {
        path: 'pcTypeOne',
        name: 'pcTypeOne',
        component: () => import('@/views/pcType/pcTypeOne'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      }, {
        path: 'pcTypeOneEdit',
        name: 'pcTypeOneEdit',
        component: () => import('@/views/pcType/pcTypeOneEdit'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      }, {
        path: 'pcTypeTwo',
        name: 'pcTypeTwo',
        component: () => import('@/views/pcType/pcTypeTwo'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      }, {
        path: 'pcTypeTwoEdit',
        name: 'pcTypeTwoEdit',
        component: () => import('@/views/pcType/pcTypeTwoEdit'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      },
      // {
      //   path:'mobileType',
      //   name:'mobileType',
      //   component:() => import('@/views/mobileType/index')
      // },
      {
        path: 'mobileTypeOne',
        name: 'mobileTypeOne',
        component: () => import('@/views/mobileType/mobileTypeOne'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      }, {
        path: 'mobileTypeOneEdit',
        name: 'mobileTypeOneEdit',
        component: () => import('@/views/mobileType/mobileTypeOneEdit'),
        meta: {
          permissionPath: '/schoolWebTwo/webManager'
        }
      }, {
        path: 'webManage',
        name: 'webManage',
        component: () => import('@/views/webManage/index'),
        children: [{
          path: '/',
          redirect: 'columnList'
        }, {
          path: 'columnList',
          name: 'columnList',
          component: () => import('@/views/webManage/columnList')
        }, {
          path: 'addColumn',
          name: 'addColumn',
          component: () => import('@/views/webManage/addColumn'),
          meta: {
            permissionPath: '/schoolWebTwo/webManager'
          }
        }, {
          path: 'editColumn',
          name: 'editColumn',
          component: () => import('@/views/webManage/editColumn'),
          meta: {
            permissionPath: '/schoolWebTwo/webManager'
          }
        }, {
          path: 'columnDetail',
          name: 'columnDetail',
          component: () => import('@/views/webManage/columnDetail')
        }, {
          path: 'moduleList',
          name: 'moduleList',
          component: () => import('@/views/webManage/moduleList')
        }, {
          path: 'addModule',
          name: 'addModule',
          component: () => import('@/views/webManage/addModule')
        }, {
          path: 'editModule',
          name: 'editModule',
          component: () => import('@/views/webManage/editModule')
        }, {
          path: 'moduleDetail',
          name: 'moduleDetail',
          component: () => import('@/views/webManage/moduleDetail')
        }, {
          path: 'messageList',
          name: 'messageList',
          component: () => import('@/views/webManage/messageList'),
          meta: {
            isCached: true,
            // permissionPath: '/schoolWebTwo/webManager'
          }
        }, {
          path: 'messageJia',
          name: 'messageJia',
          component: () => import('@/views/webManage/messageJia'),
        }, {
          path: 'editMessage',
          name: 'editMessage',
          component: () => import('@/views/webManage/editMessage'),
        }, {
          path: 'messageDetail',
          name: 'messageDetail',
          component: () => import('@/views/webManage/messageDetail')
        }]
      }

    ]
  }]
})
