import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
/**
 * 查询学校所有学期列表
 * **/
export function getSchoolTimeAllList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'get',
        params
    });
}
// 班级学生德育评价统计列表（分页）
export function getClassConductCollectPageDataList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('gradeId', args.gradeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    // params.append('endDate', args.endDate);
    // params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/schoolConduct/getClassConductCollectPageDataList',
        method: 'POST',
        data: params
    })
}

export function getClassConductCollectPageDataList2(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('gradeId', args.gradeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('studentName', args.studentName);

    return fetch({
        url: 'structure/schoolConduct/getClassConductCollectPageDataList2',
        method: 'POST',
        data: params
    })
}

// 班级德育评价维度列表
export function getClassConductList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/schoolConduct/getClassConductList',
        method: 'POST',
        data: params
    })
}

// 分维度统计班级学生德育评价列表（列表）
export function getClassDimensionConductCollectPageList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('dimensionId', args.dimensionId);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/schoolConduct/getClassDimensionConductCollectPageList',
        method: 'POST',
        data: params
    })
}

// 班级学生德育评价统计维度表头列表
export function getClassDimensionTableHeaderList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
     params.append('pageNo', args.pageNo);
     params.append('pageSize', args.pageSize);
    //   params.append('endDate', args.endDate);
    //   params.append('startDate', args.startDate);
    return fetch({
        url: 'structure/schoolConduct/getClassDimensionTableHeaderList',
        method: 'POST',
        data: params
    });
    }
    // 班级学生德育评价统计维度表头列表
    export function getSchoolConductListByTh(args) {
        let params = new URLSearchParams();
        params.append('dimensionId', args.dimensionId);
        params.append('createUserName', args.createUserName);
        params.append('schoolTimeId', args.schoolTimeId);
        params.append('endDate', args.endDate);
        params.append('startDate', args.startDate);
        return fetch({
            url: 'structure/schoolConduct/getSchoolConductListByTh',
            method: 'get',
            params
        });
    }
// 获得维度下的评价类型列表
export function getAllDimensionConductTypeList(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);
    params.append('type', args.type);

    return fetch({
        url: 'structure/schoolConduct/getAllDimensionConductTypeList',
        method: 'POST',
        data: params
    });
}

// 学生德育评价明细
export function getStuConductDetailList(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('studentId', args.studentId);
    params.append('type', args.type);

    return fetch({
        url: 'structure/schoolConduct/getStuConductDetailList',
        method: 'POST',
        data: params
    });
}

// 学生德育各维度得分情况统计分析图
export function getStuConductStaticsInfo(args) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('classId', args.classId);
    params.append('studentId', args.studentId);

    return fetch({
        url: 'structure/schoolConduct/getStuConductStaticsInfo',
        method: 'POST',
        data: params
    });
}

// 获得学生维度下的各项得分情况
export function getStuDimensionStaticsData(args) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('studentId', args.studentId);
    params.append('dimensionId', args.dimensionId);
    params.append('type', args.type);

    return fetch({
        url: 'structure/schoolConduct/getStuDimensionStaticsData',
        method: 'POST',
        data: params
    });
}
// 获得年级列表
export function getGradeListByTermId(schoolTimeId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    return fetch({
        url: 'structure/schoolConduct/getGradeListByTermId',
        method: 'POST',
        data: params
    });
}
//获得年级下的班级列表
export function getGradeClassList(schoolTimeId, gradeId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    params.append('gradeId', gradeId);
    return fetch({
        url: 'structure/schoolConduct/getGradeClassList',
        method: 'POST',
        data: params
    });
}
// 获得学校德育评价维度列表
export function getSchoolConductDimensionList() {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductDimensionList',
        method: 'post',
    });
}

// 删除德育评价维度
export function deleteConductDimension(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);

    return fetch({
        url: 'structure/schoolConduct/deleteConductDimension',
        method: 'post',
        data: params
    });
}

// 新增德育评价维度
export function addSchoolConductDimension(args) {
    let params = new URLSearchParams();
    params.append('dayMaxScord', args.dayMaxScord);
    params.append('dimensionName', args.dimensionName);
    params.append('initScore', args.initScore);
    params.append('isAllUse', args.isAllUse);
    params.append('type', args.type);
    params.append('assessTimeJson', args.assessTimeJson);
    params.append('maxPerson', args.maxPerson);
    params.append('maxType', args.maxType);
    params.append('isOtherType', args.isOtherType);
    params.append('logoUrl', args.logoUrl);
    params.append('orderNum', args.orderNum);
    params.append('typeCode', args.typeCode);
    params.append('typeTitle', args.typeTitle);
    params.append('isOtherTypeLess', args.isOtherTypeLess);
    return fetch({
        url: 'structure/schoolConduct/addSchoolConductDimension',
        method: 'post',
        data: params
    });
}

