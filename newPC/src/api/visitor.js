import fetch from '@/utils/fetch';
//查询访客列表
export function getVisitorList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('name', args.name);
    return fetch({
        url: 'structure/visitor/getVisitorList',
        method: 'get',
        params
    });
}
//查询访客详情
export function getVisitor(vid) {
    let params = new URLSearchParams();
    params.append('vid', vid);
    return fetch({
        url: 'structure/visitor/getVisitor',
        method: 'get',
        params
    });
}