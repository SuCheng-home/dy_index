import {systemFetch} from '@/utils/fetch';
//积分分页查询
export function getABCPointUserForPage(query) {
    let params = new URLSearchParams();
    params.append("pageNo",query.pageNo);
    params.append("pageSize",query.pageSize);
    params.append("keywords",query.keywords);
    return systemFetch({
        url: 'abc/point/user/getABCPointUserForPage',
        method: 'get',
        params
    });
}
//个人积分明细分页查询
export function getABCPointUserRecordForPage(query) {
    let params = new URLSearchParams();
    params.append("pageNo",query.pageNo);
    params.append("pageSize",query.pageSize);
    params.append("userId",query.userId);
    return systemFetch({
        url: 'abc/point/user/getABCPointUserRecordForPage',
        method: 'get',
        params
    });
}