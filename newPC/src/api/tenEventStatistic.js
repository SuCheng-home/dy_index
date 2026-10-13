import fetch from '@/utils/fetch';

// 获取学期列表
export function getSchoolTimeAllList() {
  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'GET'
  });
}

//获得年级列表
export function querySchoolGrade() {
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

//某学期,某年级level,上/下学期的事件详情(列表)
export function findThingByGradeLevel(args) {
  let params = new URLSearchParams();
  params.append('gradeLevel', args.gradeLevel);
  params.append('schoolTimeId', args.schoolTimeId);
  return fetch({
    url: 'structure/eachYearTenThings/findThingTypeListByGradeLevelAndTimeId',
    method: 'get',
    params
  });
}

//列表
export function statisticThingsListByPage(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('gradeId', args.gradeId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('schoolTimeId', args.schoolTimeId);
  params.append('stuName', args.stuName);
  params.append('thingsTypeId', args.thingsTypeId);
  return fetch({
    url: 'structure/eachYearTenThings/statisticThingsListByPage',
    method: 'get',
    params
  });
}

//查看事情(详情)
export function getThingById(args) {
  let params = new URLSearchParams();
  params.append('id', args.id);
  return fetch({
    url: 'structure/eachYearTenThings/getThingById',
    method: 'get',
    params
  });
}