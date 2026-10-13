import fetch from '@/utils/fetch';

export function possessRole(ConstantId) {
  let params = new URLSearchParams();
  params.append('roleConstantId', ConstantId);
  return fetch({
    baseURL: global.BaseNewPath,
    url: 'api/user/role/possessRole',
    method: 'GET',
    params
  });
}
// 获取学期列表
export function getSchoolTimeAllList() {
  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'GET'
  });
}

// 获取学年列表
export function getSchoolYear() {
  return fetch({
    url: 'structure/schoolTime/getSchoolYear',
    method: 'GET'
  });
}

// 获取
export function getCurrentSchoolTimeBySchoolId() {
  return fetch({
    url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
    method: 'GET'
  });
}

//根据用户ID获得管理的班级（包括年级信息）
export function getClassAndGradeByManagerId(args){
  let params = new URLSearchParams();
  params.append('managerId', args.managerId);
  return fetch({
    url: 'depart/getClassAndGradeByManagerId',
    method: 'GET',
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
    })
}
//根据年级ID获得班级列表
export function queryClassByGradeId(args) {
  let params = new URLSearchParams();
  params.append('gradeId', args.gradeId);
  return fetch({
    url: 'depart/queryClassByGradeId',
    method: 'POST',
    params
  });
}
//学生积分统计,gradeId=0,classId=0,代表全部
export function stuPointAnalysis(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('gradeId', args.gradeId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('schoolYearId', args.schoolYearId);
  params.append('searchName', args.searchName);
  return fetch({
    url: 'structure/creditPoint/stuPointAnalysis',
    method: 'POST',
    params
  });
}
//获取学生的自主申领记录(pc分页)
export function queryApplyRecord(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('gradeId', args.gradeId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('schoolId', args.schoolId);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('searchName', args.searchName);
  params.append('week', args.week);
  return fetch({
    url: 'structure/creditPoint/queryApplyRecord',
    method: 'POST',
    params
  });
}
//物品统计gradeId=0,classId=0,代表全部
export function goodAnalysis(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('gradeId', args.gradeId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('schoolId', args.schoolId);
  params.append('schoolYearId', args.schoolYearId);
  params.append('searchName', args.searchName);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  return fetch({
    url: 'structure/creditPoint/goodAnalysis',
    method: 'POST',
    params
  });
}
//学期末推送消息给家长
export function sendMsgToParent(args) {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/creditPoint/sendMsgToParent',
    method: 'POST',
    params
  });
}

//物品统计gradeId=0,classId=0,代表全部
export function stuGoodAnalysisByGoodId(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('gradeId', args.gradeId);
  params.append('goodId', args.goodId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('schoolYearId', args.schoolYearId);
  params.append('schoolId', args.schoolId);
  params.append('searchName', args.searchName);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  return fetch({
    url: 'structure/creditPoint/stuGoodAnalysisByGoodId',
    method: 'POST',
    params
  });
}

//查询用户所负责的部门列表
export function getDepartListByUserId(args) {
  let params = new URLSearchParams();
  params.append('pid', args.pid);
  params.append('type', args.type);
  return fetch({
    url: 'depart/getDepartListByUserId',
    method: 'POST',
    params
  });
}
