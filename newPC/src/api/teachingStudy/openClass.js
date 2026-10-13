import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';

/**
 * 根据角色常量查询用户列表
 * */
export function getUsersByConstantId(constantId) {
    let params = new URLSearchParams();
    params.append("constantId", constantId);

    return systemFetch({
        url: 'api/user/role/getUsersByConstantId',
        method: 'GET',
        params
    });
}

/**
 * 校内公开课
 * */
/**
 * 校内公开课列表
 * */
export function schoolClassRegisterList(args) {
    let params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("teacherName", args.teacherName);
    params.append("openClassTypeId", args.openClassTypeId);

    return fetch({
        url: 'structure/listenClassRegister/schoolClassRegisterList',
        method: 'GET',
        params
    });
}

/**
 * 我的公开课列表
 * */
export function myClassRegisterList(args) {
    let params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("teacherName", args.teacherName);
     params.append("schoolTimeId", args.schoolTimeId);
    return fetch({
        url: 'structure/listenClassRegister/myClassRegisterList',
        method: 'GET',
        params
    });
}

/**
 * 审批公开课列表
 * */
export function getSPRegisterList(args) {
    let params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("teacherName", args.teacherName);

    return fetch({
        url: 'structure/listenClassRegister/getSPRegisterList',
        method: 'GET',
        params
    });
}
//获得学校下某个字典的字典值列表
export function findSchoolDicsByCode(dicCode) {
    let params = new URLSearchParams();
    params.append('dicCode', dicCode);
    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'post',
        data: params
    });
}
/**
 * 获取详情
 * */
export function registerDetail(registerId) {
    let params = new URLSearchParams();
    params.append("registerId", registerId);

    return fetch({
        url: 'structure/listenClassRegister/registerDetail',
        method: 'GET',
        params
    });
}

/**
 * 预约和登记记录
 * */
export function queryRegisterOrder(args) {
    let params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("registerId", args.registerId);
    params.append("searchName", args.searchName);

    return fetch({
        url: 'structure/listenClassRegister/queryRegisterOrder',
        method: 'GET',
        params
    });
}

/**
 * 获取节次
 * */
export function getClassNoList() {

    return fetch({
        url: 'structure/listenClassRegister/classNoList',
        method: 'GET'
    });
}

/**
 * 选节次 带出课程 老师
 * */
export function getClassNoTeacher(args) {
    let params = new URLSearchParams();
    params.append("classId", args.classId);
    params.append("classNo", args.classNo);
    params.append("listenDate", args.listenDate);

    return fetch({
        url: 'structure/listenClassRegister/ClassNoTeacher',
        method: 'GET',
        params
    });
}

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
 * 获得学校下某个字典的字典值列表
 **/
export function findDicsByCode(dicCode) {
    let params = new URLSearchParams();
    params.append('dicCode', dicCode);

    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'post',
        data: params
    });
}

/**
 * 新增已发布公开课
 * */
export function addRegister(args) {
    let params = new URLSearchParams();
    params.append("applyRemark", args.applyRemark);
    params.append("approveRemark", args.approveRemark);
    params.append("classId", args.classId);
    params.append("className", args.className);
    params.append("classNo", args.classNo);
    params.append("classNoName", args.classNoName);
    params.append("createType", args.createType);
    params.append("gradeId", args.gradeId);
    params.append("gradeName", args.gradeName);
    params.append("level", args.level);
    params.append("levelName", args.levelName);
    params.append("listenDate", args.listenDate);
    params.append("place", args.place);
    params.append("subjectId", args.subjectId);
    params.append("subjectName", args.subjectName);
    params.append("userJson", args.userJson);
    params.append("openClassTypeId", args.openClassTypeId);
    params.append("openClassType", args.openClassType);
    params.append("subjectTheme", args.subjectTheme);
    params.append("supervisoryLeader", args.supervisoryLeader || "");
    params.append("participant", args.participant || "");
    params.append("modality", args.modality || "");
    return fetch({
        url: 'structure/listenClassRegister/addRegister',
        method: 'POST',
        data: params
    });
}

/**
 * 编辑已发布公开课
 * */
export function editRegister(args) {
    let params = new URLSearchParams();
    params.append("applyRemark", args.applyRemark);
    params.append("approveRemark", args.approveRemark);
    params.append("classId", args.classId);
    params.append("className", args.className);
    params.append("classNo", args.classNo);
    params.append("classNoName", args.classNoName);
    params.append("gradeId", args.gradeId);
    params.append("gradeName", args.gradeName);
    params.append("id", args.id);
    params.append("level", args.level);
    params.append("levelName", args.levelName);
    params.append("listenDate", args.listenDate);
    params.append("place", args.place);
    params.append("subjectId", args.subjectId);
    params.append("subjectName", args.subjectName);
    params.append("userJson", args.userJson);
    params.append("openClassTypeId", args.openClassTypeId);
    params.append("openClassType", args.openClassType);
    params.append("subjectTheme", args.subjectTheme);
    params.append("supervisoryLeader", args.supervisoryLeader || "");
    params.append("participant", args.participant || "");
    params.append("modality", args.modality || "");
    return fetch({
        url: 'structure/listenClassRegister/editRegister',
        method: 'POST',
        data: params
    });
}

