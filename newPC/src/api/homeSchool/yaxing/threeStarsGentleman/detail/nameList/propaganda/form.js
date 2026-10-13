import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 根据学生id,批次查询三星小雅士
export const getThreeStarStuThree = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarStuThree',
        method: 'GET',
        params: filterURLSearchParams(params)
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

