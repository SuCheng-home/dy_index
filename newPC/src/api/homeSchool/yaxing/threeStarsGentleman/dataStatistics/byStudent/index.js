import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 获取当前学期
export const getCurrentSchoolTimeBySchoolId = () =>
    fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'GET',
    })

// 根据学校id,开始日期结束日期查询学生列表
export const getStuStarCountDetail = params =>
    fetch({
        url: 'structure/threeStar/getStuStarCountDetail',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id查询所有二级分组
export const getThreeStarGroupListAll = params =>
    fetch({
        url: 'structure/threeStar/getThreeStarGroupListAll',
        method: 'GET',
        params: filterURLSearchParams(params)
    })