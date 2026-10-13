import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 根据学校id查询所有二级分组
export const getThreeStarGroupListAll = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarGroupListAll',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据批次id查询批次详情
export const getThreeStarBatch = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarBatch',
        method: 'GET',
        params: filterURLSearchParams(params)
    })


// 新增批次
export const addThreeStarBatch = data =>
    fetch({
        url: 'structure/threeStar/addThreeStarBatch',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改批次
export const updateThreeStarBatch = data =>
    fetch({
        url: 'structure/threeStar/updateThreeStarBatch',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })
