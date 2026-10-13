import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

/**
 * 查询教务处部门列表
 */
export function queryDepartByType() {
    return systemFetch({
        url: 'api/depart/queryDepartByType?type=7',
        method: 'get',
    });
}

/**
 * 查询用户所负责的部门列表
 */
export function getDepartListByUserId() {
    return systemFetch({
        url: 'api/depart/getDepartListByUserId?type=7',
        method: 'get',
    });
}

/**
 * 修改加班条
 * */
export function updateOverTimeDeductionGrant(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/overTimeDeductionGrant/updateOverTimeDeductionGrant',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 删除加班条
 * */
export function deleteOverTimeDeductionGrantById(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/overTimeDeductionGrant/deleteOverTimeDeductionGrantById',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 发加班条(新增)
 * */
export function insertOverTimeDeductionGrant(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/overTimeDeductionGrant/insertOverTimeDeductionGrant',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 发放记录(列表)(自己创建的)
 * */
export function findOverTimeDeductionGrantByPage(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('useType', args.useType);
    return fetch({
        url: 'structure/overTimeDeductionGrant/findOverTimeDeductionGrantByPage',
        method: 'POST',
        data: params
    });
}

/**
 * 发放记录详情(查询单个)
 * */
export function getOverTimeDeductionGrantById(id) {
    const params = new URLSearchParams();
    params.append('id', id);

    return fetch({
        url: 'structure/overTimeDeductionGrant/getOverTimeDeductionGrantById',
        method: 'get',
        params
    });
}

/**
 * 抵扣记录
 * */
/**
 * 加班抵扣记录(PC)
 * */
export function findOverTimeDeductionDeductionListByPagePC(args) {
    const params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/overTimeDeductionDeduction/findOverTimeDeductionDeductionListByPagePC',
        method: 'POST',
        data: params
    });
}

/**
 * 抵扣统计
 * */
export function listStatisticOverTimeDeductionDeductionByModelAndPage(args) {
    const params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/overTimeDeductionDeduction/listStatisticOverTimeDeductionDeductionByModelAndPage',
        method: 'POST',
        data: params
    });
}

/**
 * 驳回抵扣申请
 * */
export function rejectOverTimeDeductionDeduction(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/overTimeDeductionDeduction/rejectOverTimeDeductionDeduction',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
