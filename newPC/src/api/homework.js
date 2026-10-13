import fetch from '@/utils/fetch'
import { systemFetch, homeworkfetch } from '@/utils/fetch' //引入系统的ucenter-web 接口
//查询学校所有学期列表
export function getSchoolTimeAllList() {
	let params = new URLSearchParams();
	return fetch({
		url: 'structure/schoolTime/getSchoolTimeAllList',
		method: 'GET',
		params
	})
}

// 查询相关参数
export function getSchoolHomeworkSet() {
	return homeworkfetch({
		url: '/structure/homeWork/getSchoolHomeworkSet',
		method: 'POST'
	})
}

/*
 * 作业列表
 */
export function getHomeworkList(query) {
	let params = new URLSearchParams();
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
	params.append('searchTitle', query.searchTitle);
	params.append('schoolTimeId', query.schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getHomeworkList',
		method: 'post',
		params
	})
}

/**
 * 发布（详情页）
 * @export
 * @param {any} query
 * @returns
 */
export function updateAndPubHomework(homeworkId, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('homeworkId', homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/updateAndPubHomework',
		method: 'post',
		data: params
	})
}
/**
 * 新增保存预览
 * @export
 * @param {any} listQuery
 * @returns
 */
export function addAndPreviewHomework(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('picJson', query.picJson); //	图片（手机端上传图片） 多个逗号分隔
	params.append('content', query.content); //内容
	params.append('curriculumId', query.curriculumId); //课程
	params.append('fileJson', query.fileJson); //附件Id（PC端上传）
	params.append('homeworkState', query.homeworkState); //作业状态 1代表未发布,2代表已经发布
	params.append('homeworkType', query.homeworkType); //作业类型 0为PC端作业,1为手机端作业
	params.append('isTurn', query.isTurn); // 家长是否上交
	//params.append('picIds', query.picIds);//	图片（手机端上传图片）
	params.append('title', query.title); //	标题
	params.append('publishType', query.publishType); //	发布类型 0按班级 1按学生
	params.append('notNotice', query.notNotice);
	params.append('videoJson', query.videoJson);
	params.append('openAfterCensus', query.openAfterCensus || 0);
	params.append('preFinishDur', query.preFinishDur);
	params.append('schoolTimeId', schoolTimeId);
	params.append(
		'smsContent',
		query.content
			.replace(/<[^>]*>|<\/[^>]*>/gm, '')
			.replace(/&nbsp;/gi, '')
			.substring(0, 500)
	);
	if (query.publishType === '1') {
		params.append('workStuJson', JSON.stringify(query.workStuJson.userJson)) //	发布的学生范围JSON
	} else {
		params.append('departIds', query.departIds); //部门 多个逗号分隔
		params.append('walkClassIds', query.walkClassIds.toString()) //	走班班级IDs
	}

	return homeworkfetch({
		url: 'structure/homeWork/addAndPreviewHomework',
		method: 'post',
		data: params
	})
}

/**
 * 新增草稿或提交发布
 * @export
 * @param {any} query
 * @returns
 */
export function addDraftOrPubHomework(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('picJson', query.picJson); //	图片（手机端上传图片） 多个逗号分隔
	params.append('content', query.content); //内容
	params.append('curriculumId', query.curriculumId); //课程
	params.append('fileJson', query.fileJson); //附件Id（PC端上传）
	params.append('homeworkState', query.homeworkState); //作业状态 1代表未发布,2代表已经发布
	params.append('homeworkType', query.homeworkType); //作业类型 0为PC端作业,1为手机端作业
	params.append('isTurn', query.isTurn); // 家长是否上交
	//params.append('picIds', query.picIds);//	图片（手机端上传图片）
	params.append('title', query.title); //	标题
	params.append('publishType', query.publishType); //	发布类型 0按班级 1按学生
	params.append('notNotice', query.notNotice);
	params.append('schoolTimeId', schoolTimeId);
	params.append('videoJson', query.videoJson);
	params.append('openAfterCensus', query.openAfterCensus || 0);
	params.append('preFinishDur', query.preFinishDur);
	params.append(
		'smsContent',
		query.content
			.replace(/<[^>]*>|<\/[^>]*>/gm, '')
			.replace(/&nbsp;/gi, '')
			.substring(0, 500)
	);
	if (query.publishType === '1') {
		params.append('workStuJson', JSON.stringify(query.workStuJson.userJson)); //	发布的学生范围JSON
		params.append('stuGroupsJson', JSON.stringify(query.workStuJson.groupJson)) //	发布的学生范围JSON
	} else {
		params.append('departIds', query.departIds); //部门 多个逗号分隔
		params.append('walkClassIds', query.walkClassIds.toString()) //	走班班级IDs
	}

	return homeworkfetch({
		url: 'structure/homeWork/addDraftOrPubHomework',
		method: 'post',
		data: params
	})
}

