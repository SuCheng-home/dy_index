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

// 获得常用组名称列表和人数
export const getGroupByUserCount = () =>
    systemFetch({
        url: 'oneself/group/getGroupByUserCount',
        method: 'POST',
    })