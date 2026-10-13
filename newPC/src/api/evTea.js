import fetch from '@/utils/fetch';

// 修改模板
export function updateEvaluateTwTemp(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/updateEvaluateTwTemp',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 新增模板
export function addEvaluateTwTemp(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/addEvaluateTwTemp',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

// 根据学校id查询模板列表
export function getEvaluateTwTempList() {

    return fetch({
        url: 'structure/evaluateTw/getEvaluateTwTempList',
        method: 'GET',
    })
}

// 根据模板id删除模板
export function delEvaluateTwTemp(args) {
    let params = new URLSearchParams();
    params.append("tempId", args.tempId);

    return fetch({
        url: 'structure/evaluateTw/delEvaluateTwTemp',
        method: 'GET',
        params
    })
}

// 根据模板id查询模板信息
export function getEvaluateTwTemp(args) {
    let params = new URLSearchParams();
    params.append("tempId", args.tempId);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateTwTemp',
        method: 'GET',
        params
    })
}

// 根据批次id查询评教评学批次
export function getEvaluateTwBatch(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateTwBatch',
        method: 'GET',
        params
    })
}
// 根据批次id删除评教评学批次
export function delEvaluateTwBatch(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);

    return fetch({
        url: 'structure/evaluateTw/delEvaluateTwBatch',
        method: 'GET',
        params
    })
}

// 新增评教评学批次
export function addEvaluateTwBatch(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/addEvaluateTwBatch',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
// 修改评教评学批次
export function updateEvaluateTwBatch(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/updateEvaluateTwBatch',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
// 根据条件查询批次列表
export function getEvaluateTwBatchList(args) {
    let params = new URLSearchParams();
    params.append("batchTitle", args.batchTitle);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateTwBatchList',
        method: 'GET',
        params
    })
}
// 根据批次id查询各班级进度
export function getClassProgressList(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    return fetch({
        url: 'structure/evaluateTw/getClassProgressList',
        method: 'GET',
        params
    })
}
// 根据批次id,班级id 答卷状态 学生姓名查询学生列表
export function getEvaluateTwBatchUserList(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("classId", args.classId);
    params.append("isVote", args.isVote);
    params.append("studentName", args.studentName);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateTwBatchUserList',
        method: 'GET',
        params
    })
}
// 根据批次id查询普通模板统计
export function getEvaluateStaticList(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("batchTempId", args.batchTempId);
    params.append("classIds", args.classIds);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateStaticList',
        method: 'GET',
        params
    })
}
// 提醒家长答卷
export function remindToStuParent(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("batchTitle", args.batchTitle);
    params.append("classId", args.classId);
    params.append("studentId", args.studentId);

    return fetch({
        url: 'structure/evaluateTw/remindToStuParent',
        method: 'GET',
        params
    })
}
// 补发评教评学
export function mendEvaluateTwBatchBatchUserStu(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/mendEvaluateTwBatchBatchUserStu',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
// 查询普通模板统计详情
export function getEvaluateStaticInfoList(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("batchTempId", args.batchTempId);
    params.append("classIds", args.classIds);
    params.append("optionNum", args.optionNum);
    params.append("topicNum", args.topicNum);
    params.append("topicType", args.topicType);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateStaticInfoList',
        method: 'GET',
        params
    })
}
// 根据批次id，老师姓名查询学科选项统计
export function getEvaluateCurrOptionStaticList(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("teacherUserName", args.teacherUserName);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateCurrOptionStaticList',
        method: 'GET',
        params
    })
}
// 根据批次id，老师姓名查询学科题目统计
export function getEvaluateCurrTopicStaticList(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("teacherUserName", args.teacherUserName);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateCurrTopicStaticList',
        method: 'GET',
        params
    })
}
// 根据批次id，老师id查询学科题目统计
export function getEvaluateCurrTopicStaticListByThId(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("teacherUserId", args.teacherUserId);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateCurrTopicStaticListByThId',
        method: 'GET',
        params
    })
}
// 根据批次id，老师id查询学科题目统计
export function getEvaluateCurrOptionStaticListByThId(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("teacherUserId", args.teacherUserId);
    params.append("batchTempId", args.batchTempId || 0);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateCurrOptionStaticListByThId',
        method: 'GET',
        params
    })
}
// 根据批次id，老师id查询学科题目统计
export function getStaticScoreListByBatchTempId(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("teacherUserName", args.teacherUserName);
    params.append("batchTempId", args.batchTempId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    return fetch({
        url: 'structure/evaluateTw/getStaticScoreListByBatchTempId',
        method: 'GET',
        params
    })
}
// 根据批次id，老师id查询学科题目统计
export function getStaticScoreListThByBatchTempId(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("batchTempId", args.batchTempId);
    return fetch({
        url: 'structure/evaluateTw/getStaticScoreListThByBatchTempId',
        method: 'GET',
        params
    })
}

// 根据批次id 模板id查询批次模板统计 2023-12-11
export function getEvaluateCurrTopicStaticListByBatchTempId(args) {
    let params = new URLSearchParams();
    params.append("batchId", args.batchId);
    params.append("batchTempId", args.batchTempId);

    return fetch({
        url: 'structure/evaluateTw/getEvaluateCurrTopicStaticListByBatchTempId',
        method: 'GET',
        params
    })
}

export function exportEvaluateStaticList(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/exportEvaluateStaticList',
        method: 'POST',
        data: JSON.stringify(args)
    })
}

export function resetEvaluateTwBatchUser(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/resetEvaluateTwBatchUser',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
export function delEvaluateTwBatchUser(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/evaluateTw/delEvaluateTwBatchUser',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
