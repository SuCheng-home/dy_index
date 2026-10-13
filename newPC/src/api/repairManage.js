import fetch from '@/utils/fetch';

function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}


/**
 * 获取报修列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getRepairList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('startDate', listQuery.startDate);
    params.append('endDate', listQuery.endDate);
    params.append('searchTitle', listQuery.searchTitle);
  
    return fetch({
        url: 'structure/repair/getManagerRepairList',
        method: 'post',
        data: params
    });

}


/**
 * 获取学校管理员查询所有报修列表这个接口不要了，不知道他其他地方有没有用我就不删除了
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getAllRepairList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('repairTypeId', listQuery.repairTypeId);
    params.append('status', listQuery.status);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('startDate', listQuery.startDate);
    params.append('endDate', listQuery.endDate);
  
    return fetch({
        url: 'structure/repair/getAllRepairList',
        method: 'post',
        data: params
    });

}
/*获取用户报修分页列表这个接口不一定要*/
export function getUserRepairList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    return fetch({
        url: 'structure/repair/getUserRepairList',
        method: 'post',
        data: params
    });

}
/*报修处理检索列表*/
export function getManagerRepairList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('repairTypeId', listQuery.repairTypeId);
    params.append('status', listQuery.status);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('startDate', listQuery.startDate);
    params.append('endDate', listQuery.endDate);
    params.append('userId', listQuery.userId || 0);
    return fetch({
        url: 'structure/repair/getManagerRepairList',
        method: 'post',
        data: params
    });

}
/**
 * 删除报修
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function delRepairList(delId) {
    let params = new URLSearchParams();
    params.append('repairIds', delId);
  
    return fetch({
        url: 'structure/repair/delRepairList',
        method: 'post',
        data: params
    });

}

/**
 * 根据id查找加载报修详情（跳转详情页）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getRepairInfo(id,index) {
    let params = new URLSearchParams();
    params.append('repairId', id);
    params.append("isSendToMsg",index);
  
    return fetch({
        url: 'structure/repair/getRepairInfo',
        method: 'post',
        data: params
    });

}


/**
 * 处理结果及反馈（详情页点击处理执行）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function updateDealRepair(data) {
    let params = new URLSearchParams();
    params.append('repairId', data.repairId);
    params.append("userType",data.userType);
    params.append("status",data.status);
    params.append("dealContent",data.dealContent);
    params.append("dealDicName",data.dealDicName);
    params.append("dealDicCode",data.dealDicCode);
    params.append('dealResultPicUrls', JSON.stringify(data.dealResultPicUrls));
    return fetch({
        url: 'structure/repair/updateDealRepair',
        method: 'post',
        data: params
    });

}


/**
 * 获取学校报修类型分页列表（系统设置）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getRepairTypeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('type', listQuery.type);
    return fetch({
        url: 'structure/repair/getRepairTypeList',
        method: 'post',
        data: params
    });

}


/**
 * 根据报修类型id查询报修类型详情（报修类型列表点击修改跳转）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getRepairTypeInfo(repairTypeId) {
    let params = new URLSearchParams();
    params.append('repairTypeId', repairTypeId);
  
    return fetch({
        url: 'structure/repair/getRepairTypeInfo',
        method: 'post',
        data: params
    });

}



/**
 * 修改报修类型（报修类型编辑页确定按钮执行）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function updateRepairType(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.repairTypeId);
    params.append('pId', listQuery.pId);
    params.append('repairTypeName', listQuery.repairTypeName);
    params.append('scope', listQuery.scope);
    params.append('scope2', listQuery.scope2);
    params.append('isFback', listQuery.isFback);  
    params.append('type', listQuery.type);
    params.append('orderNo', listQuery.orderNo);

    return fetch({
        url: 'structure/repair/updateRepairType',
        method: 'post',
        data: params
    });

}


/**
 * 删除报修类型（）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function delRepairTypeList(repairTypeIds) {
    let params = new URLSearchParams();
    params.append('repairTypeIds', repairTypeIds);
  
    return fetch({
        url: 'structure/repair/delRepairTypeList',
        method: 'post',
        data: params
    });

}

/**
 * 获得学校的报修地点分页列表(点击树节点id)
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function findRepairPlaceListByModel(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.Id);
    params.append('pId', listQuery.pId);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchTitle);
    params.append('pageNo', listQuery.pageNo);
    return fetch({
        url: 'structure/repair/findRepairPlaceListByModel',
        method: 'post',
        data: params
    });
}

/**
 * 获取上级所有报修类型（）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function findParentRepairPlaceList(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.id);
    params.append('type', listQuery.type);
    return fetch({
        url: 'structure/repair/findParentRepairPlaceList',
        method: 'post',
        data: params
    });
}
/**
 * (报修类型)上级类型框改变的change事件
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getRepairTypeById(id) {
    let params = new URLSearchParams();
    params.append('repairTypeId', id);
    return fetch({
        url: 'structure/repair/getRepairTypeById',
        method: 'post',
        data: params
    });
}
/**
 * 获取树结构
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function findRepairPlaceTreeList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/repair/findRepairPlaceTreeList',
        method: 'post',
        data: params
    });
}
/**
 * 新增报修类型（）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function addRepairType(listQuery) {
    let params = new URLSearchParams();
    params.append('pId', listQuery.pId);
    params.append('repairTypeName', listQuery.repairTypeName);
    params.append('scope', listQuery.scope);
    params.append('scope2', listQuery.scope2);
    params.append('isFback', listQuery.isFback);  
    params.append('type', listQuery.type);
    params.append('orderNo', listQuery.orderNo);

    return fetch({
        url: 'structure/repair/addRepairType',
        method: 'post',
        data: params
    });

}



/**
 * 获取学校报修地点分页列表（系统设置）/structure/repair/getRepairPlaceList
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getRepairPlaceList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
  
    return fetch({
        url: 'structure/repair/getRepairPlaceList',
        method: 'post',
        data: params
    });
}



/**
 * 新增报修地点系统设置）structure/repair/addRepairPlace
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function addRepairPlace(placeName,pId) {
    let params = new URLSearchParams();
    params.append('placeName', placeName);
    params.append('pId', pId);  
    return fetch({
        url: 'structure/repair/addRepairPlace',
        method: 'post',
        data: params
    });
}



/**
 * 编辑报修地点系统设置）structure/repair/updateRepairPlace
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function updateRepairPlace(editQuery) {
    let params = new URLSearchParams();
    params.append('id', editQuery.id);
    params.append('placeName', editQuery.placeName);
    return fetch({
        url: 'structure/repair/updateRepairPlace',
        method: 'post',
        data: params
    });
}

/**
 * 根据id删除报修地点系统设置）
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function delRepairPlaceById(repairPlaceId) {
    let params = new URLSearchParams();
    params.append('repairPlaceId', repairPlaceId);
    return fetch({
        url: 'structure/repair/delRepairPlaceById',
        method: 'post',
        data: params
    });
}



/**
 * 批量删除报修地点系统设置）structure/repair/delRepairPlaceByIds
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function delRepairPlaceByIds(repairPlaceIds) {
    let params = new URLSearchParams();
    params.append('repairPlaceIds', repairPlaceIds);
    return fetch({
        url: 'structure/repair/delRepairPlaceByIds',
        method: 'post',
        data: params
    });
}

/**
 * 获取学校所有报修类型列表structure/repair/getRepairTypeAllList
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getRepairTypeAllList(type) {
    let params = new URLSearchParams();
    params.append('type', type);
    return fetch({
        url: 'structure/repair/getRepairTypeAllList',
        method: 'post',
        data: params
    });
}
// 报修处理检索列表
export const repairListAll = params =>
    fetch({
        url: 'structure/repair/repairListAll',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
export function getDealUserList() {
    return fetch({
        url: 'structure/repair/getDealUserList',
        method: 'GET'
    });
}