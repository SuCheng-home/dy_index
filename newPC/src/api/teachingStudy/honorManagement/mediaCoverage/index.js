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

// 列表 媒体报道
export const listByModelAndPage = params =>
    fetch({
        url: '/structure/mediaReport/listByModelAndPage',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 删除 媒体报道
export const del = data =>
    fetch({
        url: '/structure/mediaReport/delete',
        method: 'POST',
        data: filterURLSearchParams(data)
    })