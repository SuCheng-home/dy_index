import fetch from '@/utils/fetch';

//查询学校所有学期列表
export function getSchoolTimeAllList(){
  let params=new URLSearchParams();
  return fetch({
    url:'structure/schoolTime/getSchoolTimeAllList',
    method:'GET',
    params
  })
}
//荣誉等级分布图
export function gethonorTypeAllChar(args){
  let params=new URLSearchParams();
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  return fetch({
    url:'structure/schoolHonor/gethonorTypeAllChar',
    method:'GET',
    params
  })
}
//各个年级荣誉等级分布
export function getSchoolHonorGradeChar(args){
  let params=new URLSearchParams();
  params.append('endDate', args.endDate);
  params.append('honorTypeId', args.honorTypeId);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorGradeChar',
    method:'GET',
    params
  })
}
//某个年级下所有班级的荣誉等级分布
export function getSchoolHonorClassTypeChar(args){
  let params=new URLSearchParams();
  params.append('endDate', args.endDate);
  params.append('honorTypeId', args.honorTypeId);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('gradeId', args.gradeId);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorClassTypeChar',
    method:'GET',
    params
  })
}

//某班级下的某荣誉等级分布(检索)
export function getSchoolHonorClassDetailDate(args){
  let params=new URLSearchParams();
  params.append('awardTypeCode', args.awardTypeCode);
  params.append('certTypeId', args.certTypeId);
  params.append('classId', args.classId);
  params.append('endDate', args.endDate);
  params.append('honorTypeId', args.honorTypeId);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('stuName', args.stuName);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorClassDetailDate',
    method:'GET',
    params
  })
}

//荣誉分布图
export function gethonorTypeAllGradeChar(args){
  let params=new URLSearchParams();
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  return fetch({
    url:'structure/schoolHonor/gethonorTypeAllGradeChar',
    method:'GET',
    params
  })
}

//某年级下所有班级的荣誉等级分布图
export function gethonorTypeAllClassChar(args){
  let params=new URLSearchParams();
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('gradeId', args.gradeId);
  return fetch({
    url:'structure/schoolHonor/gethonorTypeAllClassChar',
    method:'GET',
    params
  })
}

//某班级的荣誉分布图
export function getSchoolHonorClassChar(args){
  let params=new URLSearchParams();
  params.append('classId', args.classId);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('gradeId', args.gradeId);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorClassChar',
    method:'GET',
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
export function queryClassByGradeId(args) {
  let params = new URLSearchParams();
  params.append('gradeId', args.gradeId);
  return fetch({
    url: 'depart/queryClassByGradeId',
    method: 'POST',
    params
  });
}

//荣誉级别列表(所有,不分页)
export function findSchoolHonorTypeList() {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/schoolHonor/findSchoolHonorTypeList',
    method: 'GET',
    params
  });
}

//荣誉级别列表(所有,不分页)
export function findSchoolHonorTypeCertList() {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/schoolHonor/findSchoolHonorTypeCertList',
    method: 'GET',
    params
  });
}

//学生明细列表(新)
export function classStuHonorStaticsCountInfo(args){
  let params=new URLSearchParams();
  params.append('certTypeId', args.certTypeId);
  params.append('classId', args.classId);
  params.append('gradeId', args.gradeId);
  params.append('schoolTimeId', args.schoolTimeId);
  return fetch({
    url:'structure/schoolHonor/classStuHonorStaticsCountInfo',
    method:'GET',
    params
  })
}

//学生获得的荣誉列表 （有问题）
export function stuSchoolHonorListPage(args){
  let params=new URLSearchParams();
  params.append('stuId', args.stuId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('schoolTimeId', args.schoolTimeId);
  return fetch({
    url:'structure/schoolHonor/stuSchoolHonorListPage',
    method:'GET',
    params
  })
}

//班级统计列表
export function schoolHonorClassAnalysis(args){
  let params=new URLSearchParams();
  params.append('gradeId', args.gradeId);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('certTypeId', args.certTypeId);
  return fetch({
    url:'structure/schoolHonor/schoolHonorClassAnalysis',
    method:'GET',
    params
  })
}

//年级统计列表
export function getstatisticalSchoolHonorGradeList(args){
  let params=new URLSearchParams();
  params.append('selectSchoolTime', args.selectSchoolTime);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('certTypeId', args.certTypeId);
  return fetch({
    url:'structure/schoolHonor/getstatisticalSchoolHonorGradeList',
    method:'GET',
    params
  })
}

//根据荣誉类型分组,查询各个荣誉类型的数量
export function findHonorGroupByCertTypeId(args){
  let params=new URLSearchParams();
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  return fetch({
    url:'structure/schoolHonor/findHonorGroupByCertTypeId',
    method:'GET',
    params
  })
}

// 证书级别(select)
export function findHonorTypeListHistory(args){
  let params=new URLSearchParams();
  params.append('schoolTimeId', args.schoolTimeId);
  return fetch({
    url:'structure/schoolHonor/findHonorTypeListHistory',
    method:'GET',
    params
  })
}

// 证书类型(select)
export function findHonorLevelListHistory(args){
  let params=new URLSearchParams();
  params.append('schoolTimeId', args.schoolTimeId);
  return fetch({
    url:'structure/schoolHonor/findHonorLevelListHistory',
    method:'GET',
    params
  })
}
