import fetch from '@/utils/fetch';
import { systemFetch,homeworkfetch} from '@/utils/fetch';
// 获取年级列表
export const getSchoolGrade = () =>
  systemFetch({
      url: '/api/depart/querySchoolGrade',
      timeout: 300000,
      method: 'GET'
  });
//根据学校id，年级id，班级id,学生id查询类型统计
export function getTypeListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  params.append('studentId', listQuery.studentId); 
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getTypeListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id查询学生统计
export function getStuListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  params.append('studentId', listQuery.studentId); 
  params.append('pageSize', listQuery.pageSize); 
  params.append('pageNo', listQuery.pageNo); 
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getStuListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id,学生id查询最早创建日期、评价次数及评价次数最多的一天
export function getBehEvalRecordStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  params.append('studentId', listQuery.studentId); 
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getBehEvalRecordStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id,学生id查询学年统计
export function getSchoolYearListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  params.append('studentId', listQuery.studentId); 
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getSchoolYearListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id,学生id查询科目统计
export function getCurrListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  params.append('studentId', listQuery.studentId); 
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getCurrListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id查询科目最高分统计
export function getCurrMaxListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getCurrMaxListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id查询班级统计
export function getClassListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getClassListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id,班级id查询班级学年排名
export function getClassRankListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getClassRankListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id查询性别统计
export function getGenderListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getGenderListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id,学生id科目查询学期排名统计
export function getStuCurrListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  params.append('studentId', listQuery.studentId); 
  params.append('schoolTimeId', listQuery.schoolTimeId); 
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getStuCurrListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//根据学校id，年级id，班级id,学生id科目查询学期排名统计
export function getStuTimeListStatic(listQuery) {
  let params = new URLSearchParams();
  params.append('classId', listQuery.classId);
  params.append('gradeId', listQuery.gradeId);
  params.append('schoolId', listQuery.schoolId);  
  params.append('studentId', listQuery.studentId); 
  params.append('curriculumId', listQuery.curriculumId); 
  return homeworkfetch({
      url: 'common/schoolBehEvalRecord/getStuTimeListStatic',
      method: 'get',
      timeout: 300000,
      params
  });
}
//学生ID查询信息
export function info(idsStr) {
  let params = new URLSearchParams();
  params.append('idsStr', idsStr); 
  return systemFetch({
      url: 'common/student/info',
      method: 'get',
      timeout: 300000,
      params
  });
}