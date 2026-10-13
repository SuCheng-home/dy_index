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

// 查询周次列表
export const getSeveralWeekList = () =>
    fetch({
        url: 'structure/schoolTime/getSeveralWeekList',
        method: 'GET'
    })

// 学校课程表设置
export const classScheduleSet = data =>
    fetch({
        url: 'structure/classSchedule/classScheduleSet',
        method: 'POST',
        data: filterURLSearchParams(data)
    })

// 新增或发布研究课听课
export const insertStudySubject = data =>
    fetch({
        url: 'structure/studySubject/insertStudySubject',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 根据学校id获取学期列表
export const getSchoolTimeAllListBySchoolId = params =>
    fetch({
        url: 'structure/schoolTime/getSchoolTimeAllListBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据schoolTimeId获取学期的周次
export const getSeveralWeekListBySchoolTImeId = params =>
    fetch({
        url: 'structure/schoolTime/getSeveralWeekListBySchoolTImeId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// pc端分页获取学校研究听课,week=0时代表全部周次
export const queryStudySubject = params =>
    fetch({
        url: 'structure/studySubject/queryStudySubject',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 删除研究课听课
export const deleteStudySubject = params =>
    fetch({
        url: 'structure/studySubject/deleteStudySubject',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据听课id获取基础详情
export const getStudySubjectInfoById = params =>
    fetch({
        url: 'structure/studySubject/getStudySubjectInfoById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 编辑或发布研究课听课
export const editStudySubject = data =>
    fetch({
        url: 'structure/studySubject/editStudySubject',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 获取研究听课评价分析
export const getStudySubjectAnalysis = params =>
    fetch({
        url: 'structure/studySubject/getStudySubjectAnalysis',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 获取评价详情
export const getStudySubjectAppraiseDetails = params =>
    fetch({
        url: 'structure/studySubject/getStudySubjectAppraiseDetails',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 提醒未评价教师评价
export const remindAppraise = params =>
    fetch({
        url: 'structure/studySubject/remindAppraise',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 提醒未评价教师评价
export const deleteUserAppraise = params =>
    fetch({
        url: 'structure/studySubject/deleteUserAppraise',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 获得某个字典项的子字典项列表
export const getSchoolDicDetailsByTypeCode = data =>
    fetch({
        url: 'structure/schoolDictionary/getSchoolDicDetailsByTypeCode',
        method: 'POST',
        data: filterURLSearchParams(data)
    })

// 自主听课分析,week=0代表全部周
export const studySubjectOwnAnalysis = params =>
    fetch({
        url: 'structure/studySubject/studySubjectOwnAnalysis',
        method: 'GET',
        params: filterURLSearchParams(params)
    })


// 根据学期和周分页获取自主听课,week=0代表全部周
export const queryStudySubjectOwnBySchoolTimeIdAndWeek = params =>
    fetch({
        url: 'structure/studySubject/queryStudySubjectOwnBySchoolTimeIdAndWeek',
        method: 'GET',
        params: filterURLSearchParams(params)
    })