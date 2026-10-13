import fetch from '@/utils/fetch';
import {
    wymsFetchNoProcess
} from '@/utils/fetch';
//根据schoolId分页获取订单
export function queryOrderBySchoolId(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('status', query.status);
    params.append('typeId', query.typeId || 0);
    // params.append('typeId', query.typeId || 0);
    return fetch({
        url: 'structure/good/queryOrderBySchoolId',
        method: 'get',
        params
    });
}
//获取物品统计
export function orderAnalysisByGood(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'structure/good/orderAnalysisByGood',
        method: 'get',
        params
    });
}
//获取教师订单统计
export function orderAnalysisByUser(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'structure/good/orderAnalysisByUser',
        method: 'get',
        params
    });
}
//根据开始时间和结束时间获取部门统计
export function goodDepartAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'structure/good/goodDepartAnalysis',
        method: 'get',
        params
    });
}
//根据开始时间和结束时间获取部门统计
export function giveBackGoodOrderAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'structure/good/giveBackGoodOrderAnalysis',
        method: 'get',
        params
    });
}
// 查询用户所负责的部门列表
export function queryDepartByUserId() {

    return fetch({
        url: 'userDepart/queryDepartByUserId',
        method: 'get'
    });
}
//提交订单
export function submitOrder(query) {
    let params = new URLSearchParams();
    params.append('content', query.content);
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('orderDetailsJson', query.orderDetailsJson);
    return fetch({
        url: 'structure/good/submitOrder',
        method: 'post',
        data: params
    });
}
//根据开始时间和结束时间获取易耗品统计
export function easyConsumeGoodAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'structure/good/easyConsumeGoodAnalysis',
        method: 'get',
        params
    });
}
//根据部门id, 开始时间和结束时间获取部门订单
export function goodOrderByDepartId(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('departId', query.departId);
    return fetch({
        url: 'structure/good/goodOrderByDepartId',
        method: 'get',
        params
    });
}
//根据物品id, 开始时间和结束时间获取需要归还的订单, type=0代表获取借出订单，type=
export function queryGiveBackGoodOrder(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('goodId', query.goodId);
    params.append('type', query.type);
    return fetch({
        url: 'structure/good/queryGiveBackGoodOrder',
        method: 'get',
        params
    });
}
//根据用户id获取物品订单
export function orderByUserId(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('userId', query.userId);
    return fetch({
        url: 'structure/good/orderByUserId',
        method: 'get',
        params
    });
}
//根据goodId获取这段时间用户订单数
export function orderAnalysisByGoodIdGroupByUserId(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('goodId', query.goodId);
    return fetch({
        url: 'structure/good/orderAnalysisByGoodIdGroupByUserId',
        method: 'get',
        params
    });
}
//根据goodId获取这段时间用户订单数
export function queryGoodStatistics(query) {
    let params = new URLSearchParams();
    params.append('goodName', query.goodName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('goodTypeId', query.goodTypeId);
    return fetch({
        url: 'structure/good/queryGoodStatistics',
        method: 'get',
        params
    });
}
export function queryGoodStorageRecordByGoodId(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('goodId', query.goodId);
    return fetch({
        url: 'structure/good/queryGoodStorageRecordByGoodId',
        method: 'get',
        params
    });
}
export function queryGoodStatisticsDetails(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('goodId', query.goodId);
    params.append('searchType', query.searchType);
    return fetch({
        url: 'structure/good/queryGoodStatisticsDetails',
        method: 'get',
        params
    });
}

//根据goodId和用户id获取物品订单
export function orderByGoodIdAndUserId(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('goodId', query.goodId);
    params.append('userId', query.userId);
    return fetch({
        url: 'structure/good/orderByGoodIdAndUserId',
        method: 'get',
        params
    });
}


//获取物品类型数据
export function goodTypeData() {
    return fetch({
        url: 'structure/good/goodTypeData',
        method: 'get'
    });
}
//获取物品类型下的物品
export function queryGoodByTypeId(query) {
    let params = new URLSearchParams();
    params.append('goodTypeId', query.goodTypeId);
    params.append('searchName', query.searchName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    return fetch({
        url: 'structure/good/queryGoodByTypeId',
        method: 'get',
        params
    });
}
//入库
export function goodStorage(query, goodCount) {
    let params = new URLSearchParams();
    params.append('goodBrand', query.goodBrand);
    params.append('goodId', query.id);
    params.append('goodName', query.goodName);
    params.append('goodPrice', query.goodPrice);
    params.append('goodSpec', query.goodSpec);
    params.append('goodTypeId', query.goodTypeId);
    params.append('goodTypeName', query.goodTypeName);
    params.append('goodUrl', query.goodUrl);
    params.append('goodCount', goodCount);
    return fetch({
        url: 'structure/good/goodStorage',
        method: 'post',
        data: params
    });
}
//删除物品分类
export function deleteGoodType(goodTypeId) {
    let params = new URLSearchParams();
    params.append('goodTypeId', goodTypeId);
    return fetch({
        url: 'structure/good/deleteGoodType',
        method: 'get',
        params
    });
}
//删除物品分类
export function deleteGood(goodIds) {
    let params = new URLSearchParams();
    params.append('goodIds', goodIds);
    return fetch({
        url: 'structure/good/deleteGood',
        method: 'get',
        params
    });
}

//获取物品领取情况
export function queryOrderDetailsByGoodId(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('goodId', query.goodId);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/good/queryOrderDetailsByGoodId',
        method: 'get',
        params
    });
}
//入库记录
export function queryGoodStorageRecord(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('goodTypeId', query.goodTypeId);
    params.append('goodName', query.goodName);
    return fetch({
        url: 'structure/good/queryGoodStorageRecord',
        method: 'get',
        params
    });
}
//获取子类型
export function querySGoodType() {
    return fetch({
        url: 'structure/good/querySGoodType',
        method: 'get'
    });
}
//获取父类型
export function queryFGoodType() {
    return fetch({
        url: 'structure/good/queryFGoodType',
        method: 'get'
    });
}
//新增物品类型
export function insertGoodType(query) {
    let params = new URLSearchParams();
    params.append('level', query.level);
    params.append('pId', query.pId);
    params.append('typeName', query.typeName);
    params.append('userJson', query.userJson);
    params.append('orderNum', query.orderNum);
    params.append('limitUserIds', query.limitUserIds);
    params.append('limitUserJson', query.limitUserJson);
    params.append('isLimit', query.isLimit);
    return fetch({
        url: 'structure/good/insertGoodType',
        method: 'post',
        data: params
    });
}
//编辑物品类型
export function editGoodType(query) {
    let params = new URLSearchParams();
    params.append('level', query.level);
    params.append('pId', query.pId);
    params.append('id', query.id);
    params.append('typeName', query.typeName);
    params.append('userJson', query.userJson);
    params.append('orderNum', query.orderNum);
    params.append('limitUserIds', query.limitUserIds);
    params.append('limitUserJson', query.limitUserJson);
    params.append('isLimit', query.isLimit);
    return fetch({
        url: 'structure/good/editGoodType',
        method: 'post',
        data: params
    });
}