/**
 * 编辑保存预览
 * @export
 * @param {any} query
 * @returns
 */
export function editAndPreviewHomework(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('content', query.content); //内容
	params.append('curriculumId', query.curriculumId); //课程
	params.append('isTurn', query.isTurn); // 家长是否提交
	params.append('fileJson', query.fileJson); //附件Id（PC端上传）	多个逗号分隔
	params.append('homeworkState', query.homeworkState); //作业状态 1代表未发布,2代表已经发布	保存草稿和预览传-1；发布传-2
	params.append('homeworkType', query.homeworkType); //作业类型 0为PC端作业,1为手机端作业 PC端创建传-0；手机端创建传-1
	params.append('picJson', query.picJson); //	图片（手机端上传图片） 多个逗号分隔
	params.append('title', query.title); //	标题
	params.append('id', query.id + ''); //	id
	params.append('publishType', query.publishType); //	发布类型 0按班级 1按学生
	params.append('notNotice', query.notNotice);
	params.append('videoJson', query.videoJson);
	params.append('openAfterCensus', query.openAfterCensus || 0);
	params.append('preFinishDur', query.preFinishDur);
	params.append('schoolTimeId', schoolTimeId);
	params.append(
		'smsContent',
		query.content
			.replace(/<[^>]*>|<\/[^>]*>/gm, '')
			.replace(/&nbsp;/gi, '')
			.substring(0, 500)
	);
	if (query.publishType === '1') {
		params.append('workStuJson', JSON.stringify(query.workStuJson.userJson)); //	发布的学生范围JSON
		params.append('stuGroupsJson', JSON.stringify(query.workStuJson.groupJson)) //	发布的学生范围JSON
	} else {
		params.append('departIds', query.departIds); //部门 多个逗号分隔
		params.append('walkClassIds', query.walkClassIds.toString()) //	走班班级IDs
	}
	return homeworkfetch({
		url: 'structure/homeWork/editAndPreviewHomework',
		method: 'post',
		data: params
	})
}

/**
 * 编辑草稿或提交发布
 * @export
 * @param {any} query
 * @returns
 */
export function editDraftOrPubHomework(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('content', query.content); //内容
	params.append('curriculumId', query.curriculumId); //课程
	params.append('fileJson', query.fileJson); //附件Id（PC端上传）	 多个逗号分隔
	params.append('homeworkState', query.homeworkState); //作业状态 1代表未发布,2代表已经发布  保存草稿和预览传-1；发布传-2
	params.append('homeworkType', query.homeworkType); //作业类型 0为PC端作业,1为手机端作业  PC端创建传-0；手机端创建传-1
	params.append('picJson', query.picJson); //	图片（手机端上传图片） 	多个逗号分隔
	params.append('title', query.title); //	标题
	params.append('id', query.id + ''); // 唯一标示
	params.append('isTurn', query.isTurn); // 家长是否提交
	params.append('publishType', query.publishType); //	发布类型 0按班级 1按学生
	params.append('notNotice', query.notNotice);
	params.append('videoJson', query.videoJson);
	params.append('openAfterCensus', query.openAfterCensus || 0);
	params.append('preFinishDur', query.preFinishDur);
	params.append('schoolTimeId', schoolTimeId);
	params.append(
		'smsContent',
		query.content
			.replace(/<[^>]*>|<\/[^>]*>/gm, '')
			.replace(/&nbsp;/gi, '')
			.substring(0, 500)
	);
	if (query.publishType === '1') {
		params.append('workStuJson', JSON.stringify(query.workStuJson.userJson)); //	发布的学生范围JSON
		params.append('stuGroupsJson', JSON.stringify(query.workStuJson.groupJson)) //	发布的学生范围JSON
	} else {
		params.append('departIds', query.departIds); //部门 多个逗号分隔
		params.append('walkClassIds', query.walkClassIds.toString()) //	走班班级IDs
	}
	return homeworkfetch({
		url: 'structure/homeWork/editDraftOrPubHomework',
		method: 'post',
		data: params
	})
}

