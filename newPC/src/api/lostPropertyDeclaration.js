import fetch from '@/utils/fetch';

/**
 * 根据id获取失物申报详情
 * @export
 * @param {any} query
 * @returns
 */
export function lostDeclareDetails(query) {
    let params = new URLSearchParams();
    params.append('lostDeclareId', query.lostDeclareId);
    return fetch({
        url: 'structure/lost/lostDeclareDetails',
        method: 'POST',
        data: params
    });
}
/**
 * 管理员失物申报列表
 * @export
 * @param {any} query
 * @returns
 */
export function manageLostDeclareList(query) {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/lost/manageLostDeclareList',
        method: 'POST',
        data: params
    });
}
/**
 * 回复列表
 * @export
 * @param {any} query
 * @returns
 */
export function getReplyList(query) {
    let params = new URLSearchParams();

    params.append('searchFoundId', query.searchFoundId);
    return fetch({
        url: 'structure/lost/getReplyList',
        method: 'POST',
        data: params
    });
}
/**
 * 新增回复
 * @export
 * @param {any} query
 * @returns
 */
export function insertReply(query) {
    let params = new URLSearchParams();
    params.append('picList', query.picList);
    params.append('replyContext', query.replyContext);
    params.append('searchFoundId', query.searchFoundId);
    return fetch({
        url: 'structure/lost/insertReply',
        method: 'POST',
        data: params
    });
}

/**
 * 新增启示
 * @export
 * @param {any} query
 * @returns
 */
export function insertSearchAnnouncement(query) {
    let params = new URLSearchParams();
    params.append('declareUserName', query.declareUserName); //失主姓名
    params.append('declareUserPhone', query.declareUserPhone); //创建人联系方式
    params.append('declareUserId', query.declareUserId); //	申报人ID
    params.append('content', query.content); //描述内容
    params.append('declareId', query.declareId); //	失物申报的id,由失物申报转为寻物启事时设值，新建时为null
    params.append('lostSearchPic', JSON.stringify(query.lostSearchPic)); //	图片
    params.append('announcementType', query.announcementType); //判断是寻物还是招领1代表寻物启事，2代表招领启示
    params.append('outSide', query.outSide); //是否对校外开放;1代表开放,0代表不开放
    params.append('schoolFellow', query.schoolFellow); //	是否对校友开放;1代表开放,0代表不开放
    params.append('status', query.status); //	1代表已保存，2代表已发布，3代表已找到（仅寻物启事），4代表已交还失主
    params.append('inscribeDeptName', query.inscribeDeptName); //落款部门

    params.append('publishType', query.publishType);
    params.append('auditStatus', query.auditStatus);
    params.append('departJson', JSON.stringify(query.departJson));

    if (query.declareId) {
        params.append('createId', query.createId);
        params.append('createUserName', query.createUserName);
    }

    return fetch({
        url: 'structure/lost/insertSearchAnnouncement',
        method: 'POST',
        data: params
    });
}
/**
 * 根据schoolId分页获取寻物招领
 * @export
 * @param {any} query
 * @returns
 */
export function searchFoundListBySchoolId(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/lost/searchFoundListBySchoolId',
        method: 'POST',
        data: params
    });
}

/**
 * 获取寻物招领详情
 * @export
 * @param {any} query
 * @returns
 */
export function searchFountDetails(query) {
    let params = new URLSearchParams();
    params.append('searchFoundId', query.searchFoundId);//寻物招领id
    params.append('submitRead', query.submitRead);// 是否录入已读人，1代表录入
    return fetch({
        url: 'structure/lost/searchFountDetails',
        method: 'POST',
        data: params
    });
}
/**
 * 已归还
 * @export
 * @param {any} query
 * @returns
 */
export function giveBack(id) {
    let params = new URLSearchParams();
    params.append('id', id);//寻物招领id
    return fetch({
        url: 'structure/lost/giveBack',
        method: 'POST',
        data: params
    });
}
/**
 * 已找到
 * @export
 * @param {any} query
 * @returns
 */
export function found(id, declareId, declareUserId) {
    let params = new URLSearchParams();
    params.append('declareId', declareId);//失物申报id,没有传0
    params.append('declareUserId', declareUserId);//失物申报人的Id,没有传0
    params.append('id', id);//寻物招领id
    return fetch({
        url: 'structure/lost/found',
        method: 'POST',
        data: params
    });
}

/**
 * pc分页回复列表
 * @export
 * @param {any} query
 * @returns
 */
export function pcReplyList(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);//寻物招领id
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/lost/pcReplyList',
        method: 'POST',
        data: params
    });
}

/**
 * pc删除失物申报
 * @export
 * @param {any} query
 * @returns
 */
export function deleteDeClare(declareIds) {
    let params = new URLSearchParams();
    params.append('declareIds', declareIds);//失物申报ids,以“，”分割
    return fetch({
        url: 'structure/lost/deleteDeClare',
        method: 'POST',
        data: params
    });
}

/**
 * pc删除失物启事
 * @export
 * @param {any} query
 * @returns
 */
export function deleteSearchAnnouncement(searchFoundIds) {
    let params = new URLSearchParams();
    params.append('searchFoundIds', searchFoundIds);//失物启事ids,以“，”分割
    return fetch({
        url: 'structure/lost/deleteSearchAnnouncement',
        method: 'POST',
        data: params
    });
}
/**
 * 根据学校id分页获取失物申报
 * @export
 * @param {any} query
 * @returns
 */
export function lostDeclareBySchoolId(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/lost/lostDeclareBySchoolId',
        method: 'POST',
        data: params
    });
}
/**
 * 编辑寻物招领启事
 * @export
 * @param {any} query
 * @returns
 */
export function editFoundAnnouncement(query) {
    let params = new URLSearchParams();
    params.append('declareUserName', query.declareUserName); //失主姓名
    params.append('declareUserPhone', query.declareUserPhone); //创建人联系方式
    params.append('declareUserId', query.declareUserId); //	申报人ID
    params.append('content', query.content); //描述内容
    params.append('declareId', query.declareId); //	失物申报的id,由失物申报转为寻物启事时设值，新建时为null
    params.append('lostSearchPic', JSON.stringify(query.lostSearchPic)); //	图片
    params.append('announcementType', query.announcementType); //判断是寻物还是招领1代表寻物启事，2代表招领启示
    params.append('outSide', query.outSide); //是否对校外开放;1代表开放,0代表不开放
    params.append('schoolFellow', query.schoolFellow); //	是否对校友开放;1代表开放,0代表不开放
    params.append('status', query.status); //	1代表已保存，2代表已发布，3代表已找到（仅寻物启事），4代表已交还失主
    params.append('inscribeDeptName', query.inscribeDeptName); //落款部门
    params.append('id', query.id); //物品id

    params.append('publishType', query.publishType);
    params.append('auditStatus', query.auditStatus);
    params.append('departJson', JSON.stringify(query.departJson));
    return fetch({
        url: 'structure/lost/editFoundAnnouncement',
        method: 'post',
        data: params
    });
}

// 统一处理请求参数
export const filterURLSearchParams = (args = {}) => {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 审批寻物招领
export const auditSearchFoundAnnouncement = data =>
    fetch({
        url: 'structure/lost/auditSearchFoundAnnouncement',
        method: 'POST',
        data: filterURLSearchParams(data)
    })