import fetch from '@/utils/fetch';
import {systemFetch} from "@/utils/fetch";

//查询学校所有学期列表
export function getSchoolTimeAllList() {
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'get'
    });
}
//个人工作计划列表
export function getPersonWorkPlanList(schoolTimeId) {
    const params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    return fetch({
        url: 'structure/weekPlan/getPersonWorkPlanList',
        method: 'POST',
        data:params
    });
}
//根据id获取所在部门
export function queryDepartByUserId(userId) {
    let params = new URLSearchParams();
    params.append('depType', 7);
    params.append('userId', userId);
    return systemFetch({
        baseURL: global.BaseNewPath,
        url: 'api/user/depart/queryDepartByUserId',
        method: 'post',
        data: params
    });
}
//根据周次和学期ID获得周日期列表
export function getTermWeekAllDateList(schoolTimeId,weekNo) {
    const params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    params.append('weekNo', weekNo);
    return fetch({
        url: 'structure/weekPlan/getTermWeekAllDateList',
        method: 'POST',
        data:params
    });
}
//根据计划ID获得计划详细信息
export function getWorkPlanInfoById(id) {
    const params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/weekPlan/getWorkPlanInfoById',
        method: 'POST',
        data:params
    });
}
//新建工作计划内容
export function addWorkPlanContent(query) {
    const params = new URLSearchParams();
    params.append('conType', query.conType);
    params.append('content', query.content);
    params.append('dayDate', query.dayDate?query.dayDate:'');
    params.append('dayNo', query.dayNo);
    params.append('department', query.department);
    params.append('departmentId', query.departmentId);
    params.append('isSuper', query.isSuper);
    params.append('planId', query.planId);
    params.append('planWeek', query.planWeek);
    params.append('principalJson', query.principalJson);
    params.append('termId', query.termId);
    params.append('planType', query.planType);
    params.append('outEndDate', query.planType==1?query.outEndDate:'');
    params.append('outPlace', query.planType==1?query.outPlace:'');
    params.append('outStartDate', query.planType==1?query.outStartDate:'');
    params.append('title', query.planType==1?query.title:'');
    params.append('place', query.place);
    params.append('timeType', query.timeType);
    params.append('startTime', query.timeType == 4 ? query.startTime : '');
    params.append('endTime', query.timeType == 4 ? query.endTime : '');
    return fetch({
        url: 'structure/weekPlan/addWorkPlanContent',
        method: 'POST',
        data:params
    });
}
export function weekPlanAddCalendar(query) {
    const params = new URLSearchParams();
    params.append('approveState', 1);
    params.append('approveUserId', 0);
    // params.append('approveUserLoginName','');
    // params.append('approveUserName', query.dayNo);
    params.append('calContent', query.content);
    params.append('calName', query.title);
    params.append('calPlace', 2);
    params.append('calPlaceName', query.outPlace);
    params.append('calendarState', 1);
    params.append('endTime', query.outEndDate);
    params.append('remindRule', 1);
    params.append('remindRuleName', '不提醒');
    params.append('startTime', query.outStartDate);
    params.append('timeType', 4);
    params.append('userIdStr', query.userIdStr);
    return fetch({
        url: 'structure/calendar/weekPlanAddCalendar',
        method: 'POST',
        data:params
    });
}

//编辑工作计划内容
export function editWorkPlanContent(query) {
    const params = new URLSearchParams();
    params.append('content', query.content);
    params.append('department', query.department);
    params.append('departmentId', query.departmentId);
    params.append('isSuper', query.isSuper);
    params.append('principalJson', query.principalJson);
    params.append('id', query.id);
    params.append('outEndDate', query.planType==1?query.outEndDate:'');
    params.append('outPlace', query.planType==1?query.outPlace:'');
    params.append('outStartDate', query.planType==1?query.outStartDate:'');
    params.append('title', query.planType==1?query.title:'');
    params.append('place', query.place);
    params.append('timeType', query.timeType);
    params.append('startTime', query.timeType == 4 ? query.startTime : '');
    params.append('endTime', query.timeType == 4 ? query.endTime : '');
    return fetch({
        url: 'structure/weekPlan/editWorkPlanContent',
        method: 'POST',
        data:params
    });
}
//根据ID删除工作计划内容
export function delWorkPlanContentById(id) {
    const params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/weekPlan/delWorkPlanContentById',
        method: 'POST',
        data:params
    });
}
//调节内容顺序
export function adjustContentOrderNo(id) {
    const params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/weekPlan/adjustContentOrderNo',
        method: 'POST',
        data:params
    });
}
//部门工作计划列表
export function getDepartWorkPlanList(schoolTimeId,departId) {
    const params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    params.append('departId', departId);
    return fetch({
        url: 'structure/weekPlan/getDepartWorkPlanList',
        method: 'POST',
        data:params
    });
}
//获得部门下周待采用的个人计划列表
export function getDepartNotAdoptPlanContentList(departmentId,planWeek,termId) {
    const params = new URLSearchParams();
    params.append('departmentId', departmentId);
    params.append('planWeek', planWeek);
    params.append('termId', termId);
    return fetch({
        url: 'structure/weekPlan/getDepartNotAdoptPlanContentList',
        method: 'POST',
        data:params
    });
}
//条件查询工作计划信息
export function getWorkPlanInfoByParam(departId,weekNo,schoolTimeId,useType) {
    const params = new URLSearchParams();
    params.append('departId', departId);
    params.append('weekNo', weekNo);
    params.append('schoolTimeId', schoolTimeId);
    params.append('useType', useType);
    return fetch({
        url: 'structure/weekPlan/getWorkPlanInfoByParam',
        method: 'POST',
        data:params
    });
}
//采用与拒绝采用计划内容
export function useOrRefusePlanContent(id,state) {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('state', state);
    return fetch({
        url: 'structure/weekPlan/useOrRefusePlanContent',
        method: 'POST',
        data:params
    });
}
//新增计划（部门-学校计划备注时调用）
export function addWorkPlan(query) {
    const params = new URLSearchParams();
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('endDate', query.endDate);
    params.append('remarks', query.remarks);
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('startDate', query.startDate);
    params.append('useType', query.useType);
    params.append('weekNo', query.weekNo);
    params.append('mainWorks', query.mainWorks);
    return fetch({
        url: 'structure/weekPlan/addWorkPlan',
        method: 'POST',
        data:params
    });
}
//编辑计划（部门-学校计划备注时调用）
export function editWorkPlan(id,remarks,mainWorks) {
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('remarks', remarks);
    params.append('mainWorks', mainWorks);
    return fetch({
        url: 'structure/weekPlan/editWorkPlan',
        method: 'POST',
        data:params
    });
}
//发布计划-副本
export function publishWorkPlan(planId) {
    const params = new URLSearchParams();
    params.append('planId', planId);
    return fetch({
        url: 'structure/weekPlan/publishWorkPlan',
        method: 'POST',
        data:params
    });
}
//删除计划（部门-学校计划列表调用）-副本
export function delWorkPlan(id) {
    const params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/weekPlan/delWorkPlan',
        method: 'POST',
        data:params
    });
}
//学校工作计划列表
export function getSchoolWorkPlanList(schoolTimeId) {
    const params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    return fetch({
        url: 'structure/weekPlan/getSchoolWorkPlanList',
        method: 'POST',
        data:params
    });
}
//工作计划通知（个人）
export function getPersonWorkPlanNoticeList(termId,planWeek) {
    const params = new URLSearchParams();
    params.append('termId', termId);
    params.append('planWeek', planWeek);
    return fetch({
        url: 'structure/weekPlan/getPersonWorkPlanNoticeList',
        method: 'POST',
        data:params
    });
}
//工作计划通知（学校）
export function getSchoolWorkPlanNoticeList(termId,planWeek) {
    const params = new URLSearchParams();
    params.append('termId', termId);
    params.append('planWeek', planWeek);
    return fetch({
        url: 'structure/weekPlan/getSchoolWorkPlanNoticeList',
        method: 'POST',
        data:params
    });
}
//工作计划通知（部门）
export function getDepartWorkPlanNoticeList(termId,planWeek,departmentId) {
    const params = new URLSearchParams();
    params.append('termId', termId);
    params.append('planWeek', planWeek);
    params.append('departmentId', departmentId);
    return fetch({
        url: 'structure/weekPlan/getDepartWorkPlanNoticeList',
        method: 'POST',
        data:params
    });
}
//批量采用个人计划
export function batchAdoptDepartPlanContents(departmentId,planWeek,termId) {
    const params = new URLSearchParams();
    params.append('departmentId', departmentId);
    params.append('planWeek', planWeek);
    params.append('termId', termId);
    return fetch({
        url: 'structure/weekPlan/batchAdoptDepartPlanContents',
        method: 'POST',
        data:params
    });
}
//获得学校下周待采用的部门计划内容列表
export function getSchoolNotAdoptPlanContentList(planWeek,termId) {
    const params = new URLSearchParams();
    params.append('planWeek', planWeek);
    params.append('termId', termId);
    return fetch({
        url: 'structure/weekPlan/getSchoolNotAdoptPlanContentList',
        method: 'POST',
        data:params
    });
}
//批量采用部门计划
export function batchAdoptSchoolPlanContents(departmentId,planWeek,termId) {
    const params = new URLSearchParams();
    params.append('departmentId', departmentId);
    params.append('planWeek', planWeek);
    params.append('termId', termId);
    return fetch({
        url: 'structure/weekPlan/batchAdoptSchoolPlanContents',
        method: 'POST',
        data:params
    });
}
//查询用户所负责的部门和其他负责部门
export function getManageAndOtherDepart() {
    let params = new URLSearchParams();
    params.append('type', 7);
    return systemFetch({
        baseURL: global.BaseNewPath,
        url: 'api/depart/getManageAndOtherDepart',
        method: 'post',
        data: params
    });
}
//根据部门类型获得部门
export function queryDepartByType() {
    let params = new URLSearchParams();
    params.append('type', 7);
    return systemFetch({
        baseURL: global.BaseNewPath,
        url: 'api/depart/queryDepartByType',
        method: 'post',
        data: params
    });
}