import axios from 'axios';
import {Message} from 'element-ui';
import initEnv from '@/utils/initEnv';
import router from '@/router';
import Cookie from 'js-cookie';

//创建axios实例
export function getAxiosService(serviceConfig={}){
    serviceConfig = Object.assign({}, {
        baseURL: global.BasePath,
        timeout: 10000
    }, serviceConfig);

    const service = axios.create({
        baseURL: serviceConfig.baseURL, // api的base_url
        timeout: serviceConfig.timeout // 请求超时时间
    });

    //request拦截器
    service.interceptors.request.use(config => {
        if (!config.params) {
            config.params = new URLSearchParams();
        }
        /*yjx*/
        /*if (!config.params.has('token')) {
            config.params.append('token', Cookies.get('Admin-Token'));
        }*/
        return config;
        // if (!config.params) {
        //     config.params = {}
        // }
        // if (config.params.token === undefined) {
        //     config.params.token = Cookies.get('Admin-Token');
        // }
        // return config;
    }, error => {
        // Do something with request error
        Promise.reject(error);
    })

    //response拦截器
    service.interceptors.response.use(
        response => {
            response
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
            if (code === -1 || code === 400 || code === 403 || code === 404 || code === 500 || code === 1000 || code === 1001 || code === 1002 || code === 1003 || code === 1004 || code === 1050 || code === 1051 ||  code === 1053 || code === 1054 ||  code === 1056) {
                Message({
                    message: response.data.msg,
                    type: 'error',
                    duration: 5 * 1000
                });
                /*yjx*/
                /*if (code === 1000) {
                    // 登出
                    store.dispatch('FedLogOut').then(res => {
                        router.push({ path: '/login' });
                    }).catch();
                }*/
                return Promise.reject({ code: response.data.code, mes: response.data.msg });


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

    return service;
}

const fetch=getAxiosService();

export default fetch;


export const systemFetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.zhxiaoyuan.cn/ucenter-web/' : 'https://www.weixiaojia.net/ucenter-web/'
});

