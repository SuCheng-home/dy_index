import fetch from '@/utils/fetch'
import { systemFetch } from '@/utils/fetch'

export function getTest(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	return fetch({
		url: '/structure/performance/queryItem',
		method: 'GET',
		params
	})
}

export function addTest(args) {
	let params = new URLSearchParams();
	params.append('desContent', args.desContent);
	params.append('itemName', args.itemName);
	params.append('orderNo', args.orderNo);
	params.append('pointType', args.pointType);
	params.append('cashScore', args.cashScore);
	params.append('typeId', 1);
	params.append('haveRemark', args.haveRemark);
	params.append('typeName', '月考核');
	return fetch({
		url: '/structure/performance/insertItem',
		method: 'POST',
		params
	})
}

export function deleteTest(id) {
	let params = new URLSearchParams();
	params.append('id', id);
	return fetch({
		url: '/structure/performance/deleteItemById',
		method: 'GET',
		params
	})
}

export function editTest(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);
	params.append('itemName', args.itemName);
	params.append('orderNo', args.orderNo);
	params.append('pointType', args.pointType);
	params.append('cashScore', args.cashScore);
	params.append('desContent', args.desContent);
	params.append('haveRemark', args.haveRemark);
	params.append('typeId', 1);
	params.append('typeName', '月考核');
	return fetch({
		url: '/structure/performance/updateItem',
		method: 'POST',
		params
	})
}

//获取考核员角色列表
export function getTestRole() {
	let params = new URLSearchParams();
	params.append('constantId', 20211026);
	return systemFetch({
		url: '/api/user/role/getUsersByConstantId',
		method: 'GET',
		params
	})
}

//获取审核员角色列表
export function getAuditRole() {
	let params = new URLSearchParams();
	params.append('constantId', 20211027);
	return systemFetch({
		url: '/api/user/role/getUsersByConstantId',
		method: 'GET',
		params
	})
}

//管理员获取绩效考核任务列表
export function getTestList(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	return fetch({
		url: '/structure/performance/queryTaskBySchoolId',
		method: 'GET',
		params
	})
}

//新建考核任务保存与发布
export function newTest(args) {
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/insertTask',
		method: 'POST',
		data: JSON.stringify(args)
	})
}

//删除考核任务
export function deleteTaskById(id) {
	let params = new URLSearchParams();
	params.append('taskId', id);
	return fetch({
		url: '/structure/performance/deleteTaskById',
		method: 'GET',
		params
	})
}

//发布考核任务
export function publishTaskById(id) {
	let params = new URLSearchParams();
	params.append('id', id);
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/publishTask',
		method: 'POST',
		data: JSON.stringify(id)
	})
}

//根据id获取任务详情
export function getTaskDetailById(id) {
	let params = new URLSearchParams();
	params.append('taskId', id);
	return fetch({
		url: '/structure/performance/getTaskInfoById',
		method: 'GET',
		params
	})
}

//编辑考核任务
export function editTask(args) {
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/updateTask',
		method: 'POST',
		data: JSON.stringify(args)
	})
}

//获取绩效上报任务列表
export function getReportTaskList(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	return fetch({
		url: '/structure/performance/queryTaskRelative',
		method: 'GET',
		params
	})
}

//保存并下一步
export function saveAndNext(args) {
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/appear',
		method: 'POST',
		data: JSON.stringify(args)
	})
}

//上报绩效
export function reportPerformance(args) {
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/reportPerformance',
		method: 'POST',
		data: JSON.stringify(args)
	})
}

