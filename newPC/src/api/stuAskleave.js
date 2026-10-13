import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
export function isOpenModule(moduleCode) {
    let params = new URLSearchParams();
    params.append('moduleCode', moduleCode ? moduleCode : 1213);
    return systemFetch({
        url: 'api/module/school/isOpenModule',
        method: 'GET',
        params
    })
}
// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 查询用户所负责的请假班级组
export const getUserAskleaveGroupList = params =>
    fetch({
        url: 'structure/stuAskleave/getUserAskleaveGroupList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据开始日期结束日期及班级组查询学生请假统计列表
export const getStuAskleaveStatisticalList = params =>
    fetch({
        url: 'structure/stuAskleave/getStuAskleaveStatisticalList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
// 接口名称根据开始日期结束日期查询各班请假人数 2024-06-03
export const getClassLeaveStuCountByDateScope = params =>
    fetch({
        url: 'structure/stuAskleave/getClassLeaveStuCountByDateScope',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据班级组及开始日期结束日期查询学生请假列表
export const getStuAskleaveListByClassIds = params =>
    fetch({
        url: 'structure/stuAskleave/getStuAskleaveListByClassIds',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据请假Id查询请假详情
export const getStuAskleaveInfo = params =>
    fetch({
        url: 'structure/stuAskleave/getStuAskleaveInfo',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id获取学期列表
export const getSchoolTimeAllListBySchoolId = params =>
    fetch({
        url: 'structure/schoolTime/getSchoolTimeAllListBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据分组及学期查询请假统计图表
export const getStatisticsSchoolTimeGroupTotalList = params =>
    fetch({
        url: 'structure/stuAskleave/getStatisticsSchoolTimeGroupTotalList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据疾病类型查询学生列表
export const getSchoolSickTypeClassStuList = params =>
    fetch({
        url: 'structure/stuAskleave/getSchoolSickTypeClassStuList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据分组及月份查询请假疾病统计图表
export const getStatisticsSchoolTimeGroupMonthList = params =>
    fetch({
        url: 'structure/stuAskleave/getStatisticsSchoolTimeGroupMonthList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据月份查询请假疾病列表
export const getStuListMonthListByGroupIdAndMonth = params =>
    fetch({
        url: 'structure/stuAskleave/getStuListMonthListByGroupIdAndMonth',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据日期学期查询学校疾病统计
export const getStatisticsSchoolSickType = params =>
    fetch({
        url: 'structure/stuAskleave/getStatisticsSchoolSickType',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据日期获取当日疾病学生列表
export const getStatisticsSchoolSickTypeStuList = params =>
    fetch({
        url: 'structure/stuAskleave/getStatisticsSchoolSickTypeStuList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据日期学期疾病id查询班班级疾病统计
export const getStatisticsClassSickType = params =>
    fetch({
        url: 'structure/stuAskleave/getStatisticsClassSickType',
        method: 'GET',
        params: filterURLSearchParams(params)
    })


/**
 * 根据学校id查询请假设置
 */
export function getStuAskleaveInitInfo(args) {
    const params = new URLSearchParams();
    params.append('schoolId', args.schoolId);

    return fetch({
        url: 'common/stuAskleave/getStuAskleaveInitInfo',
        method: 'GET',
        params
    });
}
export function getFireAnalysisByUserIdAndDateRange(query) {
    var params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    params.append('userId', query.userId);
    params.append('fireType', 2)
    if (query.myis) {
        return fetch({
            url: 'structure/fire/getFireAnalysisByUserIdAndDateRange',
            method: 'post',
            params
        });
    } else {
        return fetch({
            url: 'structure/repastManagement/getFireAnalysisByUserIdAndDateRange',
            method: 'post',
            params
        });
    }
}

/**
 * 根据分组Id查看班级分组信息
 * @param {*} groupId 
 */
export function getStuAskleaveGroupInfo(groupId) {
    let params = new URLSearchParams();
    params.append('groupId', groupId);
    return fetch({
        url: 'structure/stuAskleave/getStuAskleaveGroupInfo',
        method: 'post',
        data: params
    });
}
