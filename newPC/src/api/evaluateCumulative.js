import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
// 新增维度
export function addAssessDimension(query) {
    let params = new URLSearchParams();
    params.append('badNotice', query.badNotice);
    params.append('badRemind', query.badRemind);
    params.append('classHeader', query.classHeader);
    params.append('classHeaderType', query.classHeaderType);
    params.append('classStu', query.classStu);
    params.append('classStuType', query.classStuType);
    params.append('classTh', query.classTh);
    params.append('classThType', query.classThType);
    params.append('dayHelpNum', query.dayHelpNum);
    params.append('goodNotice', query.goodNotice);
    params.append('goodRemind', query.goodRemind);
    params.append('isCanHelp', query.isCanHelp);
    params.append('leader', query.leader);
    params.append('leaderIds', query.leaderIds);
    params.append('leaderJson', query.leaderJson);
    params.append('leaderNames', query.leaderNames);
    params.append('leaderType', query.leaderType);
    params.append('logo', query.logo);
    params.append('name', query.name);
    params.append('orderNo', query.orderNo);
    params.append('otherTh', query.otherTh);
    params.append('otherThIds', query.otherThIds);
    params.append('otherThJson', query.otherThJson);
    params.append('otherThNames', query.otherThNames);
    params.append('otherThType', query.otherThType);
    params.append('score', query.score);
    params.append('stuSelf', query.stuSelf);
    params.append('stuSelfType', query.stuSelfType);
    params.append('remarks', query.remarks);
    return fetch({
        url: 'structure/cumulAssess/addAssessDimension',
        method: 'POST',
        data: params
    });
}
//修改维度
export function editAssessDimension(query) {
    let params = new URLSearchParams();
    params.append('badNotice', query.badNotice);
    params.append('badRemind', query.badRemind);
    params.append('classHeader', query.classHeader);
    params.append('classHeaderType', query.classHeaderType);
    params.append('classStu', query.classStu);
    params.append('classStuType', query.classStuType);
    params.append('classTh', query.classTh);
    params.append('classThType', query.classThType);
    params.append('dayHelpNum', query.dayHelpNum);
    params.append('goodNotice', query.goodNotice);
    params.append('goodRemind', query.goodRemind);
    params.append('isCanHelp', query.isCanHelp);
    params.append('leader', query.leader);
    params.append('leaderIds', query.leaderIds);
    params.append('leaderJson', query.leaderJson);
    params.append('leaderNames', query.leaderNames);
    params.append('leaderType', query.leaderType);
    params.append('logo', query.logo);
    params.append('name', query.name);
    params.append('orderNo', query.orderNo);
    params.append('otherTh', query.otherTh);
    params.append('otherThIds', query.otherThIds);
    params.append('otherThJson', query.otherThJson);
    params.append('otherThNames', query.otherThNames);
    params.append('otherThType', query.otherThType);
    params.append('score', query.score);
    params.append('stuSelf', query.stuSelf);
    params.append('stuSelfType', query.stuSelfType);
    params.append('id', query.id);
    params.append('remarks', query.remarks);
    return fetch({
        url: 'structure/cumulAssess/editAssessDimension',
        method: 'POST',
        data: params
    });
}
// 根据ID删除维度
export function delAssessDimensionById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/cumulAssess/delAssessDimensionById',
        method: 'POST',
        data: params
    });
}
//根据ID查询维度
export function getAssessDimensionById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/cumulAssess/getAssessDimensionById',
        method: 'POST',
        data: params
    });
}
//获得学校的维度列表
export function getSchoolAssessDimensionList() {
    return fetch({
        url: 'structure/cumulAssess/getSchoolAssessDimensionList',
        method: 'POST'
    });
}
//保存花朵兑换规则
export function saveAssessFlowerRule(flowerLevelJson,flowerRuleJson) {
    let params = new URLSearchParams();
    params.append('flowerLevelJson', flowerLevelJson);
    params.append('flowerRuleJson', flowerRuleJson);
    return fetch({
        url: 'structure/cumulAssess/saveAssessFlowerRule',
        method: 'POST',
        data: params
    });
}
//获得学校的花朵设置规则列表
export function getAssessFlowerRuleList() {
    return fetch({
        url: 'structure/cumulAssess/getAssessFlowerRuleList',
        method: 'POST'
    });
}
//新增称号
export function addAssessMedal(query) {
    let params = new URLSearchParams();
    params.append('logo', query.logo);
    params.append('name', query.name);
    params.append('orderNo', query.orderNo);
    params.append('flowerNum', query.flowerNum);
    return fetch({
        url: 'structure/cumulAssess/addAssessMedal',
        method: 'POST',
        data: params
    });
}
//编辑称号
export function editAssessMedal(query) {
    let params = new URLSearchParams();
    params.append('logo', query.logo);
    params.append('name', query.name);
    params.append('orderNo', query.orderNo);
    params.append('flowerNum', query.flowerNum);
    params.append('id', query.id);
    return fetch({
        url: 'structure/cumulAssess/editAssessMedal',
        method: 'POST',
        data: params
    });
}
//获得学校称号列表
export function getAssessMedalList() {
    return fetch({
        url: 'structure/cumulAssess/getAssessMedalList',
        method: 'POST'
    });
}
//根据ID获得称号详细信息
export function getAssessMedalInfoById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/cumulAssess/getAssessMedalInfoById',
        method: 'POST',
        data: params
    });
}
//删除称号
export function delAssessMedalById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/cumulAssess/delAssessMedalById',
        method: 'POST',
        data: params
    });
}
//重新处理学校学生分数
export function resetSchoolStuPoint() {
    return fetch({
        url: 'structure/cumulAssess/resetSchoolStuPoint',
        method: 'POST'
    });
}
//获得教师班级列表
export function getThClassList() {
    return fetch({
        url: 'structure/cumulAssess/getThClassList',
        method: 'POST'
    });
}
//根据班级ID获得班级学生评价列表
export function getSchoolStuAssessPointList(classId) {
    const params = new URLSearchParams();
    params.append('classId', classId);
    return fetch({
        url: 'structure/cumulAssess/getSchoolStuAssessPointList',
        method: 'post',
        data:params
    });
}
//取当前学期
export function getCurrentSchoolTimeBySchoolId() {
    return fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'POST'
    });
}
//获得学生时间段内的助力记录（分页）
export function getStuAssessRecordPageList(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('userId', query.userId);
    return fetch({
        url: 'structure/cumulAssess/getStuAssessRecordPageList',
        method: 'POST',
        data: params
    });
}
//获得学校-年级学生得分列表（分页）
export function getSchoolStuPointPageList(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('gradeId', query.gradeId);
    params.append('classId', query.classId);
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'structure/cumulAssess/getSchoolStuPointPageList',
        method: 'POST',
        data: params
    });
}
//获得学校教师评价记录列表（分页）
export function getSchoolTeacherAssessDataPageList(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('type', query.type);
    return fetch({
        url: 'structure/cumulAssess/getSchoolTeacherAssessDataPageList',
        method: 'POST',
        data: params
    });
}
//获得学生所有维度得分列表
export function getStuAllDimensionDataList(stuId) {
    const params = new URLSearchParams();
    params.append('stuId', stuId);
    return fetch({
        url: 'structure/cumulAssess/getStuAllDimensionDataList',
        method: 'post',
        data:params
    });
}
//根据记录ID删除助力记录
export function deleteStuAssessRecordByRecordId(recordId) {
    let params = new URLSearchParams();
    params.append('recordId', recordId);
    return fetch({
        url: 'structure/cumulAssess/deleteStuAssessRecordByRecordId',
        method: 'POST',
        data: params
    });
}
/**
 * 获得年级列表
 * **/
export function querySchoolGrade() {
    return systemFetch({
      url: 'api/depart/querySchoolGrade',
      method: 'get'
    });
  }
  /**
 * 获得年级列表
 * **/
export function queryClassByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return systemFetch({
      url: 'api/depart/queryClassByGradeId',
      method: 'get',
      params
    });
  }
  /**
 * 根据用户ID获得管理的班级（包括年级信息）
 * **/
export function getClassAndGradeByManagerId(managerId) {
    let params = new URLSearchParams();
    params.append('managerId', managerId);
    return systemFetch({
      url: 'api/depart/getClassAndGradeByManagerId',
      method: 'get',
      params
    });
  }
//获得学生得分情况
export function getStuAssessPointInfoData(stuId) {
    const params = new URLSearchParams();
    params.append('stuId', stuId);
    return fetch({
        url: 'structure/cumulAssess/getStuAssessPointInfoData',
        method: 'post',
        data:params
    });
}