/**
 * 保存作业课后服务人数统计信息
 * @export
 * @param {any} args
 * @returns
 */
export function saveHomeworkAfterClassInfo(args) {
	let params = new URLSearchParams();
	params.append('finishCount', args.finishCount);
	params.append('joinCount', args.joinCount);
	params.append('workId', args.workId);
	params.append('schoolTimeId', args.schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/saveHomeworkAfterClassInfo',
		method: 'post',
		params
	})
}

/**
 * 删除
 * @export
 * @param {any} query
 * @returns
 */
export function delHomework(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('idStr', query);
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/delHomework',
		method: 'post',
		params
	})
}

/**
 * 更新已读数量
 */
export function updateReadCount(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('homeworkId', query.homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/updateReadCount',
		method: 'post',
		params
	})
}

/**
 * 作业类型列表
 */
export function getCourseList(schoolTimeId) {
	let params = new URLSearchParams();
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getTeacherCourseList',
		method: 'post',
		params
	})
}

/**
 * 根据课程获取班级
 */
export function getClassListByCourseId(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('courseId', query);
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getClassListByCourseId',
		method: 'post',
		params
	})
}

/**
 * 获取班级列表
 */
export function getClassList(schoolTimeId) {
	let params = new URLSearchParams();
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getClassList',
		method: 'post',
		params
	})
}

/**
 * 老师查看作业详情
 */
export function getHomeworkById(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('schoolTimeId', schoolTimeId);
	params.append('homeworkId', query.homeworkId + '');
	return homeworkfetch({
		url: 'structure/homeWork/getHomeworkById',
		method: 'post',
		params
	})
}

/**
 * 已读列表
 */
export function getReadList(query, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
	params.append('userName', query.userName);
	params.append('homeworkId', query.homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getReadList',
		method: 'post',
		params
	})
}

// 已完成列表
export function getFinishStuList(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('homeworkId', args.homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getFinishStuList',
		method: 'post',
		data: params
	})
}

// 未完成列表
export function getUnFinishStuList(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('homeworkId', args.homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getUnFinishStuList',
		method: 'post',
		data: params
	})
}
/**
 * 未读列表
 */
export function getUnReadStudentList(homeworkId, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('homeworkId', homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getUnReadStudentList',
		method: 'post',
		params
	})
}

// 获得学生的提交作业内容
export function getStuWorkInfo(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('homeworkId', args.homeworkId + '');
	params.append('studentId', args.studentId);
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getStuWorkInfo',
		method: 'post',
		data: params
	})
}

// 已完成、未完成列表
export function getFinishStuListByType(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('departId', args.departId);
	params.append('homeworkId', args.homeworkId + '');
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('stuName', args.stuName);
	params.append('type', args.type);
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getFinishStuListByType',
		method: 'post',
		data: params
	})
}

// 回复列表(分页)
export function getReplyPageListByHId(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('homeworkId', args.homeworkId + '');
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('searchName', args.searchName);
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getReplyPageListByHId',
		method: 'post',
		data: params
	})
}

// 保存回复
export function addReplyInfo(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('content', args.content);
	params.append('homeworkId', args.homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/addReplyInfo',
		method: 'post',
		data: params
	})
}

// 导出全部回复
export function exportHomeworkReply(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('homeworkId', args.homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/exportHomeworkReply',
		method: 'post',
		data: params
	})
}
//教师提交学生作业评价
export function updateStuHomeWorkEvaluate(args, schoolTimeId) {
	const params = new URLSearchParams();
	params.append('evaluateAudioJson', args.evaluateAudioJson);
	params.append('evaluateRemark', args.evaluateRemark || '');
	params.append('isRevised', args.isRevised);
	params.append('starNum', args.starNum);
	params.append('stuId', args.stuId);
	params.append('id', args.id || 0);
	params.append('stuWorkId', args.stuWorkId);
	params.append('workId', args.workId + '');
	params.append('schoolTimeId', schoolTimeId);
	params.append('evaluatePicJson', JSON.stringify(args.evaluatePicJson));
	params.append("markPicJson", JSON.stringify(args.markPicJson) || '');
	return homeworkfetch({
		url: 'structure/homeWork/updateStuHomeWorkEvaluate',
		method: 'post',
		data: params
	})
}
/**
 * 提醒未提交作业学生
 * @export
 * @param {any} query
 * @returns
 */
