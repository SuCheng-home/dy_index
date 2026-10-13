import fetch from '@/utils/fetch';
import {
    wxcepInterface
} from '@/utils/fetch';
/**
 * 查询全部设备
 */
export function getAllEquipmentList() {
    return fetch({
        url: 'structure/scancodeEquipment/getAllScancodeEquipmentList',
        method: 'get'
    });
}

/**
 * 新增设备
 * @param {*} scancodeEquipment
 */
export function addDevice(query) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/scancodeEquipment/addScancodeEquipment',
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function editScancodeEquipmentt(query) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/scancodeEquipment/editScancodeEquipment',
        method: 'post',
        data: JSON.stringify(query)
    });
}

/**
 * 批量删除设备
 * @param {*} ids
 */
export function batchDeleteDevice(ids) {
    let params = new URLSearchParams();
    params.append('ids', ids);
    return fetch({
        url: 'structure/scancodeEquipment/batchDeleteScancodeEquipment',
        method: 'post',
        data: params
    });
}


/**
 * 用户
 */
/**
 * 查询设备用户
 * @param {*} query
 */
export function getDeviceUserList(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('scanId', query.scanId);
    params.append('userName', query.userName);
    params.append('userType', query.userType);

    return fetch({
        url: 'structure/scancodeEquipment/getScancodeEquipmentUser',
        method: 'post',
        data: params
    });
}

/**
 * 新增设备用户
 * @param {*} query
 */
export function addUserDevice(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/scancodeEquipment/addScancodeEquipmentUser',
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function addScancodeEquipmentUserByDepart(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/scancodeEquipment/addScancodeEquipmentUserByDepart',
        method: 'post',
        data: JSON.stringify(query)
    });
}


/**
 * 同步设备用户
 * @param {*} query
 */
export function delDeviceUser(query) {
    let params = new URLSearchParams();
    params.append('scanId', query.scanId);
    params.append('userId', query.userId);

    return fetch({
        url: 'structure/scancodeEquipment/delScancodeEquipmentUser',
        method: 'get',
        params
    });
}

/**
 * 同步设备用户
 * @param {*} equipmentId
 */
export function syncDeviceUser(equipmentId) {
    let params = new URLSearchParams();
    params.append('equipmentId', equipmentId);

    return fetch({
        url: 'structure/scancodeEquipment/synchronousScancodeEquipmentUser',
        method: 'get',
        params
    });
}

/**
 * 提醒未上传照片设备用户
 * @param {*} scanId
 */
export function remindUser(scanId) {
    let params = new URLSearchParams();
    params.append('scanId', scanId);

    return fetch({
        url: 'structure/scancodeEquipment/remindScancodeEquipmentUser',
        method: 'get',
        params
    });
}

export function morningCheckInit(equipmentId) {
    let params = new URLSearchParams();
    params.append('equipmentId', equipmentId);
    return wxcepInterface({
        url: 'common/aiNuoDa/morningCheckInit',
        method: 'get',
        timeout: 600000,
        params
    });
}

export function getEquipmentLibraryList(args) {
    let params = new URLSearchParams();
    params.append('equipType', args.equipType);
    params.append('equipmentId', args.equipmentId);
    params.append('moduleId', args.moduleId);
    params.append('schoolName', args.schoolName);
    params.append('status', args.status);
    params.append('useType', args.useType);

    return fetch({
        url: 'structure/scancodeEquipment/getEquipmentLibraryList',
        method: 'get',
        params
    });
}

export function getEquipmentLibrary(args) {
    let params = new URLSearchParams();
    params.append('equipType', args.equipType);
    params.append('equipmentId', args.equipmentId);

    return fetch({
        url: 'structure/scancodeEquipment/getEquipmentLibrary',
        method: 'get',
        params
    });
}
