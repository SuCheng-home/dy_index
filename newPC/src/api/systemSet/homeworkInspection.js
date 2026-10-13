import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 详情 设置详情
export const getBySchoolId = params =>
    fetch({
        url: 'structure/teacherWorkCheckSet/getBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 新增or修改
export const insert = data =>
    fetch({
        url: 'structure/teacherWorkCheckSet/insert',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })