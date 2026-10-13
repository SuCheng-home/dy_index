import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 提醒详情
export const getBySchoolId = params =>
    fetch({
        url: 'structure/repairRemindSet/getBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 新增or修改提醒
export const insertOrUpdate = data =>
    fetch({
        url: 'structure/repairRemindSet/insertOrUpdate',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

