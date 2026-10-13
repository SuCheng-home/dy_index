import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
// 获得字典项下的字典列表
export function getDicDetailValuePageList(pageNo,pageSize,dictionaryCode) {
    let params = new URLSearchParams();
    params.append('dictionaryCode', dictionaryCode);
    params.append('pageNo', pageNo);
    params.append('pageSize', pageSize);
    return fetch({
        url: 'structure/schoolDictionary/getDicDetailValuePageList',
        method: 'POST',
        data:params
    });
}
// 保存字典信息
export function saveDicValue(query) {
    let params = new URLSearchParams();
    params.append('code', query.code);
    params.append('dictionaryCode', query.dictionaryCode);
    params.append('id', query.id);
    params.append('remark', query.remark);
    params.append('sort', query.sort);
    params.append('value', query.value);
    return fetch({
        url: 'structure/schoolDictionary/saveDicValue',
        method: 'POST',
        data:params
    });
}
// 根据字典id获得字典详细信息
export function getDicValueInfoById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/schoolDictionary/getDicValueInfoById',
        method: 'POST',
        data:params
    });
}
// 根据ID删除字典信息
export function deleteDicValueById(valueId) {
    let params = new URLSearchParams();
    params.append('valueId', valueId);
    return fetch({
        url: 'structure/schoolDictionary/deleteDicValueById',
        method: 'POST',
        data:params
    });
}
// 获得字典类型信息
export function getDicDetailInfoByCode(code) {
    let params = new URLSearchParams();
    params.append('code', code);
    return fetch({
        url: 'structure/schoolDictionary/getDicDetailInfoByCode',
        method: 'POST',
        data:params
    });
}
export function getSchoolDicTypeInfoByCode(code) {
    let params = new URLSearchParams();
    params.append('code', code);
    return fetch({
        url: 'structure/schoolDictionary/getSchoolDicTypeInfoByCode',
        method: 'POST',
        data:params
    });
}
//保存学校字典类型
export function saveSchoolDicType() {
    let params = new URLSearchParams();
    params.append('code', 'jxt_activities');
    params.append('id', '0');
    params.append('name', '家校通');
    params.append('remark', '');
    return fetch({
        url: 'structure/schoolDictionary/saveSchoolDicType',
        method: 'POST',
        data:params
    });
}
//保存字典项
export function saveDicDetail(code,name) {
    let params = new URLSearchParams();
    params.append('code', code);
    params.append('id', '0');
    params.append('name', name);
    params.append('remark', '');
    params.append('typeCode', 'jxt_activities');
    return fetch({
        url: 'structure/schoolDictionary/saveDicDetail',
        method: 'POST',
        data:params
    });
}
// 获得字典项下的字典列表
export function findSchoolDicsByCode(dicCode) {
    let params = new URLSearchParams();
    params.append('dicCode', dicCode);
    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'POST',
        data:params
    });
}
//获得班级列表
export function querySchoolClass(){
    let params=new URLSearchParams();
    return fetch({
      url:'depart/querySchoolClass',
      method:'GET',
      params
    })
    }
//活动申请统计
export function queryApplyAnalysis(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('searchName', args.searchName);
  return fetch({
      url: 'structure/activitiesApply/queryApplyAnalysis',
      method: 'get',
      params
  });
}
//获取全校已发布的活动申请
export function queryApply(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('searchName', args.searchName);
  params.append('applyType', args.applyType);
  params.append('status', args.status);
  return fetch({
      url: 'structure/activitiesApply/queryApply',
      method: 'get',
      params
  });
}
//删除活动申请
export function deleteApplyById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/activitiesApply/deleteApplyById',
        method: 'get',
        params
    });
}
//审核活动申请
export function auditContentone(id) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/activitiesApply/auditApply',
        method: 'POST',
        data: JSON.stringify({id:id,auditContent:'通过',status:3})
    });
}
//审核活动申请
export function auditContenttwo(id) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/activitiesApply/auditApply',
        method: 'POST',
        data: JSON.stringify({id:id,auditContent:'不通过',status:4})
    });
}
//一键通过
export function aKeyBy() {
    return fetch({
        url: 'structure/activitiesApply/aKeyBy',
        method: 'get'
    });
}
//获取活动申请详情
export function getApplyInfoById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/activitiesApply/getApplyInfoById',
        method: 'get',
        params
    });
}