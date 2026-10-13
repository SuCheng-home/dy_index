import fetch from '@/utils/fetch'

// 根据学校Id查询工作流程列表
export function getWorkFlowList() {
    return fetch({
        url: 'structure/workFlow/getWorkFlowList',
        method: 'GET'
    })
}

// 删除工作流程
export function delWorkFlowById(args) {
    let params = new URLSearchParams();
    params.append("workFlowId", args.workFlowId);

    return fetch({
        url: 'structure/workFlow/delWorkFlowById',
        method: 'GET',
        params
    })
}

// 根据id查询工作流程
export function getWorkFlowById(args) {
    let params = new URLSearchParams();
    params.append("workFlowId", args.workFlowId);

    return fetch({
        url: 'structure/workFlow/getWorkFlowById',
        method: 'GET',
        params
    })
}

// 新增工作流程
export function addWorkFlow(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workFlow/addWorkFlow',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 修改工作流程
export function updateWorkFlow(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workFlow/updateWorkFlow',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
