import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 根据学校id,标题查询批次列表
export const getThreeStarBatchList = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarBatchList',
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

// 删除批次记录
export const delThreeStarBatch = params =>
    fetch({
        url: 'structure/threeStar/delThreeStarBatch',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

