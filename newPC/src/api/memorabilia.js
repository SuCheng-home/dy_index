import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

//部门List(上报员的部门list和非上报员的部门List)
export function findDepartList(args) {
    let params = new URLSearchParams();
    params.append('isReporter', args.isReporter);
    return fetch({
        url: 'structure/bigEvent/findDepartList',
        method: 'get',
        params
    });
}

// 获取学期列表
export function getSchoolTimeAllList() {
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'GET'
    });
}

//新增大事记
export function addBigEventNote(args) {
    return fetch({
        url: 'structure/bigEvent/addBigEventNote',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(args)
    });
}

//大事记列表(上报员)
export function findBigEventNoteListByReporter(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('isExport', args.isExport);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTermId', args.schoolTermId);
    return fetch({
        url: 'structure/bigEvent/findBigEventNoteListByReporter',
        method: 'post',
        timeout: 20000,
        data: params
    });
}

//删除单个大事记
export function deleteBigEventNote(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    return fetch({
        url: 'structure/bigEvent/deleteBigEventNote',
        method: 'get',
        params
    });
}

//修改
export function updateBigEventNote(args) {
    return fetch({
        url: 'structure/bigEvent/updateBigEventNote',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(args)
    });
}

//查看单个大事记详情
export function getBigEventNoteInfoById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    return fetch({
        url: 'structure/bigEvent/getBigEventNoteInfoById',
        method: 'get',
        params
    });
}

//大事记列表(统计员)
export function findBigEventNoteListBySta(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('endTimeStr', args.endTimeStr);
    params.append('isBtnSearch', args.isBtnSearch);
    params.append('isExport', args.isExport);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTermId', args.schoolTermId);
    params.append('startTimeStr', args.startTimeStr);
    return fetch({
        url: 'structure/bigEvent/findBigEventNoteListByStatistician',
        method: 'post',
        timeout: 20000,
        data: params
    });
}

//新增or修改
export function insertOrUpdateBigEventNoteSet(args) {
    return fetch({
        url: 'structure/bigEventNoteSet/insertOrUpdateBigEventNoteSet',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(args)
    });
}

//获取学校的大事记设置
export function getBySchoolId(args) {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/bigEventNoteSet/getBySchoolId',
        method: 'get',
        params
    });
}