import fetch from '@/utils/fetch';
//园务日志列表(分页)(PC)
export function findSchoolLogListByPage(pageNo,pageSize,recordDate) {
    let params = new URLSearchParams();
    params.append('pageNo', pageNo);
    params.append('pageSize', pageSize);
    params.append('recordDate', recordDate);
    return fetch({
        url: 'structure/schoolLog/findSchoolLogListByPage',
        method: 'get',
        params
    });
}
//删除园务日志
export function delSchoolLog(schoolLogIds) {
    let params = new URLSearchParams();
    params.append('schoolLogIds', schoolLogIds);
    return fetch({
        url: 'structure/schoolLog/delSchoolLog',
        method: 'POST',
        data:params
    });
}
//修改园务日志
export function editSchoolLogSet(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolLog/editSchoolLogSet',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//初始化园务日志设置(没有则添加,有返回详情)
export function initSchoolLogSet() {
    return fetch({
        url: 'structure/schoolLog/initSchoolLogSet',
        method: 'get',
    });
}
//园务日志详情
export function getSchoolLogDetail(schoolLogId) {
    let params = new URLSearchParams();
    params.append('schoolLogId', schoolLogId);
    return fetch({
        url: 'structure/schoolLog/getSchoolLogDetail',
        method: 'POST',
        data:params
    });
}
//发布园务日志
export function publishSchoolLog(schoolLogId) {
    let params = new URLSearchParams();
    params.append('schoolLogId', schoolLogId);
    return fetch({
        url: 'structure/schoolLog/publishSchoolLog',
        method: 'POST',
        data:params
    });
}
//选日期切换出勤数和请假人数
export function selectDate(selectDate) {
    let params = new URLSearchParams();
    params.append('selectDate', selectDate);
    return fetch({
        url: 'structure/schoolLog/selectDate',
        method: 'get',
        params
    });
}
//新增园务日志
export function addSchoolLog(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolLog/addSchoolLog',
        method: 'post',
        data: JSON.stringify(args)
    });
}
/**
 * 获取所在部门
 */
export function queryDepartByUserId(userId,depType) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('depType', depType);
    return fetch({
        baseURL: global.BaseNewPath,
        url: 'api/user/depart/queryDepartByUserId',
        method: 'get',
        params
    });
}
//修改园务日志
export function editSchoolLog(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolLog/editSchoolLog',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//已读未读总人数
export function getReadAndNotReadByLogId(logId) {
    let params = new URLSearchParams();
    params.append('logId', logId);
    return fetch({
        url: 'structure/schoolLog/getReadAndNotReadByLogId',
        method: 'get',
        params
    });
}
//已读or未读列表
export function listReadByLogIdAndStateAndPage(pagination) {
    let params = new URLSearchParams();
    params.append('pageNo', pagination.pageNo);
    params.append('pageSize', pagination.pageSize);
    params.append('logId', pagination.logId);
    params.append('isRead', pagination.isRead);
    return fetch({
        url: 'structure/schoolLog/listReadByLogIdAndStateAndPage',
        method: 'get',
        params
    });
}