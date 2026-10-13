import fetch from '@/utils/fetch';

// 1.新闻列表
export function getNewsList(args) {
    const params = new URLSearchParams();
    params.append('pageSize', args.pageSize);
    params.append('pageNo', args.pageNo);
    params.append('searchTitle', args.searchTitle);
    params.append('startDate', args.startDate);
    params.append('endDate', args.endDate);
    return fetch({
        url: 'structure/news/getNewsList',
        method: 'POST',
        params
    });
}

// 2.新建新闻的保存及保存发布及保存预览
export function addNews(args) {
    const params = new URLSearchParams();
    params.append('title', args.title);
    params.append('logoURL', args.logoURL);
    params.append('examineUserId', args.examineUserId);
    params.append('examineUserName', args.examineUserName);
    params.append('schoolFellow', args.schoolFellow);
    params.append('outSide', args.outSide);
    params.append('inscribe', args.inscribe);
    params.append('departId', args.departId);
    params.append('departName', args.departName);
    params.append('isAddSubscrip', args.isAddSubscrip);
    params.append('isSendToWebsite', args.isSendToWebsite);
    params.append('comment', args.comment);
    params.append('isfx', args.isfx);
    params.append('state', args.state);
    params.append('optType', args.optType);
    params.append('content', args.content);
    params.append('id', args.id);

    return fetch({
        url: 'structure/news/addNews',
        method: 'POST',
        data: params
    });
}

// 3.删除新闻
export function delNewsByIds(args) {
    const params = new URLSearchParams();
    params.append('idStr', args.idStr);

    return fetch({
        url: 'structure/news/delNewsByIds',
        method: 'POST',
        params
    });
}

// 4.新闻详情
export function getNewsDetailById(args) {
    const params = new URLSearchParams();
    params.append('newsId', args.newsId);

    return fetch({
        url: 'structure/news/getNewsDetailById',
        method: 'POST',
        params
    });
}

// 5.新闻驳回原因列表
export function getNewsRejectList(args) {
    const params = new URLSearchParams();
    params.append('newsId', args.newsId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return fetch({
        url: 'structure/news/getNewsRejectList',
        method: 'POST',
        params
    });
}

// 6.获取新建编辑时的基本信息
export function getBasicInfo() {
    return fetch({
        url: 'structure/news/getBasicInfo',
        method: 'POST'
    });
}

// 7.编辑新闻的保存及保存发布及保存预览 8.提交审核（详情页的操作）
export function updateNewsById(args) {
    const params = new URLSearchParams();

    params.append('id', args.id);
    params.append('state', args.state);
    params.append('optType', args.optType);
    if (args.optType !== 3) {
        params.append('title', args.title);
        params.append('logoURL', args.logoURL);
        params.append('examineUserId', args.examineUserId);
        params.append('examineUserName', args.examineUserName);
        params.append('schoolFellow', args.schoolFellow);
        params.append('outSide', args.outSide);
        params.append('inscribe', args.inscribe);
        params.append('departId', args.departId);
        params.append('departName', args.departName);
        params.append('isAddSubscrip', args.isAddSubscrip);
        params.append('isSendToWebsite', args.isSendToWebsite);
        params.append('isfx', args.isfx);
        params.append('content', args.content);
        params.append('comment', args.comment);
    }

    return fetch({
        url: 'structure/news/updateNewsById',
        method: 'POST',
        data: params
    });
}

// 9.审批列表
export function getNewsListByApprUser(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('fromType', args.fromType);
    params.append('searchName', args.searchName);

    return fetch({
        url: 'structure/news/getNewsListByApprUser',
        method: 'POST',
        params
    });
}

// 10.审批人发布或驳回（详情页）
export function updatePubOrReject(args) {
    const params = new URLSearchParams();
    params.append('newsId', args.newsId);
    params.append('optType', args.optType);
    if (args.optType === 2) {
        params.append('rejectReason', args.rejectReason);
    }

    return fetch({
        url: 'structure/news/updatePubOrReject',
        method: 'POST',
        params
    });
}

// 11.审批人编辑保存发布
export function updateAndPublish(args) {
    const params = new URLSearchParams();
    params.append('title', args.title);
    params.append('logoURL', args.logoURL);
    params.append('schoolFellow', args.schoolFellow);
    params.append('outSide', args.outSide);
    params.append('inscribe', args.inscribe);
    params.append('departId', args.departId);
    params.append('departName', args.departName);
    params.append('isAddSubscrip', args.isAddSubscrip);
    params.append('isSendToWebsite', args.isSendToWebsite);
    params.append('isfx', args.isfx);
    params.append('state', args.state);
    params.append('optType', args.optType);
    params.append('content', args.content);
    params.append('id', args.id);
    params.append('comment', args.comment);


    return fetch({
        url: 'structure/news/updateAndPublish',
        method: 'POST',
        data: params
    });
}

// 12.点赞
export function updateCommentCount(args) {
    const params = new URLSearchParams();
    params.append('newsId', args.newsId);
    params.append('commentType', args.commentType);

    return fetch({
        url: 'structure/news/updateCommentCount',
        method: 'POST',
        params
    });
}

// 发布后编辑
export function updatePubNews(args) {
    const params = new URLSearchParams();
    params.append('content', args.content);
    params.append('id', args.id);
    params.append('title', args.title);
    params.append('isfx', args.isfx);
    params.append('comment', args.comment);
    params.append('logoURL', args.logoURL);

    return fetch({
        url: 'structure/news/updatePubNews',
        method: 'POST',
        data: params
    });
}

// 部门列表
export function getDeptListBySchoolId(args) {
    const params = new URLSearchParams();

    return fetch({
        url: 'structure/news/getDeptListBySchoolId',
        method: 'POST',
        data: params
    })
}

//评论列表
export function queryCommentLst(args) {
    const params = new URLSearchParams();
    params.append('journalismId', args.journalismId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    return fetch({
        url: 'structure/news/queryCommentLst',
        method: 'GET',
        params
    })
}
//删除评论
export function deleteJournalismCommentById(args) {
    const params = new URLSearchParams();
    params.append('commentId', args.commentId);

    return fetch({
        url: 'structure/news/deleteJournalismCommentById',
        method: 'POST',
        params
    });
}

//14.新闻提交人撤回审批
export function revoke(args) {
    const params = new URLSearchParams();
    params.append('newsId', args.newsId);
    return fetch({
        url: 'structure/news/revoke',
        method: 'POST',
        data:params
    });
}
export function topJournalism(params) {
    return fetch({
        url: 'structure/news/topJournalism',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}