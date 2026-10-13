import fetch from '@/utils/fetch';

// 新增班级自主分区
export function addClassAutonomyZone(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('typeCode', args.typeCode);
    params.append('typeName', args.typeName);
    params.append('zoneLogo', args.zoneLogo);
    params.append('stuLimitCount', args.stuLimitCount);

    return fetch({
        url: 'structure/autonomyZone/addClassAutonomyZone',
        method: 'POST',
        data: params
    });
}

// 查询班级自主分区列表
export function getClassAutonomyZoneList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);

    return fetch({
        url: 'structure/autonomyZone/getClassAutonomyZoneList',
        method: 'POST',
        data: params
    });
}

// 删除班级自主分区
export function deleteClassAutonomyZoneById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/autonomyZone/deleteClassAutonomyZoneById',
        method: 'POST',
        data: params
    });
}

// 班级自主分区基础设置信息
export function getClassAutonomyZoneBasicInfo(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);

    return fetch({
        url: 'structure/autonomyZone/getClassAutonomyZoneBasicInfo',
        method: 'POST',
        data: params
    });
}

// 保存班级自主分区基础信息
export function saveClassAutonomyZoneBasic(args) {
    let params = new URLSearchParams();
    params.append('autoEndTime', args.autoEndTime);
    params.append('classId', args.classId);
    params.append('id', args.id);
    params.append('oneKeyRemove', args.oneKeyRemove);
    params.append('removePwd', args.removePwd);

    return fetch({
        url: 'structure/autonomyZone/saveClassAutonomyZoneBasic',
        method: 'POST',
        data: params
    });
}

// 按分区统计--各分区男女人数统计
export function getAllZoneGenderCountDataList(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/autonomyZone/getAllZoneGenderCountDataList',
        method: 'POST',
        data: params
    });
}
// 按分区统计--分区班级男女人列表统计 2023-11-07
export function getZoneClassGenderDataList(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('gender', args.gender);
    params.append('zoneTypeCode', args.zoneTypeCode);
    return fetch({
        url: 'structure/autonomyZone/getZoneClassGenderDataList',
        method: 'POST',
        data: params
    });
}

// 按分区统计--分区各班级男女人数统计
export function getZoneClassGenderCountDataList(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('zoneTypeCode', args.zoneTypeCode);

    return fetch({
        url: 'structure/autonomyZone/getZoneClassGenderCountDataList',
        method: 'POST',
        data: params
    });
}

// 按班级统计--时间段班级各分区人数统计
export function getPriodClassZoneCountDataList(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/autonomyZone/getPriodClassZoneCountDataList',
        method: 'POST',
        data: params
    });
}

// 按班级统计明细--时间段内班级学生各分区次数统计
export function getPriodClassStuZoneCountData(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/autonomyZone/getPriodClassStuZoneCountData',
        method: 'POST',
        data: params
    });
}

// 分区时长统计--时间段内班级学生各分区时长统计
export function getPriodClassStuDurationDataList(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/autonomyZone/getPriodClassStuDurationDataList',
        method: 'POST',
        data: params
    });
}

// 幼儿分区记录（分页）
export function getPriodClassStuZoneRecordPageList(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    params.append('gender', args.gender || 0);
    params.append('stuId', args.stuId || 0);

    return fetch({
        url: 'structure/autonomyZone/getPriodClassStuZoneRecordPageList',
        method: 'POST',
        data: params
    });
}

// 按分区统计--按月统计各分区人数
export function getPriodMonthZoneCountDataList(args) {
    let params = new URLSearchParams();
    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('zoneTypeCode', args.zoneTypeCode);

    return fetch({
        url: 'structure/autonomyZone/getPriodMonthZoneCountDataList',
        method: 'POST',
        data: params
    });
}
