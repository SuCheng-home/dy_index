import fetch from '@/utils/fetch';

//pc统计列表
export function loadExtraWorkListone(listQuery) {
    let params = new URLSearchParams();
    params.append("fromType", listQuery.fromType);
    params.append("pageSize", listQuery.pageSize);
    params.append("pageNo", listQuery.pageNo);
    params.append("startTime", listQuery.startTime);
    params.append("endTime", listQuery.endTime);
    return fetch({
        url: 'structure/extraWork/loadExtraWorkList',
        method: 'get',
        params
    });
}

export function delExtraWork(extraWorkId) {
    let params = new URLSearchParams();
    params.append("extraWorkId", extraWorkId);
    return fetch({
        url: 'structure/extraWork/delExtraWork',
        method: 'get',
        params
    });
}
export function loadExtraWorkListtwo(listQuery) {
    let params = new URLSearchParams();
    params.append("fromType", listQuery.fromType);
    params.append("pageSize", listQuery.pageSize);
    params.append("pageNo", listQuery.pageNo);
    params.append("startTime", listQuery.startTime);
    params.append("endTime", listQuery.endTime);
    params.append("workUserId", listQuery.workUserId);
    return fetch({
        url: 'structure/extraWork/loadExtraWorkList',
        method: 'get',
        params
    });
}
//加班详情统计
export function countDetail(listQuery) {
    let params = new URLSearchParams();
    params.append("startTime", listQuery.startTime);
    params.append("endTime", listQuery.endTime);
    return fetch({
        url: 'structure/extraWork/countDetail',
        method: 'get',
        params
    });
}
export function addAndUpdateExtraWorkInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/extraWork/addAndUpdateExtraWorkInit',
        method: 'post',
        data: JSON.stringify(args)
    });

}

export function getExtraWorkInit() {
    return fetch({
        url: 'structure/extraWork/getExtraWorkInit',
        method: 'get'
    });
}