//上报绩效
export function finishReport(args) {
	let params = new URLSearchParams();
	params.append('relativeId', args.relativeId);
	params.append('taskId', args.taskId);
	return fetch({
		url: '/structure/performance/finishReport',
		method: 'GET',
		params
	})
}
//上报绩效
export function deleteReport(args) {
	let params = new URLSearchParams();
	params.append('reportId', args.reportId);
	params.append('taskId', args.taskId);
	return fetch({
		url: '/structure/performance/deleteReport',
		method: 'GET',
		params
	})
}
//上报绩效
export function deleteTaskRelativeById(args) {
	let params = new URLSearchParams();
	params.append('relativeId', args.relativeId);
	return fetch({
		url: '/structure/performance/deleteTaskRelativeById',
		method: 'GET',
		params
	})
}
//完成上报
export function finishTaskByTaskId(args) {
	let params = new URLSearchParams();
	params.append('taskId', args.taskId);
	return fetch({
		url: '/structure/performance/finishTaskByTaskId',
		method: 'GET',
		params
	})
}
//上报绩效
export function submitReportPerformanceAssess(args) {
	let params = new URLSearchParams();
	params.append('relativeId', args.relativeId);
	params.append('reportId', args.reportId);
	return fetch({
		url: '/structure/performance/submitReportPerformanceAssess',
		method: 'GET',
		params
	})
}

//上报绩效
export function getReportInfoById(args) {
	let params = new URLSearchParams();
	params.append('reportId', args.reportId);
	return fetch({
		url: '/structure/performance/getReportInfoById',
		method: 'GET',
		params
	})
}

//填报绩效
export function writePerformance(args) {
	let params = new URLSearchParams();
	params.append('departId', args.departId);
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('taskId', args.taskId);
	params.append('taskRelativeId', args.taskRelativeId);
	return fetch({
		url: '/structure/performance/queryTaskRelativeUser',
		method: 'GET',
		params
	})
}

//填报绩效
export function queryReportUserByReportId(args) {
	let params = new URLSearchParams();
	params.append('departId', args.departId);
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('reportId', args.reportId);
	params.append('taskId', args.taskId);
	params.append('searchName', args.searchName);
	return fetch({
		url: '/structure/performance/queryReportUserByReportId',
		method: 'GET',
		params
	})
}

//录入绩效
export function setPerformance(args) {
	let params = new URLSearchParams();
	params.append('classIds', args.classIds);
	params.append('classNames', args.classNames);
	params.append('currIds', args.currIds);
	params.append('currNames', args.currNames);
	params.append('remark', args.remark);
	params.append('assessDate', args.assessDate);
	params.append('departIds', args.departIds);
	params.append('departNames', args.departNames);
	params.append('haveRemark', args.haveRemark);
	params.append('itemId', args.itemId);
	params.append('itemName', args.itemName);
	params.append('orderNo', args.orderNo);
	params.append('point', args.point);
	params.append('taskId', args.taskId);
	params.append('taskName', args.taskName);
	params.append('typeId', args.typeId);
	params.append('typeName', args.typeName);
	params.append('userId', args.userId);
	params.append('userLoginName', args.userLoginName);
	params.append('userName', args.userName);
	params.append('cashScore', args.cashScore);
	params.append('pointType', args.pointType);
	params.append('score', args.score);

	return fetch({
		url: '/structure/performance/insertPerformance',
		method: 'POST',
		params
	})
}

//再次保存并进行下一步
export function saveAndNextAgain(args) {
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/againAppear',
		method: 'POST',
		data: JSON.stringify(args)
	})
}

//获取部门列表
export function getDepart() {
	let params = new URLSearchParams();
	params.append('type', 7);
	return systemFetch({
		url: '/api/depart/queryDepartByType',
		method: 'GET',
		params
	})
}

//获取绩效汇总
export function getAllPerformance(args) {
	let params = new URLSearchParams();
	params.append('departId', args.departId);
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('taskId', args.taskId);
	return fetch({
		url: '/structure/performance/queryTaskUser',
		method: 'GET',
		params
	})
}

//删除被考核人考核数据
export function deleteRelativeUserItemByTaskId(args) {
	let params = new URLSearchParams();
	params.append('taskId', args.taskId);
	params.append('userIds', args.userIds);
	return fetch({
		url: '/structure/performance/deleteUserByTaskId',
		method: 'GET',
		params
	})
}

