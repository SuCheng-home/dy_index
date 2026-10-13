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

// 列表 证书级别(全部)
export const listBySchoolId = params =>
    fetch({
        url: '/structure/teacherHonorCertLevel/listBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 删除 证书级别
export const del = data =>
    fetch({
        url: '/structure/teacherHonorCertLevel/delete',
        method: 'POST',
        data: filterURLSearchParams(data)
    })