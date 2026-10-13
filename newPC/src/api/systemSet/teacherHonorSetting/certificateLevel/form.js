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

// 新增 证书级别
export const insert = data =>
    fetch({
        url: '/structure/teacherHonorCertLevel/insert',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改 证书级别
export const update = data =>
    fetch({
        url: '/structure/teacherHonorCertLevel/update',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })