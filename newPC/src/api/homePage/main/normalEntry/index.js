import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 获得登录教师发展平台登录signKey
export const getTeacherDevelopSignKey = () =>
    fetch({
        url: 'structure/teacherDevelopPlatform/getTeacherDevelopSignKey',
        method: 'POST',
    })

// 获取集成应用列表
export const listIntegrateModule = () =>
    systemFetch({
        url: 'login/listIntegrateModule',
        method: 'GET',
    })

// 集成应用的跳转
export const gotoIntegrateModule = params =>
    systemFetch({
        url: 'login/gotoIntegrateModule',
        method: 'POST',
        params: filterURLSearchParams(params),
    })

// 获取智慧防疫跳转链接授权登录
export const getCovidAbcfyLoginaccess = () =>
    systemFetch({
        url: 'covidAbcfy/loginaccess',
        method: 'GET',
    })
