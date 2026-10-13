import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
/**
 *
 * 获取班级圈列表/structure/classCircle/getClassCircleList
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getClassCircleList(listQuery) {
    let params = new URLSearchParams();
    params.append("classId", listQuery.classId);
    params.append("pageNo", listQuery.pageNo);
    params.append("optionId", listQuery.optionId);
    params.append("pageSize", listQuery.pageSize);
     params.append("searchTitle", listQuery.searchTitle);
     params.append("endTime", listQuery.endTime);
     params.append("startTime", listQuery.startTime);
     params.append("isDigest", listQuery.isDigest);
     params.append("isMySend", listQuery.isMySend);

    return fetch({
        url: 'structure/classCircle/getClassCircleList',
        method: 'post',
        params
    });
}

/**
 *
 * 班级圈点赞/structure/classCircle/addPraise
 * @export
 * @param {any} listQuery
 * @returns
 */
export function addPraise(listQuery) {
    let params = new URLSearchParams();
    params.append("circleId", listQuery.circleId);
    params.append("fabulousUser", listQuery.fabulousUser);
    params.append("fabulousUserId", listQuery.fabulousUserId);
    params.append("likeType", listQuery.likeType);

    return fetch({
        url: 'structure/classCircle/addPraise',
        method: 'post',
        data:params
    });

}

/**
 *
 * 班级圈取消点赞/structure/classCircle/delPraise
 * @export
 * @param {any} listQuery
 * @returns
 */
export function delPraise(listQuery) {
    let params = new URLSearchParams();
    params.append("circleId", listQuery.circleId);
    params.append("fabulousUserId", listQuery.fabulousUserId);

    return fetch({
        url: 'structure/classCircle/delPraise',
        method: 'post',
        data:params
    });

}


/**
 *
 * 班级圈添加评论/structure/classCircle/addComment
 * @export
 * @param {any} listQuery
 * @returns
 */
export function addComment(listQuery) {
    let params = new URLSearchParams();
    params.append("circleId", listQuery.circleId);
    params.append("commentContent", listQuery.commentContent);
    params.append("commentUser", listQuery.commentUser);
    params.append("commentUserId", listQuery.commentUserId);
    params.append("receiveUser", listQuery.receiveUser);
    params.append("receiveUserId", listQuery.receiveUserId);
    params.append("type", listQuery.type);

    return fetch({
        url: 'structure/classCircle/addComment',
        method: 'post',
        data:params
    });

}



/**
 *
 * 班级圈删除评论/structure/classCircle/delComment
 * @export
 * @param {any} listQuery
 * @returns
 */
export function delComment(commentId) {
    let params = new URLSearchParams();
    params.append("commentId", commentId);

    return fetch({
        url: 'structure/classCircle/delComment',
        method: 'post',
        data:params
    });

}



/**
 *
 * 新增班级圈/structure/classCircle/addClassCircle
 * @export
 * @param {any} listQuery
 * @returns
 */
export function addClassCircle(listQuery) {
    let params = new URLSearchParams();
    params.append("classId", listQuery.classId);
    params.append("content", listQuery.content);
    params.append("createType", listQuery.createType);
    params.append("description", listQuery.description);
    params.append("picsJson", listQuery.picsJson);
    params.append("studentId", listQuery.studentId);
    params.append("type", listQuery.type);
    params.append("videosJson", listQuery.videosJson);
    params.append("optionId", listQuery.optionId);
    params.append("optionName", listQuery.optionName);
    params.append("relatedStuJson", listQuery.relatedStuJson);

    return fetch({
        url: 'structure/classCircle/addClassCircle',
        method: 'post',
        data:params
    });

}


/**
 *
 * 获取上传视频所需资源
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getUpload() {
    let params = new URLSearchParams();
    return fetch({
        url: '/common/getWxCosFile',
        method: 'post',
        data:params
    });

}



/**
 *
 * 删除班级圈/structure/classCircle/delClassCircle
 * @export
 * @param {any} listQuery
 * @returns
 */
export function delClassCircle(circleId) {
    let params = new URLSearchParams();
    params.append("circleId", circleId);
    return fetch({
        url: 'structure/classCircle/delClassCircle',
        method: 'post',
        data:params
    });

};


/**
 *
 * 根据班级圈id获取班级圈详情/structure/classCircle/getClassCircleInfo
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getClassCircleInfo(circleId) {
    let params = new URLSearchParams();
    params.append("circleId", circleId);
    return fetch({
        url: 'structure/classCircle/getClassCircleInfo',
        method: 'post',
        data:params
    });

}

/**
 *
 * 批量删除班级圈structure/classCircle/delClassCircleIds
 * @export
 * @param {any} listQuery
 * @returns
 */
export function queryDepartById(circleIds) {
    let params = new URLSearchParams();
    params.append("id", circleIds);
    return fetch({
        url: 'depart/queryDepartById',
        method: 'post',
        data:params
    });

}
export function delClassCircleIds(circleIds) {
    let params = new URLSearchParams();
    params.append("circleIds", circleIds);
    return fetch({
        url: 'structure/classCircle/delClassCircleIds',
        method: 'post',
        data:params
    });

}

