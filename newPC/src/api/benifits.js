import fetch from '@/utils/fetch';

//根据学校id，标题查询福利列表
export function getThWelfareList(args) {
    let params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("title", args.title);

    return fetch({
        url: 'structure/thWelfare/getThWelfareList',
        method: 'GET',
        params
    });
}

//新增福利
export function addThWelfare(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/thWelfare/addThWelfare',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据福利id删除福利
export function delThWelfare(args) {
    let params = new URLSearchParams();
    params.append("welfareId", args.welfareId);

    return fetch({
        url: 'structure/thWelfare/delThWelfare',
        method: 'GET',
        params
    });
}

// 根据福利id查询福利信息
export function getThWelfare(args) {
    let params = new URLSearchParams();
    params.append("welfareId", args.welfareId);

    return fetch({
        url: 'structure/thWelfare/getThWelfare',
        method: 'GET',
        params
    });
}

// 修改福利
export function updateThWelfare(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/thWelfare/updateThWelfare',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 福利补发
export function againSendThWelfare(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/thWelfare/againSendThWelfare',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据福利id查询物品统计
export function getThWelfareGoodsStatics(args) {
    let params = new URLSearchParams();
    params.append("welfareId", args.welfareId);

    return fetch({
        url: 'structure/thWelfare/getThWelfareGoodsStatics',
        method: 'GET',
        params
    });
}

// 根据福利id,状态，用户姓名查询福利用户列表
export function getThWelfareActionList(args) {
    let params = new URLSearchParams();
    params.append("welfareId", args.welfareId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("status", args.status);
    params.append("userName", args.userName);

    return fetch({
        url: 'structure/thWelfare/getThWelfareActionList',
        method: 'GET',
        params
    });
}

// 更新福利用户信息
export function updateThWelfareAction(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/thWelfare/updateThWelfareAction',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 按状态提醒用户
export function remindThWelfareActionList(args) {
    let params = new URLSearchParams();
    params.append("status", args.status);
    params.append("welfareId", args.welfareId);

    return fetch({
        url: 'structure/thWelfare/remindThWelfareActionList',
        method: 'GET',
        params
    });
}
