import fetch from '@/utils/fetch';
export function updateSocialReserDate(params) {
    return fetch({
        url: 'structure/socialReser/updateSocialReserDate',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}

export function addupdateSocialReserInit(params) {
    return fetch({
        url: 'structure/socialReser/addupdateSocialReserInit',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}

export function addSocialReserDate(params) {
    return fetch({
        url: 'structure/socialReser/addSocialReserDate',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}

export function delSocialReserDate(watchDate) {
    let params = new URLSearchParams();
    params.append("watchDate", watchDate);
    return fetch({
        url: 'structure/socialReser/delSocialReserDate',
        method: 'get',
        params
    });
}
export function getSocialReserInit() {
    return fetch({
        url: 'structure/socialReser/getSocialReserInit',
        method: 'get',
    });
}
export function getSocialReserDateListPage(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("startDate", args.startDate);
    return fetch({
        url: 'structure/socialReser/getSocialReserDateListPage',
        method: 'GET',
        params
    });
}
export function getSocialReserRecordList(watchDate) {
    let params = new URLSearchParams();
    params.append("watchDate", watchDate);
    return fetch({
        url: 'structure/socialReser/getSocialReserRecordList',
        method: 'get',
        params
    });
}