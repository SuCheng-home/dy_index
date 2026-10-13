import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
import {wymsFetchNoProcess,newcard} from '@/utils/fetch';
//用户分页查询
export function getTelephoneUserForPage(args) {
    let params = new URLSearchParams();
    params.append("nameKeywords", args.nameKeywords);
    params.append("sidKeywords", args.sidKeywords);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/telephoneUser/getTelephoneUserForPage',
        method: 'GET',
        params
    });
}
//亲情号码列表
export function getTelephoneUserFamilyNumberList(userId) {
    let params = new URLSearchParams();
    params.append("userId", userId);
    return newcard({
        url: 'structure/telephoneUserFamilyNumber/getTelephoneUserFamilyNumberList',
        method: 'GET',
        params
    });
}
//命令下发返回列表
export function getTelephoneDevicesCommandRecordForPage(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('keywords', args.keywords);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/telephoneDevicesCommandRecord/getTelephoneDevicesCommandRecordForPage',
        method: 'GET',
        params
    });
}
//PC端通话记录分页查询
export function getTelephoneUserCallRecordForPage(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('keywords', args.keywords);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/telephoneUserCallRecord/getTelephoneUserCallRecordForPage',
        method: 'GET',
        params
    });
}
//PC端通话记录分页查询
export function getTelephoneUserRechargeRecordForPage(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('keywords', args.keywords);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/telephoneUser/getTelephoneUserRechargeRecordForPage',
        method: 'GET',
        params
    });
}
//删除设备指令
export function delTelephoneDevicesCommandRecord(query) {
    return newcard({
        headers: {'content-type': 'application/json'},
        url: 'structure/telephoneDevicesCommandRecord/delTelephoneDevicesCommandRecord',
        method: 'POST',
        data: JSON.stringify(query)
    });
  }
//PC端通话记录分页查询
export function getTelephoneDevicesForPage(args) {
    let params = new URLSearchParams();
    params.append('keywords', args.keywords);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/telephoneDevices/getTelephoneDevicesForPage',
        method: 'GET',
        params
    });
}

//设备命令控制：重启|关机|清除缓存|下发人脸
export function controlCommand(query) {
    return newcard({
        headers: {'content-type': 'application/json'},
        url: 'structure/telephoneDevices/controlCommand?commandCode='+query.commandCode,
        method: 'POST',
        data: JSON.stringify(query.devicesIds)
    });
}
//删除设备
export function delTelephoneDevices(devicesId) {
    let params = new URLSearchParams();
    params.append("devicesId", devicesId);
    return newcard({
        url: 'structure/telephoneDevices/delTelephoneDevices',
        method: 'GET',
        params
    });
}

//新增设备
export function addTelephoneDevices(query) {
    return newcard({
        headers: {'content-type': 'application/json'},
        url: 'structure/telephoneDevices/addTelephoneDevices',
        method: 'POST',
        data: JSON.stringify(query)
    });
  }
//修改设备
export function updateTelephoneDevices(query) {
    return newcard({
        headers: {'content-type': 'application/json'},
        url: 'structure/telephoneDevices/updateTelephoneDevices',
        method: 'POST',
        data: JSON.stringify(query)
    });
  }

  //删除设备
export function getTelephoneDevicesInfo(devicesId) {
    let params = new URLSearchParams();
    params.append("devicesId", devicesId);
    return newcard({
        url: 'structure/telephoneDevices/getTelephoneDevicesInfo',
        method: 'GET',
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
