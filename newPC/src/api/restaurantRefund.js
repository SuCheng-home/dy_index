import fetch from '@/utils/fetch'
import { systemFetch } from '@/utils/fetch'
/**
 * 查询本学期伙食收费列表
 *
 * @export
 * @param {any} listQuery
 * @returns
 */
export function queryChargeNoticeListCurrentTerm() {
	let params = new URLSearchParams()
	return fetch({
		url: 'chargeNotice/queryChargeNoticeListCurrentTerm',
		method: 'post',
		data: params
	})
}
/*分页获取退费批次*/
export function queryReturnBatch(listQuery) {
	let params = new URLSearchParams()
	params.append('pageNo', listQuery.pageNo)
	params.append('pageSize', listQuery.pageSize)
	params.append('searchName', listQuery.searchName)
	return fetch({
		url: 'structure/repastManagement/queryReturnBatch',
		method: 'get',
		timeout: 30000,
		params
	})
}
/*根据时间和通知退费id获取需退费的就餐停伙学生*/
export function queryStuRepastFireByCIdAndDateRange(listQuery) {
	let params = new URLSearchParams()
	params.append('pageNo', listQuery.pageNo)
	params.append('pageSize', listQuery.pageSize)
	params.append('searchName', listQuery.searchName)
	params.append('cId', listQuery.cId)
	params.append('startDate', listQuery.startDate)
	params.append('endDate', listQuery.endDate)
	return fetch({
		url: 'structure/repastManagement/queryStuRepastFireByCIdAndDateRange',
		method: 'get',
		params
	})
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
		method: 'get'
	})
}
/*提交退费*/
export function submitReturnMoney(listQuery) {
	let params = new URLSearchParams()
	params.append('cId', listQuery.id)
	params.append('cName', listQuery.name)
	params.append('startDate', listQuery.startDate)
	params.append('endDate', listQuery.endDate)
	return fetch({
		url: 'structure/repastManagement/submitReturnMoney',
		method: 'get',
		params
	})
}
/*分页获取退费记录*/
export function queryReturnRecordByBatchId(listQuery) {
	let params = new URLSearchParams()
	params.append('pageNo', listQuery.pageNo)
	params.append('pageSize', listQuery.pageSize)
	params.append('searchName', listQuery.searchName)
	params.append('batchId', listQuery.batchId)
	return fetch({
		url: 'structure/repastManagement/queryReturnRecordByBatchId',
		method: 'get',
		params
	})
}
/**
 *校园收费退款(新增)
 */
export function updateRefund(noticeId, refundMoney, studentId) {
	return fetch({
		url: 'chargeNotice/updateRefund?noticeId=' + noticeId + '&refundMoney=' + refundMoney + '&refundRemark="停伙退费"&studentId=' + studentId,
		method: 'get'
	})
}
/*登记统计*/
export function queryRepastUserFireAnalysis(listQuery) {
	let params = new URLSearchParams()
	params.append('pageNo', listQuery.pageNo)
	params.append('pageSize', listQuery.pageSize)
	params.append('searchName', listQuery.searchName)
	params.append('departId', listQuery.departId)
	params.append('repastType', listQuery.repastType)
	params.append('endDate', listQuery.endDate)
	params.append('startDate', listQuery.startDate)
	params.append('schoolTimeId', listQuery.schoolTimeId)
	return fetch({
		url: 'structure/repastManagement/queryRepastUserFireAnalysis',
		method: 'get',
		params
	})
}
//获取部门
export function queryDepartByType() {
	let params = new URLSearchParams()
	params.append('type', 7)
	return systemFetch({
		url: 'api/depart/queryDepartByType',
		method: 'get',
		params
	})
}
/*停伙就餐统计*/
export function queryRepastUserFire(listQuery) {
	let params = new URLSearchParams()
	params.append('pageNo', listQuery.pageNo)
	params.append('pageSize', listQuery.pageSize)
	params.append('searchName', listQuery.searchName)
	params.append('endDate', listQuery.endDate)
	params.append('startDate', listQuery.startDate)
	return fetch({
		url: 'structure/repastManagement/queryRepastUserFire',
		method: 'get',
		params
	})
}
/*获取教师缴费单*/
export function getTeacherPayFees(listQuery) {
	let params = new URLSearchParams()
	params.append('departId', listQuery.departId)
	params.append('endDate', listQuery.endDate)
	params.append('searchName', listQuery.searchName)
	params.append('startDate', listQuery.startDate)
	return fetch({
		url: 'structure/repastManagement/getTeacherPayFees',
		method: 'get',
		params
	})
}
//刷新
export function refreshReturnRecordStatus(batchId) {
	let params = new URLSearchParams()
	params.append('batchId', batchId)
	return fetch({
		url: 'structure/repastManagement/refreshReturnRecordStatus',
		method: 'get',
		params
	})
}