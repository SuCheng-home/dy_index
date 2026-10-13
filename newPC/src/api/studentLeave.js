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
// 学生请假列表
export function studentleaveList(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('classId', query.classId);
    params.append('leaveState', query.leaveState);
    params.append('studentName', query.studentName);

    return fetch({
        url: '/structure/stuAskleave/getStuAskleaveListByClassHead',
        method: 'GET',
        params
    });
}

/**
 * 获取学生请假版本二初始化设置
 */
export function getStuAskleaveInitInfo() {
    return fetch({
        url: '/structure/stuAskleave/getStuAskleaveInitInfo',
        method: 'GET'
    });
}

// 新增学生请假
export function addStuAskleaveByClassHeader(query) {
    let params = new URLSearchParams();
    params.append('studentId', query.studentId);
    params.append('stopFireClassNum', query.stopFireClassNum);
    params.append('stopFire', query.stopFire);
    params.append('startDate', query.startDate);
    params.append('sickTypeName', query.sickTypeName);
    params.append('sickType', query.sickType);
    params.append('leaveTypeName', query.leaveTypeName);
    params.append('leaveType', query.leaveType);
    params.append('leaveStateName', query.leaveStateName);
    params.append('leaveState', query.leaveState);
    params.append('leaveDateCount', query.leaveDateCount);
    params.append('isMorningName', query.isMorningName);
    params.append('isMorning', query.isMorning);
    params.append('isHer', query.isHer);
    params.append('isBatch', query.isBatch);
    params.append('hospital', query.hospital);
    params.append('content', query.content);
    params.append('askPhotoListJson', query.askPhotoListJson);
    params.append('medicalType', query.medicalType);
    params.append('symptomJson', query.symptomJson);
    params.append('showStopLimit', query.showStopLimit);
    params.append('breakMeal', query.breakMeal);
    params.append('supper', query.supper);
    params.append('isClassHour', query.isClassHour);
    params.append('startTime', query.startTime);
    params.append('endTime', query.endTime);
    params.append('classHourName', query.classHourName);
    params.append('classHourCount', query.classHourCount);
    params.append('endDate', query.startDate);
    params.append('liveType', query.liveType);

    return fetch({
        url: 'structure/stuAskleave/addStuAskleaveByClassHeader',
        method: 'post',
        data: params
    });
}

export function addStuAskleaveByClassHeaderList(args) {
    return fetch({
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        url: 'structure/stuAskleave/addStuAskleaveByClassHeaderList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}


//根据请假Id查询请假详情
export function getStuAskleaveInfo(query) {
    let params = new URLSearchParams();
    params.append('askId', query.askId);
    return fetch({
        url: 'structure/stuAskleave/getStuAskleaveInfo',
        method: 'GET',
        params
    });
}


// 获取停伙设置
export function getFireSet() {
    return fetch({
        url: 'structure/fire/getFireSet',
        method: 'get'
    });
}

/**
 * 学生请假统计
 */
export function getStuAskleaveThreeListByNum(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('leaveState', query.leaveState);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('studentName', query.studentName);

    return fetch({
        url: 'structure/stuAskleaveThree/getStuAskleaveThreeListByNum',
        method: 'GET',
        params
    });
}

/**
 * 学生请假详情
 */
export function getStuAskleaveThree(askId) {
    let params = new URLSearchParams();
    params.append('askId', askId);

    return fetch({
        url: 'structure/stuAskleaveThree/getStuAskleaveThree',
        method: 'GET',
        params
    });
}

/**
 * 根根学校id,开始日期，结束日期，状态，查询请假列表
 */
export function getStuAskleaveThreeList(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('leaveState', query.leaveState);
    params.append('startDate', query.startDate);

    return fetch({
        url: 'structure/stuAskleaveThree/getStuAskleaveThreeList',
        method: 'GET',
        params
    });
}

/**
 * 修改请假记录
 */
export function updateStuAskleaveThree(args) {

    return fetch({
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        url: 'structure/stuAskleaveThree/updateStuAskleaveThree',
        method: 'POST',
        data: JSON.stringify(args)
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
// 当前学校某天设置的作息时间
export function listTimeByWeekDay(weekDay) {
    var params = new URLSearchParams();
    params.append('weekDay', weekDay);
    params.append('customize', 0);
    return fetch({
        url: 'structure/scheduleTime/listTimeByWeekDay',
        method: 'GET',
        params
    });
}

export function updateStuAskLeaveListByBatch(args) {
    var params = new URLSearchParams();
    params.append('classHourCount', args.classHourCount);
    params.append('classHourName', args.classHourName);
    params.append('endTime', args.endTime);
    params.append('id', args.id);
    params.append('isClassHour', args.isClassHour);
    params.append('isMorning', args.isMorning);
    params.append('leaveDateCount', args.leaveDateCount);
    params.append('leaveType', args.leaveType);
    params.append('startDate', args.startDate);
    params.append('startTime', args.startTime);
    params.append('studentId', args.studentId);
    params.append('endDate', args.endDate);

    return fetch({
        url: 'structure/stuAskleave/updateStuAskLeaveListByBatch',
        method: 'POST',
        data: params
    });
}

// 学生请假列表
export function delStuAskleave(query) {
    let params = new URLSearchParams();
    params.append('askId', query.askId);

    return fetch({
        url: '/structure/stuAskleave/delStuAskleave',
        method: 'GET',
        params
    });
}
