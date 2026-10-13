import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 根据学校id,开始日期结束日期查询得星统计详情
export const getSchoolStarCountDetail = params =>
    fetch({
        url: 'structure/threeStar/getSchoolStarCountDetail',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

