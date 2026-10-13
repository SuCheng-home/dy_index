import fetch from '@/utils/fetch';

// 根据时间范围查询采购列表
export function getProcureListByDateScope(args) {
    const params = new URLSearchParams();
    params.append('createUserName', args.createUserName);
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('typeId', args.typeId);

    return fetch({
        url: 'structure/procure/getProcureListByDateScope',
        method: 'GET',
        params
    });
}

// 根据采购id查询采购信息
export function getProcureById(args) {
    const params = new URLSearchParams();
    params.append('procureId', args.procureId);

    return fetch({
        url: 'structure/procure/getProcureById',
        method: 'GET',
        params
    });
}
