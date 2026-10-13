import fetch from '@/utils/fetchNew';
import { systemFetch } from '@/utils/fetch';
/**
 * 获取上下级树形关系
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function relationTrees() {
    return fetch({
        url: 'sys/userRelation/relationTrees',
        method: 'get'
        });
}
/**
 * 删除下级
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function delLowerLevel(userId) {
    return fetch({
        url: 'sys/userRelation/delLowerLevel?userId='+userId,
        method: 'get'
        });
}
/**
 * 清空所有上下级关系
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function emptyAll(userId) {
    return fetch({
        url: 'sys/userRelation/emptyAll',
        method: 'get'
        });
}
/**
 * 添加顶级
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function addTopLevel(userId,position) {
    return fetch({
        url: 'sys/userRelation/addTopLevel?userId='+userId+'&position='+position,
        method: 'get'
        });
}
/**
 * 新增下级
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function addLowerLevel(leaderId,position,userIds) {
    return fetch({
        url: 'sys/userRelation/addLowerLevel?leaderId='+leaderId+'&position='+position+'&userIds='+userIds,
        method: 'get'
        });
}
/**
 * 修改本级信息
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function updateCurrLevel(userId,position,newUserId) {
    return fetch({
        url: 'sys/userRelation/updateCurrLevel?userId='+userId+'&position='+position+'&newUserId='+newUserId,
        method: 'get'
        });
}
/**
 * 用户职务
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function postion() {
    return fetch({
        url: 'api/constant/user/postion',
        method: 'get'
        });
}
/**
 * 获得用户信息
 * @export
 * @param {any} params 
 * @returns 
 */
export function sysUserDetail(arg) {
    let params = new URLSearchParams();
    params.append('userId', arg.userId);
    params.append('userType', arg.userType);
    return systemFetch({
        url: 'sys/user/detail',
        method: 'get',
        params
        });
}
