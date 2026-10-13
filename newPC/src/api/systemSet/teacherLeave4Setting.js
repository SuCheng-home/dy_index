import fetch from '@/utils/fetch';

// 新增修改请假设置
export function addAndUpdateThAskLeaveFourInit(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/thAskLeaveFour/addAndUpdateThAskLeaveFourInit',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//新增请假规则
export function addThAskleaveFourRule(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/thAskLeaveFourNew/addThAskleaveFourRule',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//新增请假规则
export function updateThAskleaveFourRule(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/thAskLeaveFourNew/updateThAskleaveFourRule',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function delThAskleaveFourRule(ruleId) {
    let params = new URLSearchParams();
    params.append('ruleId', ruleId);
    return fetch({
        url: 'structure/thAskLeaveFourNew/delThAskleaveFourRule',
        method: 'get',
        params
    });
}
export function getThAskleaveFourRule(ruleId) {
    let params = new URLSearchParams();
    params.append('ruleId', ruleId);
    return fetch({
        url: 'structure/thAskLeaveFourNew/getThAskleaveFourRule',
        method: 'get',
        params
    });
}
export function getThAskleaveFourRuleList() {
    return fetch({
        url: 'structure/thAskLeaveFourNew/getThAskleaveFourRuleList',
        method: 'get'
    });
}
// 根据学数Id查询请假设置
export function getThAskLeaveFourInit() {

    return fetch({
        url: 'structure/thAskLeaveFour/getThAskLeaveFourInit',
        method: 'get'
    });
}