/**
 * 新增我的公开课
 * */
export function addMyRegister(args) {
    let params = new URLSearchParams();
    params.append("applyRemark", args.applyRemark);
    params.append("classId", args.classId);
    params.append("className", args.className);
    params.append("classNo", args.classNo);
    params.append("classNoName", args.classNoName);
    params.append("createType", args.createType);
    params.append("gradeId", args.gradeId);
    params.append("gradeName", args.gradeName);
    params.append("level", args.level);
    params.append("levelName", args.levelName);
    params.append("listenDate", args.listenDate);
    params.append("place", args.place);
    params.append("subjectId", args.subjectId);
    params.append("subjectName", args.subjectName);
    params.append("examineUserId", args.examineUserId);
    params.append("examineUserName", args.examineUserName);
    params.append("openClassTypeId", args.openClassTypeId);
    params.append("openClassType", args.openClassType);
    params.append("subjectTheme", args.subjectTheme);

    return fetch({
        url: 'structure/listenClassRegister/addMyRegister',
        method: 'POST',
        data: params
    });
}

/**
 * 编辑我的公开课
 * */
export function editMyRegister(args) {
    let params = new URLSearchParams();
    params.append("applyRemark", args.applyRemark);
    params.append("classId", args.classId);
    params.append("className", args.className);
    params.append("classNo", args.classNo);
    params.append("classNoName", args.classNoName);
    params.append("createType", args.createType);
    params.append("gradeId", args.gradeId);
    params.append("gradeName", args.gradeName);
    params.append("id", args.id);
    params.append("level", args.level);
    params.append("levelName", args.levelName);
    params.append("listenDate", args.listenDate);
    params.append("place", args.place);
    params.append("subjectId", args.subjectId);
    params.append("subjectName", args.subjectName);
    params.append("examineUserId", args.examineUserId);
    params.append("examineUserName", args.examineUserName);
    params.append("openClassTypeId", args.openClassTypeId);
    params.append("openClassType", args.openClassType);
    params.append("subjectTheme", args.subjectTheme);
    return fetch({
        url: 'structure/listenClassRegister/editMyRegister',
        method: 'POST',
        data: params
    });
}

/**
 * 审批公开课
 * */
export function examineRegister(args) {
    let params = new URLSearchParams();
    params.append("registerId", args.registerId);
    params.append("remark", args.remark);
    params.append("state", args.state);

    return fetch({
        url: 'structure/listenClassRegister/examineRegister',
        method: 'POST',
        data: params
    });
}

// 新增评价设置
export function insertAppraiseSet(args) {
    let params = new URLSearchParams();
    params.append("name", args.name);
    params.append("orderNum", args.orderNum);
    params.append("pId", args.pId);
    params.append("starNum", args.starNum);
    params.append("type", args.type);

    return fetch({
        url: 'structure/listenClassRecord/insertAppraiseSet',
        method: 'POST',
        data: params
    });
}
// 获取听课记录评价设置
export function queryAppraiseList() {

    return fetch({
        url: 'structure/listenClassRecord/queryAppraiseList',
        method: 'POST'
    });
}
//
export function deleteAppraiseSetById(args) {
    let params = new URLSearchParams();
    params.append("id", args.id);

    return fetch({
        url: 'structure/listenClassRecord/deleteAppraiseSetById',
        method: 'GET',
        params
    });
}
// 编辑评价设置
export function updateAppraiseSet(args) {
    let params = new URLSearchParams();
    params.append("id", args.id);
    params.append("name", args.name);
    params.append("orderNum", args.orderNum);
    params.append("pId", args.pId);
    params.append("starNum", args.starNum);
    params.append("type", args.type);

    return fetch({
        url: 'structure/listenClassRecord/updateAppraiseSet',
        method: 'POST',
        data: params
    });
}
export function listenClassRecordInfoById(recordId) {
    let params = new URLSearchParams();
    params.append("recordId", recordId);

    return fetch({
        url: 'structure/listenClassRecord/listenClassRecordInfoById',
        method: 'GET',
        params
    });
}
export function insertOrderFromRegister(args) {
    let params = new URLSearchParams();
    params.append("departJSON", args.departJSON);
    params.append("registerId", args.registerId);
    params.append("userJSON", args.userJSON);

    return fetch({
        url: 'structure/listenClassRegister/insertOrderFromRegister',
        method: 'POST',
        data: params
    });
}
export function getAuditUser() {

    return fetch({
        url: 'structure/listenClassRegister/getAuditUser',
        method: 'GET',
    });
}

/**
 * 获取学期列表
 * */
export function getSchoolTimeList() {
  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'GET'
  });
}
