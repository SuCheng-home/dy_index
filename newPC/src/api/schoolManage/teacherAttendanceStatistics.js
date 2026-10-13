import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';

// ---------------------  考勤统计  ---------------------------
/**
 * 今天考勤统计
 */
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key])
    });
    return params
}
export function todayAttendanceAnalysis(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);

    return fetch({
        url: 'structure/attendance/todayAttendanceAnalysis',
        method: 'GET',
        params
    });
}
export function getOutApplyCount(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/outApply/getOutApplyCount',
        method: 'GET',
        params
    });
}
export function getExtraUserCountBySchoolIdAndDateRange(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/extraWork/getExtraUserCountBySchoolIdAndDateRange',
        method: 'GET',
        params
    });
}
export function getTeacherRecordListByDate(args) {
    let params = new URLSearchParams();
    params.append('searchDate', args.searchDate);
    params.append('searchName', args.searchName);

    return fetch({
        url: 'structure/attendance/getTeacherRecordListByDate',
        method: 'GET',
        params
    });
}
export function getAttendanceRecordThListByMonth(month,schoolTimeId) {
    let params = new URLSearchParams();
    params.append('month', month);
     params.append('schoolTimeId', schoolTimeId);
    return fetch({
        url: 'structure/attendance/getAttendanceRecordThListByMonth',
        method: 'GET',
        params
    });
}

/**
 *  学校当天考勤类型分析，type,1迟到，2早退，3签到正常，4未签到,5签退正常，6未签退
 */
export function todayAttendanceTypeAnalysis(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('type', query.type);
    params.append('departId', query.departId || 0);
    params.append('startDate', query.startDate);
    params.append('endDate', query.endDate);

    return fetch({
        url: 'structure/attendance/todayAttendanceTypeAnalysis',
        method: 'POST',
        data: params
    });
}

/**
 * 一个时间段的学校考勤总统计
 */
export function attendanceAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);

    return fetch({
        url: 'structure/attendance/attendanceAnalysis',
        method: 'POST',
        data: params
    });
}

/**
 *  一个时间段的考勤类型分析，type,1代表迟到，2代表早退，3代表签到正常，4代表缺勤，5代表异常
 */
export function attendanceTypeAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('startDate', query.startDate);
    params.append('type', query.type);

    return fetch({
        url: 'structure/attendance/attendanceTypeAnalysis',
        method: 'POST',
        data: params
    });
}

/**
 *  考勤汇总
 */
export function attendanceUserAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('startDate', query.startDate);

    return fetch({
        url: 'structure/attendance/attendanceUserAnalysis',
        method: 'POST',
        data: params
    });
}

/**
 *  根据用户id和时间以及类型获取考勤记录
 */
export function attendanceTypeUser(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    params.append('type', query.type);
    params.append('userId', query.userId);

    return fetch({
        url: 'structure/attendance/attendanceTypeUser',
        method: 'POST',
        data: params
    });
}

/**
 *  补签，type,1补签到,2补签退，4全补,5异常补
 */
export function attendanceRetroactive(query) {
    let params = new URLSearchParams();
    params.append('recordId', query.recordId);
    params.append('type', query.type);

    return fetch({
        url: 'structure/attendance/attendanceRetroactive',
        method: 'POST',
        data: params
    });
}
/**
 * 一个时间段的学校考勤总统计
 */
export function getStatisticsTypeCount(date) {
    let params = new URLSearchParams();
    if (typeof date === 'string') {
        params.append('endDate', date);
        params.append('startDate', date);
    } else {
        params.append('endDate', date.endDate);
        params.append('startDate', date.startDate);
    }

    return fetch({
        url: 'structure/teacherAskleave/getStatisticsTypeCount',
        method: 'get',
        params
    });
}

/**
 * 根据部门类型获得信息（批量）
 * */
export function queryDepartByTypes(args) {
    let params = new URLSearchParams();
    params.append('types', args.types);

    return systemFetch({
        url: 'api/depart/queryDepartByTypes',
        method: 'GET',
        params
    })
}
export function getSchoolOvertimeDeductionStaticsByMonth(args) {
    let params = new URLSearchParams();

    params.append('monthStr', args.monthStr);

    return fetch({
        url: 'structure/overTimeDeduction/getSchoolOvertimeDeductionStaticsByMonth',
        method: 'get',
        params
    });
}
export function teacherAnalysisCollect(args) {
    let params = new URLSearchParams();

    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/attendance/teacherAnalysisCollect',
        method: 'get',
        params
    });
}


export function getGateInfoExceptionCount(args) {
    return fetch({
        url: 'structure/gateNew/getGateInfoExceptionCount',
        method: 'GET',
        params: filterURLSearchParams(args)
    });
}
export function getGateInfoExceptionList(args) {
    return fetch({
        url: 'structure/gateNew/getGateInfoExceptionList',
        method: 'GET',
        params: filterURLSearchParams(args)
    });
}