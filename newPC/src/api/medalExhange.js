import fetch from '@/utils/fetch';

export function queryMedalExchangeRecord(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/medalExchange/queryMedalExchangeRecord',
        method: 'GET',
        params
    });
}

export function deleteMedalExchangeRecord(args) {
    let params = new URLSearchParams();
    params.append('medalExchangeId', args.medalExchangeId);

    return fetch({
        url: 'structure/medalExchange/deleteMedalExchangeRecord',
        method: 'GET',
        params
    });
}
export function insertMedalExchangeRecord(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/medalExchange/insertMedalExchangeRecord',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function queryMedalExchangeAnalysis(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/medalExchange/queryMedalExchangeAnalysis',
        method: 'GET',
        params
    });
}
