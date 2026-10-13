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

// 根据班级id,批次id,查询三星小雅士
export const getThreeStarStuThreeList = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarStuThreeList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 提醒未评选班级
export const remindClassHeader = params =>
    fetch({
        url: 'structure/threeStar/remindClassHeader',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 批量新增三星小雅士
export const addThreeStarStuThreeList = data =>
    fetch({
        url: 'structure/threeStar/addThreeStarStuThreeList',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改三星小雅士
export const updateThreeStarStuThree = data =>
    fetch({
        url: 'structure/threeStar/updateThreeStarStuThree',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

