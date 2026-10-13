import fetch from '@/utils/fetch';

//荣誉类型列表
export function schoolHonorTypeCertList(args){
  let params=new URLSearchParams();
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  return fetch({
    url:'structure/schoolHonor/schoolHonorTypeCertList',
    method:'GET',
    params
  })
}

//新增荣誉类型
export function addSchoolHonorTypeCert(args){
  return fetch({
    url:'structure/schoolHonor/addSchoolHonorTypeCert',
    method:'post',
    headers: {
      'content-type': 'application/json'
    },
    data:JSON.stringify(args)
  })
}

//单个荣誉类型信息
export function getSchoolHonorTypeId(args){
  let params=new URLSearchParams();
  params.append('typeId', args.typeId);
  return fetch({
    url:'structure/schoolHonor/getSchoolHonorTypeCertByTypeId',
    method:'GET',
    params
  })
}

//修改荣誉类型
export function updateSchoolHonorTypeCert(args){
  return fetch({
    url:'structure/schoolHonor/updateSchoolHonorTypeCert',
    method:'post',
    headers: {
      'content-type': 'application/json'
    },
    data:JSON.stringify(args)
  })
}

//删除荣誉类型(支持批量)
export function delSchoolHonorTypeCert(args){
  let params=new URLSearchParams();
  params.append('typeIds', args.typeIds);
  return fetch({
    url:'structure/schoolHonor/delSchoolHonorTypeCert',
    method:'post',
    params
  })
}

// 获奖等级列表
export function listBySchoolId(args){
  let params=new URLSearchParams();
  return fetch({
    url:'structure/schoolHonorAwardLevel/listBySchoolId',
    method:'GET',
    params
  })
}

// 新增获奖等级
export function levelInsert(args){
  return fetch({
    url:'structure/schoolHonorAwardLevel/insert',
    method:'post',
    headers: {
      'content-type': 'application/json'
    },
    data:JSON.stringify(args)
  })
}

// 编辑获奖等级
export function levelUpdate(args){
  return fetch({
    url:'structure/schoolHonorAwardLevel/update',
    method:'post',
    headers: {
      'content-type': 'application/json'
    },
    data:JSON.stringify(args)
  })
}

// 单个获奖等级信息
export function getLevelId(args){
  let params=new URLSearchParams();
  params.append('id', args.id);
  return fetch({
    url:'structure/schoolHonorAwardLevel/getById',
    method:'GET',
    params
  })
}

// 删除获奖等级
export function deleteLevelById(args){
  let params=new URLSearchParams();
  params.append('id', args.id);
  return fetch({
    url:'structure/schoolHonorAwardLevel/deleteById',
    method:'post',
    params
  })
}
