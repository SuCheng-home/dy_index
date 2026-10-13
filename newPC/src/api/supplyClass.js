import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';

export function possessRole(ConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', ConstantId);
    return fetch({
        url: 'userRole/possessRole',
        method: 'POST',
        params
    });
}

/**
 * PC-查看代课调课列表（分页）
 */
export function getSupplyAdjustClassPageListForPC(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);
    params.append('searchClassId', args.searchClassId);
    params.append('searchGradeId', args.searchGradeId);
    params.append('searchEndDate', args.searchEndDate);
    params.append('searchStartDate', args.searchStartDate);
    params.append('state', args.state);
    params.append('type', args.type);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/supplyClass/getSupplyAdjustClassPageListForPC',
        method: 'post',
        data: params
    });
}

/**
 * 教务处主任删除代课调课
 */
export function deleteSupplyClass(supplyClassIds) {
    let params = new URLSearchParams();
    params.append('supplyClassIds', supplyClassIds);

    return fetch({
        url: 'structure/supplyClass/deleteSupplyClass',
        method: 'post',
        data: params
    });
}

/**
 * 教师代课调课统计数据
 */
export function getSupplyClassStatisticsData(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/supplyClass/getSupplyclassStatisticsData',
        method: 'post',
        data: params
    });
}

/**
 * 抵扣统计
 */
/**
 * 获得代课抵扣统计
 */
export function getSupplyWithholdStaticsPageData(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('teacherName', args.teacherName);

    return fetch({
        url: 'structure/supplyClass/getSupplyWithholdStaticsPageData',
        method: 'post',
        data: params
    });
}

/**
 * 获得代课抵扣抵扣记录（分页）
 */
export function getSupplyWithholdRecordPageList(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);
    params.append('teacherName', args.teacherName);

    return fetch({
        url: 'structure/supplyClass/getSupplyWithholdRecordPageList',
        method: 'post',
        data: params
    });
}

/**
 * 获得代课调课详细信息
 */
export function getSupplyAdjustClassInfo(id) {
    let params = new URLSearchParams();
    params.append('id', id);

    return fetch({
        url: 'structure/supplyClass/getSupplyAdjustClassInfo',
        method: 'post',
        data: params
    });
}

/**
 * 调课代课审批
 */
export function examineSupplyAdjustClass(args) {
    let params = new URLSearchParams();
    params.append('examineRemark', args.examineRemark);
    params.append('id', args.id);
    params.append('state', args.state);
    params.append('supplyTeacherJson', args.supplyTeacherJson);
    if (args.adjustDate) {
        params.append('adjustClassId', args.adjustClassId || 0);
        params.append('adjustClassName', args.adjustClassName || '');
        params.append('adjustClassNo', args.adjustClassNo || '');
        params.append('adjustClassNoName', args.adjustClassNoName || '');
        params.append('adjustDate', args.adjustDate || '');
        params.append('adjustGradeId', args.adjustGradeId || 0);
        params.append('adjustGradeName', args.adjustGradeName || '');
        params.append('adjustSubjectId', args.adjustSubjectId || 0);
        params.append('adjustSubjectName', args.adjustSubjectName || '');
        params.append('adjustTeacherJson', args.adjustTeacherJson || '');

    }
    return fetch({
        url: 'structure/supplyClass/examineSupplyAdjustClass',
        method: 'post',
        data: params
    });
}

/**
 * 代课抵扣驳回
 */
export function recallSupplyWithhold(args) {
    let params = new URLSearchParams();
    params.append('disRemark', args.disRemark);
    params.append('id', args.id);

    return fetch({
        url: 'structure/supplyClass/recallSupplyWithhold',
        method: 'post',
        data: params
    });
}


/**
 * 新增页
 */
/**
 * 获得年级和班级列表
 **/
export function querySchoolGradeClass() {
    let params = new URLSearchParams();

    return fetch({
        baseURL: global.BaseNewPath,
        url: 'api/depart/querySchoolGradeClass',
        method: 'get',
        params
    });
}

/**
 * 根据班级ID，查询相关的课程列表
 **/
export function queryCoursesByClassId(classId) {
    let params = new URLSearchParams();
    params.append('classId', classId);

    return fetch({
        baseURL: global.BaseNewPath,
        url: 'api/teacherClass/queryCoursesByClassId',
        method: 'get',
        params
    });
}

/**
 * 获得学校节次列表
 */
export function getSchoolClassNoJSONArray(args) {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/supplyClass/getSchoolClassNoJSONArray',
        method: 'post',
        data: params
    });
}

/**
 * 切换节次获得课程及老师信息
 */
