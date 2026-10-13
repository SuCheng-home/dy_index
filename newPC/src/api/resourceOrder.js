import fetch from '@/utils/fetch';

// =====================资源审批页面==================================

// 删除预约
export function deleteResourceOrder(args) {
    const params = new URLSearchParams();
    params.append('ids', args.ids);
    return fetch({
        url: 'structure/resource/deleteResourceOrder',
        method: 'POST',
        params
    });
}

// 审批不通过
export function noPassExamineOrder(args) {
    const params = new URLSearchParams();
    params.append('options', args.options);
    params.append('orderId', args.orderId);
    return fetch({
        url: 'structure/resource/noPassExamineOrder',
        method: 'POST',
        params
    });
}

// 审批列表
export function resourceExamineList(args) {
    const params = new URLSearchParams();
    params.append('dateDay', args.dateDay);
    params.append('orderStatus', args.orderStatus);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);
    return fetch({
        url: 'structure/resource/resourceExamineList',
        method: 'POST',
        params
    });
}
export function newresourceExamineList(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('typeId', args.typeId);
    params.append('orderStatus', args.orderStatus);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);
    return fetch({
        url: 'structure/resource/resourceExamineList',
        method: 'POST',
        params
    });
}

// 审批详情
export function resourceExamineDetailInfo(args) {
    const params = new URLSearchParams();
    params.append('orderId', args.orderId);
    return fetch({
        url: 'structure/resource/resourceExamineDetailInfo',
        method: 'POST',
        params
    });
}

// 审批通过
export function passExamineResource(args) {
    const params = new URLSearchParams();
    params.append('appointerIdStr', args.appointerIdStr);
    params.append('appointerJson', args.appointerJson);
    params.append('isAppoint', args.isAppoint);
    params.append('options', args.options);
    params.append('orderId', args.orderId);

    return fetch({
        url: 'structure/resource/passExamineResource',
        method: 'POST',
        params
    });
}

// =====================资源类型页面==================================

// 修改资源类型
export function updateResourceType(args) {
    const params = new URLSearchParams();
    params.append('appointerJson', args.appointerJson);
    params.append('endRemindTime', args.endRemindTime);
    params.append('earlyTime', args.earlyTime);
    params.append('id', args.id);
    params.append('isAppoint', args.isAppoint);
    params.append('isEndRemind', args.isEndRemind);
    params.append('isExamine', args.isExamine);
    params.append('isRemind', args.isRemind);
    params.append('name', args.name);
    params.append('remark', args.remark);
    params.append('remindTime', args.remindTime);
    params.append('typeNo', args.typeNo);
    params.append('resourceUserIds', args.resourceUserIds);
    params.append('schoolId', args.schoolId);
    params.append('isApplyAppoint', args.isApplyAppoint);
    params.append('isFeedback', args.isFeedback);
    return fetch({
        url: 'structure/resource/updateResourceType',
        method: 'POST',
        params
    });
}

// 删除资源类型
export function deleteResourceType(args) {
    const params = new URLSearchParams();
    params.append('typeId', args.typeId);
    return fetch({
        url: 'structure/resource/deleteResourceType',
        method: 'POST',
        params
    });
}

// 新增资源类型
export function addResourceType(args) {
    const params = new URLSearchParams();
    params.append('appointerJson', args.appointerJson);
    params.append('createDate', args.createDate);
    params.append('earlyTime', args.earlyTime);
    params.append('endRemindTime', args.endRemindTime);
    params.append('isAppoint', args.isAppoint);
    params.append('isEndRemind', args.isEndRemind);
    params.append('isExamine', args.isExamine);
    params.append('isRemind', args.isRemind);
    params.append('name', args.name);
    params.append('remark', args.remark);
    params.append('remindTime', args.remindTime);
    params.append('resourceUserIds', args.resourceUserIds);
    params.append('typeNo', args.typeNo);
    params.append('isApplyAppoint', args.isApplyAppoint);
    params.append('isFeedback', args.isFeedback);

    return fetch({
        url: 'structure/resource/addResourceType',
        method: 'POST',
        params
    });
}

// 获取资源类型详情
export function getResourceTypeInfo(args) {
    const params = new URLSearchParams();
    params.append('typeId', args.typeId);

    return fetch({
        url: 'structure/resource/getResourceTypeInfo',
        method: 'POST',
        params
    });
}

