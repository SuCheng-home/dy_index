import fetch from '@/utils/fetch';

//修改资金申请
export function updateFundApply(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/fundApply/updateFundApply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//学校审核
export function schBatchFundApply(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/fundApply/schBatchFundApply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//新增资金申请
export function addFundApply(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/fundApply/addFundApply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}


//学校审核列表
export function getFundApplyListBySchBatch(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('useInfo', args.useInfo);
    params.append('type', args.type);
    return fetch({
        url: 'structure/fundApply/getFundApplyListBySchBatch',
        method: 'get',
        params
    });
}
//申请列表
export function getFundApplyListByApply(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('useInfo', args.useInfo);
    params.append('type', args.type);
    return fetch({
        url: 'structure/fundApply/getFundApplyListByApply',
        method: 'get',
        params
    });
}
//查询资金申请详情
export function getFundApply(fundApplyId) {
    const params = new URLSearchParams();
    params.append("fundApplyId", fundApplyId);
    return fetch({
        url: 'structure/fundApply/getFundApply',
        method: 'get',
        params
    })
}
//查询资金申请详情
export function delFundApply(fundApplyId) {
    const params = new URLSearchParams();
    params.append("fundApplyId", fundApplyId);
    return fetch({
        url: 'structure/fundApply/delFundApply',
        method: 'get',
        params
    })
}

//新增收费酱资金申请
export function addFundChargeApply(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/fundApply/addFundChargeApply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//改收费资金申请
export function updateFundChargeApply(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/fundApply/updateFundChargeApply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

//列表
export function getFundChargeList(applyId) {
    const params = new URLSearchParams();
    params.append("applyId", applyId);
    return fetch({
        url: 'structure/fundApply/getFundChargeList',
        method: 'get',
        params
    })
}
export function delFundChargeApply(applyId) {
    const params = new URLSearchParams();
    params.append("applyId", applyId);
    return fetch({
        url: 'structure/fundApply/delFundChargeApply',
        method: 'get',
        params
    })
}
export function getFundChargeApply(applyId) {
    const params = new URLSearchParams();
    params.append("applyId", applyId);
    return fetch({
        url: 'structure/fundApply/getFundChargeApply',
        method: 'get',
        params
    })
}
//申请列表
export function getFundChargeApplyList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('applyState', args.applyState);
    params.append('schoolId', args.schoolId);
    params.append('title', args.title);
    return fetch({
        url: 'structure/fundApply/getFundChargeApplyList',
        method: 'get',
        params
    });
}
//根据学校id查询资金账户详情
export function getFundAccountBySchoolId(schoolId) {
    const params = new URLSearchParams();
    params.append("schoolId", schoolId);
    return fetch({
        url: 'structure/fundApply/getFundAccountBySchoolId',
        method: 'get',
        params
    })
}
//查询账户金额
export function getFundAccountAmount() {
    return fetch({
        url: 'structure/fundApply/getFundAccountAmount',
        method: 'get'
    })
}
export function getFunduleRuleSet() {
    return fetch({
        url: 'structure/fundApply/getFunduleRuleSet',
        method: 'get'
    })
}
