import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 查询分组列表
export const getThreeStarGroupList = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarGroupList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 新增分组
export const addThreeStarGroup = data =>
    fetch({
        url: 'structure/threeStar/addThreeStarGroup',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改分组
export const updateThreeStarGroup = data =>
    fetch({
        url: 'structure/threeStar/updateThreeStarGroup',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 根据id删除分组
export const delThreeStarGroupById = params =>
    fetch({
        url: 'structure/threeStar/delThreeStarGroupById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
