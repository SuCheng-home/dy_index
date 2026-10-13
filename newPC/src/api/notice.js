import fetch from '@/utils/fetch';
import {
    archivedFetch
} from '@/utils/fetch';
/**
 * 获取通知列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getUserNoticeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    return fetch({
        url: 'structure/notice/getUserNoticeList',
        method: 'post',
        data: params
    });

}


/**
 * 获取通知列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getYSendNoticeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    return fetch({
        url: 'structure/notice/getYSendNoticeList',
        method: 'post',
        data: params
    });

}


//区端发通知列表
export function getUserNoticeListDoe(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('noticeType', 2);
    return fetch({
        url: 'structure/notice/getUserNoticeList',
        method: 'post',
        data: params
    });

}

//  区端点击 已读 / 未读 获取所有学校

export function getSchoolListDoe(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('noticeId', listQuery.noticeId);
    return fetch({
        url: 'structure/notice/findReadingRatingListGroupBySchoolId',
        method: 'get',
        params
    });

}




/**
 * 
 * 获取通知详情
 * 
 * @export
 * @param {any} noticeId 
 * @param {any} submitRead 
 * @returns 
 */
export function getNoticeInfo(noticeId, submitRead, receiveUserId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    params.append('submitRead', submitRead);
    if (receiveUserId) {
        params.append('receiveUserId', receiveUserId);
    } else {
        params.append('receiveUserId', 0);
    }

    return fetch({
        url: 'structure/notice/getNoticeInfo',
        method: 'post',
        data: params
    });

}
export function getNoticeInfonew(noticeId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    return archivedFetch({
        url: 'structure/notice/getNoticeInfo',
        method: 'post',
        data: params
    });

}

// 区端通知详情
export function getNoticeInfoDoe(noticeId, submitRead) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    params.append('submitRead', submitRead);
    return fetch({
        url: 'structure/notice/getNoticeInfo',
        method: 'post',
        data: params
    });

}

/**
 * 获取通知已读未读列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getReadUserNoticeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('noticeId', listQuery.noticeId);
    params.append('isRead', listQuery.isRead);
    if (listQuery.deptId) {
        params.append('deptId', listQuery.deptId);
    }
    if (listQuery.isSign) {
        params.append('isSign', listQuery.isSign);
    }
    if (listQuery.deptName) {
        params.append('deptName', listQuery.deptName);
    }
    if (listQuery.userType) {
        params.append('userType', listQuery.userType);
    }
    if (listQuery.searchTitle) {
        params.append('searchTitle', listQuery.searchTitle);
    }
    return fetch({
        url: 'structure/notice/getReadUserNoticeList',
        method: 'post',
        data: params
    });

}

export function getReadUserNoticeListnew(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('noticeId', listQuery.noticeId);
    params.append('isRead', listQuery.isRead);
    if (listQuery.deptId) {
        params.append('deptId', listQuery.deptId);
    }
    if (listQuery.deptName) {
        params.append('deptName', listQuery.deptName);
    }
    if (listQuery.userType) {
        params.append('userType', listQuery.userType);
    }
    if (listQuery.searchTitle) {
        params.append('searchTitle', listQuery.searchTitle);
    }

    return archivedFetch({
        url: 'structure/notice/getReadUserNoticeList',
        method: 'post',
        data: params
    });

}


// 区端  已读  未读 人员
export function getReadUserNoticeListDoe(listQuery) {
    let params = new URLSearchParams();
    params.append('noticeId', listQuery.noticeId);
    params.append('readState', listQuery.readState);
    params.append('schoolId', listQuery.schoolId);
    return fetch({
        url: 'structure/notice/findReadList',
        method: 'get',
        params
    });

}

/**
 * 
 * 获取回复列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getReplyNoticeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchTitle);
    params.append('noticeId', listQuery.noticeId);
    params.append('type', listQuery.type);
    return fetch({
        url: 'structure/notice/getReceiveNoticeReplyList',
        method: 'post',
        data: params
    });
}
export function getReplyNoticeListnew(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchTitle);
    params.append('noticeId', listQuery.noticeId);
    params.append('type', listQuery.type);
    return archivedFetch({
        url: 'structure/notice/getReceiveNoticeReplyList',
        method: 'post',
        data: params
    });
}
/**
 * 
 * 用户接收的通知列表
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getUserReceiveNoticeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('noticeType', listQuery.noticeType);
    params.append('receiveUserId', listQuery.receiveUserId);

    return fetch({
        url: 'structure/notice/getUserReceiveNoticeList',
        method: 'post',
        data: params
    });
}


// 区端  收通知

export function getUserReceiveNoticeListDoe(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('noticeType', 2);
    return fetch({
        url: 'structure/notice/getUserReceiveNoticeList',
        method: 'post',
        data: params
    });
}



/**
 * 通知阅读率统计
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getNoticeReadRateList(listQuery) {
    let params = new URLSearchParams();
    params.append('startDate', listQuery.startDate);
    params.append('endDate', listQuery.endDate);
    params.append('searchTitle', listQuery.searchTitle);
    return fetch({
        url: 'structure/notice/getNoticeReadRateList',
        method: 'post',
        data: params
    });
}

/**
 * 
 * 查询用户的未读及已读通知列表
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getUserReadNoticeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('startDate', listQuery.startDate);
    params.append('endDate', listQuery.endDate);
    params.append('isRead', listQuery.isRead);
    params.append('userId', listQuery.userId);
    return fetch({
        url: 'structure/notice/getUserReadNoticeList',
        method: 'post',
        data: params
    });
}

/**
 * 添加通知
 * @param {*} query 
 */
