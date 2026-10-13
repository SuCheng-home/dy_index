import fetch from '@/utils/fetch';

/**
 * 根据类型Id及建议内容学校id查询建议列表
 * */
export function getAdviceTypeListAll(args) {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/advice/getAdviceTypeListAll',
        method: 'GET',
        params
    });
}

//学校管理员或者负责人的类型列表
export function findAdviceTypeListByRole(args) {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/advice/findAdviceTypeListByRole',
        method: 'GET',
        params
    });
}

/**
 * 根据类型Id及建议内容学校id查询建议列表
 * */
export function getAdviceListByType(args) {
    let params = new URLSearchParams();
    params.append("adviceContent", args.adviceContent);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("typeId", args.typeId);

    return fetch({
        url: 'structure/advice/getAdviceListByType',
        method: 'GET',
        params
    });
}

/**
 * 根据建议箱的id查询建议箱信息
 * */
export function getAdviceById(adviceId) {
    let params = new URLSearchParams();
    params.append("adviceId", adviceId);

    return fetch({
        url: 'structure/advice/getAdviceById',
        method: 'GET',
        params
    });
}

/**
 * 建议审批
 * */
/**
 * 负责人查询未处理建议列表
 * */
export function getNotBatchAdviceListByManager() {

    return fetch({
        url: 'structure/advice/getNotBatchAdviceListByManager',
        method: 'GET'
    });
}

/**
 * 处理建议
 * */
export function updateAdviceIsPublic(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/advice/updateAdviceIsPublic',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function turnToAdviceMsg(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/advice/turnToAdviceMsg',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function turnToAdvice(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/advice/turnToAdvice',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 查询是否为处理人
 * */
export function getIsBatchUser(adviceTypeId) {
    let params = new URLSearchParams();
    params.append('adviceTypeId', adviceTypeId);

    return fetch({
        url: 'structure/advice/getIsBatchUser',
        method: 'GET',
        params
    });
}

/**
 * 处理建议
 * */
export function batchAdvice(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/advice/batchAdvice',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

//负责人或者学校管理员的建议箱列表
export function findAdviceListByRole(args) {
    let params = new URLSearchParams();
    params.append("adviceContent", args.adviceContent);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("typeId", args.typeId);
    params.append("startDate", args.startDate);
    params.append("endDate", args.endDate);
    params.append("userId", args.userId);
    return fetch({
        url: 'structure/advice/findAdviceListByRole',
        method: 'GET',
        params
    });
}


export function getAdviceSchTimeStatic(args) {
    let params = new URLSearchParams();
    params.append("schoolTimeId", args.schoolTimeId);
    params.append("severalWeek", args.severalWeek);
    return fetch({
        url: 'structure/advice/getAdviceSchTimeStatic',
        method: 'GET',
        params
    });
}