import {
    archivedFetch as fetch
} from '@/utils/fetch';

function appendSchoolYear(params, schoolYear) {
    if (schoolYear) {
        params.append('schoolYear', schoolYear);
    }
}

// 修改问卷
export function updateVoteTwo(args) {
    const params = new URLSearchParams();
    params.append('anonymous', args.anonymous);
    params.append('expriyDate', args.expriyDate);
    params.append('id', args.id);
    params.append('isShowResult', args.isShowResult);
    params.append('sendUserType', args.sendUserType);
    params.append('stuDepartJson', args.stuDepartJson);
    params.append('thScopeJson', args.thScopeJson);
    params.append('topicList', args.topicList);
    params.append('voteDesc', args.voteDesc);
    params.append('voteStatus', args.voteStatus);
    params.append('voteTitle', args.voteTitle);
    params.append('logoUrl', args.logoUrl);


    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/voteTwo/updateVoteTwo',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 修改问卷截止日期
export function updateVoteTwoExpriyDate(args) {
    const params = new URLSearchParams();
    params.append('anonymous', args.anonymous);
    params.append('isShowResult', args.isShowResult);
    params.append('expriyDate', args.expriyDate);
    params.append('id', args.id);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/voteTwo/updateVoteTwoExpriyDate',
        method: 'post',
        data: JSON.stringify(args)
    });
}
// 删除用户
export function deleteUser(args) {
    const params = new URLSearchParams();
    params.append('userId', args.userId);
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/deleteUser',
        method: 'post',
        data: params
    });
}

// 单个提醒问卷未答用户
export function remindSendMessagetoUser(args) {
    const params = new URLSearchParams();
    params.append('sendUserType', args.sendUserType);
    params.append('userId', args.userId);
    params.append('userName', args.userName);
    params.append('voteId', args.voteId);
    params.append('logoUrl', args.logoUrl);

    return fetch({
        url: 'structure/voteTwo/remindSendMessagetoUser',
        method: 'post',
        data: params
    });
}

// 批量提醒问卷未答用户
export function remindSendMessagetoUserList(args) {
    const params = new URLSearchParams();
    params.append('sendUserType', args.sendUserType);
    params.append('voteId', args.voteId);
    params.append('logoUrl', args.logoUrl);

    return fetch({
        url: 'structure/voteTwo/remindSendMessagetoUserList',
        method: 'post',
        data: params
    });
}



// 新增问卷
export function addVoteTwo(args, schoolYear) {
    const params = new URLSearchParams();
    appendSchoolYear(params, schoolYear);
    return fetch({
        params,
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/voteTwo/addVoteTwo',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 批量新增逻辑规则
export function addVoteTwoRuleList(args, schoolYear) {
    const params = new URLSearchParams();
    appendSchoolYear(params, schoolYear);

    return fetch({
        params,
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/voteTwo/addVoteTwoRuleList',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 根据问卷id删除逻辑规则
export function delVoteTwoRuleList(args, schoolYear) {
    const params = new URLSearchParams();
    appendSchoolYear(params, schoolYear);
    params.append('voteId', args.voteId);
    return fetch({
        url: 'structure/voteTwo/delVoteTwoRuleList',
        method: 'get',
        params 
         
    });
}

// 根据问卷id查询逻辑规则
export function getVoteTwoRuleList(args, schoolYear) {
    const params = new URLSearchParams();
    appendSchoolYear(params, schoolYear);
  
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/getVoteTwoRuleList',
        method: 'get',
        params
    });
}

// 查询问卷列表
export function getVoteTwoList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('voteTitle', args.voteTitle);
    params.append('searchType', args.searchType || 0);


    return fetch({
        url: 'structure/voteTwo/getVoteTwoList',
        method: 'post',
        data: params
    });
}

// 根据Id查询班级列表
export function getVoteClassListByVoteId(args) {
    const params = new URLSearchParams();
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/getVoteClassListByVoteId',
        method: 'post',
        data: params
    });
}

// 根据接收用户Ids查询问卷列表

export function getVoteListByUserIds(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return fetch({
        url: 'structure/voteTwo/getVoteListByUserIds',
        method: 'post',
        data: params
    });
}

// 根据选项id,班级id,导出用户列表

export function exportOptionUserList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('optionId', args.optionId);
    params.append('sendUserType', args.sendUserType);

    return fetch({
        url: 'structure/voteTwo/exportOptionUserList',
        method: 'post',
        data: params
    });
}

