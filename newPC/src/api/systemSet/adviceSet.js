import fetch from '@/utils/fetch';

/**
 * 分页查询类型列表
 * */
export function getAdviceTypeList(args) {
    let params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("typeName", args.typeName);

    return fetch({
        url: 'structure/advice/getAdviceTypeList',
        method: 'GET',
        params
    });
}

/**
 * 根据类型ids批量删除类型
 * */
export function batchDelAdviceType(adviceTypeIds) {
    let params = new URLSearchParams();
    params.append("adviceTypeIds", adviceTypeIds);

    return fetch({
        url: 'structure/advice/batchDelAdviceType',
        method: 'GET',
        params
    });
}

/**
 * 新增建议箱类型
 * */
export function addAdviceType(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/advice/addAdviceType',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 编辑建议箱类型
 * */
export function updateAdviceType(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/advice/updateAdviceType',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 根据建议箱的id查询建议箱信息
 * */
export function getAdviceTypeById(adviceTypeId) {
    let params = new URLSearchParams();
    params.append("adviceTypeId", adviceTypeId);

    return fetch({
        url: 'structure/advice/getAdviceTypeById',
        method: 'GET',
        params
    });
}
