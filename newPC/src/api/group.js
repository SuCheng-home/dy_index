import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

import Cookies from 'js-cookie';

/*
 * 群组列表
 */
export function getAllGroupList() {
    let params = new URLSearchParams();
    return systemFetch({
        url: 'oneself/group/userGroup',
        method: 'post',
        data:params
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
    params.append('groupId', query.group_id);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('queryName', query.query_name);
    return systemFetch({
        url: 'oneself/group/findAll_members',
        method: 'post',
        data:params
    });
}

/**
 * 新增群组
 * @export
 * @param {any} listQuery
 * @returns
 */
export function addGroup(query) {
    /*{
      "groupName": "测试群组",
      "employeeSelected": "1,2,3,4,5",
      "managerSelected": "1,2,3,4,5",
      }*/
    let params = new URLSearchParams();
    params.append('groupName', query.groupName);
    params.append('managerSelected', query.managerSelected);
    params.append('employeeSelected', query.employeeSelected);
    params.append('type', query.type);
    return systemFetch({
        url: 'oneself/group/save_add',
        method: 'post',
        data:params
    });
}
/**
 * 编辑群组
 * @export
 * @param {any} query
 * @returns
 */
export function editGroup(query) {
    /*{
      "groupName": "测试群组",
      "employeeSelected": "1,2,3,4,5",
      "managerSelected": "1,2,3,4,5",
      "groupId": "id"
      }*/
    let params = new URLSearchParams();
    params.append('groupName', query.groupName);
    params.append('managerSelected', query.managerSelected);
    params.append('employeeSelected', query.employeeSelected);
    params.append('groupId', query.groupId);
    params.append('type', query.type);
    return systemFetch({
        url: 'oneself/group/save_update',
        method: 'post',
        data:params
    });
}
/**
 * 跳转到常用组修改
 * @export
 * @param {any} query
 * @returns
 */
export function toUpdate(query) {
    let params = new URLSearchParams();
    params.append('groupId', query);
    return systemFetch({
        url: 'oneself/group/toUpdate',
        method: 'post',
        data:params
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
    params.append('groupId', listQuery.group_id);
    params.append('userids', listQuery.userids);
    return systemFetch({
        url: 'oneself/group/addMembers',
        method: 'post',
        data:params
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
    params.append('groupId', listQuery.group_id);
    params.append('userIds', listQuery.userids);
    return systemFetch({
        url: 'oneself/group/delete_members',
        method: 'post',
        data:params
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

    params.append('groupId', listQuery.group_id);
    return systemFetch({
        url: 'oneself/group/delete_groups',
        method: 'post',
        data:params
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
    return systemFetch({
        url: 'oneself/group/importGroupMember',
        method: 'post',
        data:params
    });
}
