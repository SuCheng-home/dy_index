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


// 详情 教师荣誉
export const getById = params =>
    fetch({
        url: '/structure/teacherHonorRecord/getById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })