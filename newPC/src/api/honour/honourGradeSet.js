import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

//荣誉级别列表
export function schoolHonorTypeList(args){
  let params=new URLSearchParams();
  params.append('honorTypeName', args.honorTypeName);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  return fetch({
    url:'structure/schoolHonor/schoolHonorTypeList',
    method:'GET',
    params
  })
}

//新增荣誉级别
export function addSchoolHonorType(args){
  return fetch({
    url:'structure/schoolHonor/addSchoolHonorType',
    method:'POST',
    headers: {
      'content-type': 'application/json'
    },
    data:JSON.stringify(args)
  })
}

//单个荣誉级别信息
export function getSchoolHonorTypeById(args){
  let params=new URLSearchParams();
  params.append('honorTypeId', args.honorTypeId);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorTypeById',
    method:'GET',
    params
  })
}

//修改荣誉级别
export function updateSchoolHonorType(args){
  return fetch({
    url:'structure/schoolHonor/updateSchoolHonorType',
    method:'post',
    headers:{
      'content-type':'application/json'
    },
    data:JSON.stringify(args)
  })
}

//删除荣誉级别(批量删除)
export function delSchoolHonorType(args){
  let params=new URLSearchParams();
  params.append('honorTypeIds', args.honorTypeIds);
  return fetch({
    url:'structure/schoolHonor/delSchoolHonorType',
    method:'post',
    params
  })
}

//机构列表
export function getSchoolHonororganList(args){
  let params=new URLSearchParams();
  params.append('honorTypeId', args.honorTypeId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorTypeIssueorganList',
    method:'get',
    params
  })
}

//新增机构信息
export function addSchoolHonororgan(args){
  return fetch({
    url:'structure/schoolHonor/addSchoolHonorTypeIssueorgan',
    method:'post',
    headers:{
      'content-type':'application/json'
    },
    data:JSON.stringify(args)
  })
}

//单个机构信息
export function getSchoolHonororganById(args){
  let params=new URLSearchParams();
  params.append('honorTypeId', args.honorTypeId);
  params.append('issId', args.issId);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorTypeIssueorganById',
    method:'get',
    params
  })
}

//修改机构信息
export function updateSchoolHonororgan(args){
  let params=new URLSearchParams();
  params.append('id', args.id);
  params.append('issueOrgan', args.issueOrgan);
  return fetch({
    url:'structure/schoolHonor/updateSchoolHonorTypeIssueorgan',
    method:'post',
    params
  })
}

//删除机构(批量删除)
export function delSchoolHonororgan(args){
  let params=new URLSearchParams();
  params.append('issIds', args.issIds);
  return fetch({
    url:'structure/schoolHonor/delSchoolHonorTypeIssueorgan',
    method:'post',
    params
  })
}

//新增或修改提醒设置信息
export function schoolHonorRemindSet(args){
  return fetch({
    url:'structure/schoolHonor/schoolHonorRemindSet',
    method:'post',
    headers:{
      'content-type':'application/json'
    },
    data:JSON.stringify(args)
  })
}

//提醒设置信息
export function honorRemindSetPage(args){
  let params=new URLSearchParams();
  return fetch({
    url:'structure/schoolHonor/honorRemindSetPage',
    method:'get',
    params
  })
}
// 新增荣誉标题
export function addSchoolHonorTitle(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolHonor/addSchoolHonorTitle',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
// 修改荣誉标题
export function updateSchoolHonorTitle(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolHonor/updateSchoolHonorTitle',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
// 荣誉类型列表(所有,不分页)
export function findSchoolHonorTypeCertList() {
    return fetch({
        url: 'structure/schoolHonor/findSchoolHonorTypeCertList',
        method: 'GET',
    })
}
//
export function findSchoolHonorTypeList() {
    return fetch({
        url: 'structure/schoolHonor/findSchoolHonorTypeList',
        method: 'GET',
    })
}
//
export function listBySchoolId() {
    return fetch({
        url: 'structure/schoolHonorAwardLevel/listBySchoolId',
        method: 'GET',
    })
}
// 查询荣誉标题列表
export function getSchoolHonorTitleList(args = {}) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolHonor/getSchoolHonorTitleList',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
// 询荣誉标题
export function getSchoolHonorTitle(args) {
    let params = new URLSearchParams();
    params.append('titleId', args.titleId);

    return fetch({
        url: 'structure/schoolHonor/getSchoolHonorTitle',
        method: 'GET',
        params
    })
}
// 删除荣誉标题
export function delSchoolHonorTitle(args) {
    let params = new URLSearchParams();
    params.append('titleId', args.titleId);

    return fetch({
        url: 'structure/schoolHonor/delSchoolHonorTitle',
        method: 'GET',
        params
    })
}
//
export function listGradeLevel() {
    return systemFetch({
        url: 'api/depart/listGradeLevel',
        method: 'GET'
    })
}
//学生荣誉信息(单个)
export function getSchoolHonorStuById(args) {
    let params = new URLSearchParams();
    params.append('honorStuId', args.honorStuId);
    return fetch({
        url: 'structure/schoolHonor/getSchoolHonorStuById',
        method: 'get',
        params
    });
}
//机构列表
export function getSchoolHonorTypeIssueorganList(args) {
    let params = new URLSearchParams();
    params.append('honorTypeId', args.honorTypeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
        url: 'structure/schoolHonor/getSchoolHonorTypeIssueorganList',
        method: 'get',
        params
    });
}
//修改孩子荣誉
export function updateSchoolHonorStu(args) {
    return fetch({
        url: 'structure/schoolHonor/updateSchoolHonorStu',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(args)
    })
}
//修改孩子荣誉(老师端)
export function updateSchoolHonorStuHead(args) {
    return fetch({
        url: 'structure/schoolHonor/updateSchoolHonorStuHead',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(args)
    })
}
//根据年级ID获得序号
export function getLevelByGradeId(args){
    let params=new URLSearchParams();
    params.append("gradeId",args.gradeId);
    return systemFetch({
        url: 'api/depart/getLevelByGradeIdPerfect',
        method: 'get',
        params
    })
}
// 复制上学期荣誉标题
export function copySchoolHonorTitle(){
    let params=new URLSearchParams();
    return fetch({
        url: 'structure/schoolHonor/copySchoolHonorTitle',
        method: 'get'
    })
}
// 批量删除荣誉标题
export function delSchoolHonorTitleList(args){
    let params=new URLSearchParams();
    return fetch({
        url: 'structure/schoolHonor/delSchoolHonorTitleList',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(args)
    })
}
