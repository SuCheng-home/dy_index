// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import polyfill from 'babel-polyfill';
import 'url-search-params-polyfill';
import store from './store';
/*新增插件*/
import Moment from 'moment';
import ElementUI from 'element-ui';
import NProgress from 'nprogress'; // Progress 进度条
/*css*/
import 'element-ui/lib/theme-chalk/index.css';
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import 'normalize.css/normalize.css'; // normalize.css 样式格式化
import vueWaves from './directive/waves'; // 水波纹指令
import vshare from 'vshare';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(vshare);
//
router.beforeEach((to, from, next) => {
  let host = window.location.host;
  var hostLast = window.location.search;
  var hostLastVal = hostLast.substring(hostLast.lastIndexOf('=') + 1, hostLast.length);
  if (!store.getters.id && to.path.indexOf("403") == -1) {
    if (hostLast.indexOf("domain") !== -1 && hostLastVal) {
      store.dispatch('schoolWebInfoFun', {
        domain: hostLastVal
      }).then(res => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          var httpVal = window.location.protocol;
          console.log(httpVal, host)
          // www.njmx.cn:8080
          window.location = httpVal + '//' + host + '/webMobile';
          // window.location = "/webMobile"
        } else {
          let data = res.data.data;
          if (data) {
            document.getElementById('titleId').innerHTML = data.webName;
            let webId = data.id;
            let templateType = data.templateTypePc;
            if (templateType == 100001) {
              store.dispatch('pcHomeFun', {
                webId: webId,
                templateType: templateType
              }).then(res => {
                let data = res.data.data;
                let infoType = JSON.parse(data.initJson).infoType;
                var Link = document.querySelector(".skinLink");
                if (infoType == 1) {
                  Link.setAttribute("href", "./static/styles/skin.css");
                } else if (infoType == 2) {
                  Link.setAttribute("href", "./static/styles/skin2.css");
                } else if (infoType == 3) {
                  Link.setAttribute("href", "./static/styles/skin3.css");
                } else if (infoType == 4) {
                  Link.setAttribute("href", "./static/styles/skin4.css");
                }
                next();
              })
            } else if (templateType == 100002) {
              //跳转网站2，发送网站二的请求
              store.dispatch('pcHomeTwoFun', {
                webId: webId,
                templateType: templateType
              }).then(res => {
                let data = res.data.data;
                let infoType = JSON.parse(data.initJson).infoType;
                var Link = document.querySelector(".skinLink");
                if (infoType == 1) {
                  Link.setAttribute("href", "./static/styles2/skin.css");
                } else if (infoType == 2) {
                  Link.setAttribute("href", "./static/styles2/skin2.css");
                }
                next();
              })
            }
          } else {
            router.push({
              path: '/403'
            })
          }

        }

      }).catch(err => {})
    } else {
      store.dispatch('schoolWebInfoFun', {
        // domain: 'xzys.wxadt.cn'
        domain: host
      }).then(res => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          var httpVal = window.location.protocol;
          window.location = httpVal + '//' + host + '/webMobile';
          // window.location = "/webMobile"
        } else {
          let data = res.data.data;
          if (data) {
            document.getElementById('titleId').innerHTML = data.webName;
            let webId = data.id;
            let templateType = data.templateTypePc;
            if (templateType == 100001) {
              store.dispatch('pcHomeFun', {
                webId: webId,
                templateType: templateType
              }).then(res => {
                let data = res.data.data;
                let infoType = JSON.parse(data.initJson).infoType;
                var Link = document.querySelector(".skinLink");
                if (infoType == 1) {
                  Link.setAttribute("href", "./static/styles/skin.css");
                } else if (infoType == 2) {
                  Link.setAttribute("href", "./static/styles/skin2.css");
                } else if (infoType == 3) {
                  Link.setAttribute("href", "./static/styles/skin3.css");
                } else if (infoType == 4) {
                  Link.setAttribute("href", "./static/styles/skin4.css");
                }
                next();
              })
            } else if (templateType == 100002) {
              //跳转网站2，发送网站二的请求
              store.dispatch('pcHomeTwoFun', {
                webId: webId,
                templateType: templateType
              }).then(res => {
                let data = res.data.data;
                let infoType = JSON.parse(data.initJson).infoType;
                var Link = document.querySelector(".skinLink");
                if (infoType == 1) {
                  Link.setAttribute("href", "./static/styles2/skin.css");
                } else if (infoType == 2) {
                  Link.setAttribute("href", "./static/styles2/skin2.css");
                }
                next();
              })
            }
          } else {
            router.push({
              path: '/403'
            })
          }

        }

      }).catch(err => {})
    }
  } else {
    next();
  }
})
/*拓展全局方法*/
Vue.prototype.$moment = Moment;
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
