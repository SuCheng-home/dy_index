import fetch from '@/utils/fetch';
//分页获取类型列表
export function queryPastryTypeBySchoolId(schoolId) {
    let params = new URLSearchParams();
    params.append("schoolId", schoolId);
    return fetch({
        url: 'structure/pastry/queryPastryTypeBySchoolId',
        method: 'get',
        params
    });
  }
//根据id 获取类型详情
export function getPastryTypeById(id) {
    let params = new URLSearchParams();
    params.append("id", id);
    return fetch({
        url: 'structure/pastry/getPastryTypeById',
        method: 'get',
        params
    });
  }
//根据id 删除类型
export function deletePastryTypeById(id) {
    let params = new URLSearchParams();
    params.append("id", id);
    return fetch({
        url: 'structure/pastry/deletePastryTypeById',
        method: 'get',
        params
    });
  }
  //保存面点类型
  export function insertPastryType(query) {
    let params = new URLSearchParams();
    params.append('afterDate', query.afterDate);
    params.append('afterDay', query.afterDay);
    params.append('barCode', query.barCode);
    params.append('endDate', query.endDate);
    params.append('maxCount', query.maxCount);
    params.append('mostDay', query.mostDay);
    params.append('startDate', query.startDate);
    params.append('typeName', query.typeName);
    params.append('typeOrder', query.typeOrder);
    params.append('typePayWay', query.typePayWay);
    params.append('typeUrl', query.typeUrl);
    params.append('userJSON', query.userJSON);
    return fetch({
        url: 'structure/pastry/insertPastryType',
        method: 'post',
        data:params
    });
}
//编辑面点类型
export function editPastryType(query) {
    let params = new URLSearchParams();
    params.append('afterDate', query.afterDate);
    params.append('afterDay', query.afterDay);
    params.append('barCode', query.barCode);
    params.append('endDate', query.endDate);
    params.append('maxCount', query.maxCount);
    params.append('mostDay', query.mostDay);
    params.append('startDate', query.startDate);
    params.append('typeName', query.typeName);
    params.append('typeOrder', query.typeOrder);
    params.append('typePayWay', query.typePayWay);
    params.append('typeUrl', query.typeUrl);
    params.append('userJSON', query.userJSON);
    params.append('id', query.id);
    return fetch({
        url: 'structure/pastry/editPastryType',
        method: 'post',
        data:params
    });
}
//校园收费收费关系列表
export function querySchoolChargeRelationList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'schoolCharge/querySchoolChargeRelationList',
        method: 'get',
        params
    });
  }
//分页获取学校面点库面点
export function queryPastryBySchoolId(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/pastry/queryPastryBySchoolId',
        method: 'get',
        params
    });
}
//删除面点
export function deletePastryById(pastryId) {
    let params = new URLSearchParams();
    params.append("pastryId", pastryId);
    return fetch({
        url: 'structure/pastry/deletePastryById',
        method: 'get',
        params
    });
  }
  //根据面点id获取面点
export function getPastryById(pastryId) {
    let params = new URLSearchParams();
    params.append("pastryId", pastryId);
    return fetch({
        url: 'structure/pastry/getPastryById',
        method: 'get',
        params
    });
  }
 //新增面点
 export function createPastry(query) {
    let params = new URLSearchParams();
    params.append('pastryName', query.pastryName);
    params.append('pastryPrice', query.pastryPrices);
    params.append('pastryRemark', query.pastryRemark);
    params.append('pastryUrl', query.pastryUrl);
    params.append('shelfState', query.shelfState);
    params.append('shelfDate', query.shelfDate);
    params.append('typeId', query.typeId);
    params.append('typeName', query.typeName);
    return fetch({
        url: 'structure/pastry/createPastry',
        method: 'post',
        data:params
    });
}
 //编辑面点
 export function updatePastry(query) {
    let params = new URLSearchParams();
    params.append('pastryName', query.pastryName);
    params.append('pastryPrice', query.pastryPrices);
    params.append('pastryRemark', query.pastryRemark);
    params.append('pastryUrl', query.pastryUrl);
    params.append('shelfState', query.shelfState);
    params.append('shelfDate', query.shelfDate);
    params.append('typeId', query.typeId);
    params.append('typeName', query.typeName);
    params.append('id', query.id);
    return fetch({
        url: 'structure/pastry/updatePastry',
        method: 'post',
        data:params
    });
}
//获取用户管理的面点类型
export function getTypeListByUserId() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/pastry/getTypeListByUserId',
        method: 'get',
        params
    });
  }