export function getClassSubjectAndTeacherByClassNo(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('classNo', args.classNo);
    params.append('listenDate', args.listenDate);

    return fetch({
        url: 'structure/supplyClass/getClassSujectAndTeacherByClassNo2',
        method: 'post',
        data: params
    });
}

/**
 * 新增代课调课(教务处主任)
 */
export function addOrPublishSupplyAdjustClass(args) {
    let params = new URLSearchParams();
    params.append('adjustClassId', args.adjustClassId || 0);
    params.append('adjustClassName', args.adjustClassName || '');
    params.append('adjustClassNo', args.adjustClassNo || '');
    params.append('adjustClassNoName', args.adjustClassNoName || '');
    params.append('adjustDate', args.adjustDate || '');
    params.append('adjustGradeId', args.adjustGradeId || 0);
    params.append('adjustGradeName', args.adjustGradeName || '');
    params.append('adjustSubjectId', args.adjustSubjectId || 0);
    params.append('adjustSubjectName', args.adjustSubjectName || '');
    params.append('adjustTeacherJson', args.adjustTeacherJson || '');
    params.append('createUserType', args.createUserType);
    params.append('reason', args.reason || '');
    params.append('state', args.state);
    params.append('chooseType', args.chooseType);
     params.append('reasonType', args.reasonType || '');
    if (args.type === 2) {
        params.append('supplyClassId', args.supplyClassId || 0);
        params.append('supplyClassName', args.supplyClassName || '');
        params.append('supplyClassNo', args.supplyClassNo || '');
        params.append('supplyClassNoName', args.supplyClassNoName || '');
        params.append('supplyDate', args.supplyDate || '');
        params.append('supplyGradeId', args.supplyGradeId || 0);
        params.append('supplyGradeName', args.supplyGradeName || '');
        params.append('supplySubjectId', args.supplySubjectId || 0);
        params.append('supplySubjectName', args.supplySubjectName || '');
    }
    if (args.substituteId) {
        params.append('substituteId', args.substituteId);
        params.append('substituteName', args.substituteName);
        params.append('sendNum', args.sendNum);
    }
    params.append('supplyTeacherJson', args.supplyTeacherJson || '');
    params.append('type', args.type);
    params.append('typeName', args.typeName);
    params.append('adjustPics', args.adjustPics);
    return fetch({
        url: 'structure/supplyClass/addOrPublishSupplyAdjustClass',
        method: 'post',
        data: params
    });
}

/**
 * 新增代课调课(教务处主任) 批量新增代课调课（教务处）20260303
 */