// 资源类型列表
export function resourceTypeList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);

    return fetch({
        url: 'structure/resource/resourceTypeList',
        method: 'POST',
        params
    });
}

// =====================资源页面==================================

// 修改资源
export function updateResources(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);
    params.append('isDelete', args.isDelete);
    params.append('name', args.name);
    params.append('remark', args.remark);
    params.append('resoureNo', args.resoureNo);
    params.append('schoolId', args.schoolId);
    params.append('status', args.status);
    params.append('typeId', args.typeId);
    params.append('isApplyAppoint', args.isApplyAppoint);
    params.append('isFeedback', args.isFeedback);
    params.append('isApplyAppoint', args.isApplyAppoint);
    params.append('isFeedback', args.isFeedback);
    params.append('deviceSerial', args.deviceSerial);
    params.append('deviceJson', args.deviceJson);
    return fetch({
        url: 'structure/resource/updateResources',
        method: 'POST',
        params
    });
}

// 删除资源
export function deleteResources(args) {
    const params = new URLSearchParams();
    params.append('resourcesId', args.resourcesId);

    return fetch({
        url: 'structure/resource/deleteResources',
        method: 'POST',
        params
    });
}

// 新增资源
export function addResources(args) {
    const params = new URLSearchParams();
    params.append('name', args.name);
    params.append('remark', args.remark);
    params.append('resoureNo', args.resoureNo);
    params.append('status', args.status);
    params.append('typeId', args.typeId);
    params.append('deviceSerial', args.deviceSerial);
    params.append('deviceJson', args.deviceJson);
    return fetch({
        url: 'structure/resource/addResources',
        method: 'POST',
        params
    });
}

// 获取资源详情
export function getResourcesInfo(args) {
    const params = new URLSearchParams();
    params.append('resourcesId', args.resourcesId);

    return fetch({
        url: 'structure/resource/getResourcesInfo',
        method: 'POST',
        params
    });
}

// 资源列表
export function resourcesList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);
    params.append('typeId', args.typeId);

    return fetch({
        url: 'structure/resource/resourcesList',
        method: 'POST',
        params
    });
}

// =====================资源预约汇总-领导看板==================================

// 全校资源预约列表
export function getAllResourceOrderList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);

    return fetch({
        url: 'structure/resource/getAllResourceOrderList',
        method: 'POST',
        params
    });
}

// 取消预约-管理员
export function cancelOrderResourceByManager(args) {
    const params = new URLSearchParams();
    params.append('cancelResion', args.cancelResion);
    params.append('id', args.id);

    return fetch({
        url: 'structure/resource/cancelOrderResourceByManager',
        method: 'POST',
        params
    });
}

// =====================资源预约页面==================================

// 加载可选的资源
export function toOrderResource(args) {
    return fetch({
        url: 'structure/resource/toOrderResource',
        method: 'POST'
    });
}

// 取消预约
export function cancelOrderResource(args) {
    const params = new URLSearchParams();
    params.append('isExamine', args.isExamine);
    params.append('orderId', args.orderId);

    return fetch({
        url: 'structure/resource/cancelOrderResource',
        method: 'POST',
        params
    });
}

// 我的预约列表
export function resourceOrderList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);

    return fetch({
        url: 'structure/resource/resourceOrderList',
        method: 'POST',
        params
    });
}

// 改变类型重新加载资源
export function reloadChangeType(args) {
    const params = new URLSearchParams();
    params.append('typeId', args.typeId);

    return fetch({
        url: 'structure/resource/reloadChangeType',
        method: 'POST',
        params
    });
}

// 查看某天的资源使用情况
export function loadResOrder(args) {
    const params = new URLSearchParams();
    params.append('time', args.time);

    return fetch({
        url: 'structure/resource/loadResOrder',
        method: 'POST',
        data: params
    });
}

// 查看预约详情
export function resourceOrderDetailInfo(args) {
    const params = new URLSearchParams();
    params.append('orderId', args.orderId);

    return fetch({
        url: 'structure/resource/resourceOrderDetailInfo',
        method: 'POST',
        data: params
    });
}

// 活动资源预约
export function toOrderResourceFromActivity(args) {
    const params = new URLSearchParams();
    params.append('activityId', args.activityId);

    return fetch({
        url: 'structure/resource/toOrderResourceFromActivity',
        method: 'POST',
        data: params
    });
}

