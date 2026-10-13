import fetch from '@/utils/fetch'
export function geMsgList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('status', args.status);
    params.append('moduleCode', args.moduleCode);
    params.append('title', args.title);
    params.append('userId', args.userId);
    return fetch({
        url: 'structure/pushMsg/geMsgList',
        method: 'post',
        data: params
    })
}
export function getMsgInit(moduleCode) {
    let params = new URLSearchParams();
    params.append('moduleCode', moduleCode);
    return fetch({
        url: 'structure/pushMsg/getMsgInit',
        method: 'get',
        params
    })
}

export function delMsg(msgId) {
    let params = new URLSearchParams();
    params.append('msgId', msgId);
    return fetch({
        url: 'structure/pushMsg/delMsg',
        method: 'get',
        params
    })
}

export function getMsg(msgId) {
    let params = new URLSearchParams();
    params.append('msgId', msgId);
    return fetch({
        url: 'structure/pushMsg/getMsg',
        method: 'get',
        params
    })
}

export function getMsgUserReplyListPage(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('msgId', args.msgId);
    return fetch({
        url: 'structure/pushMsg/getMsgUserReplyListPage',
        method: 'post',
        data: params
    })
}

export function addMsg(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/pushMsg/addMsg',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

export function updateMsg(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/pushMsg/updateMsg',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

export function addMsgUserReply(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/pushMsg/addMsgUserReply',
        method: 'POST',
        data: JSON.stringify(args)
    })
}