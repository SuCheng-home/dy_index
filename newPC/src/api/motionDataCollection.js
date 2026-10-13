import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

// 判断该用户是否为运动数据管理员
export const getUserPossessRole = () => {
  let params = new URLSearchParams();
  params.append('roleConstantId', 314);
  return systemFetch({
      url: '/api/user/role/possessRole',
      method: 'GET',
      params
  });
}

// 获取年级列表
export const getSchoolGrade = () =>
  systemFetch({
      url: '/api/depart/querySchoolGrade',
      method: 'GET'
  });

// 根据年级获取对应班级
export const getSchoolClassByGradeId = args => {
  let params = new URLSearchParams();
  params.append('gradeId', args.gradeId);
  return systemFetch({
      url: '/api/depart/queryClassByGradeId',
      method: 'GET',
      params
  });
}

// 获取教师下的班级列表
export const getClassList = args => {
  let params = new URLSearchParams();
  params.append('type', 4);
  return systemFetch({
      url: '/api/depart/getDepartListByUserId',
      method: 'GET',
      params
  });
}

// 获取学员运动信息
export const getMotionDataCollection = args => {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('creatDate', args.creatDate);
  return fetch({
      url: '/structure/sportsReport/listByDateAndClassId',
      method: 'GET',
      params
  })
}

// 提醒上报
export const remindReport = args => {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('creatDate', args.creatDate);
  return fetch({
      url: '/structure/sportsReport/remindNotReportStuListByDateAndClassId',
      method: 'GET',
      params
  })
}