/*
 *  @Author: ZQ 
 * @Date: 2017-10-30 15:41:13 
 * @Last Modified by: ZQ
 * @Last Modified time: 2017-12-12 16:54:37
 * 关于权限接口
 */

import fetch from '@/utils/fetch';

/**
 * 查询用户所有权限
 * @param {*} userId 
 */
export function getUserPerm(schoolId,userId){
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    params.append('userId', userId);
    return fetch({
        url: global.LoginPath + 'permission/getUserPerm',
        method: 'post',
        data: params
    });

}

/**
 * 根据上级权限id获取子权限
 * @param {*} permId 
 */
export function getNewUserSonPerm(permId){
    let params = new URLSearchParams();
    params.append('permId', permId);
    return fetch({
        url: global.LoginPath + 'permission/getNewUserSonPerm',
        method: 'post',
        data: params
    });
}
