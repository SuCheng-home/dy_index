import fetch from '@/utils/fetch';
import {getAxiosService} from '@/utils/fetch';
const longFetch = getAxiosService({
    timeout: 300000
});
// 根据schoolId分页获取消毒场所
export function queryPlaceBySchoolId(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    return fetch({
        url: 'structure/sterilize/queryPlaceBySchoolId',
        method: 'get',
         params
    });
}
// 根据ids删除消毒场所
export function deletePlace(ids) {
    let params = new URLSearchParams();
    params.append('ids', ids);
    return longFetch({
        url: 'structure/sterilize/deletePlace',
        method: 'get',
        params
    });
}
// 新增消毒场所
export function insertPlace(args) {
    let params = new URLSearchParams();
    params.append('checkUserJson', args.checkUserJson);
    params.append('placeName', args.placeName);
    params.append('placeOrder', args.placeOrder);
    params.append('strategyId', args.strategyId);
    params.append('strategyName', args.strategyName);
    return fetch({
        url: 'structure/sterilize/insertPlace',
        method: 'post',
        data:params
    });
}
// 编辑消毒场所
export function editPlace(args) {
    let params = new URLSearchParams();
    params.append('checkUserJson', args.checkUserJson);
    params.append('placeName', args.placeName);
    params.append('placeOrder', args.placeOrder);
    params.append('strategyId', args.strategyId);
    params.append('strategyName', args.strategyName);
    params.append('id', args.id);
    return fetch({
        url: 'structure/sterilize/editPlace',
        method: 'post',
        data:params
    });
}
//根据id获取消毒场所详情
export function getPlaceById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/sterilize/getPlaceById',
        method: 'get',
        params
    });
}
//初始化班级场所
export function initClassPlace(strategyId) {
    let params = new URLSearchParams();
    params.append('strategyId', strategyId);
    return longFetch({
        url: 'structure/sterilize/initClassPlace',
        method: 'get',
        params
    });
}
// 根据id删除消毒cl
export function deleteStategyById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/sterilize/deleteStategyById',
        method: 'get',
        params
    });
}
// 根据id获取消毒策略详情
export function getStategyById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/sterilize/getStategyById',
        method: 'get',
        params
    });
}
// 根据schoolId获取消毒策略
export function listStrategyBySchoolId() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/sterilize/listStrategyBySchoolId',
        method: 'get'
    });
}
//新增消毒策略
export function insertStrategy(args) {
    let params = new URLSearchParams();
    params.append('checkPhoto', args.checkPhoto);
    params.append('checkRemark', args.checkRemark);
    params.append('checkStrategyJson', args.checkStrategyJson);
    params.append('strategyName', args.strategyName);
    return fetch({
        url: 'structure/sterilize/insertStrategy',
        method: 'post',
        data:params
    });
}
//编辑消毒策略
export function editStrategy(args) {
    let params = new URLSearchParams();
    params.append('checkPhoto', args.checkPhoto);
    params.append('checkRemark', args.checkRemark);
    params.append('checkStrategyJson', args.checkStrategyJson);
    params.append('strategyName', args.strategyName);
    params.append('id', args.id);
    return fetch({
        url: 'structure/sterilize/editStrategy',
        method: 'post',
        data:params
    });
}
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
    params.append('code', 'ventilatearoombig');
    params.append('id', '0');
    params.append('name', '通风打卡');
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
    params.append('typeCode', 'ventilatearoombig');
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
//立即生效
export function generateRecord() {
    return fetch({
        url: 'structure/sterilize/generateRecord',
        method: 'get'
    });
}

//根据schoolId和时间获取上报记录
export function recordListBySchoolIdAndDate(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolId', args.schoolId);
    params.append('searchName', args.searchName);
    return fetch({
        url: 'structure/sterilize/recordListBySchoolIdAndDate',
        method: 'get',
        params
    });
}
//统计
export function recordAnalysis(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('schoolId', args.schoolId);
    return fetch({
        url: 'structure/sterilize/recordAnalysis',
        method: 'get',
        params
    });
}
// 根据上报id获取上报详情
export function recordInfoById(recordId) {
    let params = new URLSearchParams();
    params.append('recordId', recordId);
    return fetch({
        url: '/structure/sterilize/recordInfoById',
        method: 'get',
        params
    });
}