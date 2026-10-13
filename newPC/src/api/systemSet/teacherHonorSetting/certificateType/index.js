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

// 列表 证书类型(全部)
export const listBySchoolId = () =>
    fetch({
        url: '/structure/teacherHonorCertType/listBySchoolId',
        method: 'GET',
    })

// 新增 证书类型
export const insert = data =>
    fetch({
        url: '/structure/teacherHonorCertType/insert',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改 证书类型
export const update = data =>
    fetch({
        url: '/structure/teacherHonorCertType/update',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 删除 证书类型
export const del = params =>
    fetch({
        url: '/structure/teacherHonorCertType/delete',
        method: 'POST',
        params: filterURLSearchParams(params)
    })