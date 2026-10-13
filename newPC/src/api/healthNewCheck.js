import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

//获得学校教师体温统计数据
export function getSchoolThTempStaticsData(args) {
  let params = new URLSearchParams();
  params.append('day', args.day);
  return fetch({
      url: 'structure/temperatureReport/getSchoolThTempStaticsData',
      method: 'post',
      data: params
  });
}

//获得学校学生体温出勤统计数据
export function getSchoolStuTempAndDutyStaticsData(args) {
  let params = new URLSearchParams();
  params.append('day', args.day);
  return fetch({
      url: 'structure/temperatureReport/getSchoolStuTempAndDutyStaticsData',
      method: 'post',
      data: params
  });
}

//获得学校教师日体温上报列表（分页）
export function getSchoolThDayTempPageList(args) {
  let params = new URLSearchParams();
  params.append('day', args.day);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  return fetch({
      url: 'structure/temperatureReport/getSchoolThDayTempPageList',
      method: 'post',
      data: params
  });
}

//获得年级列表
export function querySchoolGrade(args) {
  let params = new URLSearchParams();
  params.append('isFilterNewGrade', args.isFilterNewGrade);
  return systemFetch({
      url: 'api/depart/querySchoolGrade',
      method: 'get',
      params
  });
}
//根据年级ID获得班级列表
export function queryClassByGradeId(args) {
  let params = new URLSearchParams();
  params.append('gradeId', args.gradeId);
  return systemFetch({
      url: 'api/depart/queryClassByGradeId',
      method: 'get',
      params
  });
}

//获得班级学生体温检查列表
export function getClassStuDayTempAndDutyList(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('isOkTemp', args.isOkTemp);
  params.append('reportDate', args.reportDate);
  params.append('dataFrom', args.dataFrom);
  return fetch({
      url: 'structure/temperatureReport/getClassStuDayTempAndDutyList',
      method: 'post',
      data: params
  });
}