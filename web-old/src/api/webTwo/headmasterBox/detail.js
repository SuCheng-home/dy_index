import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 根据消息id查询校长信箱
export const getSchoolWebLetterBoxById = (params) =>
    fetch({
        url: '/common/schoolWebTwo/getSchoolWebLetterBoxById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })