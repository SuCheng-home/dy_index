import fetch from '@/utils/fetch';

//查询学校所有学期列表
export function getSchoolTimeAllList() {
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'POST'
    });
}
// 工作计划通知列表
export function findWorkPlanList(args) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('state', args.state);
    return fetch({
        url: 'structure/workPlan/findWorkPlanList?schoolTimeId='+args.schoolTimeId+'&state='+args.state,
        method: 'get',
        data: params
    });
}
/**
 * 根据id获取所在部门
 * @param {*} userId 
 * @param {*} depType 
 */
export function queryDepartByUserId(userId, depType) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('depType', depType);
    return fetch({
        baseURL: global.BaseNewPath,
        url: 'api/user/depart/queryDepartByUserId',
        method: 'post',
        data: params
    });
}
/**
 * 新增工作计划  
 */
export function addWorkPlan(query) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/addWorkPlan',
        method: 'post',
        data: JSON.stringify(query)
    });
}
/**
 *  发布工作计划
 */
export function publishWorkPlan(query) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/publishWorkPlan',
        method: 'post',
        data: JSON.stringify(query)
    });
}
/**
 * 查看工作计划
 */
export function getWorkPlan(id) {
    return fetch({
        url: 'structure/workPlan/getWorkPlan?batchId='+id,
        method: 'get',
    });
}
/**
 * 编辑工作计划
 */
export function updateWorkPlan(query) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/updateWorkPlan',
        method: 'post',
        data: JSON.stringify(query)
    });
}
/**
 * 删除
 */
export function deleteWorkPlan(id) {   
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/workPlan/deleteWorkPlan',
        method: 'post',
        data: params
    });
}

/**
 * 删除工作计划 明细(根据id)
 */
export function deletes(id){   
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/workPlan/deletePlanById',
        method: 'post',
        data: params
    });
}
/**
 * 初始化已上报且未发布的内容明细List的最小的开始时间和最大的结束时间
 */
export function getInitStartAndEndDate() {
    return fetch({
        url: 'structure/workPlan/getInitStartAndEndDate',
        method: 'get',
    });
}
/**
 * 查询所有的工作内容明细List(时间框change事件)
 */
export function findReportedWorkPlan(startDate,endDate) {
    return fetch({
        url: 'structure/workPlan/findReportedWorkPlan?endDate='+endDate+'&startDate='+startDate,
        method: 'get',
    });
}
/**
 * 根据开始时间和结束时间,获得周次名称
 */
export function getWorkPlanTitle(startDate,endDate) {
    return fetch({
        url: 'structure/workPlan/getWorkPlanTitle?endDate='+endDate+'&startDate='+startDate,
        method: 'get',
    });
}
/**
 *查询已发布的工作内容计划明细List (根据部门排序根据记录id)
 */
export function findPublishedWorkPlan(id) {
    return fetch({
        url: 'structure/workPlan/findPublishedWorkPlan?recordId='+id,
        method: 'get',
    });
}
/**
 * 新增工作计划明细
 */
export function addWorkPlanDetail(query) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/addWorkPlanDetail',
        method: 'post',
        data: JSON.stringify(query)
    });
}
/**
 * 修改工作计划明细
 */
export function updateWorkPlanDetail(query) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/updateWorkPlanDetail',
        method: 'post',
        data: JSON.stringify(query)
    });
}

/**
 * 查看已发布的工作计划
 */
export function getPublishedWorkPlan(publishId) {
    return fetch({
        url: 'structure/workPlan/getPublishedWorkPlan?publishId='+publishId,
        method: 'get',
    });
}
/**
 * 预览工作计划
 */
export function previewWorkPlan(query) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/previewWorkPlan',
        method: 'post',
        data: JSON.stringify(query)
    });
}
/**
 *  工作计划通知列表
 */
export function findPublishedWorkPlanList(schoolTimeId) {
    return fetch({
        url: 'structure/workPlan/findPublishedWorkPlanList?schoolTimeId='+schoolTimeId,
        method: 'get',
    });
}
/**
 *  查看最后一次编辑的发布信息
 */
export function getWorkPlanInfoSync() {
    return fetch({
        url: 'structure/workPlan/getWorkPlanInfoSync',
        method: 'get',
    });
}
/**
 * 更改排序号(异步保存)
 */
export function updateWorkPlanListSortNoSync(query){   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/updateWorkPlanListSortNoSync',
        method: 'post',
        data: JSON.stringify(query)
    });
}
/**
 * 异步保存发布信息
 */
export function addWorkPlanInfoSync(query){   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/addWorkPlanInfoSync',
        method: 'post',
        data: JSON.stringify(query)
    });
}
/**
 * 异步修改发布信息
 */
export function updateWorkPlanInfoSync(query){   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workPlan/updateWorkPlanInfoSync',
        method: 'post',
        data: JSON.stringify(query)
    });
}

/**
 * 查询用户所负责的部门列表
 */
export function getDepartListByUserId() {
    return fetch({
        url: 'depart/getDepartListByUserId?type=7',
        method: 'get',
    });
}
/**
 * 查询用户所负责的部门列表
 */
export function getDepartListByOtherManId() {
    return fetch({
        url: 'depart/getDepartListByOtherManId?type=7',
        method: 'get',
    });
}