//获取已上架面点
 export function getShelfPastryByTypeId(schoolId,typeId) {
    let params = new URLSearchParams();
    params.append("schoolId", schoolId);
    params.append("typeId", typeId);
    return fetch({
        url: 'structure/pastry/getShelfPastryByTypeId',
        method: 'get',
        params
    });
  }
  //获取未上架面点
 export function getDownShelfPastryByTypeId(schoolId,typeId) {
    let params = new URLSearchParams();
    params.append("schoolId", schoolId);
    params.append("typeId", typeId);
    return fetch({
        url: 'structure/pastry/getDownShelfPastryByTypeId',
        method: 'get',
        params
    });
  }
  //添加上架面点
 export function addShelf(pastryIds) {
    let params = new URLSearchParams();
    params.append("pastryIds", pastryIds);
    return fetch({
        url: 'structure/pastry/addShelf',
        method: 'get',
        params
    });
  }
  //维护面点上架时间点
 export function managePastryWeekDay(pastryId,weekDay) {
    let params = new URLSearchParams();
    params.append("pastryId", pastryId);
    params.append("weekDay", weekDay);
    return fetch({
        url: 'structure/pastry/managePastryWeekDay',
        method: 'get',
        params
    });
  }
  //根据面点Id下架面点
 export function downShelfPastry(pastryId) {
    let params = new URLSearchParams();
    params.append("pastryId", pastryId);
    return fetch({
        url: 'structure/pastry/downShelfPastry',
        method: 'get',
        params
    });
  }
  //根据schoolId获取已上架一周面点
 export function weekShelfPastry(schoolId,typeId) {
    let params = new URLSearchParams();
    params.append("schoolId", schoolId);
    params.append("typeId", typeId);
    return fetch({
        url: 'structure/pastry/weekShelfPastry',
        method: 'get',
        params
    });
  }
    //发送面点消息
 export function sendWeekPastryMessage(pastryMessageDetails,typeId,typeName) {
    let params = new URLSearchParams();
    params.append("pastryMessageDetails", pastryMessageDetails);
    params.append("typeId", typeId);
    params.append("typeName", typeName);
    return fetch({
        url: 'structure/pastry/sendWeekPastryMessage',
        method: 'post',
        data:params
    });
  }
  //订单记录
export function queryOrderListByTypeIdAndDateRange(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('startDate', query.startDate);
    params.append('typeId', query.typeId);
    params.append('endDate', query.endDate);
    params.append('schoolId', query.schoolId);
    return fetch({
        url: 'structure/pastry/queryOrderListByTypeIdAndDateRange',
        method: 'get',
        params
    });
}
//按老师统计
export function queryTeacherAnalysisByDateRange(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('startDate', query.startDate);
    params.append('endDate', query.endDate);
    params.append('schoolId', query.schoolId);
    return fetch({
        url: 'structure/pastry/queryTeacherAnalysisByDateRange',
        method: 'get',
        params
    });
}
//签收单
export function queryOrderListByTypeIdAndDate(query) {
    let params = new URLSearchParams();
    params.append('searchName', query.searchName);
    params.append('date', query.date);
    params.append('typeId', query.typeId);
    params.append('schoolId', query.schoolId);
    return fetch({
        url: 'structure/pastry/queryOrderListByTypeIdAndDate',
        method: 'get',
        params
    });
}
 //面点统计
 export function queryPastryAnalysisByTypeIdAndDateRange(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('startDate', query.startDate);
    params.append('typeId', query.typeId);
    params.append('endDate', query.endDate);
    params.append('schoolId', query.schoolId);
    return fetch({
        url: 'structure/pastry/queryPastryAnalysisByTypeIdAndDateRange',
        method: 'get',
        params
    });
}
//个人订单记录
export function queryOrderListByUserIdAndDateRange(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('endDate', query.endDate);
    params.append('userId', query.userId);
    return fetch({
        url: 'structure/pastry/queryOrderListByUserIdAndDateRange',
        method: 'get',
        params
    });
}
//获取订单详情
export function getOrderInfoById(orderId) {
    let params = new URLSearchParams();
    params.append("orderId", orderId);
    return fetch({
        url: 'structure/pastry/getOrderInfoById',
        method: 'get',
        params
    });
  }
//取消订单
export function cancelOrderByOrderId(orderId) {
    let params = new URLSearchParams();
    params.append("orderId", orderId);
    return fetch({
        url: 'structure/pastry/cancelOrderByOrderId',
        method: 'get',
        params
    });
  }
   //退款
export function refund(query) {
    let params = new URLSearchParams();
    params.append('amount', query.amount);
    params.append('orderId', query.orderId);
    params.append('orderNo', query.orderNo);
    params.append('requestSn', query.requestSn);
    params.append('id', query.id);
    return fetch({
        url: 'structure/pastry/refund',
        method: 'post',
        data:params
    });
}
//删除订单
export function deleteOrderById(orderId) {
    let params = new URLSearchParams();
    params.append("orderId", orderId);
    return fetch({
        url: 'structure/pastry/deleteOrderById',
        method: 'get',
        params
    });
  }