// 预约资源
export function orderResources(args) {
    const params = new URLSearchParams();
    params.append('beginTime', args.beginTime);
    params.append('endTime', args.endTime);
    params.append('orderReasonCode', args.orderReasonCode);
    params.append('orderReasonValue', args.orderReasonValue);
    params.append('orderResion', args.orderResion);
    params.append('serviceObjectCode', args.serviceObjectCode);
    params.append('serviceObjectValue', args.serviceObjectValue);
    params.append('resourceId', args.resourceId);
    params.append('resourceTypeId', args.resourceTypeId);
    params.append('sendAppointerJson', args.sendAppointerJson);
    params.append('fileJson', args.fileJson);
    return fetch({
        url: 'structure/resource/orderResources',
        method: 'POST',
        data: params
    });
}

// 某天预约（明细页）
export function toOrderResourceDetail(args) {
    const params = new URLSearchParams();
    params.append('time', args.time);

    return fetch({
        url: 'structure/resource/toOrderResourceDetail',
        method: 'POST',
        data: params
    });
}

// 资源预约反馈
export function resourceOrderFeedback(args) {
    const params = new URLSearchParams();
    params.append('feedbackMarks', args.feedbackMarks);
    params.append('id', args.id);

    return fetch({
        url: 'structure/resource/resourceOrderFeedback',
        method: 'POST',
        data: params
    });
}
//scancodeEquipmentNewService
export function getScancodeEquipmentListByType() {
    const params = new URLSearchParams();
    params.append('equipType', 10002);
    params.append('useType', 28);
    return fetch({
        url: 'structure/scancodeEquipment/getScancodeEquipmentListByType',
        method: 'get',
        params
    });
}

export function getSchoolResourceOrderPageList(args) {
    const params = new URLSearchParams();
    params.append('beginTime', args.beginTime);
    params.append('endTime', args.endTime);
    params.append('orderReasonCode', args.orderReasonCode);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('resourceId', args.resourceId);
    params.append('resourceTypeId', args.resourceTypeId);

    return fetch({
        url: 'structure/resource/getSchoolResourceOrderPageList',
        method: 'POST',
        data: params
    });
}
// 根据不同角色获得学校资源类型列表
export function getResourceTypeListForStatics() {

    return fetch({
        url: 'structure/resource/getResourceTypeListForStatics',
        method: 'POST'
    });
}
// 从资源预约列表中查询资源类型下的资源列表
export function getResourceListForStatics(args) {
    const params = new URLSearchParams();
    params.append('resourceTypeId', args.resourceTypeId);

    return fetch({
        url: 'structure/resource/getResourceListForStatics',
        method: 'POST',
        data: params
    });
}

//查询资源分页列表
export function getParentResourceListByPage(args) {
    const params = new URLSearchParams();
    params.append('name', args.name);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('status', args.status);
    return fetch({
        url: 'structure/parentResource/getParentResourceListByPage',
        method: 'GET',
        params
    });
}
//删除资源
export function delParentResource(resourceId) {
    const params = new URLSearchParams();
    params.append('resourceId', resourceId);
    return fetch({
        url: 'structure/parentResource/delParentResource',
        method: 'GET',
        params
    });
}
//查询资源
export function getParentResource(resourceId) {
    const params = new URLSearchParams();
    params.append('resourceId', resourceId);
    return fetch({
        url: 'structure/parentResource/getParentResource',
        method: 'GET',
        params
    });
}
//修改资源
export function updateParentResource(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/parentResource/updateParentResource',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//新增资源
export function addParentResource(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/parentResource/addParentResource',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function getParentResourceRecordList(args) {
    const params = new URLSearchParams();
    params.append('startDate', args.startDate);
    params.append('endDate', args.endDate);
    params.append('createUserName', args.createUserName);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('resourceId', args.resourceId);
    params.append('searchtype', args.searchtype);
    params.append('state', args.state);
    return fetch({
        url: 'structure/parentResource/getParentResourceRecordList',
        method: 'POST',
        data: params
    });
}

//新增资源预约
export function updateParentResourceRecord(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/parentResource/updateParentResourceRecord',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//新增资源预约
export function updateParentResourceRecordList(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/parentResource/updateParentResourceRecordList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 查询资源列表
export function getParentResourceList(searchtype) {
    const params = new URLSearchParams();
    params.append('searchtype', searchtype);
    return fetch({
        url: 'structure/parentResource/getParentResourceList',
        method: 'get',
        params
    });
}
