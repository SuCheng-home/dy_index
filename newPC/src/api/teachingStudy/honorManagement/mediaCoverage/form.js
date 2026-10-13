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

// 新增 媒体报道
export const insert = data =>
    fetch({
        url: '/structure/mediaReport/insert',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改 媒体报道
export const update = data =>
    fetch({
        url: '/structure/mediaReport/update',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 详情 媒体报道
export const getById = params =>
    fetch({
        url: '/structure/mediaReport/getById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })