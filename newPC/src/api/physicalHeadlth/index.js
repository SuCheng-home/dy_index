import fetch from '@/utils/fetch';
import {newcard} from '@/utils/fetch';

//获取学年
export function getSchoolYear(){
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/schoolTime/getSchoolYear',
    method: 'GET',
    params
  })
}

//获取当前学期
export function getCurrentSchoolTimeBySchoolId(){
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
    method: 'GET',
    params
  })
}

//根据学年查已录入的班级及其学生数
export function getClassListBySchoolYear(args){
  let params=new URLSearchParams();
  params.append("schoolYear",args.schoolYear);
  return fetch({
    url: 'structure/schoolFitnessTest/getClassListBySchoolYear',
    method: 'post',
    params
  })
}

//体质健康列表
export function getFitnessTestList(args){
  let params=new URLSearchParams();
  params.append("classId",args.classId);
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("schoolYear",args.schoolYear);
  params.append("searchTitle",args.searchTitle);
  return fetch({
    url: 'structure/schoolFitnessTest/getFitnessTestList',
    method: 'post',
    params
  })
}

//根据学生id获取学生信息以及校园卡信息
export function getStudentInfoAndCardById(args){
  let params=new URLSearchParams();
  params.append("schoolId",args.schoolId);
  params.append("searchType",args.searchType);
  params.append("studentId",args.studentId);
  return newcard({
    url: 'common/getStudentInfoAndCardById',
    method: 'get',
    params
  })
}
//根据体质健康id查单条
export function getFitnessTestDetail(args){
  let params=new URLSearchParams();
  params.append("fitnessTestId",args.fitnessTestId);
  return fetch({
    url: 'structure/schoolFitnessTest/getFitnessTestDetail',
    method: 'post',
    params
  })
}

//获得年级列表
export function querySchoolGrade(args) {
    let params = new URLSearchParams();
    params.append('isFilterNewGrade', args.isFilterNewGrade);
    return systemFetch({
        url: 'api/depart/querySchoolGrade',
        method: 'get',
        params
    })
}

//根据年级ID获得班级列表
export function queryClassByGradeId(args){
  let params=new URLSearchParams();
  params.append("gradeId",args.gradeId);
  return fetch({
    url: 'depart/queryClassByGradeId',
    method: 'get',
    params
  })
}

//获得年级和班级列表
export function querySchoolGradeClass(args){
  let params=new URLSearchParams();
  return fetch({
    url: 'depart/querySchoolGradeClass',
    method: 'get',
    params
  })
}

//统计部门下的用户数（不包括子部门）
export function countUsersByDepIds(args){
  let params=new URLSearchParams();
  params.append("departIds",args.departIds);
  params.append("userType",args.userType);
  return fetch({
    url: 'user/countUsersByDepIds',
    method: 'get',
    params
  })
}

//根据部门ID集合，查询用户基本信息和所在部门
export function getUserDepInfoByDepIds(args){
  let params=new URLSearchParams();
  params.append("departIds",args.departIds);
  params.append("searchVal",args.searchVal);
  params.append("userType",args.userType);
  return fetch({
    url: 'user/getUserDepInfoByDepIds',
    method: 'post',
    params
  })
}

//按项录入体质健康成绩
export function addFitnessTestListByProject(args){
  let params=new URLSearchParams();
  params.append("classId",args.classId);
  params.append("className",args.className);
  params.append("fitnessTestListJson",args.fitnessTestListJson);
  params.append("schoolYear",args.schoolYear);
  return fetch({
    url: 'structure/schoolFitnessTest/addFitnessTestListByProject',
    method: 'post',
    data:params
  })
}

//根据学生id查询健康评价
export function getFitnessDetailStuRecordId(args){
  let params=new URLSearchParams();
  params.append("schoolId",args.schoolId);
  params.append("schoolYear",args.schoolYear);
  params.append("studentId",args.studentId);
  return fetch({
    url: 'structure/schoolFitnessTest/getFitnessTestDetailByStuId',
    method: 'post',
    params
  })
}

//按学生录入体质健康成绩
export function addFitnessByStudentId(args){
  return fetch({
    url:'structure/schoolFitnessTest/addFitnessTestListByStudentId',
    method:'post',
    headers: {
      'content-type': 'application/json'
    },
    data:JSON.stringify(args)
  })
}

//根据年级ID获得序号
export function getLevelByGradeId(args){
  let params=new URLSearchParams();
  params.append("gradeId",args.gradeId);
  return fetch({
    url: 'depart/getLevelByGradeId',
    method: 'get',
    params
  })
}

//查询部门的上级部门（父部门）
export function getParentByChildId(args){
  let params=new URLSearchParams();
  params.append("childId",args.childId);
  return fetch({
    url: 'depart/getParentByChildId',
    method: 'get',
    params
  })
}
