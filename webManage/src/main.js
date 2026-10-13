// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import polyfill from 'babel-polyfill';
import 'url-search-params-polyfill';
import store from './store';
import Cookies from 'js-cookie';
import initEnv from '@/utils/initEnv';
/*新增插件*/
import Moment from 'moment';
import ElementUI from 'element-ui';
import NProgress from 'nprogress'; // Progress 进度条
/*css*/
import 'element-ui/lib/theme-chalk/index.css';
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import 'normalize.css/normalize.css'; // normalize.css 样式格式化
import vueWaves from './directive/waves'; // 水波纹指令
import {
  checkPermission
} from '@/utils/utils';
import {
  refresh
} from '@/api/index';
import {
  fromOldFramework
} from '@/api/index';
Vue.config.productionTip = false
Vue.use(ElementUI);
document.title = "网站管理系统";

function refreshUrl(to, from, next) {
  // Cookies.set("webId",19);
  if (to.query.token) {
    Cookies.set('Admin-Token', to.query.token);
  }
  const token = Cookies.get('Admin-Token');

  console.log(token)
  if (token) {
    refresh(token).then(res => res.data)
      .then(data => {
        if (data.code === 200) {
          const loginData = data.data;
          store.dispatch('SET_TOKEN', {
            token: token
          }); //抛token
          store.dispatch('SET_LOGININFO', {
            userInfo: loginData.userPageModel,
            schoolInfo: loginData.schoolPageModel,
            departInfo: loginData.departList[0]
          });
          store.dispatch('getWebBasic');
          if (Cookies.get("webId")) {
            store.dispatch('getOneWebInfo', {
              webId: Cookies.get("webId")
            });
          }

          store.dispatch('GetPermission').then(() => {
            if (to.meta.permissionPath) {
              if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                next('/404');
              } else {
                next();
              }
            } else {
              next();
            }
          })
          // next();

        }

      }).catch(err => {
        NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
      });
  } else {
    next();
  }

}


router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if (!store.getters.token) {
    if (to.query.userToken) {
      fromOldFramework(to.query.userToken).then((res) => {
        if (res.data.code === 200) {
          const token = res.data.data.token;
          Cookies.set('Admin-Token', token);
          const loginData = res.data.data;
          store.dispatch('SET_TOKEN', {
            token: token
          }); //抛token
          store.dispatch('SET_LOGININFO', {
            userInfo: loginData.userPageModel,
            schoolInfo: loginData.schoolPageModel,
            departInfo: loginData.departList[0]
          });
          store.dispatch('getWebBasic');
          if (Cookies.get("webId")) {
            store.dispatch('getOneWebInfo', {
              webId: Cookies.get("webId")
            });
          }

          store.dispatch('GetPermission').then(() => {
            if (to.meta.permissionPath) {
              if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                next('/404');
              } else {
                next();
              }
            } else {
              next();
            }
          })
        }
      })
    } else {
      refreshUrl(to, from, next);
    }

  } else {
    if (to.meta.permissionPath) {
      if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
        next('/404');
      } else {
        next();
      }
    } else {
      next();
    }

  }
})
router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
/*拓展全局*/
Vue.prototype.$moment = Moment;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