export function addNotice(query) {
    let params = new URLSearchParams();
    params.append('noticeTitle', query.noticeTitle);
    params.append('noticeContent', query.noticeContent);
    params.append('releaseUserId', query.releaseUserId);
    params.append('releaseUserName', query.releaseUserName);
    params.append('noticeState', query.noticeState);
    params.append('createType', query.createType);
    params.append('isReply', query.isReply);
    params.append('departJson', query.departJson);
    params.append('groupJson', query.groupJson);
    params.append('userJson', query.userJson);
    params.append('isSendOntime', query.isSendOntime);
    params.append('sendTime', query.sendTime);
    params.append('logoURL', query.logoURL);
    params.append('inscribe', query.inscribe);
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('fileJson', query.fileJson);
    params.append('fileCount', query.fileCount);

    params.append('picIds', query.picIds);
    params.append('infaceType', query.infaceType);
    params.append('isAnswer', query.isAnswer);
    params.append('overdueTime', query.overdueTime);
    params.append('sendType', query.sendType);
    params.append('isSign', query.isSign);

    params.append('isOpenForTeacher', query.isOpenForTeacher);

    // params.append('noticeType', 0)   //  校端
    return fetch({
        url: 'structure/notice/addNotice',
        method: 'post',
        data: params
    });
}


//  区端 添加通知

export function addNoticeDoe(query) {
    let params = new URLSearchParams();
    params.append('noticeTitle', query.noticeTitle);
    params.append('noticeContent', query.noticeContent);
    params.append('releaseUserId', query.releaseUserId);
    params.append('releaseUserName', query.releaseUserName);
    params.append('noticeState', query.noticeState);
    params.append('createType', query.createType);
    params.append('isReply', query.isReply);
    // params.append('departJson', query.departJson);
    // params.append('groupJson', query.groupJson);
    // params.append('userJson', query.userJson);
    // params.append('isSendOntime', query.isSendOntime);
    params.append('isSendOntime', 0);
    // params.append('sendTime', query.sendTime);
    params.append('logoURL', query.logoURL);
    params.append('inscribe', query.inscribe);
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('fileIds', query.fileIds);
    params.append('picIds', query.picIds);
    params.append('infaceType', query.infaceType);
    params.append('isAnswer', query.isAnswer);
    params.append('overdueTime', query.overdueTime);
    params.append('sendType', query.sendType);
    params.append('areaDepartJson', query.areaDepartJson); //  区端 地址簿
    params.append('noticeType', 2); //  区端
    return fetch({
        url: 'structure/notice/addNotice',
        method: 'post',
        data: params
    });
}
//  区端 编辑发通知
export function updateNoticeDoe(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('noticeTitle', query.noticeTitle);
    params.append('noticeContent', query.noticeContent);
    params.append('releaseUserId', query.releaseUserId);
    params.append('releaseUserName', query.releaseUserName);
    params.append('noticeState', query.noticeState);
    params.append('createType', query.createType);
    params.append('isReply', query.isReply);
    params.append('isSendOntime', 0);
    params.append('logoURL', query.logoURL);
    params.append('inscribe', query.inscribe);
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('fileIds', query.fileIds);
    params.append('picIds', query.picIds);
    params.append('infaceType', query.infaceType);
    params.append('isAnswer', query.isAnswer);
    params.append('overdueTime', query.overdueTime);
    params.append('sendType', query.sendType);
    params.append('areaDepartJson', query.areaDepartJson); //  区端 地址簿
    params.append('noticeType', 2);

    return fetch({
        url: 'structure/notice/updateNotice',
        method: 'post',
        data: params
    });
}


