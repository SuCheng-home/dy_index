import fetch from '@/utils/fetch';
import Cookies from 'js-cookie';

/*
 * 群组列表
 */
export function getAllGroupList() {
	let params = new URLSearchParams();
	return fetch({
		url: 'group/userGroup',
		method: 'post',
		params
	});
}
/**
 * 
 * 群组人员列表
 * 
 * @export
 * @param {any} noticeId 
 * @param {any} submitRead 
 * @returns 
 */
export function getGroupMembersList(query) {
	let params = new URLSearchParams();
	params.append('filterVal', query.filterVal);
	params.append('group_id', query.group_id);
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
	params.append('query_name', query.query_name);
	return fetch({
		url: 'group/findAll_members',
		method: 'post',
		params
	});
}

/**
 * 新增群组
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function addGroup(listQuery) {
	/*{
    "groupName": "测试群组",
	"employeeSelected": "1,2,3,4,5",
	"managerSelected": "1,2,3,4,5",
	}*/
	let params = new URLSearchParams();
	return fetch({
		url: 'group/save_add',
		method: 'post',
		params
	});
}

/**
 * 
 * 添加群组成员
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function addGroupMembers(listQuery) {
	let params = new URLSearchParams();
	return fetch({
		url: 'group/addMembers',
		method: 'post',
		params
	});
}
/**
 * 
 * 删除群组成员
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function deleteGroupMembers(listQuery) {
	let params = new URLSearchParams();
	params.append('group_id', listQuery.group_id);
	params.append('user_ids', listQuery.userids);
	return fetch({
		url: 'group/delete_members',
		method: 'post',
		params
	});
}
/**
 * 
 * 删除群组
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function deleteGroups(listQuery) {
	let params = new URLSearchParams();

	params.append('group_id', listQuery.group_id);
	return fetch({
		url: 'group/delete_groups',
		method: 'post',
		params
	});
}

/**
 * 
 * 导入成员
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function importGroupMember(listQuery) {
	let params = new URLSearchParams();

	params.append('file', listQuery.group_id);
	params.append('groupId', listQuery.group_id);
	params.append('groupName', listQuery.group_id);
	return fetch({
		url: 'group/importGroupMember',
		method: 'post',
		params
	});
}