// 根据选项id,班级id查询用户列表
export function getOptionUserList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('optionId', args.optionId)

    return fetch({
        url: 'structure/voteTwo/getOptionUserList',
        method: 'post',
        data: params
    });
}


// 根据问卷Id和用户id查询问卷信息
export function getVoteByVoteIdAndUserId(args) {
    const params = new URLSearchParams();
    params.append('userId', args.userId);
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/getVoteByVoteIdAndUserId',
        method: 'post',
        data: params
    });
}

// 根据问卷Id查询
export function getVoteTwoById(args) {
    const params = new URLSearchParams();
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/getVoteTwoById',
        method: 'get',
        params
    });
}

// 根据问卷id,用户姓名，状态分页查询问卷用户列表
export function getVoteTwoActionList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('isVote', args.isVote);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('userName', args.userName);
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/getVoteTwoActionList',
        method: 'post',
        data: params
    });
}

// 根据问卷id,用户姓名，状态导出问卷用户列表
export function exportVoteTwoActionList(args) {
    const params = new URLSearchParams();
    params.append('isVote', args.isVote);
    params.append('sendUserType', args.sendUserType);
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/exportVoteTwoActionList',
        method: 'post',
        data: params
    });
}

// 根据问卷id删除问卷
export function delVoteTwoById(args) {
    const params = new URLSearchParams();
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/delVoteTwoById',
        method: 'post',
        data: params
    });
}

// 根据问卷id按选项导出问卷结果
export function exportVoteOptionResult(args) {
    const params = new URLSearchParams();
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/exportVoteOptionResult',
        method: 'post',
        data: params
    });
}

// 根据问卷id按题目导出问卷结果
export function exportVoteTopicResult(args) {
    const params = new URLSearchParams();
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/exportVoteTopicResult',
        method: 'post',
        data: params
    });
}

// 根据题目id,分页查询问答题用户回答列表
export function getTopicAnswerList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('topicId', args.topicId);

    return fetch({
        url: 'structure/voteTwo/getTopicAnswerList',
        method: 'post',
        data: params
    });
}

// 根据题目id,导出问答题用户回答列表
export function exportTopicAnswerList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('sendUserType', args.sendUserType);
    params.append('topicId', args.topicId);

    return fetch({
        url: 'structure/voteTwo/exportTopicAnswerList',
        method: 'post',
        data: params
    });
}

// 获取预览问卷信息
export function getVoteTwoByViewId(args) {
    const params = new URLSearchParams();
    params.append('viewId', args.viewId);

    return fetch({
        url: 'structure/voteTwo/getVoteTwoByViewId',
        method: 'post',
        data: params
    });
}

// 重置用户问卷
export function resetUserVote(args) {
    const params = new URLSearchParams();
    params.append('userId', args.userId);
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/resetUserVote',
        method: 'post',
        data: params
    });
}

// 问卷补发
export function againSendVote(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);
    params.append('sendUserType', args.sendUserType);
    params.append('stuDepartJson', args.stuDepartJson);
    params.append('thScopeJson', args.thScopeJson);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/voteTwo/againSendVote',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 问卷预览
export function sendViewVoteTwo(args, schoolYear) {
    const params = new URLSearchParams();
    if (schoolYear) {
        params.append('schoolYear', schoolYear);
    }
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        params,
        url: 'structure/voteTwo/sendViewVoteTwo',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 问卷预览
export function getVoteResultByVoteId(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/getVoteResultByVoteId',
        method: 'post',
        data: params
    });
}

// 用户答卷
export function addVoteTwoUserSelectedList(args) {
    const params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/voteTwo/addVoteTwoUserSelectedList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 根据问卷id,用户ids删除问卷列表
export function deleteUserList(args) {
    const params = new URLSearchParams();
    params.append('userIds', args.userIds);
    params.append('voteId', args.voteId);

    return fetch({
        url: 'structure/voteTwo/deleteUserList',
        method: 'GET',
        params
    });
}
