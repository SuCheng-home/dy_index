import fetch from '@/utils/fetch';

//根据开始日期结束日期查询请假统计
export function getStatisticsList(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('classOperatType', args.classOperatType);
    return fetch({
        url: 'structure/thAskLeaveFour/getStatisticsList',
        method: 'get',
        params
    });
}

// 根据请假日期查询请假列表
export function getThAskListByDate(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    // params.append('leaveState', args.leaveState);
    // params.append('leaveType', args.leaveType);
    params.append('leaveType', -1);
    params.append('leaveTypeListStr', args.leaveTypeListStr);
    params.append('leaveStateListStr', args.leaveStateListStr);
    params.append('teacherName', args.teacherName);

    return fetch({
        url: 'structure/thAskLeaveFour/getThAskListByDate',
        method: 'get',
        params
    });
}

export function getBatchThAskLeaveFourListByDealUserAll(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('leaveState', args.leaveState);
    params.append('leaveType', args.leaveType);
    params.append('userId', args.userId);
    params.append('teacherName', args.teacherName);

    return fetch({
        url: 'structure/thAskLeaveFourNew/getBatchThAskLeaveFourListByDealUserAll',
        method: 'get',
        params
    });
}
// 请假详情页
export function viewThAskLeaveFourView(args) {
    let params = new URLSearchParams();
    params.append('askId', args.askId);

    return fetch({
        url: 'structure/thAskLeaveFour/viewThAskLeaveFourView',
        method: 'get',
        params
    });
}
// 领导查询请假详情
export function viewThAskLeaveFourViewHeader(args) {
    let params = new URLSearchParams();
    params.append('askId', args.askId);
    return fetch({
        url: 'structure/thAskLeaveFour/viewThAskLeaveFourViewHeader',
        method: 'get',
        params
    });
}

// 获取工作流程
export function getWorkFlow(args) {
    let params = new URLSearchParams();
    params.append('workFlowType', args.workFlowType);
    return fetch({
        url: 'structure/workFlow/getWorkFlow',
        method: 'get',
        params
    });
}

// 删除请假
export function delThAskLeaveFour(args) {
    let params = new URLSearchParams();
    params.append('askId', args.askId);
    params.append('workFlowId', args.workFlowId);

    return fetch({
        url: 'structure/thAskLeaveFour/delThAskLeaveFour',
        method: 'get',
        params
    });
}
// 取消请假时删除一个时间段的停伙
export function askLeaveCancelFireByUserIdAndDate(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('userId', args.userId);

    return fetch({
        url: 'structure/fire/askLeaveCancelFireByUserIdAndDate',
        method: 'get',
        params
    });
}

// 根据学校Id查询请假设置
export function getThAskLeaveFourInit() {

    return fetch({
        url: 'structure/thAskLeaveFour/getThAskLeaveFourInit',
        method: 'GET'
    })
}

// 新增请假记录
export function addThAskLeaveFour(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: `structure/thAskLeaveFourNew/addThAskLeaveFour`,
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 批量新增代请假记录
export function addThAskLeaveFourList(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: `/structure/thAskLeaveFourNew/addThAskLeaveFourList`,
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 修改请假
export function updateThAskLeaveFour(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: `structure/thAskLeaveFourNew/updateThAskLeaveFour`,
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 根据请假id查询请假记录
export function getThAskLeaveFourById(args) {
    const params = new URLSearchParams();
    params.append("askId", args.askId);

    return fetch({
        url: `structure/thAskLeaveFour/getThAskLeaveFourById`,
        method: 'GET',
        params
    })
}

// 请假处理2
export function updateThAskLeaveFourDeal(args) {
    const params = new URLSearchParams();
    params.append("createUserId", args.createUserId);
    params.append("dealUserList", args.dealUserList);
    params.append("stepIdNo", args.stepIdNo);
    params.append("thAskLeaveFour", args.thAskLeaveFour);
    params.append("toStepIdNo", args.toStepIdNo);
    params.append("workFlowId", args.workFlowId);
    params.append("endDate", args.endDate);
    params.append("endTime", args.endTime);
    params.append("isUpdateEndTime", args.isUpdateEndTime);

    return fetch({
        url: `structure/thAskLeaveFourNew/updateThAskLeaveFourDeal`,
        method: 'GET',
        params
    })
}
export function getThAskleaveFouLListByLeaveSchState(args) {
    const params = new URLSearchParams();
    params.append("leaveSchState", args.leaveSchState);
    params.append("searchDate", args.searchDate);
    return fetch({
        url: `structure/thAskLeaveFourNew/getThAskleaveFouLListByLeaveSchState`,
        method: 'GET',
        params
    })
}

export function updateThAskLeaveFourLeaveSchState(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: `structure/thAskLeaveFourNew/updateThAskLeaveFourLeaveSchState`,
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 请假驳回
export function backThAskLeaveFourDeal(args) {
    const params = new URLSearchParams();
    params.append("createUserId", args.createUserId);
    params.append("dealUserList", args.dealUserList);
    params.append("stepIdNo", args.stepIdNo);
    params.append("thAskLeaveFour", args.thAskLeaveFour);
    params.append("toStepIdNo", args.toStepIdNo);
    params.append("workFlowId", args.workFlowId);

    return fetch({
        url: `structure/thAskLeaveFourNew/backThAskLeaveFourDeal`,
        method: 'GET',
        params
    })
}
