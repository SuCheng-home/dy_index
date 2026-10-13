import fetch from '@/utils/fetch';
import { systemFetch,homeworkfetch,wymsFetchNoProcess} from '@/utils/fetch';

// //卡模板正/反面url
// export function findSchoolDicsByCode() {
//     let params = new URLSearchParams();
//     params.append('dicCode', 'dataSend');
//     return fetch({
//         url: 'structure/schoolDictionary/findSchoolDicsByCode',
//         method: 'post',
//         data: params
//     })
// }
//系统字典
export function listValue() {
    let params = new URLSearchParams();
    params.append('key', "dataSend");
    return wymsFetchNoProcess({
        url: 'sysDic/listValue?pageSize=500',
        method: 'get',
        params
    });
}
export function deleteDataSendBatchById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/dataSend/deleteDataSendBatchById',
        method: 'get',
        params
    });
}
export function pushDateSendBatch(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dataSend/pushDateSendBatch',
        method: 'post',
        data: JSON.stringify(args)
    });
   
}
export function getSchoolDataSendBatchPageList(obj) {
    let params = new URLSearchParams();
    params.append('pageNo', obj.pageNo);
    params.append('pageSize', obj.pageSize);
    params.append('batchName', obj.batchName);
    return fetch({
        url: 'structure/dataSend/getSchoolDataSendBatchPageList',
        method: 'get',
        params
    });
}

export function addDateSendBatch(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dataSend/addDateSendBatch',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function updateDateSendBatch(args) {
    let params = new URLSearchParams();
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dataSend/updateDateSendBatch',
        method: 'post',
        data: JSON.stringify(args)
    });
}

export function getDataSendSearchBatchInfo(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/dataSend/getDataSendSearchBatchInfo',
        method: 'get',
        params
    });
}


export function getBatchDataSendInfoRosterPageList(obj) {
    let params = new URLSearchParams();
    params.append('pageNo', obj.pageNo);
    params.append('pageSize', obj.pageSize);
    params.append('batchId', obj.batchId);
    params.append('rosterKey', obj.rosterKey);
    return fetch({
        url: 'structure/dataSend/getBatchDataSendInfoRosterPageList',
        method: 'get',
        params
    });
}

export function deleteDataSendBatchRosterById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/dataSend/deleteDataSendBatchRosterById',
        method: 'get',
        params
    });
}
export function remindNotReadeDateSendBatch(args) {
    let params = new URLSearchParams();
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dataSend/remindNotReadeDateSendBatch',
        method: 'post',
        data: JSON.stringify(args)
    });
}