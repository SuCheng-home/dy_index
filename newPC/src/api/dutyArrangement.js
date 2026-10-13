import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
export function getWatchGroupList(title, signSheetCode) {
    let params = new URLSearchParams();
    params.append("title", title);
    if (signSheetCode) {
        params.append("signSheetCode", signSheetCode);
    }
    return fetch({
        url: 'structure/watch/getWatchGroupList',
        method: 'get',
        params
    });
}
export function getWatchGroup(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/watch/getWatchGroup',
        method: 'get',
        params
    });
}
export function delWatchGroup(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/watch/delWatchGroup',
        method: 'get',
        params
    });
}
export function updateWatchGroup(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/watch/updateWatchGroup',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function addWatchGroup(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/watch/addWatchGroup',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function stationInitIdList(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/watch/delWatchStationInitList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function delWatchGroupStation(stationId) {
    let params = new URLSearchParams();
    params.append("stationId", stationId);
    return fetch({
        url: 'structure/watch/delWatchGroupStation',
        method: 'get',
        params
    });
}
export function getWatchGroupStation(stationId) {
    let params = new URLSearchParams();
    params.append("stationId", stationId);
    return fetch({
        url: 'structure/watch/getWatchGroupStation',
        method: 'get',
        params
    });
}
export function getWatchGroupStationList(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/watch/getWatchGroupStationList',
        method: 'get',
        params
    });
}

export function uddateWatchGroupStation(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/watch/uddateWatchGroupStation',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function addWatchGroupStation(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/watch/addWatchGroupStation',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function uddateWatchStationInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/watch/uddateWatchStationInit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function addWatchStationInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/watch/addWatchStationInit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function getWatchStationInitListPage(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("groupId", args.groupId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("startDate", args.startDate);
    params.append("stationId", args.stationId);
    params.append("teacherUserName", args.teacherUserName);
    return fetch({
        url: 'structure/watch/getWatchStationInitListPage',
        method: 'get',
        params
    });
}
export function getWatchStationSignRecordList(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("groupId", args.groupId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("startDate", args.startDate);
    params.append("teacherUserName", args.teacherUserName);
    return fetch({
        url: 'structure/watch/getWatchStationSignRecordList',
        method: 'get',
        params
    });
}
export function getWatchStationInit(stationInitId) {
    let params = new URLSearchParams();
    params.append("stationInitId", stationInitId);
    return fetch({
        url: 'structure/watch/getWatchStationInit',
        method: 'get',
        params
    });
}
export function delWatchStationInit(stationInitId) {
    let params = new URLSearchParams();
    params.append("stationInitId", stationInitId);
    return fetch({
        url: 'structure/watch/delWatchStationInit',
        method: 'get',
        params
    });
}

export function getWatchStationInitListWeek(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/watch/getWatchStationInitListWeek',
        method: 'get',
        params
    });
}