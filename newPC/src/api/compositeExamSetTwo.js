import fetch from '@/utils/fetch';

/*新增修改设置*/
export function addAndUpdateComplexInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/complex/addAndUpdateComplexInit',
        method: 'post',
        data: JSON.stringify(args)
    })
}

/*获取值班组*/
export function getComplexInit() {
    return fetch({
        url: 'structure/complex/getComplexInit'
    });
}
//查询检查组列表
export function getComplexCheckBaseList() {
    return fetch({
        url: 'structure/complex/getComplexCheckBaseList'
    });
}
export function delComplexCheckBase(baseId) {
    let params = new URLSearchParams();
    params.append("baseId", baseId);
    return fetch({
        url: 'structure/complex/delComplexCheckBase',
        method: 'post',
        data: params
    })
}
export function getComplexCheckItemList() {
    return fetch({
        url: 'structure/complex/getComplexCheckItemList'
    });
}
export function delComplexCheckItem(itemId) {
    let params = new URLSearchParams();
    params.append("itemId", itemId);
    return fetch({
        url: 'structure/complex/delComplexCheckItem',
        method: 'post',
        data: params
    })
}
export function addComplexCheckItem(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/complex/addComplexCheckItem',
        method: 'post',
        data: JSON.stringify(args)
    })
}
export function updateComplexCheckItem(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/complex/updateComplexCheckItem',
        method: 'post',
        data: JSON.stringify(args)
    })
}

export function getComplexCheckItem(itemId) {
    let params = new URLSearchParams();
    params.append("itemId", itemId);
    return fetch({
        url: 'structure/complex/getComplexCheckItem',
        method: 'post',
        data: params
    })
}


export function addComplexCheckBase(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/complex/addComplexCheckBase',
        method: 'post',
        data: JSON.stringify(args)
    })
}
export function updateComplexCheckBase(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/complex/updateComplexCheckBase',
        method: 'post',
        data: JSON.stringify(args)
    })
}

export function getComplexCheckBase(baseId) {
    let params = new URLSearchParams();
    params.append("baseId", baseId);
    return fetch({
        url: 'structure/complex/getComplexCheckBase',
        method: 'post',
        data: params
    })
}
export function getComplexCheckBaseListByDateScope(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("pageSize", query.pageSize);
    params.append("pageNo", query.pageNo);
    params.append("startDate", query.startDate);
    return fetch({
        url: 'structure/complex/getComplexCheckBaseListByDateScope',
        method: 'get',
        params
    });
}


export function getComplexCheckStatisticsByDutyUser(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("userName", query.userName);
    params.append("startDate", query.startDate);
    return fetch({
        url: 'structure/complex/getComplexCheckStatisticsByDutyUser',
        method: 'get',
        params
    });
}

export function getComplexCheckRecordList(query) {
    let params = new URLSearchParams();
    params.append("baseId", query.baseId);
    params.append("checkDate", query.checkDate);
    // params.append("userId", query.userId);
    return fetch({
        url: 'structure/complex/getComplexCheckRecordList',
        method: 'get',
        params
    });
}

// 查询责任人明细 2026-03-17
export function getComplexRecordByDutyUser(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("startDate", query.startDate);
    params.append("userId", query.userId);
    return fetch({
        url: '/structure/complex/getComplexRecordByDutyUser',
        method: 'get',
        params
    });
}


export function getComplexCheckStatistics(query) {
    let params = new URLSearchParams();
    params.append("baseId", query.baseId);
    params.append("checkDate", query.checkDate);
    // params.append("userId", query.userId);
    return fetch({
        url: 'structure/complex/getComplexCheckStatistics',
        method: 'get',
        params
    });
}