/**
 * 
 * @param {*} ids 删除通知，可批量删除（多个id用，分割）
 */
export function delNoticeList(ids) {
    let params = new URLSearchParams();
    params.append('ids', ids);
    return fetch({
        url: 'structure/notice/delNoticeList',
        method: 'post',
        data: params
    });
}

/**
 * 更新通知
 * @param {*} query 
 */
export function updateNotice(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('noticeTitle', query.noticeTitle);
    params.append('noticeContent', query.noticeContent);
    params.append('releaseUserId', query.releaseUserId);
    params.append('releaseUserName', query.releaseUserName);
    params.append('noticeState', query.noticeState);
    params.append('createType', query.createType);
    params.append('isReply', query.isReply);
    params.append('departJson', query.departJson);
    params.append('groupJson', query.groupJson);
    params.append('userJson', query.userJson);
    params.append('isSendOntime', query.isSendOntime);
    params.append('sendTime', query.sendTime);
    params.append('logoURL', query.logoURL);
    params.append('inscribe', query.inscribe);
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('fileJson', query.fileJson);
    params.append('fileCount', query.fileCount);
    params.append('picIds', query.picIds);
    params.append('infaceType', query.infaceType);
    params.append('isAnswer', query.isAnswer);
    params.append('overdueTime', query.overdueTime);
    params.append('sendType', query.sendType);
    params.append('noticeType', query.noticeType);
    params.append('isOpenForTeacher', query.isOpenForTeacher);
    params.append('isSign', query.isSign);

    return fetch({
        url: 'structure/notice/updateNotice',
        method: 'post',
        data: params
    });
}


/*yjx迭代*/
/*所有通知*/
export function getAllPublishNoticeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    return fetch({
        url: 'structure/notice/getAllPublishNoticeList',
        method: 'post',
        data: params
    })
}
export function getAllPublishNoticeListnew(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    return archivedFetch({
        url: 'structure/notice/getAllPublishNoticeList',
        method: 'post',
        data: params
    })
}
export function getAllPublishNoticeListBoe(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('noticeType', 2);
    return fetch({
        url: 'structure/notice/getAllPublishNoticeList',
        method: 'post',
        data: params
    })
}
/*发送统计*/
export function getNoticePublishCount(listQuery) {
    let params = new URLSearchParams();
    params.append('beginTime', listQuery.beginTime);
    params.append('endTime', listQuery.endTime);
    params.append('teacherName', listQuery.teacherName);
    return fetch({
        url: 'structure/notice/getNoticePublishCount',
        method: 'post',
        data: params
    })
}


/**
 *区端发送统计
 */
export function getNoticePublishCountDoe(listQuery) {
    let params = new URLSearchParams();
    params.append('beginTime', listQuery.beginTime);
    params.append('endTime', listQuery.endTime);
    params.append('teacherName', listQuery.teacherName);
    params.append('noticeType', 2);
    return fetch({
        url: 'structure/notice/getNoticePublishCount',
        method: 'get',
        params
    })
}



/**删除 */
export function delNoticeListAll(args) {
    let params = new URLSearchParams();
    params.append('ids', args.ids);
    return fetch({
        url: 'structure/notice/delNoticeList',
        method: 'post',
        data: params
    });
}

// 提醒通知未读人
export function remindNotReadUsers(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    return fetch({
        url: 'structure/notice/remindNotReadUsers',
        method: 'GET',
        params
    });
}


// 提醒  学校里的  未读人
export function remindNotReadUsersSchoolId(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('schoolId', args.schoolId);
    return fetch({
        url: 'structure/notice/remindNotReadUsersBySchoolId',
        method: 'GET',
        params
    });
}

// 局通知 列表
export function findAreaNoticeList(args) {
    let params = new URLSearchParams();
    params.append('noticeTitle', args.noticeTitle);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return fetch({
        url: 'structure/notice/findAreaNoticeList',
        method: 'POST',
        data: params
    });
}

