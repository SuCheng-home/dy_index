import fetch from '@/utils/fetch';

/**
 * 获取工作流程
 * */
export function getWorkFlow(workFlowType) {
    let params = new URLSearchParams();
    params.append("workFlowType", workFlowType);

    return fetch({
        url: 'structure/workFlow/getWorkFlow',
        method: 'GET',
        params
    });
}

/**
 * 查询流程记录
 * */
export function getWorkFlowHisList(args) {
    let params = new URLSearchParams();
    params.append("operatId", args.operatId);
    params.append("workFlowType", args.workFlowType);

    return fetch({
        url: 'structure/workFlow/getWorkFlowHisList',
        method: 'GET',
        params
    });
}

/**
 * 获取开始环节
 * */
export function getStartStep(workFlowId) {
    let params = new URLSearchParams();
    params.append("workFlowId", workFlowId);

    return fetch({
        url: 'structure/workFlow/getStartStep',
        method: 'GET',
        params
    });
}

/**
 * 获取当前环节
 * */
export function getNowStep(createUserId, departId, operatId, workFlowId) {
    let params = new URLSearchParams();
    params.append("createUserId", createUserId);
    params.append("departId", departId);
    params.append("operatId", operatId);
    params.append("workFlowId", workFlowId);

    return fetch({
        url: 'structure/workFlow/getNowStep',
        method: 'GET',
        params
    });
}

/**
 * 获取环节处理人
 * */
export function getDealUserList(departId, stepIdNo, workFlowId, operaId, appUserId, batchTypeEnd) {
    let params = new URLSearchParams();
    params.append("stepIdNo", stepIdNo);
    params.append("workFlowId", workFlowId);
    params.append("departId", departId);
    if (operaId) {
        params.append('operatId', operaId);
    }
    if (batchTypeEnd) {
        params.append('batchTypeEnd', batchTypeEnd);
    }
    if (appUserId) {
        params.append('appUserId', appUserId);
    }
    return fetch({
        url: 'structure/workFlow/getDealUserList',
        method: 'GET',
        params
    });
}

/**
 * 根据流程id,业务标识，步骤序号查询已经处理人id集合
 * */
export function getYesHisUserList(args) {
    let params = new URLSearchParams();
    params.append("operatId", args.operatId);
    params.append("stepIdNo", args.stepIdNo);
    params.append("workFlowId", args.workFlowId);

    return fetch({
        url: 'structure/workFlow/getYesHisUserList',
        method: 'GET',
        params
    });
}

/**
 * 查询流程下一个环节
 * */
export function getStepByStepIdNo(args) {
    let params = new URLSearchParams();
    params.append("adjustClass", args.adjustClass);
    params.append("condit", args.condit);
    params.append("conditTw", args.conditTw);
    params.append("stepIdNo", args.stepIdNo);
    params.append("transfer", args.transfer);
    params.append("workFlowId", args.workFlowId);
    if (args.appUserId) {
        params.append("appUserId", args.appUserId);
    }

    return fetch({
        url: 'structure/workFlow/getStepByStepIdNo',
        method: 'GET',
        params
    });
}

/**
 * 提交流程
 * */
export function submitWorkFlow(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workFlow/submitWorkFlow',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 驳回流程
 * */
export function sendBackWorkFlow(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workFlow/sendBackWorkFlow',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