/**
 *
 * 获取所教班级列表structure/classCircle/getTeacherClassList
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getTeacherClassList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/classCircle/getTeacherClassList',
        method: 'post',
        data:params
    });

}
/**
 *
 * 判断用户是否具有发布权限
 * @export
 * @param {any} listQuery
 * @returns
 */
export function isCanAddCirrcle(classId) {
    let params = new URLSearchParams();
    params.append("classId", classId);
    return fetch({
        url: 'structure/classCircle/isCanAddCirrcle',
        method: 'post',
        data:params
    });

}

/**
 *
 * 获得班级圈评论设置信息
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getClassCircleCommentSetInfo() {
    return fetch({
        url: 'structure/classCircle/getClassCircleCommentSetInfo',
        method: 'post'
    });

}
/**
 *
 *判断教师是否具有加精权限
 */
export function isCanDigestCircle(classId) {
    let params = new URLSearchParams();
    params.append("classId", classId);
    return fetch({
        url: 'structure/classCircle/isCanDigestCircle',
        method: 'post',
        data:params
    });

}
/**
 *
 * 删除班级圈类型
 * @export
 * @param {any} listQuery
 * @returns
 */
export function deleteClassCircleOption(optionId) {
    let params = new URLSearchParams();
    params.append("optionId", optionId);
    return fetch({
        url: 'structure/classCircle/deleteClassCircleOption',
        method: 'post',
        data:params
    });

}
/**
 *
 * 新增班级圈类型
 * @export
 * @param {any} listQuery
 * @returns
 */
export function addClassCircleOption(optionName) {
    let params = new URLSearchParams();
    params.append("optionName", optionName);
    return fetch({
        url: 'structure/classCircle/addClassCircleOption',
        method: 'post',
        data:params
    });

}
/**
 *
 * 获得班级圈类型列表
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getClassCircleOptionList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/classCircle/getClassCircleOptionList',
        method: 'post',
    });

}
/**
 *
 * 新增班级圈角色与评论设置
 * @export
 * @param {any} listQuery
 * @returns
 */
export function addClassCircleRole(commentSetJson,digestSetJson,roleListJson, needApprove, isRelatedStus = 0) {
    let params = new URLSearchParams();
    params.append("commentSetJson", commentSetJson);
    params.append("digestSetJson", digestSetJson);
    params.append("roleListJson", roleListJson);
    params.append("needApprove", needApprove);
    params.append("isRelatedStus", isRelatedStus);
    return fetch({
        url: 'structure/classCircle/addClassCircleRole',
        method: 'post',
        data:params
    });

}
/**
 *
 * 获得班级圈加精设置信息
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getClassCircleDigestSetInfo() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/classCircle/getClassCircleDigestSetInfo',
        method: 'post',
    });
}
/**
 *
 * 获得班级圈设置信息
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getClassCircleSetInfo() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/classCircle/getClassCircleSetInfo',
        method: 'post',
    });
}
//判断是否指定部门负责人
export function isManager(departId,userId) {
    let params = new URLSearchParams();
    params.append('departId', departId);
    params.append('userId', userId);
    return systemFetch({
        url: 'api/depart/isManager',
        method: 'GET',
        params
    });
}
//判断用户是否具备某角色
export function possessRole(userId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', '76');
    params.append('userId', userId);
    return systemFetch({
        url: 'api/user/role/possessRole',
        method: 'GET',
        params
    });
}
/**
 *
 * 班级圈加精
 * @export
 * @param {any} listQuery
 * @returns
 */
export function digestCircle(circleId) {
    let params = new URLSearchParams();
    params.append("circleId", circleId);
    return fetch({
        url: 'structure/classCircle/digestCircle',
        method: 'post',
        data:params
    });

}
//获取当前学期
export function getCurrentSchoolTimeBySchoolId() {
    return fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'GET'
    });
}
/*
 * 班级圈统计-按老师、按班级、按学生
 */
export function getSchoolCircleStaticPageData(listQuery) {
    let params = new URLSearchParams();
    params.append("byType",listQuery.byType);
    params.append("endTime",listQuery.endTime	);
    params.append("pageNo",listQuery.pageNo);
    params.append("pageSize",listQuery.pageSize);
    params.append("searchName",listQuery.searchName);
    params.append("startTime",listQuery.startTime);
    params.append("classId",listQuery.classId);
    return fetch({
        url: 'structure/classCircle/getSchoolCircleStaticPageData',
        method: 'post',
        data:params
    });

}
// 审批班级圈
export function approveClassCircle(id,isApprove) {
    let params = new URLSearchParams();
    params.append("id", id);
    params.append("isApprove", isApprove);

    return fetch({
        url: 'structure/classCircle/approveClassCircle',
        method: 'post',
        data: params
    });

}
