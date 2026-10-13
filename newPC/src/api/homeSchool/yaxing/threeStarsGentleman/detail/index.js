import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 根据批次id查询批次详情
export const getThreeStarBatch = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarBatch',
        method: 'GET',
        params: filterURLSearchParams(params)
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