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
export const listBySchoolIdCertType = () =>
    fetch({
        url: '/structure/teacherHonorCertType/listBySchoolId',
        method: 'GET',
    })

// 列表 证书级别(全部)
export const listBySchoolIdCertLevel = params =>
    fetch({
        url: '/structure/teacherHonorCertLevel/listBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 列表 获奖等级(全部)
export const listBySchoolIdAwardLevel = () =>
    fetch({
        url: '/structure/teacherHonorAwardLevel/listBySchoolId',
        method: 'GET',
    })

// 列表 教师荣誉(统计)
export const statisticHonorByModelAndPage = params =>
    fetch({
        url: '/structure/teacherHonorRecord/statisticHonorByModelAndPage',
        method: 'GET',
        params: filterURLSearchParams(params)
    })