import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

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

//查询每个年级上学期和下学期各设置了多少了事情类型 列表
export function findThingsGroupByGradeId(args) {
  let params = new URLSearchParams();
  return fetch({
    url:'structure/eachYearTenThings/findThingsTypeListGroupByGradeId',
    method: 'get',
    params
  });
}

//新增-事件类型
export function insertThingType(args) {
  let params = new URLSearchParams();
  return fetch({
      url: 'structure/eachYearTenThings/insertThingType',
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      data:JSON.stringify(args)
  });
}

//修改-事件类型
export function updateThingType(args) {
  let params = new URLSearchParams();
  return fetch({
      url: 'structure/eachYearTenThings/updateThingType',
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      data:JSON.stringify(args)
  });
}

//删除-事件类型
export function deleteThingType(args) {
  let params = new URLSearchParams();
  params.append('id', args.id);
  return fetch({
    url:'structure/eachYearTenThings/deleteThingType',
    method: 'post',
    data:params
  });
}

//某个年级上,下学期的事件详情(列表)
export function findThingByGradeLevel(args) {
  let params = new URLSearchParams();
  params.append('gradeLevel', args.gradeLevel);
  return fetch({
    url:'structure/eachYearTenThings/findThingTypeListByGradeLevel',
    method: 'get',
    params
  });
}