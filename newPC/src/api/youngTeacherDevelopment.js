import fetch from '@/utils/fetch';

/**
 * 获得学校青年教师考核维度列表
 **/
export function getSchoolYoungTeacherDimensionList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/youngTeacher/getSchoolYoungTeacherDimensionList',
        method: 'POST',
        params
    });
}

/**
 * 新增青年教师考核维度
 **/
export function addYoungTeacherDimension(args) {
    let params = new URLSearchParams();
    params.append('dimensionName', args.dimensionName);
    params.append('initScore', args.initScore);
    params.append('isOtherType', args.isOtherType);
    params.append('logoUrl', args.logoUrl);
    params.append('type', args.type);

    return fetch({
        url: 'structure/youngTeacher/addYoungTeacherDimension',
        method: 'GET',
        params
    });
}

/**
 * 编辑青年教师考核维度
 **/
export function editYoungTeacherDimension(args) {
    let params = new URLSearchParams();
    params.append('dimensionName', args.dimensionName);
    params.append('id', args.id);
    params.append('initScore', args.initScore);
    params.append('isOtherType', args.isOtherType);
    params.append('logoUrl', args.logoUrl);
    params.append('type', args.type);

    return fetch({
        url: 'structure/youngTeacher/editYoungTeacherDimension',
        method: 'GET',
        params
    });
}

/**
 * 删除青年教师考核维度
 **/
export function delYoungTeacherDimension(dimensionId) {
    let params = new URLSearchParams();
    params.append('dimensionId', dimensionId);

    return fetch({
        url: 'structure/youngTeacher/delYoungTeacherDimension',
        method: 'GET',
        params
    });
}

/**
 * 获得青年教师考核维度详细信息
 **/
export function getYoungTeacherDimensionInfo(dimensionId) {
    let params = new URLSearchParams();
    params.append('dimensionId', dimensionId);

    return fetch({
        url: 'structure/youngTeacher/getYoungTeacherDimensionInfo',
        method: 'GET',
        params
    });
}

/**
 ***** 考核项设置 *****
 **/
/**
 * 获得青年教师考核项列表
 **/
export function getDimensionTypeList(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);
    params.append('type', args.type);

    return fetch({
        url: 'structure/youngTeacher/getDimensionTypeList',
        method: 'GET',
        params
    });
}

/**
 * 新增青年教师考核项
 **/
export function addYoungTeacherDimensionType(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);
    params.append('stepScore', args.stepScore);
    params.append('title', args.title);
    params.append('type', args.type);

    return fetch({
        url: 'structure/youngTeacher/addYoungTeacherDimensionType',
        method: 'GET',
        params
    });
}

/**
 * 删除青年教师考核项
 **/
export function delYoungTeacherType(typeId) {
    let params = new URLSearchParams();
    params.append('typeId', typeId);

    return fetch({
        url: 'structure/youngTeacher/delYoungTeacherType',
        method: 'GET',
        params
    });
}

/**
 ***** 统计 *****
 **/
/**
 * 从考核得分列表获得考核维度列表
 **/
export function getYoungTeacherDimensionListFromScore(schoolTimeId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);

    return fetch({
        url: 'structure/youngTeacher/getYoungTeacherDimensionListFromScore',
        method: 'POST',
        params
    });
}

/**
 * 学校学期下教师考核得分汇总统计（分页）
 **/
export function getSchoolThDimScoreCollectPageList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/youngTeacher/getSchoolThDimScoreCollectPageList',
        method: 'POST',
        params
    });
}

/**
 * 获得教师维度考核分数列表
 **/
export function getThDimensionScoreDataList(args) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('teacherId', args.teacherId);

    return fetch({
        url: 'structure/youngTeacher/getThDimensionScoreDataList',
        method: 'POST',
        params
    });
}

/**
 * 获得教师维度考核分数明细列表（分页）
 **/
export function getThDimensionTypeScorePageList(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('teacherId', args.teacherId);

    return fetch({
        url: 'structure/youngTeacher/getThDimensionTypeScorePageList',
        method: 'POST',
        params
    });
}
