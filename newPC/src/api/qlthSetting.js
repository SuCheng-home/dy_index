import fetch from '@/utils/fetch'
import { systemFetch } from '@/utils/fetch'
// 遍历处理参数方法
function formatParams(args) {
	let params = new URLSearchParams()
	Object.keys(args).forEach(v => {
		params.append(v, args[v])
	})
	return params
}
/**
 * 增加师徒关系
 * @param {Object} params
 * @returns
 */
export function addMasterPrentice(params) {
	return fetch({
		url: 'structure/cyanBlue/addMasterPrentice',
		method: 'post',
		data: formatParams(params)
	})
}
/**
 * 师徒关系列表
 * @param {Object} params
 * @returns
 */
export function listCyanBlueMasterPrenticeByPage(params) {
	return fetch({
		url: 'structure/cyanBlue/listCyanBlueMasterPrenticeByPage',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 删除师徒关系
 * @param {Object} params
 * @returns
 */
export function delMasterPrenticeByIds(params) {
	return fetch({
		url: 'structure/cyanBlue/delMasterPrenticeByIds',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 查询师徒关系详情
 * @param {Object} params
 * @returns
 */
export function getCyanBlueMasterPrenticeById(params) {
	return fetch({
		url: 'structure/cyanBlue/getCyanBlueMasterPrenticeById',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 编辑师徒关系
 * @param {Object} params
 * @returns
 */
export function editMasterPrentice(params) {
	return fetch({
		url: 'structure/cyanBlue/editMasterPrentice',
		method: 'post',
		data: formatParams(params)
	})
}
/**
 * 获取批次列表
 * @param {Object} params
 * @returns
 */
export function managerBatchList(params) {
	return fetch({
		url: 'structure/cyanBlue/managerBatchList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 获取批次列表
 * @param {Object} params
 * @returns
 */
export function batchDeleteBatchByIds(params) {
	return fetch({
		url: 'structure/cyanBlue/batchDeleteBatchByIds',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 新增批次
 * @param {Object} params
 * @returns
 */
export function addBatch(params) {
	return fetch({
		url: 'structure/cyanBlue/addBatch',
		method: 'post',
		data: formatParams(params)
	})
}
/**
 * 编辑批次
 * @param {Object} params
 * @returns
 */
export function editBatch(params) {
	return fetch({
		url: 'structure/cyanBlue/editBatch',
		method: 'post',
		data: formatParams(params)
	})
}
/**
 * 查询未开始的师徒人选
 * @param {Object} params
 * @returns
 */
export function getCyanBlueMasterPrenticeByCondition(params) {
	return fetch({
		url: 'structure/cyanBlue/getCyanBlueMasterPrenticeByCondition',
		method: 'get'
	})
}
/**
 * 根据批次id查询批次详情
 * @param {Object} params
 * @returns
 */
export function getCyanBlueBatchById(params) {
	return fetch({
		url: 'structure/cyanBlue/getCyanBlueBatchById',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 获取批次内type=1培养计划,2帮扶记录,3学习总结
 * @param {Object} params
 * @returns
 */
export function getCyanBlueBatchPlanRecordSumListByManager(params) {
	return fetch({
		url: 'structure/cyanBlue/getCyanBlueBatchPlanRecordSumListByManager',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 提醒未上报用户
 * @param {Object} params
 * @returns
 */
export function publishNotReport(params) {
	return fetch({
		url: 'structure/cyanBlue/publishNotReport',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 听课记录
 * @param {Object} params
 * @returns
 */
export function managerBatchClassRecordList(params) {
	return fetch({
		url: 'structure/cyanBlue/managerBatchClassRecordList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 听课排名统计列表
 * @param {Object} params
 * @returns
 */
export function batchClassRecordRankList(params) {
	return fetch({
		url: 'structure/cyanBlue/batchClassRecordRankList',
		method: 'get',
		params: formatParams(params)
	})
}

/**
 * 获得批次下的月份列表
 * @param {Object} params
 * @returns
 */
export function getCyanBlueBatchClassRecordMonthList(params) {
	return fetch({
		url: 'structure/cyanBlue/getCyanBlueBatchClassRecordMonthList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 师傅批次列表
 * @param {Object} params
 * @returns
 */
export function masterBatchList(params) {
	return fetch({
		url: 'structure/cyanBlue/masterBatchList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 师傅获取培养计划与帮扶记录
 * @param {Object} params
 * @returns
 */
export function getCyanBluePlanOrRecordListByMaster(params) {
	return fetch({
		url: 'structure/cyanBlue/getCyanBluePlanOrRecordListByMaster',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 更改状态
 * @param {Object} params
 * @returns
 */

export function updateCyanBluePlanOrRecordOrSum(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/cyanBlue/updateCyanBluePlanOrRecordOrSum',
        method: 'post',
        data: JSON.stringify(args)
    });
}
/**
 * 师傅获取听课记录
 * @param {Object} params
 * @returns
 */
export function masterBatchClassRecordList(params) {
	return fetch({
		url: 'structure/cyanBlue/masterBatchClassRecordList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 徒弟获取批次列表
 * @param {Object} params
 * @returns
 */
export function prenticeBatchList(params) {
	return fetch({
		url: 'structure/cyanBlue/prenticeBatchList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 徒弟获取听课记录
 * @param {Object} params
 * @returns
 */
export function prenticeBatchClassRecordList(params) {
	return fetch({
		url: 'structure/cyanBlue/prenticeBatchClassRecordList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 徒弟获取学习总结
 * @param {Object} params
 * @returns
 */
export function prenticeBatchSumList(params) {
	return fetch({
		url: 'structure/cyanBlue/prenticeBatchSumList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 发布通知
 * @param {Object} params
 * @returns
 */
export function publishBatch(params) {
	return fetch({
		url: 'structure/cyanBlue/publishBatch',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 获取批次下所有听课记录
 * @param {Object} params
 * @returns
 */
export function batchClassRecordList(params) {
	return fetch({
		url: 'structure/cyanBlue/batchClassRecordList',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 师徒列表
 * @param {Object} params
 * @returns
 */
export function queryCyanBlueMasterPrentice(params) {
	return fetch({
		url: 'structure/cyanBlue/queryCyanBlueMasterPrentice',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 师徒列表点击师傅姓名获取列表
 * @param {Object} params
 * @returns
 */
export function getCyanBlueBatchDetailByMasterPrentice(params) {
	return fetch({
		url: 'structure/cyanBlue/getCyanBlueBatchDetailByMasterPrentice',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 师徒列表点击师傅姓名获取列表
 * @param {Object} params
 * @returns
 */
export function finishLearnById(params) {
	return fetch({
		url: 'structure/cyanBlue/finishLearnById',
		method: 'get',
		params: formatParams(params)
	})
}
/**
 * 师徒列表首页导出
 * @param {Object} params
 * @returns
 */
export function downCyanBlueMasterPrentice(params) {
	return fetch({
		url: 'structure/cyanBlue/downCyanBlueMasterPrentice',
		method: 'get',
		params: formatParams(params)
	})
}
//判断用户是否具备某角色
export function possessRole(userId) {
	let params = new URLSearchParams()
	params.append('roleConstantId', '186')
	params.append('userId', userId)
	return systemFetch({
		url: 'api/user/role/possessRole',
		method: 'GET',
		params
	})
}
