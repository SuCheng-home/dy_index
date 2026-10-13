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

// 根据网站Id,标题查询公开校长信箱列表
export const getPublicSchoolWebLetterBoxList = (params) =>
    fetch({
        url: '/common/schoolWebTwo/getPublicSchoolWebLetterBoxList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