export function addOrPublishSupplyAdjustClassList(data) {
    return fetch({
        url: '/structure/supplyClass/addOrPublishSupplyAdjustClassList',
        method: 'post',
        data:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/**
 *批量新增代课调课申请（老师）20260309
 */
export function addOrSubmitSupplyAdjustClassApplyList(data) {
    return fetch({
        url: '/structure/supplyClass/addOrSubmitSupplyAdjustClassApplyList',
        method: 'post',
        data:JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/**
 * 编辑代课调课(教务处主任)
 */
export function editOrPublishSupplyAdjustClass(args) {
    let params = new URLSearchParams();
    params.append('adjustClassId', args.adjustClassId || 0);
    params.append('adjustClassName', args.adjustClassName || '');
    params.append('adjustClassNo', args.adjustClassNo || '');
    params.append('adjustClassNoName', args.adjustClassNoName || '');
    params.append('adjustDate', args.adjustDate || '');
    params.append('adjustGradeId', args.adjustGradeId || 0);
    params.append('adjustGradeName', args.adjustGradeName || '');
    params.append('adjustSubjectId', args.adjustSubjectId || 0);
    params.append('adjustSubjectName', args.adjustSubjectName || '');
    params.append('adjustTeacherJson', args.adjustTeacherJson || '');
    params.append('createUserType', args.createUserType);
    params.append('id', args.id);
    params.append('reason', args.reason || '');
    params.append('state', args.state);
     params.append('reasonType', args.reasonType || '');
    if (args.type === 2) {
        params.append('supplyClassId', args.supplyClassId || 0);
        params.append('supplyClassName', args.supplyClassName || '');
        params.append('supplyClassNo', args.supplyClassNo || '');
        params.append('supplyClassNoName', args.supplyClassNoName || '');
        params.append('supplyDate', args.supplyDate || '');
        params.append('supplyGradeId', args.supplyGradeId || 0);
        params.append('supplyGradeName', args.supplyGradeName || '');
        params.append('supplySubjectId', args.supplySubjectId || 0);
        params.append('supplySubjectName', args.supplySubjectName || '');
    }
    if (args.substituteId) {
        params.append('substituteId', args.substituteId);
        params.append('substituteName', args.substituteName);
        params.append('sendNum', args.sendNum);
    }
    params.append('supplyTeacherJson', args.supplyTeacherJson || '');
    params.append('type', args.type);
    params.append('typeName', args.typeName);
    params.append('adjustPics', args.adjustPics);
    params.append('chooseType', args.chooseType);
    return fetch({
        url: 'structure/supplyClass/editOrPublishSupplyAdjustClass',
        method: 'post',
        data: params
    });
}

/**
 * 查询用户所负责的部门列表
 */
export function getDepartListByUserId() {
    return systemFetch({
        url: 'api/depart/getDepartListByUserId?type=7',
        method: 'get',
    });
}

/**
 * 查询用户所负责的部门列表
 */
export function queryDepartByType() {
    return systemFetch({
        url: 'api/depart/queryDepartByType?type=7',
        method: 'get',
    });
}
/**
 * 新增其他类型代课(教务处主任)
 */
export function addOtherSupplyClass(args) {
    let params = new URLSearchParams();
    params.append('createUserType', args.createUserType);
    params.append('reason', args.reason);
    params.append('state', args.state);
    params.append('substituteDayNum', args.substituteDayNum);
    params.append('substituteType', args.substituteType);
    params.append('supplyClassNo', args.supplyClassNo);
    params.append('supplyClassNoName', args.supplyClassNoName);
    params.append('supplyDate', args.supplyDate);
    params.append('supplyTeacherJson', args.supplyTeacherJson);
    params.append('type', args.type);
    params.append('typeName', args.typeName);
    params.append('adjustPics', args.adjustPics);
     params.append('reasonType', args.reasonType || '');
    return fetch({
        url: 'structure/supplyClass/addOtherSupplyClass',
        method: 'post',
        data: params
    });
}
/**
 * 编辑其他类型代课(教务处主任)
 */
export function editOtherSupplyClass(args) {
    let params = new URLSearchParams();
    params.append('createUserType', args.createUserType);
    params.append('reason', args.reason);
    params.append('state', args.state);
    params.append('substituteDayNum', args.substituteDayNum);
    params.append('substituteType', args.substituteType);
    params.append('supplyClassNo', args.supplyClassNo);
    params.append('supplyClassNoName', args.supplyClassNoName);
    params.append('supplyDate', args.supplyDate);
    params.append('supplyTeacherJson', args.supplyTeacherJson);
    params.append('type', args.type);
    params.append('typeName', args.typeName);
    params.append('id', args.id);
    params.append('adjustPics', args.adjustPics);
     params.append('reasonType', args.reasonType || '');
    return fetch({
        url: 'structure/supplyClass/editOtherSupplyClass',
        method: 'post',
        data: params
    });
}
/**
 * 获得教师其他代课列表
 */
export function getThOtherSupplyClassPageList(args) {
    let params = new URLSearchParams();
    params.append('teacherId', args.teacherId);
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/supplyClass/getThOtherSupplyClassPageList',
        method: 'post',
        data: params
    });
}
/**
 * 调课代课审批
 */
export function getScheduleCurrByTeacherIdAndDate(args) {
    let params = new URLSearchParams();
    params.append('teacherId', args.teacherId);
    params.append('searchDate', args.searchDate);
    return fetch({
        url: 'structure/classSchedule/getScheduleCurrByTeacherIdAndDateWeek',
        method: 'post',
        data: params
    });
}


export function saveSchoolSupplyAdjustClassSetInfo(args) {
    let params = new URLSearchParams();
    params.append('examineGroupJson', args.examineGroupJson);
     params.append('ackWay', args.ackWay);
     params.append('elseUserJson', args.elseUserJson);
     params.append('isRemindElse', args.isRemindElse);
    params.append('examineType', args.examineType);
    params.append('sendTypes', args.sendTypes);
    params.append('isSubstitute', args.isSubstitute);
    params.append('substituteId', args.substituteId);
    params.append('substituteName', args.substituteName);
    return fetch({
        url: 'structure/supplyClass/saveSchoolSupplyAdjustClassSetInfo',
        method: 'post',
        data: params
    });
}
export function getSchoolSupplyAdjustClassSetInfo() {
    return fetch({
        url: 'structure/supplyClass/getSchoolSupplyAdjustClassSetInfo',
        method: 'post'
    });
}
//获得字典项下的字典列表
export function getDicDetailValuePageList(dictionaryCode) {
    let params = new URLSearchParams();
    params.append('dictionaryCode', dictionaryCode);
    params.append('pageNo', 1);
    params.append('pageSize', 500);
    return fetch({
        url: 'structure/schoolDictionary/getDicDetailValuePageList',
        method: 'POST',
        data: params
    });
}