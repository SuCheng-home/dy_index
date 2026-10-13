import fetch from '@/utils/fetch';

export function saveWonderfulActivityBasicInfo(args) {
    let params = new URLSearchParams();
    if(args.id) {
        params.append('id', args.id);
    }
    params.append('activityCode', args.activityCode);
    params.append('activityLogo', args.activityLogo);
    params.append('activityName', args.activityName);
    params.append('endReport', args.endReport);
    params.append('filesJson', args.filesJson);
    params.append('isCompare', args.isCompare);
    params.append('remark', args.remark);
    params.append('reportNum', args.reportNum);
    params.append('scopeJson', args.scopeJson);
    params.append('startReport', args.startReport);
    params.append('status', args.status);
    params.append('title', args.title);
    params.append('workType', args.workType);

    return fetch({
        url: 'structure/wonderfulActivity/saveWonderfulActivityBasicInfo',
        method: 'POST',
        data: params
    });
}
// 查询用户创建的活动列表（分页）
export function getUserWonderfulActivityPageList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('title', args.title);
    params.append('pageSize', args.pageSize);


    return fetch({
        url: 'structure/wonderfulActivity/getUserWonderfulActivityPageList',
        method: 'POST',
        data: params
    });
}
// 更新活动公开奖项设置信息
export function updateWonderfulActivityOtherInfo(args) {
    let params = new URLSearchParams();
    params.append('activityRankList', args.activityRankList);
    params.append('id', args.id);
    params.append('isComment', args.isComment);
    params.append('isOpenPrize', args.isOpenPrize);
    params.append('isOpenVotes', args.isOpenVotes);
    params.append('isOpenWin', args.isOpenWin);
    params.append('isOpenWork', args.isOpenWork);
    params.append('isPraise', args.isPraise);
    params.append('status', args.status);
    params.append('stuVoteNum', args.stuVoteNum);
    params.append('stuVoteWeight', args.stuVoteWeight);
    params.append('thVoteNum', args.thVoteNum);
    params.append('thVoteWeight', args.thVoteWeight);


    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/wonderfulActivity/updateWonderfulActivityOtherInfo',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据ID删除精彩活动
export function delWonderfulActivityById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/wonderfulActivity/delWonderfulActivityById',
        method: 'POST',
        data: params
    });
}
// 根据活动ID集合删除活动
export function delWonderfulByActivityByIds(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/wonderfulActivity/delWonderfulByActivityByIds',
        method: 'POST',
        data: params
    });
}
// 根据活动ID查询精彩活动信息
export function getWonderfulActivityInfoById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/wonderfulActivity/getWonderfulActivityInfoById',
        method: 'POST',
        data: params
    });
}
// 根据ID发布精彩活动
export function publishWonderfulActivityById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/wonderfulActivity/publishWonderfulActivityById',
        method: 'POST',
        data: params
    });
}
//
export function getAllActivityWorkPageList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('pageSize', args.pageSize);
    params.append('pageNo', args.pageNo);
    params.append('userId', args.userId);
    params.append('workTitle', args.workTitle);

    return fetch({
        url: 'structure/wonderfulActivity/getAllActivityWorkPageList',
        method: 'POST',
        data: params
    });
}
// 结束活动
export function finishWonderfulActivityById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/wonderfulActivity/finishWonderfulActivityById',
        method: 'POST',
        data: params
    });
}