// 转发
export function forwardNotice(args) {
    let params = new URLSearchParams();
    params.append('commonGroup', args.commonGroup);
    params.append('noticeId', args.noticeId);
    params.append('fromArea', args.fromArea);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/notice/forwardNotice',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 提交审批
export function addNoticeSubmit(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/notice/addNoticeSubmit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据通知id,查看所有的接收人(除了type=2(转发) 1:审批)
export function listReadUserByNoticeId(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/notice/listReadUserByNoticeId',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 转发人/提交信息/批复信息
export function findSubmitAndApprovalAndForwardUser(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);

    return fetch({
        url: 'structure/notice/findSubmitAndApprovalAndForwardUser',
        method: 'GET',
        params
    });
}

// 批复
export function addNoticeApproval(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('approvalContent', args.approvalContent);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/notice/addNoticeApproval',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 区段回复列表 分页
export function findAreaNoticeReplyListByPage(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    params.append('type', 1);

    return fetch({
        url: 'structure/notice/findAreaNoticeReplyListByPage',
        method: 'GET',
        params
    });
}

// 回复列表(不分页)
export function findAreaNoticeReplyList(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);

    return fetch({
        url: 'structure/notice/findAreaNoticeReplyList',
        method: 'GET',
        params
    });
}

// 上级发文列表(根据角色自动区分)
export function findAreaNoticeList2ByPage(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('readState', args.readState);
    params.append('userType', args.userType);
    params.append('searchContent', args.searchContent);

    return fetch({
        url: 'structure/notice/findAreaNoticeList2ByPage',
        method: 'GET',
        params
    });
}

// 提醒所有人
export function remindAllUsers(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);

    return fetch({
        url: 'structure/notice/remindAllUsers',
        method: 'GET',
        params
    });
}
//通知置顶or取消置顶
export function updateTopState(noticeId, state) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    params.append('state', state);
    return fetch({
        url: 'structure/notice/updateTopState',
        method: 'GET',
        params
    });
}
// 通知重复提醒消息保存
export function saveNoticeRepeatReminderByNoticeId(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('isDelete', args.isDelete);
    params.append('noticeId', args.noticeId);
    params.append('startDate', args.startDate);
    params.append('tipTime', args.tipTime);
    return fetch({
        url: 'structure/notice/saveNoticeRepeatReminderByNoticeId',
        method: 'GET',
        params
    });
}
//通知重复提醒详情
export function getNoticeRepeatReminderByNoticeId(noticeId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    return fetch({
        url: 'structure/notice/getNoticeRepeatReminderByNoticeId',
        method: 'GET',
        params
    });
}
export function getClassReceiveNoticeList(args) {
    let params = new URLSearchParams();
    params.append('deptClassId', args.deptClassId);
    params.append('noticeType', args.noticeType);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);

    return fetch({
        url: 'structure/notice/getClassReceiveNoticeList',
        method: 'GET',
        params
    });
}
export function getReadDepartListByNoticeId(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('userType', args.userType);

    return fetch({
        url: 'structure/notice/getReadDepartListByNoticeId',
        method: 'GET',
        params
    });
}
export function getReadDepartListByNoticeIdnew(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('userType', args.userType);

    return archivedFetch({
        url: 'structure/notice/getReadDepartListByNoticeId',
        method: 'GET',
        params
    });
}

export function getReadUserNoticeList2(args) {
    let params = new URLSearchParams();
    params.append('deptId', args.deptId);
    params.append('isRead', 1);
    params.append('noticeId', args.noticeId);
    params.append('searchTitle', '');
    params.append('userType', 2);

    return fetch({
        url: 'structure/notice/getReadUserNoticeList2',
        method: 'GET',
        params
    });
}
export function lastLogoUrl() {
    return fetch({
        url: 'structure/notice/lastLogoUrl',
        method: 'get'
    });
}


export function getNoticeAndReadHistoryPage(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchTitle', listQuery.searchTitle);
    params.append('startDate', listQuery.startDate);
    params.append('endDate', listQuery.endDate);
    return fetch({
        url: 'structure/notice/getNoticeAndReadHistoryPage',
        method: 'post',
        data: params
    });
}
// 通知阅读签名清除
export function delReadSignPic(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/notice/delReadSignPic',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