//获取审核列表
export function getCheckList(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('status', args.status || 0);
	return fetch({
		url: '/structure/performance/queryReportByAuditId',
		method: 'GET',
		params
	})
}

//查看进入考核员列表
export function gotestList(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('taskId', args.taskId);
	params.append('status', args.status);
	params.append('searchName', args.searchName);
	return fetch({
		url: '/structure/performance/queryTaskRelativeByTaskId',
		method: 'GET',
		params
	})
}

//获取任务里面已上报的绩效和未上报auditState 0全部,1未审核2驳回3通过,4未上报
export function getReportByTaskId(args) {
	let params = new URLSearchParams();
	params.append('taskId', args.taskId);
	params.append('auditState', args.auditState);
	params.append('searchName', args.searchName || '');
	return fetch({
		url: '/structure/performance/getReportByTaskId',
		method: 'GET',
		params
	})
}

//输入审核意见

export function setAuditRemark(args) {
	let params = new URLSearchParams();
	params.append('auditRemark', args.auditRemark);
	params.append('id', args.id);
	return fetch({
		url: '/structure/performance/insertAuditOpinion',
		method: 'GET',
		params
	})
}

//全部审核通过
export function passAll(args) {
	let params = new URLSearchParams();
	params.append('taskId', args.taskId);
	params.append('id', args.id);
	params.append('auditState', args.auditState);
	return fetch({
		url: '/structure/performance/auditPass',
		method: 'GET',
		params
	})
}

//提交上报
export function reportIt(args) {
	let params = new URLSearchParams();
	params.append('taskRelativeId', args.taskRelativeId);
	return fetch({
		url: '/structure/performance/submitAppearPerformanceAssess',
		method: 'GET',
		params
	})
}

//获取考核员本次考核任务的上报
export function getReportByRelativeId(args) {
	let params = new URLSearchParams();
	params.append('relativeId', args.relativeId);
	return fetch({
		url: '/structure/performance/getReportByRelativeId',
		method: 'GET',
		params
	})
}

//根据考核id和用户获取考核项（标记已上报的考核项）
export function getItemListByRelativeIdAndUserId(args) {
	let params = new URLSearchParams();
	params.append('relativeId', args.relativeId);
	return fetch({
		url: '/structure/performance/getItemListByRelativeIdAndUserId',
		method: 'GET',
		params
	})
}

//撤销上报
export function cancelReportPerformanceAssess(args) {
	let params = new URLSearchParams();
	params.append('reportId', args.reportId);
	return fetch({
		url: '/structure/performance/cancelReportPerformanceAssess',
		method: 'GET',
		params
	})
}

//驳回
export function rejectTask(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);
	return fetch({
		url: '/structure/performance/auditReject',
		method: 'POST',
		params
	})
}

//写入备注
export function setRemark(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);
	params.append('remark', args.remark);
	return fetch({
		url: '/structure/performance/insertReportUserRemark',
		method: 'POST',
		params
	})
}

//发布绩效
export function publishPerformance(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);
	params.append('taskName', args.taskName);
	return fetch({
		url: '/structure/performance/publishPerformanceAssess',
		method: 'POST',
		params
	})
}

//获取考核项的分配关系
export function queryItemAllot(args) {
	let params = new URLSearchParams();
	params.append('schoolId', args.schoolId);
	return fetch({
		url: '/structure/performance/queryItemAllot',
		method: 'POST',
		params
	})
}

//获取分配给考核员的考核项
export function getItemListByUserId(args) {
	let params = new URLSearchParams();
	params.append('schoolId', args.schoolId);
	params.append('userId', args.userId);
	return fetch({
		url: '/structure/performance/getItemListByUserId',
		method: 'POST',
		params
	})
}

//删除考核项分配关系
export function deleteItemAllot(args) {
	let params = new URLSearchParams();
	params.append('schoolId', args.schoolId);
	params.append('userId', args.userId);
	return fetch({
		url: '/structure/performance/deleteItemAllot',
		method: 'POST',
		params
	})
}

