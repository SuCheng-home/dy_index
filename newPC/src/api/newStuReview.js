import {systemFetch} from '@/utils/fetch';

//修改
export function newRegistrationUpdate(args) {
    let params = new URLSearchParams();
    params.append('cardId', args.cardId);
    params.append('classId', args.classId);
    params.append('id', args.id);
    params.append('name', args.name);
    params.append('parents', args.parents);

    return systemFetch({
        url: 'newRegistration/update',
        method: 'get',
        params
    });
}

// 一键清空
export function newRegistrationClearAll(args) {

    return systemFetch({
        url: 'newRegistration/clearAll',
        method: 'get'
    });
}

// 列表页
export function newRegistrationListPage(args) {
    let params = new URLSearchParams();
    params.append('gradeId', args.gradeId);
    params.append('classId', args.classId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('status', args.status);
    params.append('name', args.name);

    return systemFetch({
        url: 'newRegistration/listPage',
        method: 'get',
        params
    });
}

//待定
export function newRegistrationTentative(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return systemFetch({
        url: 'newRegistration/tentative',
        method: 'get',
        params
    });
}
// 未通过
export function newRegistrationNoPass(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return systemFetch({
        url: 'newRegistration/noPass',
        method: 'get',
        params
    });
}
// 通过
export function newRegistrationPass(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return systemFetch({
        url: 'newRegistration/pass',
        method: 'get',
        params
    });
}