//根据id获取类型详情
export function getGoodTypeById(goodTypeId) {
    let params = new URLSearchParams();
    params.append('goodTypeId', goodTypeId);
    return fetch({
        url: 'structure/good/getGoodTypeById',
        method: 'get',
        params
    });
}

//新增物品
export function insertGood(query) {
    let params = new URLSearchParams();
    params.append('easyConsumeGood', query.easyConsumeGood);
    params.append('goodBrand', query.goodBrand);
    params.append('goodName', query.goodName);
    params.append('goodPrice', query.goodPrice);
    params.append('goodSpec', query.goodSpec);
    params.append('goodTypeId', query.goodTypeId);
    params.append('goodTypeName', query.goodTypeName);
    params.append('goodUrl', query.goodUrl);
    params.append('isExamine', query.isExamine);
    params.append('needGiveBack', query.needGiveBack);
    // params.append('repertory', query.repertory);
    params.append('unitId', query.unitId);
    params.append('unitName', query.unitName);
    params.append('userJson', query.userJson);
    params.append('virtualGood', query.virtualGood);
    params.append('warn', query.warn);
    params.append('warnNum', query.warnNum);
    return fetch({
        url: 'structure/good/insertGood',
        method: 'post',
        data: params
    });
}
//编辑物品
export function editGood(query) {
    let params = new URLSearchParams();
    params.append('easyConsumeGood', query.easyConsumeGood);
    params.append('goodBrand', query.goodBrand);
    params.append('goodName', query.goodName);
    params.append('goodPrice', query.goodPrice);
    params.append('goodSpec', query.goodSpec);
    params.append('goodTypeId', query.goodTypeId);
    params.append('goodTypeName', query.goodTypeName);
    params.append('goodUrl', query.goodUrl);
    params.append('isExamine', query.isExamine);
    params.append('needGiveBack', query.needGiveBack);
    // params.append('repertory', query.repertory);
    params.append('unitId', query.unitId);
    params.append('unitName', query.unitName);
    params.append('userJson', query.userJson);
    params.append('virtualGood', query.virtualGood);
    params.append('warn', query.warn);
    params.append('warnNum', query.warnNum);
    params.append('id', query.id);
    return fetch({
        url: 'structure/good/editGood',
        method: 'post',
        data: params
    });
}

//字典值列表
export function listValue() {
    let params = new URLSearchParams();
    params.append('key', 'goodUnit');
    return wymsFetchNoProcess({
        url: 'sysDic/listValue?pageSize=500',
        method: 'get',
        params
    });
}

//根据id获取物品详情
export function getGoodById(goodId) {
    let params = new URLSearchParams();
    params.append('goodId', goodId);
    return fetch({
        url: 'structure/good/getGoodById',
        method: 'get',
        params
    });
}

//删除
export function deleteOrder(orderId) {
    let params = new URLSearchParams();
    params.append('orderId', orderId);
    return fetch({
        url: 'structure/good/deleteOrderAllGood',
        method: 'get',
        params
    });
}

//获取类型下所有物品领取情况
export function queryOrderDetailsByGoodTypeId(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('goodTypeId', query.goodTypeId);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/good/queryOrderDetailsByGoodTypeId',
        method: 'get',
        params
    });
}
//根据学校id查询物品一级类型 2025-02-24
export function getGoodOneTypeListBySchoolId() {
    return fetch({
        url: 'structure/good/getGoodOneTypeListBySchoolId',
        method: 'get'
    });
}
//分页查询个人订单
export function queryOrderByUserId(args) {
    let params = new URLSearchParams();
    params.append('page', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('endDate', args.endDate);
    return fetch({
        url: 'structure/good/queryOrderByUserId',
        method: 'POST',
        data: params
    });
}

export function getExamineDetails(orderDetailsId) {
    let params = new URLSearchParams();
    params.append('orderDetailsId', orderDetailsId);
    return fetch({
        url: 'structure/good/getExamineDetails',
        method: 'get',
        params
    });
}

export function getGoodGiveBackList(orderDetailsId) {
    let params = new URLSearchParams();
    params.append('orderDetailsId', orderDetailsId);
    return fetch({
        url: 'structure/good/getGoodGiveBackList',
        method: 'get',
        params
    });
}