export function remindUnfinishedStu(homeworkId, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('homeworkId', homeworkId + '');
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/remindUnfinishedStu',
		method: 'post',
		params
	})
}

//作业统计老师
export function getHomeworkStaticsPageDatas(args) {
	let params = new URLSearchParams();
	params.append('classId', args.classId);
	// params.append('endTime', args.endTime);
	params.append('gradeId', args.gradeId);
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('roleId', args.roleId);
	params.append('searchName', args.searchName);
	// params.append('startTime', args.startTime);
	params.append('schoolTimeId', args.schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getHomeworkStaticsPageDatas',
		method: 'post',
		data: params
	})
}
//作业统计学生
export function getHomeworkStuStaticsForLeader(args) {
	let params = new URLSearchParams();
	params.append('classId', args.classId);
	// params.append('endTime', args.endTime);
	params.append('gradeId', args.gradeId);
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('stuName', args.stuName);
	params.append('schoolTimeId', args.schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getHomeworkStuStaticsForLeader',
		method: 'post',
		data: params
	})
}

//已发布列表
export function getPubHomeworkList(args, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('currUserId', args.currUserId);
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getPubHomeworkList',
		method: 'post',
		data: params
	})
}

//新增接口
//年级主任年级副主任
//获得年级列表
export function getGradeList(schoolTimeId) {
	let params = new URLSearchParams();
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getGradeList',
		method: 'post',
		data: params
	})
}
//校级-部门级别根据年级ID获得班级列表
export function getClassListByGradeIdForManager(args, schoolTimeId) {
	let params = new URLSearchParams();
	params.append('gradeId', args.gradeId);
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getClassListByGradeIdForManager',
		method: 'post',
		data: params
	})
}
//班主任-副班主任获得班级列表
export function getClassListForHeader(schoolTimeId) {
	let params = new URLSearchParams();
	params.append('schoolTimeId', schoolTimeId);
	return homeworkfetch({
		url: 'structure/homeWork/getClassListForHeader',
		method: 'post',
		data: params
	})
}

//新增 编辑作业设置
export function addAndEditWorkSet(args) {
	let params = new URLSearchParams();
	params.append('homeworkGradeTimeJson', args.homeworkGradeTimeJson || '');
	params.append('id', args.id || '');
	params.append('isAutoRemind', args.isAutoRemind || 0);
	params.append('isCensusDur', args.isCensusDur || 1);
	params.append('isSendSms', args.isSendSms || 0);
	params.append('openExtraClass', args.openExtraClass || 0);
	params.append('openKhfwCensus', args.openKhfwCensus || 0);
	return homeworkfetch({
		url: 'structure/homeWork/addAndEditWorkSet',
		method: 'post',
		data: params
	})
}

/*yjx新增作业统计*/
//获得用户具备的角色
export function queryRoleList(args) {
	let params = new URLSearchParams();
	params.append('userId', args.userId);
	return systemFetch({
		url: 'api/user/role/queryRoleList',
		method: 'get',
		params
	})
}
//获得年级列表
export function querySchoolGrade(args) {
	let params = new URLSearchParams();
	params.append('isFilterNewGrade', args.isFilterNewGrade);
	return systemFetch({
		url: 'api/depart/querySchoolGrade',
		method: 'get',
		params
	})
}
//根据年级ID获得班级列表
export function queryClassByGradeId(args) {
	let params = new URLSearchParams();
	params.append('gradeId', args.gradeId);
	return systemFetch({
		url: 'api/depart/queryClassByGradeId',
		method: 'get',
		params
	})
}
//查询用户所负责的部门列表//主任：如年级主任、班主任
export function getDepartListByUserId(args) {
	let params = new URLSearchParams();
	params.append('type', args.type);
	return systemFetch({
		url: 'api/depart/getDepartListByUserId',
		method: 'get',
		params
	})
}
//查询用户所负责的部门和其他负责部门副主任：如年级副主任、副班主任
export function getManageAndOtherDepart(args) {
	let params = new URLSearchParams();
	params.append('type', args.type);
	return systemFetch({
		url: 'api/depart/getManageAndOtherDepart',
		method: 'get',
		params
	})
}
