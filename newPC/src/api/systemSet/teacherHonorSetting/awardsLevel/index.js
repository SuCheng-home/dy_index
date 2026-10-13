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

// 列表 获奖等级(全部)
export const listBySchoolId = () =>
    fetch({
        url: '/structure/teacherHonorAwardLevel/listBySchoolId',
        method: 'GET',
    })

// 新增 获奖等级
export const insert = data =>
    fetch({
        url: '/structure/teacherHonorAwardLevel/insert',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改 获奖等级
export const update = data =>
    fetch({
        url: '/structure/teacherHonorAwardLevel/update',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 删除 获奖等级
export const del = params =>
    fetch({
        url: '/structure/teacherHonorAwardLevel/delete',
        method: 'POST',
        params: filterURLSearchParams(params)
    })

//查看荣誉设置
export function getBySchoolId(){
    let params = new URLSearchParams();
    return fetch({
      url: '/structure/teacherHonorSet/getBySchoolId',
      method: 'GET',
      params
    })
  }
//新增or修改
export function insertOrUpdate(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/teacherHonorSet/insertOrUpdate',
        method: 'POST',
        data: JSON.stringify(args)
    })
}