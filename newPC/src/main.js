import Vue from 'vue';
import App from './App';
import router from './router';
import polyfill from 'babel-polyfill';
import 'url-search-params-polyfill';
import store from './store';
import ElementUI from 'element-ui';
import './utils/timeSpinnerPatch'; // 时间选择器分钟/秒5步进补丁

import './styles/theme/index.css';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import 'normalize.css/normalize.css'; // normalize.css 样式格式化
import './styles/index.scss'; // 全局自定义的css样式
import './components/Icon-svg/index'; // 封装的svg组件

import * as filters from './filters'; // 全局vue filter
import Multiselect from 'vue-multiselect'; // 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'; // 多选框组件css
import Sticky from './components/Sticky'; // 粘性header组件
import errLog from './store/errLog'; // error log组件
import Moment from 'moment';
import Backtool from '@/components/BackTool';
import Cookies from "js-cookie";
import Print from '@/utils/print';
import VueResource from 'vue-resource';
import wyWebUploader from 'wy-webUploader'
import {
    getWxCosFileSign,
    addWxfileInfo,
    delWxfileInfo
} from '@/api/common/common';

wyWebUploader().then(({ createUploader }) => {
    const uploader = createUploader({
        getWxCosFileSign,
        addWxfileInfo,
        delWxfileInfo
    })
    Vue.component('uploader', uploader);
})
//点击对话框外也不关闭对话框
ElementUI.Dialog.props.closeOnClickModal.default = false
// register globally
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.component('Backtool', Backtool);
Vue.use(ElementUI);
Vue.use(Print);
Vue.use(VueResource);

Vue.prototype.$moment = Moment; //时间处理库
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

// register global progress.
const whiteList = [
    '/prepage',
    '/login',
    'abcLogin',
    '/qrcodeLogin',
    'standalone',
    '/pcLogin',
    '/attendanceStatistics',
    '/interactUserList',
    '/classroomEvaluationApp/login',
    '/readBookBeiyouDisplay',
    '/refunRegisterLogin',
    '/addRefunRegister',
    '/signupStuTalentTable',
    '/studentAccessindex'
]; // 不重定向白名单
router.beforeEach((to, from, next) => {
    console.log(to,from)
    NProgress.start(); // 开启Progress
    sessionStorage.setItem('pcModuleCode', to.query.moduleCode || '');

    if (whiteList.some(item => to.path.includes(item))) { // 在免登录白名单，直接进入
        next();
    } else if (to.path.indexOf('/system/sysManage') !== -1 && to.query.userToken) { // 首次单点进入系统管理
        next();
    } else {
        store.commit('SET_PC_TYPE', window.location !== window.top.location ? 'standalone' : '');

        if (to.query.token) {
            Cookies.set('Admin-Token', to.query.token);
            store.dispatch('GetInfo').then(() => { // 拉取user_info
                if (to.meta.permissionPath) {
                    if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                        next('/401');
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            }).catch(err => {
                NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该 行！
            });
        } else {
            const matchArray = location.hash.match(/userToken=(.+?)(&|$)/);
            if (matchArray && window.standaloneHasLogin != 1) {
                window.standaloneHasLogin = 1;
                if (!window.sessionStorage.getItem('hasLogin')) {
                    Cookies.set('User-Token', matchArray[1]);
                    store.dispatch('FromOldFramework', matchArray[1]).then((res) => {
                        if (window.location !== window.top.location) {
                            store.commit('SET_PC_TYPE', 'standalone');
                            sessionStorage.setItem('standalone', 1);

                        } else {
                            store.commit('SET_PC_TYPE', '');
                            sessionStorage.setItem('standalone', 0);

                        }
                        // store.commit('SET_PC_TYPE', '');
                        sessionStorage.setItem('vuex_info', JSON.stringify(res.data.data));
                        if (to.meta.permissionPath) {
                            if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                                next('/401');
                            } else {
                                next();
                            }
                        } else {
                            next();
                        }
                    })
                        .catch(error => {
                        });
                } else {
                    if (to.meta.permissionPath) {
                        if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                            next('/401');
                        } else {
                            next();
                        }
                    } else {
                        next();
                    }
                }
            } else {
                if (store.getters.token) { // 判断是否有token

                    if (to.path === '/main' || to.path === '/kindergarten') {
                        sessionStorage.isFirstLoad = 1;
                    }
                    if (to.path === '/login') {
                        next({path: '/'});
                    } else {
                        if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
                            store.dispatch('GetInfo').then(() => { // 拉取user_info
                                if (to.meta.permissionPath) {
                                    if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                                        next('/401');
                                    } else {
                                        next();
                                    }
                                } else {
                                    next();
                                }
                            }).catch(err => {
                                NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
                            });

                        } else {
                            if (to.meta.permissionPath) {
                                if (store.getters.permission.indexOf(to.meta.permissionPath) === -1) {
                                    next('/401');
                                } else {
                                    next();
                                }
                            } else {
                                next();
                            }
                        }
                    }
                } else {
                    let url = '/prepage';
                    switch (window.sessionStorage.getItem('pc_login_type')) {
                        case 'normal':
                            url = '/prepage';
                            break;
                        case 'system':
                            window.location.href = global.command === 'production' ? 'http://www.zhxiaoyuan.cn/wxcepClient/success' : 'http://www.weixiaojia.net/wxcepClient/success';
                            break;
                        case 'boe':
                            window.location.href = global.command === '' ? 'http://www.zhxiaoyuan.cn/#/boe/homePage' : '';
                            break;
                        default:
                            break;
                    }
                    next(url); // 否则全部重定向到登录页
                }
            }

        }
    }
});


router.afterEach((to, from) => {
    NProgress.done(); // 结束Progress
});

// 生产环境错误日志
if (process.env === 'production') {
    Vue.config.errorHandler = function (err, vm) {
        errLog.pushLog({
            err,
            url: window.location.href,
            vm
        })
    };
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
