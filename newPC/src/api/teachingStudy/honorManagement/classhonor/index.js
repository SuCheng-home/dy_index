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

// 获得学校下某个字典的字典值列表
export const findSchoolDicsByCode = data =>
    fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'POST',
        data: filterURLSearchParams(data)
    })

// 查询学校所有学期列表
export const getSchoolTimeAllList = () =>
    fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'GET'
    })

// 根据学校id和学期id获取年级列表
export const getGradeByTermId = params =>
    fetch({
        url: 'structure/termClass/getGradeByTermId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id，学期id，年级id获取班级列表
export const getClassByGradeId = params =>
    fetch({
        url: 'structure/termClass/getClassByGradeId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 统计 班级荣誉(分页)
export const statisticsClassHonorListByModel = params =>
    fetch({
        url: 'structure/classHonor/statisticsClassHonorListByModel',
        method: 'GET',
        params: filterURLSearchParams(params)
    })