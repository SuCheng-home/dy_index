import axios from 'axios'
import {
    Message
} from 'element-ui'
import store from '../store'
// import router from '../router';
import initEnv from '@/utils/initEnv'
import router from '@/router'
import Cookies from 'js-cookie'

import $ from 'jquery'

export function getAxiosService(serviceConfig = {}) {
    serviceConfig = Object.assign({}, {
            baseURL: global.BasePath,
            timeout: 10000,
            signApiList: [],
            withoutTokenList: [],
            isReturnData: false
        },
        serviceConfig
    )

    const signApiList = ['edu/', 'elasticLeave', 'dietaryStatistics', 'patrolLessonIndex']
    const withoutTokenList = [
        'login/fromOldFramework',
        'common/authCode/wx/card',
        '/interactUserList',
        // 'CampusCard',
        'getStudentInfoAndCardById',
        '/common/readIndepend'
    ]
    serviceConfig.signApiList = [...serviceConfig.signApiList, ...signApiList]
    serviceConfig.withoutTokenList = [...serviceConfig.withoutTokenList, ...withoutTokenList]

    // 创建axios实例
    const service = axios.create({
        baseURL: serviceConfig.baseURL, // api的base_url
        timeout: serviceConfig.timeout, // 请求超时时间
        transformRequest: [
            function (data, header) {
                if (header['content-type'] && header['content-type'].includes('json')) {
                    header.post = {
                        'Content-Type': header['content-type']
                    }
                    delete header['content-type']
                    return data
                } else {
                    if (data && serviceConfig.baseURL.includes('ucenter-web')) {
                        let params = new URLSearchParams()
                        for (let key of data.keys()) {
                            if (data.get(key) !== 'null' && data.get(key) !== 'undefined') {
                                params.append(key, data.get(key))
                            }
                        }
                        return params
                    } else {
                        return data
                    }
                }
            }
        ]
    })

    // request拦截器
    service.interceptors.request.use(
        config => {
            // $('button').prop('disabled', true);
            if (!config.params) {
                config.params = new URLSearchParams()
            }
            if (config.baseURL.includes('ucenter-web')) {
                let params = new URLSearchParams()
                for (let key of config.params.keys()) {
                    if (config.params.get(key) !== 'null' && config.params.get(key) !== 'undefined') {
                        params.append(key, config.params.get(key))
                    }
                }
                config.params = params
            }
            const signApiArray = serviceConfig.signApiList
            const withoutTokenArray = serviceConfig.withoutTokenList
            if (!config.params.has('token') && withoutTokenArray.every(item => config.url.indexOf(item) === -1)) {
                config.params.append('token', Cookies.get('Admin-Token'))
            }

            if (signApiArray.some(item => config.url.indexOf(item) !== -1)) {
                if (!config.params.has('sign')) {
                    const sign = window.sessionStorage.sign ? window.sessionStorage.sign : ''
                    config.params.append('sign', sign)
                }
            }
            if (serviceConfig.isArchive && !config.params.has('schoolYear')) {
                config.params.append('schoolYear', store.getters.selectedSchoolYear)
            }
            return config
        },
        error => {
            Promise.reject(error)
        }
    )

    // respone拦截器
    service.interceptors.response.use(
        response => {
            // $('button').prop('disabled', false);

            const code = response.data.code
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
            const blockedCode = [-1, 400, 401, 403, 404, 500, 1000, 1001, 1002, 1003, 1004, 1050, 1051, 1053, 1054, 1056]
            if (blockedCode.indexOf(code) !== -1) {
                if (code !== 1000 || !/userToken=(.+?)(&|$)/.test(window.location.hash)) {
                    Message({
                        message: response.data.msg,
                        dangerouslyUseHTMLString: true,
                        type: 'error',
                        duration: 3 * 1000
                    })
                }
                if (code === 1000) {
                    store
                        .dispatch('FedLogOut')
                        .then(res => {
                            if (!/userToken=(.+?)(&|$)/.test(location.hash)) {
                                if (window.location.href.indexOf('standalone') === -1 && window.sessionStorage.getItem('pc_login_type') !== 'system') {
                                    router.push({
                                        path: '/prepage'
                                    })
                                } else {
                                    setTimeout(() => {
                                        const url = window.location.href.indexOf('test') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net/wxcepClient/toLogin' : 'http://www.weixiaojia.cn/wxcepClient/toLogin'
                                        window.location.replace(url)
                                    }, 500)
                                }
                            }
                        })
                        .catch()
                }
                return Promise.reject({
                    code: response.data.code,
                    mes: response.data.msg
                })
            } else {
                return serviceConfig.isReturnData ? response.data : response
            }
        },
        error => {
            Message({
                message: error.message,
                type: 'error',
                duration: 3 * 1000
            })
            return Promise.reject(error)
        }
    )
    return service
}

const fetch = getAxiosService()
export default fetch

export const fetchData = getAxiosService({
    isReturnData: true
})

export const systemFetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.zhxiaoyuan.cn/ucenter-web/' : 'https://www.weixiaojia.net/ucenter-web/'
})

export const xjlyuanFetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.xjleyuan.com/growth-web/' : 'https://www.xwweixiao.com/growth-web/'
})
export const client1Fetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.xjleyuan.com/wxcepClient1/' : 'https://www.xwweixiao.com/wxcepClient1/'
})
export const wymsFetchNoProcess = getAxiosService({
    baseURL: global.command === 'production' ? 'https://wyms.weixiaojia.cn/wyms' : 'https://wyms.weixiaojia.net/wyms'
})
//新收费专用
export const newcharge = getAxiosService({
    baseURL: global.command === 'production' ? 'https://pay.zhxiaoyuan.cn/' : 'https://pay.weixiaojia.net/'
})
//校园一卡通
export const newcard = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.zhxiaoyuan.cn/card/' : 'https://www.weixiaojia.net/card/'
})
export const homeworkfetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/'
})
//晨检考勤机
export const wxcepInterface = getAxiosService({
    baseURL: global.command === 'production' ? 'http://api.weixiaojia.cn/wxcepInterface/' : 'https://api.weixiaojia.net/wxcepInterface/'
})
// 归档
export const archivedFetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/',
    isArchive: true
})
export const renlianfetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'https://api.weixiaojia.net/'
})
export function getFetchArgs(url = '', args = {}, method = 'GET', isJSON = false) {
    const params = new URLSearchParams()
    for (let key of Object.keys(args)) {
        params.append(key, args[key])
    }
    let obj = {
        url,
        method: isJSON ? 'POST' : method
    }
    if (isJSON) {
        obj.headers = {
            'content-type': 'application/json'
        }
        obj.data = JSON.stringify(args)
    } else {
        if (method === 'GET') {
            obj.params = params
        } else {
            obj.data = params
        }
    }
    console.log(obj)
    return obj
}