//新增考核项分配关系
export function insertItemAllot(args) {
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/insertItemAllot',
		method: 'POST',
		data: JSON.stringify(args)
	})
}

//编辑考核项分配关系
export function editItemAllot(args) {
	return fetch({
		headers: {
			'content-type': 'application/json'
		},
		url: '/structure/performance/editItemAllot',
		method: 'POST',
		data: JSON.stringify(args)
	})
}

//获取学校考核项
export function getItemListBySchoolId(args) {
	let params = new URLSearchParams();
	return fetch({
		url: '/structure/performance/getItemListBySchoolId',
		method: 'POST',
		params
	})
}
//获取考核任务具体信息
export function getAppearInfo(args) {
	let params = new URLSearchParams();
	params.append('taskRelativeId', args.taskRelativeId);
	return fetch({
		url: '/structure/performance/getAppearInfo',
		method: 'POST',
		params
	})
}
//获取任务关联考核项
export function getAssessRelativeItemByRelativeId(args) {
	let params = new URLSearchParams();
	params.append('taskRelativeId', args.taskRelativeId);
	return fetch({
		url: '/structure/performance/getAssessRelativeItemByRelativeId',
		method: 'POST',
		params
	})
}
//获取任务关联人员
export function getAssessRelativeUserByRelativeId(args) {
	let params = new URLSearchParams();
	params.append('taskRelativeId', args.taskRelativeId);
	return fetch({
		url: '/structure/performance/getAssessRelativeUserByRelativeId',
		method: 'POST',
		params
	})
}
//审核员获取上报内的修改记录
export function queryAuditRecordByReportId(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('reportId', args.reportId);
	return fetch({
		url: '/structure/performance/queryAuditRecordByReportId',
		method: 'GET',
		params
	})
}
//获取考核员该任务的考核项
export function getItemByReportId(args) {
	let params = new URLSearchParams();
	params.append('reportId', args.reportId);
	return fetch({
		url: '/structure/performance/getItemByReportId',
		method: 'GET',
		params
	})
}
//获取该上报的被考核人员
export function getUserByReportId(args) {
	let params = new URLSearchParams();
	params.append('reportId', args.reportId);
	return fetch({
		url: '/structure/performance/getUserByReportId',
		method: 'GET',
		params
	})
}
//获取任务关联人员
export function getUserItemByTaskIdAndUserIdAndItemId(args) {
	let params = new URLSearchParams();
	params.append('taskId', args.taskId);
	params.append('userId', args.userId);
	params.append('itemId', args.itemId);
	return fetch({
		url: '/structure/performance/getUserItemByTaskIdAndUserIdAndItemId',
		method: 'GET',
		params
	})
}
// 添加修改记录
export function insertRecord(args) {
	let params = new URLSearchParams();
	params.append('updatePoint', args.updatePoint);
	params.append('assessDate', args.assessDate);
	params.append('updateRemark', args.updateRemark);
	params.append('classIds', args.classIds);
	params.append('classNames', args.classNames);
	params.append('currIds', args.currIds);
	params.append('currNames', args.currNames);
	params.append('departIds', args.departIds);
	params.append('departNames', args.departNames);
	params.append('haveRemark', args.haveRemark);
	params.append('itemId', args.itemId);
	params.append('itemName', args.itemName);
	params.append('orderNo', args.orderNo);
	params.append('point', args.point);
	params.append('relativeId', args.relativeId);
	params.append('remark', args.remark);
	params.append('reportId', args.reportId);
	params.append('taskId', args.taskId);
	params.append('taskName', args.taskName);
	params.append('typeId', args.typeId);
	params.append('typeName', args.typeName);
	params.append('userId', args.userId);
	params.append('userLoginName', args.userLoginName);
	params.append('userName', args.userName);
	params.append('state', args.state);
	params.append('score', args.score);
	params.append('pointType', args.pointType);
	params.append('updateScore', args.updateScore);
	params.append('cashScore', args.cashScore);
	return fetch({
		url: '/structure/performance/insertRecord',
		method: 'POST',
		params
	})
}
//删除绩效修改记录
export function deleteRecord(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);
	return fetch({
		url: '/structure/performance/deleteRecord',
		method: 'GET',
		params
	})
}
//编辑绩效修改记录
export function editRecord(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);
	params.append('state', args.state);
	params.append('updatePoint', args.updatePoint);
	params.append('updateRemark', args.updateRemark);
	params.append('updateScore', args.updateScore);
	return fetch({
		url: '/structure/performance/editRecord',
		method: 'POST',
		params
	})
}
//提交修改记录
export function submitRecord(args) {
	let params = new URLSearchParams();
	params.append('ids', args.ids);
	return fetch({
		url: '/structure/performance/submitRecord',
		method: 'POST',
		params
	})
}
// 考核员获取修改记录
export function queryAssessRecordByReportId(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('reportId', args.reportId);
	return fetch({
		url: '/structure/performance/queryAssessRecordByReportId',
		method: 'POST',
		params
	})
}
// 审核员审批记录
export function auditRecord(args) {
	let params = new URLSearchParams();
	params.append('auditState', args.auditState);
	params.append('ids', args.ids);
	return fetch({
		url: '/structure/performance/auditRecord',
		method: 'POST',
		params
	})
}
// 通过审核的绩效修改记录
export function queryVerifiedRecordByTaskId(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('taskId', args.taskId);
	return fetch({
		url: '/structure/performance/queryVerifiedRecordByTaskId',
		method: 'GET',
		params
	})
}
// 撤销上报
export function cancelAppearPerformanceAssess(args) {
	let params = new URLSearchParams();
	params.append('taskRelativeId', args.taskRelativeId);
	return fetch({
		url: '/structure/performance/cancelAppearPerformanceAssess',
		method: 'GET',
		params
	})
}
//管理员分页查询留言列表
export function queryMessageBySchoolId(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('state', args.state);
	return fetch({
		url: '/structure/performance/queryMessageBySchoolId',
		method: 'GET',
		params
	})
}
//获取任务详情
export function getTaskDetail(args) {
	let params = new URLSearchParams();
	params.append('taskId', args.taskId);
	params.append('userId', args.userId);
	return fetch({
		url: '/structure/performance/teacherPerformanceInfo',
		method: 'GET',
		params
	})
}
//回复留言
export function replyMessage(args) {
	let params = new URLSearchParams();
	params.append('replyContent', args.replyContent);
	params.append('id', args.id);
	return fetch({
		url: '/structure/performance/replyMessage',
		method: 'POST',
		data: params
	})
}
//删除留言
export function deleteMessage(args) {
	let params = new URLSearchParams();
	params.append('messageId', args.messageId);
	return fetch({
		url: '/structure/performance/deleteMessage',
		method: 'GET',
		params
	})
}
export function deleteUserByReportId(args) {
    let params = new URLSearchParams();
    params.append('taskId', args.taskId);
    params.append('reportId', args.reportId);
    params.append('userIds', args.userIds);

    return fetch({
        url: '/structure/performance/deleteUserByReportId',
        method: 'GET',
        params
    })
}

//获取被考核人 2024-03-05
export function getPerformanceUserByTaskId(taskId) {
	let params = new URLSearchParams();
	params.append('taskId', taskId);
	return fetch({
		url: '/structure/performance/getPerformanceUserByTaskId',
		method: 'get',
		params
	})
}

export function publishPerformanceAssessToUserList(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/performance/publishPerformanceAssessToUserList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}


//根据老师id,考核id查询上报id信息
export function getPerformanceTtemByTh(args) {
	let params = new URLSearchParams();
	params.append('taskId', args.taskId);
	params.append('itemId', args.itemId);
	params.append('userId', args.userId);
	return fetch({
		url: '/structure/performance/getPerformanceTtemByTh',
		method: 'get',
		params
	})
}