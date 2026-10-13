import fetch from '@/utils/fetch';
/*分页获取退费批次*/
export function queryReturnBatch(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchName);
    return fetch({
        url: 'structure/fire/queryReturnBatch',
        method: 'get',
        params
    });
}
/*删除退费批次*/
export function deleteFireReturnBatchById(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/fire/deleteFireReturnBatchById',
        method: 'get',
        params
    });
}
/*提交退费*/
export function submitReturnMoney(listQuery) {
    let params = new URLSearchParams();
    params.append('cId', listQuery.id);
    params.append('cName', listQuery.name);
    params.append('startDate', listQuery.startDate);
    params.append('endDate', listQuery.endDate);
    params.append('title', listQuery.title);
    params.append('fireType', listQuery.fireType);
    return fetch({
        url: 'structure/fire/submitReturnMoney',
        method: 'get',
        params
    });
}
/*分页获取退费记录*/
export function queryReturnRecordByBatchId(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchName);
    params.append('batchId', listQuery.batchId);
    return fetch({
        url: 'structure/fire/queryReturnRecordByBatchId',
        method: 'get',
        params
    });
}
/**
 * 查询本学期伙食收费列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
 export function getFireSet() {
    return fetch({
        url: 'structure/fire/getFireSet',
        method: 'get',
    });
}
/*退费*/
export function returnMoney(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/fire/returnMoney',
        method: 'get',
        params
    });
}
/*提醒未确认的班级或者教师确认停伙退费*/
export function remindConfirmReturnMoney(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/fire/remindConfirmReturnMoney',
        method: 'get',
        params
    });
}



/**
 * 查询本学期伙食收费列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
 export function queryChargeNoticeListCurrentTerm(chargeType) {
    let params = new URLSearchParams();
    params.append('chargeType', chargeType);
    params.append('typeId', 0);
    return fetch({
        url: 'chargeNotice/queryChargeNoticeListCurrentTerm',
        method: 'post',
        data: params
    });

}

//刷新
export function refreshReturnRecordStatus(batchId) {
	let params = new URLSearchParams()
	params.append('batchId', batchId)
	return fetch({
		url: 'structure/fire/refreshReturnRecordStatus',
		method: 'get',
		params
	})
}

