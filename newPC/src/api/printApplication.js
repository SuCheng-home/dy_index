import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';

// 新增印制价格
export function addPrintPrice(args) {
    const params = new URLSearchParams();
    params.append('doublePrice', args.doublePrice);
    params.append('singlePrice', args.singlePrice);
    params.append('type', args.type);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printPrice/addPrintPrice',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 列表(不分页)
export function findPriceList(args) {

    return fetch({
        url: 'structure/printPrice/findPriceList',
        method: 'GET'
    });
}

// 删除
export function delPrintPrice(args) {
    const params = new URLSearchParams();
    params.append('priceIds', args.priceIds);

    return fetch({
        url: 'structure/printPrice/delPrintPrice',
        method: 'POST',
        data: params
    });
}

// 修改
export function updatePrintPrice(args) {
    const params = new URLSearchParams();
    params.append('doublePrice', args.doublePrice);
    params.append('singlePrice', args.singlePrice);
    params.append('type', args.type);
    params.append('id', args.id);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printPrice/updatePrintPrice',
        method: 'POST',
        data: JSON.stringify(args)
    });
}


// 新增or修改Init
export function addOrUpdateInit(args) {
    const params = new URLSearchParams();
    params.append('consumableApply', args.consumableApply);
    params.append('filePrint', args.filePrint);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorSet/addOrUpdate',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 设置详情
export function getBySchoolIdInit() {

    return fetch({
        url: 'structure/printSeniorSet/getBySchoolId',
        method: 'GET'
    });
}

// 初始化印制申请类型
export function initPrintTypeRootNode(args) {
    const params = new URLSearchParams();
    params.append('kind', args.kind);

    return fetch({
        url: 'structure/printSeniorType/initPrintTypeRootNode',
        method: 'POST',
        data: params
    });
}

// 类型(树)
export function getTypeTree(args) {
    const params = new URLSearchParams();
    params.append('kind', args.kind);

    return fetch({
        url: 'structure/printSeniorType/getTypeTree',
        method: 'GET',
        params
    });
}

// 类型列表以及子节点列表查询
export function getChildTypeList(args) {
    const params = new URLSearchParams();
    params.append('childIds', args.childIds);
    params.append('kind', args.kind);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('pid', args.pid);
    params.append('searchName', args.searchName);

    return fetch({
        url: 'structure/printSeniorType/getChildTypeList',
        method: 'GET',
        params
    });
}


// 新增 类型
export function addType(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorType/addType',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 修改 类型
export function updateType(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorType/updateType',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 删除 类型
export function delType(args) {
    const params = new URLSearchParams();
    params.append('typeId', args.typeId);

    return fetch({
        url: 'structure/printSeniorType/delType',
        method: 'POST',
        data: params
    });
}

// 申请人列表
export function findApplyList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('kind', args.kind);
    params.append('searchTitle', args.searchTitle);
    params.append('status', args.status);
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);

    return fetch({
        url: 'structure/printSeniorApply/findApplyList',
        method: 'GET',
        params
    });
}

// 保存or提交
export function addOrSubmit(args) {
    const params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorApply/addOrSubmit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据类型 填充下拉选项
export function selectUseType(args) {
    const params = new URLSearchParams();
    params.append('useTypeId', args.useTypeId);

    return fetch({
        url: 'structure/printSeniorApply/selectUseType',
        method: 'GET',
        params
    });
}

// 删除记录
export function delPrintSeniorApply(args) {
    const params = new URLSearchParams();
    params.append('printIds', args.printIds);

    return fetch({
        url: 'structure/printSeniorApply/delPrintSeniorApply',
        method: 'POST',
        data: params
    });
}

// 确认(已领取)
export function confirmPrintSeniorApply(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/printSeniorApply/confirmPrintSeniorApply',
        method: 'POST',
        data: params
    });
}

// 撤回(待审核可以进行撤回)
export function revokePrintSeniorApply(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);
    params.append('revokeReason', args.revokeReason);

    return fetch({
        url: 'structure/printSeniorApply/revokePrintSeniorApply',
        method: 'POST',
        data: params
    });
}

// 申请记录详情
export function getApplyEditInfo(args) {
    const params = new URLSearchParams();
    params.append('printApplyId', args.printApplyId);

    return fetch({
        url: 'structure/printSeniorApply/getApplyEditInfo',
        method: 'GET',
        params
    });
}

// 编辑or提交
export function updateOrSubmit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorApply/updateOrSubmit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 打印人列表页- 未打印列表

export function findNotPrintList(args) {
    const params = new URLSearchParams();
    params.append('kind', args.kind);

    return fetch({
        url: 'structure/printSeniorApply/findNotPrintList',
        method: 'GET',
        params
    });
}

