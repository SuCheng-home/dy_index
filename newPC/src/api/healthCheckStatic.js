import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

//获得用户具备的角色
export function queryRoleList(args) {
  let params = new URLSearchParams();
  params.append('userId', args.userId);
  return systemFetch({
      url: 'api/user/role/queryRoleList',
      method: 'get',
      params
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
////获得班级学生体温检查列表
export function getClassStuDayTemperatureList(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('reportDate', args.reportDate);
  params.append('isOkTemp', args.isOkTemp);
  return fetch({
      url: 'structure/temperatureReport/getClassStuDayTemperatureList',
      method: 'post',
      data:params
  });
}