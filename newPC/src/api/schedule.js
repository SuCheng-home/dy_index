import fetch from '@/utils/fetch';

// 获取设置详情
export function getCalendarSet() {
    return fetch({
        url: 'structure/calendar/getCalendarSet',
        method: 'get'
    });

}
//保存设置信息
export function addSetInfo(deptIdStr, userIdStr, needApprove, approveUserIdStr, showAskLeave, outAskLeave, leaveType, leaveTypeName, isAffirm, isRemindOut) {
    let params = new URLSearchParams();
    params.append('deptIdStr', deptIdStr);
    params.append('userIdStr', userIdStr);
    params.append('needApprove', needApprove);
    params.append('approveUserIdStr', approveUserIdStr);
    params.append('showAskLeave', showAskLeave);
    params.append('outAskLeave', outAskLeave);
    params.append('isAffirm', isAffirm);
    params.append('isRemindOut', isRemindOut);
    if (outAskLeave == 1) {
        params.append('leaveType', leaveType);
        params.append('leaveTypeName', leaveTypeName);

    }
    return fetch({
        url: 'structure/calendar/addSetInfo',
        method: 'post',
        data: params
    });

}
//日程统计
export function calendarCount(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('calPlace', listQuery.calPlace);
    params.append('startTime', listQuery.startTime);
    params.append('endTime', listQuery.endTime);
    return fetch({
        url: 'structure/calendar/calendarCount',
        method: 'get',
        params
    });

}

//查询学校所有学期列表
export function getSchoolTimeAllList() {
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'POST'
    });
}