// 按用户统计
export function statisticsByUser(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('kind', args.kind);
    params.append('searchTitle', args.searchTitle);
    params.append('startDate', args.startDate);
    params.append('useType', args.useType);
    return fetch({
        url: 'structure/printSeniorApply/statisticsByUser',
        method: 'GET',
        params
    });
}

// 按纸张统计
export function statisticsByPaperSize(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('kind', args.kind);
    params.append('startDate', args.startDate);
    params.append('useType', args.useType);

    return fetch({
        url: 'structure/printSeniorApply/statisticsByPaperSize',
        method: 'GET',
        params
    });
}
export function statisticsUseByUseType(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('kind', args.kind);
    params.append('startDate', args.startDate);
    params.append('searchTitle', args.searchTitle);
   params.append('useType', args.useType);
    return fetch({
        url: 'structure/printSeniorApply/statisticsUseByUseType',
        method: 'GET',
        params
    });
}

export function statisticsUsezjByUseType(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('kind', args.kind);
    params.append('startDate', args.startDate);
    params.append('searchTitle', args.searchTitle);
    params.append('useType', args.useType);
    return fetch({
        url: 'structure/printSeniorApply/statisticsUsezjByUseType',
        method: 'GET',
        params
    });
}

// 按用途类型统计
export function statisticsByUseType(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('kind', args.kind);
    params.append('startDate', args.startDate);
     params.append('useType', args.useType);

    return fetch({
        url: 'structure/printSeniorApply/statisticsByUseType',
        method: 'GET',
        params
    });
}

// 打印人列表页
export function findPrintList(args) {
    const params = new URLSearchParams();
    params.append('kind', args.kind);
    params.append('outsource', args.outsource);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('status', args.status);
    params.append('useType', args.useType);
    return fetch({
        url: 'structure/printSeniorApply/findPrintList',
        method: 'GET',
        params
    });
}

// 影印完成
export function finishPrintSeniorApply(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorApply/finishPrintSeniorApply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 按纸张统计-纸张统计列表
export function userPaperSizeDeatilStatistics(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('paperSizeType', args.paperSizeType);
    params.append('searchTitle', args.searchTitle);
    params.append('useType', args.useType);  
    return fetch({
        url: 'structure/printSeniorApply/userPaperSizeDeatilStatistics',
        method: 'GET',
        params
    });
}
// 按纸张统计-纸张统计列表
export function findHaoCaiListByType(args) {
    const params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('kind', args.kind);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);
    params.append('startDate', args.startDate);
    params.append('useType', args.useType);

    return fetch({
        url: 'structure/printSeniorApply/findHaoCaiListByType',
        method: 'GET',
        params
    });
}

// 审批人 审批列表(条件查询)
export function listApprovalByModelAndPage(args) {
    const params = new URLSearchParams();
    params.append('kind', args.kind);
    params.append('searchTitle', args.searchTitle);
    params.append('status', args.status);
    params.append('pageSize', args.pageSize);
    params.append('pageNo', args.pageNo);

    return fetch({
        url: 'structure/printSeniorApply/listApprovalByModelAndPage',
        method: 'GET',
        params
    });
}

// 审批人审批
export function approveApply(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorApply/approveApply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 撤回-审核
export function approvalNotPrinted(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorApply/approvalNotPrinted',
        method: 'POST',
        data: JSON.stringify(args)

    });
}

//根据人员id查询所在公公室
export function getPrintSeniorOfficeUser(userId) {
    const params = new URLSearchParams();
    params.append('userId', userId);
    return fetch({
        url: 'structure/printSeniorOffice/getPrintSeniorOfficeUser',
        method: 'GET',
        params
    });
}

//查询办公室列表
export function getPrintSeniorOfficeList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);
    return fetch({
        url: 'structure/printSeniorOffice/getPrintSeniorOfficeList',
        method: 'GET',
        params
    });
}

//删除办公室
export function delPrintSeniorOffice(officeId) {
    const params = new URLSearchParams();
    params.append('officeId', officeId);
    return fetch({
        url: 'structure/printSeniorOffice/delPrintSeniorOffice',
        method: 'GET',
        params
    });
}

//根据办公室id查询详情
export function getPrintSeniorOffice(officeId) {
    const params = new URLSearchParams();
    params.append('officeId', officeId);
    return fetch({
        url: 'structure/printSeniorOffice/getPrintSeniorOffice',
        method: 'GET',
        params
    });
}


// 修改办公室
export function updatePrintSeniorOffice(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorOffice/updatePrintSeniorOffice',
        method: 'POST',
        data: JSON.stringify(args)

    });
}
// 撤回-审核
export function addPrintSeniorOffice(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/printSeniorOffice/addPrintSeniorOffice',
        method: 'POST',
        data: JSON.stringify(args)

    });
}
