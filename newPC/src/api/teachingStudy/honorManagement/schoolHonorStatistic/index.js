import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 获得学校下某个字典的字典值列表
export const findSchoolDicsByCode = data =>
    fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'POST',
        data: filterURLSearchParams(data)
    })

// 学校荣誉 - 列表-统计(分页)
export const statisticsSchoolHonorListByModel = params =>
    fetch({
        url: '/structure/schoolHonor2/statisticsSchoolHonorListByModel',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 学校荣誉 - 列表-统计(分页)
export const deleteSchoolHonor = params =>
    fetch({
        url: '/structure/schoolHonor2/deleteSchoolHonor',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
/**
 * 新增
 * */
export function addSchoolHonor(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolHonor2/addSchoolHonor',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 编辑
 * */
export function updateSchoolHonor(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolHonor2/updateSchoolHonor',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