// 根据ID获得德育评价维度信息详情
export function getConductDimensionInfoById(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);

    return fetch({
        url: 'structure/schoolConduct/getConductDimensionInfoById',
        method: 'post',
        data: params
    });
}

// 编辑德育评价维度

export function editSchoolConductDimension(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    params.append('dayMaxScord', args.dayMaxScord);
    params.append('dimensionName', args.dimensionName);
    params.append('initScore', args.initScore);
    params.append('isAllUse', args.isAllUse);
    params.append('type', args.type);
    params.append('assessTimeJson', args.assessTimeJson);
    params.append('maxPerson', args.maxPerson);
    params.append('maxType', args.maxType);
    params.append('isOtherType', args.isOtherType);
    params.append('logoUrl', args.logoUrl);
    params.append('orderNum', args.orderNum);
    params.append('typeCode', args.typeCode);
    params.append('typeTitle', args.typeTitle);
    params.append('isOtherTypeLess', args.isOtherTypeLess);
    return fetch({
        url: 'structure/schoolConduct/editSchoolConductDimension',
        method: 'post',
        data: params
    });
}

// 获得维度下的评价类型列表
export function getDimensionConductTypeList(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);
    params.append('type', args.type);

    return fetch({
        url: 'structure/schoolConduct/getDimensionConductTypeList',
        method: 'post',
        data: params
    });
}
// 删除德育评价类型
export function deleteDimensionConductType(args) {
    let params = new URLSearchParams();
    params.append('behTypeIds', args.behTypeIds);

    return fetch({
        url: 'structure/schoolConduct/deleteDimensionConductType',
        method: 'post',
        data: params
    });
}

// 新增维度评价类型
export function addDimensionConductType(args) {
    let params = new URLSearchParams();
    params.append('dimensionId', args.dimensionId);
    params.append('title', args.title);
    params.append('type', args.type);
    params.append('cover', args.cover);
    params.append('remark', args.remark);

    return fetch({
        url: 'structure/schoolConduct/addDimensionConductType',
        method: 'post',
        data: params
    });
}
export function updateSchoolConductType(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/updateSchoolConductType',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//判断用户是否具备某角色
export function possessRole(roleConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', roleConstantId);
    return systemFetch({
        url: 'api/user/role/possessRole',
        method: 'GET',
        params
    });
}
//保存学校德育评价提醒设置信息
export function saveSchoolConductRemindInfo(args) {
    let params = new URLSearchParams();
    params.append('isSendManger', args.isSendManger);
    params.append('isSendParent', args.isSendParent);
    params.append('isSendTh', args.isSendTh);
    params.append('remindHeader', args.remindHeader);
    params.append('reportUserJson', args.reportUserJson);
    params.append('sendParentAdd', args.sendParentAdd);
    params.append('sendParentLess', args.sendParentLess);
    params.append('isClassHeader', args.isClassHeader);
    params.append('headerUrl', args.headerUrl);
    params.append('isInputScore', args.isInputScore);
    return fetch({
        url: 'structure/schoolConduct/saveSchoolConductRemindInfo',
        method: 'POST',
        data: params
    });
}
//获得学校德育提醒设置信息
export function getSchoolConductRemindInfo() {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductRemindInfo',
        method: 'POST'
    });
}

// 根据评价维度ID和评价项ID查询评价列表
export function getDimensionBehTypeScoreList(args) {
    let params = new URLSearchParams();
    params.append('behTypeId', args.behTypeId);
    params.append('dimensionId', args.dimensionId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('studentId', args.studentId);
    return fetch({
        url: 'structure/schoolConduct/getDimensionBehTypeScoreList',
        method: 'POST',
        data: params
    })
}

export function getSchoolConductCardLList() {
    let params = new URLSearchParams();
    params.append('title', '');
    params.append('type', 0);
    return fetch({
        url: 'structure/schoolConductCard/getSchoolConductCardLList',
        method: 'get',
        params
    });
}
export function getSchoolConductCard(cardId) {
    let params = new URLSearchParams();
    params.append('cardId', cardId);
    return fetch({
        url: 'structure/schoolConductCard/getSchoolConductCard',
        method: 'get',
        params
    });
}
export function delSchoolConductCard(cardId) {
    let params = new URLSearchParams();
    params.append('cardId', cardId);
    return fetch({
        url: 'structure/schoolConductCard/delSchoolConductCard',
        method: 'get',
        params
    });
}

export function updateSchoolConductCard(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConductCard/updateSchoolConductCard',
        method: 'post',
        data: JSON.stringify(args)
    });
}

export function addSchoolConductCard(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConductCard/addSchoolConductCard',
        method: 'post',
        data: JSON.stringify(args)
    });
}