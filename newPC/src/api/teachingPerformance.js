import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
//获得年级列表 
export function querySchoolGrade() {
    return systemFetch({
      url: 'api/depart/querySchoolGrade',
      method: 'get'
    });
  }
  //获取学年
  export function getSchoolYear() {
    return fetch({
        url: 'structure/schoolTime/getSchoolYear',
        method: 'get'
    });
}
//获取当前学期
export function getCurrentSchoolTimeBySchoolId() {
    return fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'GET'
    });
}
//分页获取学年绩效评估表
export function queryTeacherAppraiseYearAnalysis(listQuery) {
    let params = new URLSearchParams();
    params.append("pageNo",listQuery.pageNo);
    params.append("pageSize",listQuery.pageSize);
    params.append("schoolId",listQuery.schoolId);
    params.append("schoolYearId",listQuery.schoolYearId);
    params.append("searchName",listQuery.searchName);
    return fetch({
        url: 'structure/teacherAppraise/queryTeacherAppraiseYearAnalysis',
        method: 'get',
        params
    });
}
//分页获取教师教学绩效批次
export function queryTeacherAppraiseBatch(listQuery) {
    let params = new URLSearchParams();
    params.append("pageNo",listQuery.pageNo);
    params.append("pageSize",listQuery.pageSize);
    params.append("schoolId",listQuery.schoolId);
    params.append("schoolYearId",listQuery.schoolYearId);
    return fetch({
        url: 'structure/teacherAppraise/queryTeacherAppraiseBatch',
        method: 'get',
        params
    });
}
//分页获取绩效汇总表
export function queryTeacherAppraiseClass(listQuery) {
    let params = new URLSearchParams();
    params.append("pageNo",listQuery.pageNo);
    params.append("pageSize",listQuery.pageSize);
    params.append("batchId",listQuery.batchId);
    params.append("searchName",listQuery.searchName);
    return fetch({
        url: 'structure/teacherAppraise/queryTeacherAppraiseClass',
        method: 'get',
        params
    });
}
//分页获取绩效评估表
export function queryTeacherAppraiseAnalysis(listQuery) {
    let params = new URLSearchParams();
    params.append("pageNo",listQuery.pageNo);
    params.append("pageSize",listQuery.pageSize);
    params.append("batchId",listQuery.batchId);
    params.append("searchName",listQuery.searchName);
    return fetch({
        url: 'structure/teacherAppraise/queryTeacherAppraiseAnalysis',
        method: 'get',
        params
    });
}
//删除教师教学绩效
export function deleteTeacherAppraiseBatch(batchId) {
    let params = new URLSearchParams();
    params.append("batchId",batchId);
    return fetch({
        url: 'structure/teacherAppraise/deleteTeacherAppraiseBatch',
        method: 'get',
        params
    });
}
//生成学年绩效评估表
export function generateYearTeacherAppraise(schoolId,schoolYearId) {
    let params = new URLSearchParams();
    params.append("schoolId",schoolId);
    params.append("schoolYearId",schoolYearId);
    return fetch({
        url: 'structure/teacherAppraise/generateYearTeacherAppraise',
        method: 'get',
        params
    });
}
//获取教师教学详情
export function getTeacherAppraiseBatchById(batchId) {
    let params = new URLSearchParams();
    params.append("batchId",batchId);
    return fetch({
        url: 'structure/teacherAppraise/getTeacherAppraiseBatchById',
        method: 'get',
        params
    });
}
//获取某个年级已生成成绩分析的考试
export function getExamListByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append("gradeId",gradeId);
    return fetch({
        url: 'structure/teacherAppraise/getExamListByGradeId',
        method: 'get',
        params
    });
}
//保存教师教学绩效
export function saveTeacherAppraiseBatch(listQuery) {
    let params = new URLSearchParams();
    params.append("appraiseWay",listQuery.appraiseWay);
    params.append("avgPercent",listQuery.avgPercent);
    params.append("excellence",listQuery.excellence);
    params.append("good",listQuery.good);
    params.append("goodPercent",listQuery.goodPercent);
    params.append("maxPercent",listQuery.maxPercent);
    params.append("minPercent",listQuery.minPercent);
    params.append("pass",listQuery.pass);
    params.append("performanceMax",listQuery.performanceMax);
    params.append("performanceMin",listQuery.performanceMin);
    params.append("relativeJSON",listQuery.relativeJSON);
    params.append("schoolYear",listQuery.schoolYear);
    params.append("schoolYearId",listQuery.schoolYearId);
    params.append("themeName",listQuery.themeName);
    return fetch({
        url: 'structure/teacherAppraise/saveTeacherAppraiseBatch',
        method: 'post',
        data:params
    });
}