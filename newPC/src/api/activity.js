import fetch from '@/utils/fetch';

//获得用户创建的学校活动列表（分页）
export function getSchoolActivityPageList(args) {
    const params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("theme", args.theme);
    params.append("moduleType", args.moduleType);
    return fetch({
        url: 'structure/activity/getSchoolActivityPageList',
        method: 'POST',
        data: params
    })
}

//删除活动
export function deleteActivity(args) {
    const params = new URLSearchParams();
    params.append("activityIds", args.activityIds);
    return fetch({
        url: 'structure/activity/deleteActivity',
        method: 'POST',
        data: params
    })
}

//新增活动
export function addActivity(args) {
    const params = new URLSearchParams();
    params.append("activityLogo", args.activityLogo);
    params.append("activityScopes", args.activityScopes);
    params.append("activityType", args.activityType);
    params.append("allowUploadPic", args.allowUploadPic);
    params.append("applyCount", args.applyCount);
    params.append("applyEndTime", args.applyEndTime);
    if (args.batchUserId) {
        params.append("batchUserId", args.batchUserId);
    }
    params.append("departId", args.departId);
    params.append("departName", args.departName);
    params.append("describe", args.describe);
    params.append("endTime", args.endTime);
    params.append("filesJson", args.filesJson);
    params.append("isApply", args.isApply);
    if (args.isApplyBatch) {
        params.append("isApplyBatch", args.isApplyBatch);
    }
    params.append("isInscribe", args.isInscribe);
    params.append("isResearch", args.isResearch);
    params.append("isSign", args.isSign);
    params.append("notSendSign", args.notSendSign);
    params.append("place", args.place);
    params.append("signTimeStr", args.signTimeStr);
    params.append("startTime", args.startTime);
    params.append("status", args.status);
    params.append("theme", args.theme);
    params.append("topicJson", args.topicJson);
    params.append("isOntimeSend", args.isOntimeSend || 0);
    params.append("moduleType", args.moduleType);
    if (args.isOntimeSend) {
        params.append("sendDate", args.sendDate);
    }
    return fetch({
        url: 'structure/activity/addActivity',
        method: 'POST',
        data: params
    })
}

/*
 * 根据id获取所在部门
 */
export function queryDepartByUserId(args) {
    let params = new URLSearchParams();
    params.append('userId', args.userId);
    params.append('depType', args.depType);
    return fetch({
        baseURL: global.BaseNewPath,
        url: 'api/user/depart/queryDepartByUserId',
        method: 'get',
        params
    });
}

//获得活动详细信息
export function getActivityInfo(args) {
    const params = new URLSearchParams();
    params.append("activityId", args.activityId);
    return fetch({
        url: 'structure/activity/getActivityInfo',
        method: 'POST',
        data: params
    })
}

//编辑活动
export function editActivity(args) {
    const params = new URLSearchParams();
    params.append("activityLogo", args.activityLogo);
    params.append("activityScopes", args.activityScopes);
    params.append("activityType", args.activityType);
    params.append("allowUploadPic", args.allowUploadPic);
    params.append("applyCount", args.applyCount);
    params.append("applyEndTime", args.applyEndTime);
    if (args.batchUserId) {
        params.append("batchUserId", args.batchUserId);
    }
    params.append("departId", args.departId);
    params.append("departName", args.departName);
    params.append("describe", args.describe);
    params.append("endTime", args.endTime);
    params.append("filesJson", args.filesJson);
    params.append("id", args.id);
    params.append("isApply", args.isApply);
    if (args.isApplyBatch) {
        params.append("isApplyBatch", args.isApplyBatch);
    }
    params.append("isInscribe", args.isInscribe);
    params.append("isResearch", args.isResearch);
    params.append("isSign", args.isSign);
    params.append("notSendSign", args.notSendSign);
    params.append("place", args.place);
    params.append("schoolId", args.schoolId);
    if (args.signQrCode) {
        params.append("signQrCode", args.signQrCode);
    }
    params.append("signTimeStr", args.signTimeStr);
    params.append("startTime", args.startTime);
    params.append("status", args.status);
    params.append("theme", args.theme);
    params.append("topicJson", args.topicJson);
    params.append("isOntimeSend", args.isOntimeSend || 0);
    params.append("moduleType", args.moduleType);
    if (args.isOntimeSend) {
        params.append("sendDate", args.sendDate);
    }
    return fetch({
        url: 'structure/activity/editActivity',
        method: 'POST',
        data: params
    })
}

//xiangqing
//发布互动提醒
export function publishBeginAskNotice(args) {
    const params = new URLSearchParams();
    params.append("activityId", args.activityId);
    return fetch({
        url: 'structure/activity/publishBeginAskNotice',
        method: 'POST',
        data: params
    })
}



//获得活动签到时间列表
export function getActivitySignTimeList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    return fetch({
        url: 'structure/activity/getActivitySignTimeList',
        method: 'get',
        params
    });
}

//签到人员列表（分页）内部活动
export function getActivitySignUserPageList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('signTimeId', args.signTimeId);
    params.append('userName', args.userName);
    return fetch({
        url: 'structure/activity/getActivitySignUserPageList',
        method: 'get',
        params
    });
}

