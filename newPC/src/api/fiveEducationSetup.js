import fetch from '@/utils/fetch';

export function addPeanutIndicator(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/peanutBeh/addPeanutIndicator',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

export function updatePeanutIndicator(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/peanutBeh/updatePeanutIndicator',
        method: 'POST',
        data: JSON.stringify(args)
    })
}


export function getPeanutIndicatorList(args) {
    let params = new URLSearchParams();
    params.append("title", args.title);
    params.append("type", args.type);
    return fetch({
        url: 'structure/peanutBeh/getPeanutIndicatorList',
        method: 'GET',
        params
    })
}

export function getPeanutIndicator(indicatorId) {
    let params = new URLSearchParams();
    params.append("indicatorId", indicatorId);
    return fetch({
        url: 'structure/peanutBeh/getPeanutIndicator',
        method: 'GET',
        params
    })
}

export function getPeanutScaleList(args) {
    let params = new URLSearchParams();
    params.append("moduleType", args.moduleType);
    return fetch({
        url: 'structure/peanutBeh/getPeanutScaleList',
        method: 'GET',
        params
    })
}
export function getPeanutScale(scaleId) {
    let params = new URLSearchParams();
    params.append("scaleId", scaleId);
    return fetch({
        url: 'structure/peanutBeh/getPeanutScale',
        method: 'GET',
        params
    })
}
export function delPeanutScale(scaleId) {
    let params = new URLSearchParams();
    params.append("scaleId", scaleId);
    return fetch({
        url: 'structure/peanutBeh/delPeanutScale',
        method: 'GET',
        params
    })
}
export function delPeanutIndicator(indicatorId) {
    let params = new URLSearchParams();
    params.append("indicatorId", indicatorId);
    return fetch({
        url: 'structure/peanutBeh/delPeanutIndicator',
        method: 'GET',
        params
    })
}

export function findSchoolHonorTypeCertList() {
    return fetch({
        url: 'structure/schoolHonor/findSchoolHonorTypeCertList',
        method: 'GET',
    })
}
export function addPeanutScale(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/peanutBeh/addPeanutScale',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
export function updatePeanutScale(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/peanutBeh/updatePeanutScale',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 获得学校德育评价维度列表
export function getSchoolConductDimensionList() {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductDimensionList',
        method: 'post',
    });
}