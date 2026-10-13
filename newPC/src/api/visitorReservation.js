import fetch from '@/utils/fetch';

export function addAndUpdateVisitInit(params) {
    return fetch({
        url: 'structure/visit/addAndUpdateVisitInit',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}
export function getVisitInit() {
    return fetch({
        url: 'structure/visit/getVisitInit',
        method: 'GET'
    });
}

export function getVisitRecordList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('name', args.name);
    params.append('status', args.status);
    params.append('visitUserId', args.visitUserId);
    return fetch({
        url: 'structure/visit/getVisitRecordList',
        method: 'get',
        params
    });
}

//查询访客详情
export function getVisitRecord(recordId) {
    let params = new URLSearchParams();
    params.append('recordId', recordId);
    return fetch({
        url: 'structure/visit/getVisitRecord',
        method: 'get',
        params
    });
}

export function delVisitRecord(recordId) {
    let params = new URLSearchParams();
    params.append('recordId', recordId);
    return fetch({
        url: 'structure/visit/delVisitRecord',
        method: 'get',
        params
    });
}
export function getVisitSchBoard() {
    return fetch({
        url: 'structure/visit/getVisitSchBoard',
        method: 'get'
    });
}