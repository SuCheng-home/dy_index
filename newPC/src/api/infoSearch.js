import fetch from '@/utils/fetch';
//
export function addStaterunEnrolInfoBatch(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/staterunEnrol/addStaterunEnrolInfoBatch',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function getSchoolStaterunEnrolInfoBatchPageList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('batchName', args.batchName);
    return fetch({
        url: 'structure/staterunEnrol/getSchoolStaterunEnrolInfoBatchPageList',
        method: 'post',
        data: params
    });
}

export function deleteStaterunEnrolInfoBatchById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/staterunEnrol/deleteStaterunEnrolInfoBatchById',
        method: 'post',
        data: params
    });
}

export function getBatchStaterunEnrolInfoRosterPageList(args) {
    let params = new URLSearchParams();
    params.append('batchId', args.batchId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('rosterKey', args.rosterKey);
    params.append('isSearch', args.isSearch);

    return fetch({
        url: 'structure/staterunEnrol/getBatchStaterunEnrolInfoRosterPageList',
        method: 'post',
        data: params
    });
}
