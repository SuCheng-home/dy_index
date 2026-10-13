import fetch from '@/utils/fetch';
export function getItemList(args) {
    let params = new URLSearchParams();
    params.append("pageSize", args.pageSize);
    params.append("pageNo", args.pageNo);
    params.append("title", args.title);
    return fetch({
        url: 'structure/dormCheck/getItemList',
        method: 'get',
        params
    });
}
export function getGroupList(args) {
    let params = new URLSearchParams();
    params.append("pageSize", args.pageSize);
    params.append("pageNo", args.pageNo);
    params.append("title", args.title);
    return fetch({
        url: 'structure/dormCheck/getGroupList',
        method: 'get',
        params
    });
}
export function delItem(itemId) {
    let params = new URLSearchParams();
    params.append("itemId", itemId);
    return fetch({
        url: 'structure/dormCheck/delItem',
        method: 'get',
        params
    });
}
export function delGroup(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/dormCheck/delGroup',
        method: 'get',
        params
    });
}
export function getItem(itemId) {
    let params = new URLSearchParams();
    params.append("itemId", itemId);
    return fetch({
        url: 'structure/dormCheck/getItem',
        method: 'get',
        params
    });
}
export function getGroup(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/dormCheck/getGroup',
        method: 'get',
        params
    });
}
export function getItemListAll(args) {
    let params = new URLSearchParams();
    params.append("checkType", args.checkType);
    params.append("isStar", args.isStar);
    params.append("title", args.title);
    return fetch({
        url: 'structure/dormCheck/getItemListAll',
        method: 'get',
        params
    });
}
export function addGroup(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dormCheck/addGroup',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function updateGroup(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dormCheck/updateGroup',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function addItem(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dormCheck/addItem',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function updateItem(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dormCheck/updateItem',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function getDormListByClassIdAndBuildId() {
    let params = new URLSearchParams();
    params.append('buildId', '');
    params.append('classIds', '');

    return fetch({
        url: 'structure/dormManage/getDormListByClassIdAndBuildId',
        method: 'post',
        data: params
    });
    }

export function updateGroupCheckUserJson(data) {
    return fetch({
        url: '/structure/dormCheck/updateGroupCheckUserJson',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(data)
    });
}

export function addGroupUserList(data) {
    return fetch({
        url: '/structure/dormCheck/addGroupUserList',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(data)
    });
}
export function getGroupUserList(args) {
    let params = new URLSearchParams();
    params.append('groupId', args.groupId);

    return fetch({
        url: '/structure/dormCheck/getGroupUserList',
        method: 'get',
        params
    });
}

export function addGroupItemList(data) {
    return fetch({
        url: '/structure/dormCheck/addGroupItemList',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(data)
    });
}
export function getGroupItemList(args) {
    let params = new URLSearchParams();
    params.append('groupId', args.groupId);

    return fetch({
        url: '/structure/dormCheck/getGroupItemList',
        method: 'get',
        params
    });
}
export function getRecordStaticDormListByWeekOrMonth(args) {
    let params = new URLSearchParams();
    params.append('checkType', args.checkType);
    params.append('buildId', args.buildId);
    params.append('groupId', args.groupId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    if (args.dormName) {
        params.append('dormName', args.dormName);
    }
    if (args.severalWeek) {
        params.append('severalWeek', args.severalWeek);
    }
    if (args.month) {
        params.append('month', args.month);
    }
    return fetch({
        url: '/structure/dormCheck/getRecordStaticDormListByWeekOrMonth',
        method: 'get',
        params
    });
}

export function getRecordStaticStuListByWeekOrMonth(args) {
    let params = new URLSearchParams();
    params.append('checkType', args.checkType);
    params.append('buildId', args.buildId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    if (args.dormName) {
        params.append('dormName', args.dormName);
    }
    if (args.severalWeek) {
        params.append('severalWeek', args.severalWeek);
    }
    if (args.month) {
        params.append('month', args.month);
    }
    return fetch({
        url: '/structure/dormCheck/getRecordStaticStuListByWeekOrMonth',
        method: 'get',
        params
    });
}

