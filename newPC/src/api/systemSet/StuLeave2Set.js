import fetch from '@/utils/fetch';

/**
 * 新增修改学生请假初始化设置
 * @param {*} params 
 */
export function addAndUpdateStuAskleaveInit(args) {
    return fetch({
        url: 'structure/stuAskleave/addAndUpdateStuAskleaveInit',
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(args)
    });
}

/**
 * 获取学生请假版本二初始化设置
 */
export function getStuAskleaveInitInfo() {
    return fetch({
        url: 'structure/stuAskleave/getStuAskleaveInitInfo',
        method: 'post'
    });
}


/**
 * 按条件查看请假班级分组列表
 * @param {*} params 
 */
export function getStuAskleaveGroupList(params) {
    return fetch({
        url: 'structure/stuAskleave/getStuAskleaveGroupList',
        method: 'post',
        data: params
    });
}

/**
 * 新增学生请假班级分组
 * @param {*} params 
 */
export function addStuAskleaveGroup(query) {
    let params = new URLSearchParams();
    params.append('title', query.title);
    params.append('insUserJson', query.insUserJson);
    params.append('classJson', JSON.stringify(query.classJson));
    return fetch({
        url: 'structure/stuAskleave/addStuAskleaveGroup',
        method: 'post',
        data: params
    });
}

/**
 * 修改学生请假班级分组
 */
export function updateAskleaveGroup(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('title', query.title);
    params.append('insUserJson', query.insUserJson);
    params.append('classJson', JSON.stringify(query.classJson));
    return fetch({
        url: 'structure/stuAskleave/updateAskleaveGroup',
        method: 'post',
        data: params
    });
}

/**
 * 删除学生请假班级分组
 * @param {*} groupId 
 */
export function deleAskleaveGroup(groupId) {
    let params = new URLSearchParams();
    params.append('groupId', groupId);
    return fetch({
        url: 'structure/stuAskleave/deleAskleaveGroup',
        method: 'post',
        data: params
    });
}

/**
 * 根据分组Id查看班级分组信息
 * @param {*} groupId 
 */
export function getStuAskleaveGroupInfo(groupId) {
    let params = new URLSearchParams();
    params.append('groupId', groupId);
    return fetch({
        url: 'structure/stuAskleave/getStuAskleaveGroupInfo',
        method: 'post',
        data: params
    });
}
