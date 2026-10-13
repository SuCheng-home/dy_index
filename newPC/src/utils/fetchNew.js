import axios from 'axios';
import {Message} from 'element-ui';
import store from '../store';
// import router from '../router';
import initEnv from '@/utils/initEnv';
import router from '@/router';
import Cookies from 'js-cookie';
// 创建axios实例
const service = axios.create({
    baseURL: global.BaseNewPath, // api的base_url
    timeout: 30000, // 请求超时时间
    transformRequest: [function (data, header) {
        if(header['content-type'] && header['content-type'].includes('json')) {
            header.post = {
                'Content-Type': header['content-type']
            };
            delete header['content-type'];
            return data;
        } else {
            if (data && global.BaseNewPath.includes('ucenter-web')) {
                let params = new URLSearchParams();
                for (let key of data.keys()) {
                    if(data.get(key) !== 'null' && data.get(key) !== 'undefined') {
                        params.append(key, data.get(key));
                    }
                }
                return params;
            } else {
                return data;
            }
        }
    }],
});

// request拦截器
service.interceptors.request.use(config => {
    if (!config.params) {
        config.params = new URLSearchParams();
    }
    if(config.baseURL.includes('ucenter-web')) {
        let params = new URLSearchParams();
        for(let key of config.params.keys()) {
            if(config.params.get(key) !== 'null' && config.params.get(key) !== 'undefined') {
                params.append(key, config.params.get(key));
            }
        }
        config.params = params;
    }
    const withoutTokenArray = [
        'login/fromOldFramework',
        'common/authCode/wx/card',
        // 'CampusCard',
        'getStudentInfoAndCardById'
    ];
    if (!config.params.has('token') && withoutTokenArray.every(item => config.url.indexOf(item) === -1)) {
        config.params.append('token', Cookies.get('Admin-Token'));
    }

    const signRouteArray = [
        'edu/',
        'elasticLeave',
        'dietaryStatistics',
        'patrolLessonIndex'
    ];
    if (signRouteArray.some(item => config.url.indexOf(item) !== -1)) {
        if (!config.params.has('sign')) {
            const sign = window.sessionStorage.sign ? window.sessionStorage.sign : '';
            config.params.append('sign', sign);
        }
    }
    //
    // if (config.url.substring(0,4) === 'sys/' || config.url.substring(0,4) === 'api/') {
    //     config.url = global.BaseNewPath + config.url;
    // }
    return config;
}, error => {
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        const code = response.data.code;
        // code = 200; // 成功
        // code = 400; // 访问被禁止
        // code = 403; // 访问被禁止
        // code = 404; // 资源不存在
        // code = 500; // 内部服务器错误
        // code = 1000; // 登录超时
        // code = 1001; // 不合法的参数
        // code = 1002; // 不合法的请求格式
        // code = 1003; // 不合法的请求格式
        // code = 1004; // 需要HTTPS
        // code = 1050; // 账号或密码错误
        // code = 1051; // 该用户已被禁用
        // code = 1053; // 学校异常，请联系学校管理员
        // code = 1054; // 身份不允许登录
        // code = 1056; // 该账号不存在
        const blockedCode = [-1, 400, 403, 404, 500, 1000, 1001, 1002, 1003, 1004, 1050, 1051, 1053, 1054, 1056];
        if (blockedCode.indexOf(code) !== -1) {
            Message({
                message: response.data.msg,
                type: 'error',
                duration: 5 * 1000
            });
            if (code === 1000) {
                store.dispatch('FedLogOut').then(res => {
                    if(window.location.href.indexOf('standalone') === -1 && window.sessionStorage.getItem('pc_login_type') !== 'system') {
                        router.push({ path: '/prepage' })
                    } else {
                        setTimeout(() => {
                            const url = window.location.href.indexOf('test') !== -1 || window.location.href.indexOf('localhost') !== -1 ?
                                'https://www.weixiaojia.net/wxcepClient/toLogin' :
                                'http://www.weixiaojia.cn/wxcepClient/toLogin';
                            window.location.replace(url);
                        }, 500);
                    }
                }).catch();
            }
            return Promise.reject({code: response.data.code, mes: response.data.msg});
        } else {
            return response;
        }
    },
    error => {
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
)

export default service;
