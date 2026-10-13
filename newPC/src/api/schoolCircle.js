import fetch from '@/utils/fetch'
import { wymsFetchNoProcess, systemFetch } from '@/utils/fetch'

// 参数处理函数
function handleParams(args) {
	let params = new URLSearchParams()
	Object.entries(args).forEach(([key, value]) => {
		params.append(key, value)
	})
	return params
}
//分页查询校园圈列表
export function queryCircleTopicBySchoolId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/queryCircleTopicBySchoolId',
		method: 'post',
		data: handleParams(args)
	})
}
//删除校园圈
export function deleteCircleTopic(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/deleteCircleTopic',
		method: 'get',
		params: handleParams(args)
	})
}
//发布校园圈
export function publishCircleTopic(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/publishCircleTopic',
		method: 'get',
		params: handleParams(args)
	})
}
//校园圈添加主题
export function insertCircleTopic(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/insertCircleTopic',
		method: 'post',
		data: handleParams(args)
	})
}
//校园圈编辑主题
export function editCircleTopic(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/editCircleTopic',
		method: 'post',
		data: handleParams(args)
	})
}
//校园圈查询主题详情
export function getCircleTopicInfoById(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/getCircleTopicInfoById',
		method: 'get',
		params: handleParams(args)
	})
}
//新增校园圈主题类型
export function insertCircleTopicType(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/insertCircleTopicType',
		method: 'post',
		data: handleParams(args)
	})
}
//删除校园圈主题类型
export function deleteCircleTopicType(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/deleteCircleTopicType',
		method: 'get',
		params: handleParams(args)
	})
}
//获取校园圈主题类型
export function getCircleTopicTypeByTopicId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/getCircleTopicTypeByTopicId',
		method: 'get',
		params: handleParams(args)
	})
}
//查询主题圈下帖子
export function queryPcSchoolfellowCircle(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/queryPcSchoolfellowCircle',
		method: 'get',
		params: handleParams(args)
	})
}
//查询主题圈下帖子
export function auditSchoolfellowCircle(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/auditSchoolfellowCircle',
		method: 'get',
		params: handleParams(args)
	})
}
//圈子里统计学生分析
export function stuAnalysisByTopicId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/stuAnalysisByTopicId',
		method: 'get',
		params: handleParams(args)
	})
}
//圈子里统计老师分析
export function teacherAnalysisByTopicId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/teacherAnalysisByTopicId',
		method: 'get',
		params: handleParams(args)
	})
}
//圈子里统计汇总（学生,老师）
export function analysisByTopicId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/analysisByTopicId',
		method: 'get',
		params: handleParams(args)
	})
}
//查询加精帖子
export function queryDigestSchoolfellowCircle(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/queryDigestSchoolfellowCircle',
		method: 'get',
		params: handleParams(args)
	})
}
//删除评论
export function deleteComment(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/deleteComment',
		method: 'get',
		params: handleParams(args)
	})
}
//查询圈子年级列表
export function getGradeByTopicId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/getGradeByTopicId',
		method: 'get',
		params: handleParams(args)
	})
}
//查询年级的班级
export function getClassByTopicIdAndGradeId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/getClassByTopicIdAndGradeId',
		method: 'get',
		params: handleParams(args)
	})
}
//查询总统计（学生）
export function stuAnalysisBySchoolId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/stuAnalysisBySchoolId',
		method: 'get',
		params: handleParams(args)
	})
}
//查询总统计（老师）
export function teacherAnalysisBySchoolId(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/teacherAnalysisBySchoolId',
		method: 'get',
		params: handleParams(args)
	})
}
//查询总统计（活跃度）
export function activationAnalysis(args) {
	return fetch({
		url: 'structure/schoolfellowCircle/activationAnalysis',
		method: 'get',
		params: handleParams(args)
	})
}
//字典值列表
export function listValue() {
	let params = new URLSearchParams()
	params.append('key', 'schoolCircleTopicLogo')
	return wymsFetchNoProcess({
		url: 'sysDic/listValue?pageSize=500',
		method: 'get',
		params
	})
}
/**
 * 查询用户所负责的部门列表
 */
export function querySchoolGrade() {
	let params = new URLSearchParams()

	params.append('isFilterNewGrade', false)
	return systemFetch({
		url: 'api/depart/querySchoolGrade',
		method: 'get',
		params
	})
}
/**
 * 根据年级查询班级
 */
export function queryClassByGradeId(id) {
	let params = new URLSearchParams()
	params.append('gradeId', id)
	return systemFetch({
		url: 'api/depart/queryClassByGradeId',
		method: 'get',
		params
	})
}
