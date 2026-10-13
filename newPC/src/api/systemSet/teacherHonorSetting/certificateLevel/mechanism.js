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

// 列表 机构列表(不分页)
export const listByCertLevelId = params =>
    fetch({
        url: '/structure/teacherHonorCertLevelOrganization/listByCertLevelId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 新增 机构列表
export const insert = data =>
    fetch({
        url: '/structure/teacherHonorCertLevelOrganization/insert',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改 机构
export const update = data =>
    fetch({
        url: '/structure/teacherHonorCertLevelOrganization/update',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 删除 机构
export const del = data =>
    fetch({
        url: '/structure/teacherHonorCertLevelOrganization/delete',
        method: 'POST',
        data: filterURLSearchParams(data)
    })






