import fetch from '@/utils/fetch';

/**
 * 老师请假初始化接口
 */
export function getTeacherAskleaveInitInfo() {
    return fetch({
        url: 'structure/teacherAskleave/getTeacherAskleaveInitInfo',
        method: 'post'
    });
}
export function addTeacherAskleave(query) {
    var params = new URLSearchParams();    
    params.append('content', query.content);
    params.append('operatType', 1);
    params.append('teacherId', query.teacherId);
    params.append('teacherName', query.teacherName);
    params.append('leaveType', query.leaveType);
    params.append('leaveTypeName', query.leaveTypeName);
    params.append('startDate', query.startDate);
    params.append('leaveDateCount', query.leaveDateCount);
    params.append('isMorning', query.isMorning);
    params.append('isMorningName', query.isMorningName);
    params.append('isHer', query.isHer);
    params.append('isClassHour', query.isClassHour);
    params.append('classHourCount', query.classHourCount);
    params.append('classHourName', query.classHourName);
    params.append('askleavePhotoJson', query.askleavePhotoJson);
    params.append('leaveState', query.leaveState);
    params.append('batchUserId', query.batchUserId);
    params.append('batchUserName', query.batchUserName);
    params.append('endTime', query.endTime);
    params.append('startTime', query.startTime);
    params.append('sickType', query.sickType);
    params.append('sickTypeName', query.sickTypeName);
    params.append('timeLenth', query.timeLenth);
    params.append('classCurrJson', query.classCurrJson);
    params.append('deductionJson', query.deductionJson);
    params.append('isAdjustable', query.isAdjustable);
    params.append('isDeduction', query.isDeduction);
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('adjustableRemark', query.adjustableRemark);
    params.append('deductionHour', Math.ceil(query.deductionHour));
    return fetch({
        url: 'structure/teacherAskleave/addTeacherAskleave',
        method: 'post',
        data: params
    });
}
// 当前学校某天设置的作息时间
export function listTimeByWeekDay(args) {
    var params = new URLSearchParams();
    params.append('weekDay', args.weekDay);
    params.append('customize', 0);

    return fetch({
        url: 'structure/scheduleTime/listTimeByWeekDay',
        method: 'GET',
        params
    });
}
export function getTeacherAskList(query) {
    var params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    return fetch({
        url: 'structure/teacherAskleave/getTeacherAskList',
        method: 'post',
        params
    });
}
export function getTeacherCanUseLeaveDeductionList(args) {
    var params = new URLSearchParams();
    params.append('leaveType', args.leaveType);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('searchDay', args.searchDay);

    return fetch({
        url: 'structure/overTimeDeduction/getTeacherCanUseLeaveDeductionList',
        method: 'get',
        params
    });
}
// 当前学校某天设置的作息时间
export function listTimeByWeekDayByDate(args) {
    var params = new URLSearchParams();
    params.append('secrchDate', args.secrchDate);
    params.append('isBeh', 0);
    params.append('customize', 0);
    return fetch({
        url: 'structure/scheduleTime/listTimeByWeekDayByDate',
        method: 'GET',
        params
    });
}
/**
 * 新增修改老师请假初始化设置
 */
export function addAndUpdateTeacherAskleaveInit(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('afterNoonHour', query.afterNoonHour);
    params.append('moringHour', query.moringHour);
    params.append('isDeduction', query.isDeduction);
    params.append('ruleJson', query.ruleJson);
    params.append('leaveTypeJson', query.leaveTypeJson);
    params.append('batchUserJson', query.batchUserJson);
    params.append('isHer', query.isHer);
    params.append('showStopFire', query.showStopFire);
    params.append('isSickTypeGroup', query.isSickTypeGroup);
    params.append('sickTypeJson', query.sickTypeJson);
    params.append('isDateAsk', query.isDateAsk);
    params.append('isClassHourAsk', query.isClassHourAsk);
    params.append('isTimeLenth', query.isTimeLenth);
    params.append('adjustableRimnd', query.adjustableRimnd);
    params.append('adjustableRimndJson', query.adjustableRimndJson);
    params.append('remindUserJson', query.remindUserJson);
    params.append('showAdjustable', query.showAdjustable);
    params.append('deductionMonLimtHonor', query.deductionMonLimtHonor);
    params.append('amStartTime', query.amStartTime);
    params.append('amEndTime', query.amEndTime);
    params.append('pmStartTime', query.pmStartTime);
    params.append('pmEndTime', query.pmEndTime);
    params.append('deductionSchTimeLimtHonor', query.deductionSchTimeLimtHonor);
    return fetch({
        url: 'structure/teacherAskleave/addAndUpdateTeacherAskleaveInit',
        method: 'post',
        data: params
    });
}
export function addTeacherAskleaveTypelimit(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/teacherAskleave/addTeacherAskleaveTypelimit',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function getTeacherAskleaveTypelimitList() {

    return fetch({
        url: 'structure/teacherAskleave/getTeacherAskleaveTypelimitList',
        method: 'get',
    });
}
export function delTeacherAskleaveTypelimit(args) {
    let params = new URLSearchParams();
    params.append('leaveType', args.leaveType);

    return fetch({
        url: 'structure/teacherAskleave/delTeacherAskleaveTypelimit',
        method: 'get',
        params
    });
}
