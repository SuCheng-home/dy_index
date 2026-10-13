import fetch from '@/utils/fetch'

export function addPanutGrant(params) {
    return fetch({
        url: 'structure/peanutBeh/addPanutGrant',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}

export function getPeanutRecordList(args) {
    const params = new URLSearchParams();
    params.append('batchUserId', args.batchUserId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('studentId', args.studentId);
    params.append('studentName', args.studentName);
    params.append('type', args.type);
    params.append('state', args.state);
    params.append('pageSize', args.pageSize);
    params.append('pageNo', args.pageNo);
    return fetch({
        url: 'structure/peanutBeh/getPeanutRecordList',
        method: 'POST',
        params
    });
}

export function getPanutGrantList(args) {
    const params = new URLSearchParams();
    params.append('content', args.content);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('pageSize', args.pageSize);
    params.append('pageNo', args.pageNo);
    return fetch({
        url: 'structure/peanutBeh/getPanutGrantList',
        method: 'POST',
        params
    });
}

export function getPanutGrantThList(args) {
    const params = new URLSearchParams();
    params.append('userName', args.userName);
    params.append('schoolTimeId', args.schoolTimeId);
    return fetch({
        url: 'structure/peanutBeh/getPanutGrantThList',
        method: 'POST',
        params
    });
}

export function recallPanutGrantList(id) {
    const params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/peanutBeh/recallPanutGrantList',
        method: 'POST',
        params
    });
}