//根据活动id查询年级班级列表 2025-12-24
export function getGradeAndClassList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    return fetch({
        url: 'structure/activity/getGradeAndClassList',
        method: 'get',
        params
    });
}
//查询学生签到列表2025-12-24
export function getActivityStList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);
    params.append('gradeId', args.gradeId);
    params.append('studentName', args.studentName);
    return fetch({
        url: 'structure/activity/getActivityStList',
        method: 'get',
        params
    });
}

//签到人员列表（分页）内部活动
export function getNotSignUserList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('signTimeId', args.signTimeId);
    return fetch({
        url: 'structure/activity/getNotSignUserList',
        method: 'get',
        params
    });
}

//公众号活动签到人员列表（分页） 外部
export function getWxsmpActivitySignPageList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('signTimeId', args.signTimeId);
    params.append('userName', args.userName);
    return fetch({
        url: 'structure/activity/getWxsmpActivitySignPageList',
        method: 'get',
        params
    });
}

//获得活动报名人员列表（分页）
export function getActivityApplyPageList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('userName', args.userName);
    return fetch({
        url: 'structure/activity/getActivityApplyPageList',
        method: 'get',
        params
    });
}

//获得活动调查选项列表
export function getActivityResearchInfo(args) {
    const params = new URLSearchParams();
    params.append("activityId", args.activityId);
    return fetch({
        url: 'structure/activity/getActivityResearchInfo',
        method: 'POST',
        data: params
    })
}
//获得活动调查分页列表
export function getResearchUserPageList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('optionId', args.optionId);
    return fetch({
        url: 'structure/activity/getResearchUserPageList',
        method: 'post',
        data: params
    });
}

//互动上墙
//获得活动互动数据
export function getActivityAskMapData(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('maxId', args.maxId);
    return fetch({
        url: 'structure/activity/getActivityAskMapData',
        method: 'post',
        data: params
    });
}
//签到上墙
export function signUserShow(args) {
    let params = new URLSearchParams();
    params.append('signUserShow', args.signUserShow);
    return fetch({
        url: 'structure/activity/signUserShow',
        method: 'post',
        data: params
    });
}

//资料管理
//获得活动资料列表
export function getActivityMaterialPageList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    if (args.searchTitle) {
        params.append('searchTitle', args.searchTitle);
    }
    return fetch({
        url: 'structure/activity/getActivityMaterialPageList',
        method: 'post',
        data: params
    });
}
//新增活动资料
export function addActivityMaterialFile(args) {
    let params = new URLSearchParams();
    params.append('accessUrl', args.accessUrl);
    params.append('activityId', args.activityId);
    params.append('materialStatus', args.materialStatus);
    params.append('title', args.title);
    params.append('type', args.type);
    if (args.voteId) {
        params.append('voteId', args.voteId);
    }
    return fetch({
        url: 'structure/activity/addActivityMaterialFile',
        method: 'post',
        data: params
    });
}

//删除活动资料
export function delActivityMaterial(args) {
    const params = new URLSearchParams();
    params.append("materialId", args.materialId);
    return fetch({
        url: 'structure/activity/delActivityMaterial',
        method: 'POST',
        data: params
    })
}

//发送活动附件资料
export function sendActivityMaterialFile(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('id', args.id);
    params.append('isApply', args.isApply);
    params.append('isScope', args.isScope);
    params.append('isSign', args.isSign);
    params.append('materialStatus', args.materialStatus);
    params.append('type', args.type);
    if (args.voteId) {
        params.append('voteId', args.voteId);
    }
    return fetch({
        url: 'structure/activity/sendActivityMaterialFile',
        method: 'post',
        data: params
    });
}

//补发活动
export function reissueActivity(args) {
    let params = new URLSearchParams();
    params.append('activityLogo', args.activityLogo);
    params.append('activityScopes', args.activityScopes);
    params.append('id', args.id);
    params.append('theme', args.theme);
    return fetch({
        url: 'structure/activity/reissueActivity',
        method: 'post',
        data: params
    });
}

//根据ID发布活动
export function sendActivityById(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    return fetch({
        url: 'structure/activity/sendActivityById',
        method: 'post',
        data: params
    });
}
//剪影
//上传活动剪影
export function addInteractPics(args) {
    let params = new URLSearchParams();
    params.append('interactPicsJson', args.interactPicsJson);
    return fetch({
        url: 'structure/activity/addInteractPics',
        method: 'post',
        data: params
    });
}
//删除活动图片
export function deleteInteractPic(args) {
    let params = new URLSearchParams();
    params.append('interactPicId', args.interactPicId);
    return fetch({
        url: 'structure/activity/deleteInteractPic',
        method: 'post',
        data: params
    });
}
//获得活动互动所有图片列表
export function getActivityInteractAllPicList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('moduleCode', args.moduleCode);
    return fetch({
        url: 'structure/activity/getActivityInteractAllPicList',
        method: 'post',
        data: params
    });
}
