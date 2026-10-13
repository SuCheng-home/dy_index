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
//根据开始日期结束日期查询老师请假统计列表
export function getTeacherAskleaveStatisticalList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('departId', args.departId);
    return fetch({
        url: 'structure/teacherAskleave/getTeacherAskleaveStatisticalList',
        method: 'get',
        params
    });
}
//根据开始日期结束日期查询老师请假统计列表
export function getDepartList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    return fetch({
        url: 'structure/teacherAskleave/getDepartList',
        method: 'get',
        params
    });
}
//根据开始日期结束日期查询老师请假列表
export function getTeacherAskleaveList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('leaveType', args.leaveType);
    params.append('leaveState', args.leaveState);
    params.append('teacherName', args.teacherName);
    params.append('departId', args.departId);
    return fetch({
        url: 'structure/teacherAskleave/getTeacherAskleaveList',
        method: 'get',
        params
    });
}
//老师请假详情
export function getTeacherAskleaveInfo(askId) {
    let params = new URLSearchParams();
    params.append('askId', askId);
    return fetch({
        url: 'structure/teacherAskleave/getTeacherAskleaveInfo',
        method: 'get',
        params
    });
}

export function getFireAnalysisByUserIdAndDateList(query) {
    var params = new URLSearchParams();
    params.append('dateListStr', query.dateListStr);
    params.append('userId', query.userId);
    if (!query.fireType) {
        params.append('fireType', 1);
    } else {
        params.append('fireType', query.fireType);
    }
    return fetch({
        url: 'structure/fire/getFireAnalysisByUserIdAndDateList',
        method: 'post',
        params
    });
}

export function getFireAnalysisByUserIdAndDateRange(query) {
    var params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    params.append('userId', query.userId);
    if (!query.fireType) {
        params.append('fireType', 1);
    } else {
        params.append('fireType', query.fireType);
    }

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
