import fetch from '@/utils/fetch';

// 代班统计
export function getSubstituteClassStatisticsData(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/supplyClass/getSubstituteClassStatisticsData',
        method: 'POST',
        params
    });
}

// 新增代班申请
export function addSubstituteClassApply(args) {
    let params = new URLSearchParams();
    params.append('adjustClassId', args.adjustClassId);
    params.append('adjustClassName', args.adjustClassName);
    params.append('adjustClassNo', args.adjustClassNo);
    params.append('adjustClassNoName', args.adjustClassNoName);
    params.append('adjustDate', args.adjustDate);
    params.append('createUserType', args.createUserType);
    params.append('state', args.state);
    params.append('substituteDayNum', args.substituteDayNum);
    params.append('substituteType', args.substituteType);
    params.append('supplyDate', args.supplyDate);
    params.append('supplyTeacherJson', args.supplyTeacherJson);
    params.append('reason', args.reason);
    params.append('startDayType', args.startDayType);
    return fetch({
        url: 'structure/supplyClass/addSubstituteClassApply',
        method: 'POST',
        data: params
    });
}

// 查询不同状态的代班列表（分页）
export function getSubstituteClassPageList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchDate', args.searchDate);
    params.append('state', args.state);
    params.append('supplyTeacherName', args.supplyTeacherName);

    return fetch({
        url: 'structure/supplyClass/getSubstituteClassPageList',
        method: 'POST',
        data: params
    });
}
// 查询不同状态的代课列表
export function getSubstituteClassList(args) {
    let params = new URLSearchParams();
    params.append('searchDate', args.searchDate);
    params.append('state', args.state);
    params.append('supplyTeacherName', args.supplyTeacherName);

    return fetch({
        url: 'structure/supplyClass/getSubstituteClassList',
        method: 'POST',
        data: params
    });
}
// 编辑代班申请

export function editSubstituteClassApply(args) {
    let params = new URLSearchParams();
    params.append('adjustClassId', args.adjustClassId);
    params.append('adjustClassName', args.adjustClassName);
    params.append('adjustClassNo', args.adjustClassNo);
    params.append('adjustClassNoName', args.adjustClassNoName);
    params.append('adjustDate', args.adjustDate);
    params.append('createUserType', args.createUserType);
    params.append('state', args.state);
    params.append('substituteDayNum', args.substituteDayNum);
    params.append('substituteType', args.substituteType);
    params.append('supplyDate', args.supplyDate);
    params.append('supplyTeacherJson', args.supplyTeacherJson);
    params.append('reason', args.reason);
    params.append('id', args.id);
    params.append('startDayType', args.startDayType);
    return fetch({
        url: 'structure/supplyClass/editSubstituteClassApply',
        method: 'POST',
        data: params
    });
}

// 获得代课调课详细信息
export function getSupplyAdjustClassInfo(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/supplyClass/getSupplyAdjustClassInfo',
        method: 'POST',
        data: params
    });
}

// 调课代课审批
export function examineSupplyAdjustClass(args) {
    let params = new URLSearchParams();
    params.append('adjustClassId', args.adjustClassId);
    params.append('adjustClassName', args.adjustClassName);
    params.append('adjustClassNo', args.adjustClassNo);
    params.append('adjustClassNoName', args.adjustClassNoName);
    params.append('adjustDate', args.adjustDate);
    params.append('createUserType', args.createUserType);
    params.append('substituteDayNum', args.substituteDayNum);
    params.append('substituteType', args.substituteType);
    params.append('supplyDate', args.supplyDate);
    params.append('reason', args.reason);


    params.append('examineRemark', args.examineRemark);
    params.append('id', args.id);
    params.append('state', args.state);
    params.append('supplyTeacherJson', args.supplyTeacherJson);

    return fetch({
        url: 'structure/supplyClass/examineSupplyAdjustClass',
        method: 'POST',
        data: params
    });
}

// 教务处主任删除代课调课
export function deleteSupplyClass(args) {
    let params = new URLSearchParams();
    params.append('supplyClassIds', args.supplyClassIds);

    return fetch({
        url: 'structure/supplyClass/deleteSupplyClass',
        method: 'POST',
        data: params
    });
}

// 时间段内教师被代班记录（分页）
export function getTeacherBDBList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('teacherId', args.teacherId);

    return fetch({
        url: 'structure/supplyClass/getTeacherBDBList',
        method: 'POST',
        data: params
    });
}
// 时间段内教师代班记录（分页）
export function getTeacherDBList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('teacherId', args.teacherId);

    return fetch({
        url: 'structure/supplyClass/getTeacherDBList',
        method: 'POST',
        data: params
    });
}
