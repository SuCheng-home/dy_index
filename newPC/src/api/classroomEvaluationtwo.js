import fetch from '@/utils/fetch';
import {systemFetch,homeworkfetch} from '@/utils/fetch';//引入系统的ucenter-web 接口
//学生学期评价推送家长 
export function sendStuCurrRankAnalysisBySt(schoolTimeId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/sendStuCurrRankAnalysisBySt',
        method: 'get',
        params
    });
}
//发送消息给全校所有家长 
export function sendMessageToParent() {
    return homeworkfetch({
        url: 'structure/schoolBehEval/sendMessageToParent',
        method: 'get'
    });
}
//发送老师评价统计分析
export function sendThCommonAnalysisByTh(schoolTimeId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/sendThCommonAnalysisByTh',
        method: 'get',
        params
    });
}
//根据学校Id查询课堂评价版本二初始化设置
export function getSchoolBehInit() {
    return homeworkfetch({
        url: 'structure/schoolBehEval/getSchoolBehInit',
        method: 'get'
    });
}
//新增修改课堂评价版本二初始化设置
export function addAndUpdateSchoolBehInit(query) {
    return homeworkfetch({
        headers: {'content-type': 'application/json'},
        url: 'structure/schoolBehEval/addAndUpdateSchoolBehInit',
        method: 'post',
        data: JSON.stringify(query)
    });
}
//查询学校所有学期列表
export function getSchoolTimeAllList(){
    let params=new URLSearchParams();
    return fetch({
      url:'structure/schoolTime/getSchoolTimeAllList',
      method:'GET',
      params
    })
  }
//根据开始日期及结束日期查询老师课堂评价统计
export function teacherBehEvalStuScore(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("schoolTimeId", query.schoolTimeId);
    params.append("startDate", query.startDate);
    return homeworkfetch({
        url: 'structure/schoolBehEval/teacherBehEvalStuScore',
        method: 'get',
        params
    });
}
// 根据班级ID获得课程
export function queryCoursesByClassId(classId) {
    let params = new URLSearchParams();
    params.append('classId', classId);
    return systemFetch({
        url: 'api/teacherClass/queryCoursesByClassId',
        method: 'POST',
        params
    });
}
//根据班级及日期及科目查询学生考评分数统计
export function classBehEvalCurrStuScore(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("schoolTimeId", query.schoolTimeId);
    params.append("startDate", query.startDate);
    params.append("classId", query.classId);
    params.append("curriculumId", query.curriculumId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/classBehEvalCurrStuScore',
        method: 'get',
        params
    });
}
//查询课堂评价考评项
export function getSchoolBehaviorTypeListBySchoolId(type) {
    let params = new URLSearchParams();
    params.append("type", type);
    return homeworkfetch({
        url: 'structure/schoolBehEval/getSchoolBehaviorTypeListBySchoolId',
        method: 'get',
        params
    });
}
//根据班级及日期查询学生考评分数统计
export function classBehEvalStuScore(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("schoolTimeId", query.schoolTimeId);
    params.append("startDate", query.startDate);
    params.append("classId", query.classId);
    params.append("behTypeId", query.behTypeId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/classBehEvalStuScore',
        method: 'get',
        params
    });
}
//根据班级Id查询学生各科排名
export function getStuCurrRankAnalysisList(query) {
    let params = new URLSearchParams();
    params.append("classId", query.classId);
    params.append("schoolTimeId", query.schoolTimeId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/getStuCurrRankAnalysisList',
        method: 'get',
        params
    });
}
//根据学生Id开始日期，结束日期学期id查询学生科目分数列表
export function getBehEvalCurrStuScore(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("startDate", query.startDate);
    params.append("classId", query.classId);
    params.append("studentId", query.studentId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/getBehEvalCurrStuScore',
        method: 'get',
        params
    });
}
//根据学生Id开始日期，结束日期学期id查询学生科目排名图表
export function getBehEvalCurrStuRank(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("startDate", query.startDate);
    params.append("classId", query.classId);
    params.append("studentId", query.studentId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/getBehEvalCurrStuRank',
        method: 'get',
        params
    });
}
/**
 * 根据条件查询公文流转
 * */
 export function possessRole(roleConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', roleConstantId);
    return fetch({
      url: 'userRole/possessRole',
      method: 'POST',
      params
    });
  }
  //发送老师评价统计分析
export function getStuCount(schoolTimeId,classId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    params.append('classId', classId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/getStuCount',
        method: 'get',
        params
    });
}
//根据学生Id，学期id，周次，月份查询学生科目排名图表
export function getBehEvalCurrStuRankByWeekOrMonth(query) {
    let params = new URLSearchParams();
    params.append("classId", query.classId);
    params.append("month", query.month?query.month:"");
    params.append("schoolTimeId", query.schoolTimeId);
    params.append("severalWeek", query.severalWeek?query.severalWeek:0);
    params.append("studentId", query.studentId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/getBehEvalCurrStuRankByWeekOrMonth',
        method: 'get',
        params
    });
}
//根据学期id生成分析
export function addSchoolBehEvalStuSchTimeListBySchTimeId(schoolTimeId) {
    let params = new URLSearchParams();
    params.append("schoolTimeId", schoolTimeId);
    return homeworkfetch({
        url: 'structure/schoolBehEval/addStuSchTimeList',
        method: 'get',
        params
    });
}