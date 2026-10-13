import fetch from '@/utils/fetch';

// 接口名称 根据学年区code查询批次列表
export function getPlayWordBatchListBySchoolYear(args) {
    const params = new URLSearchParams();
    params.append('postcode', args.postcode);
    params.append('schoolYear', args.schoolYear);

    return fetch({
        url: 'structure/playWord/getPlayWordBatchListBySchoolYear',
        method: 'GET',
        params
    });
}

// 新增批次记录
export function addPlayWordBatch(args) {
    const params = new URLSearchParams();
    params.append('content', args.content);
    params.append('endDate', args.endDate);
    params.append('gradeName', args.gradeName);
    params.append('learnYear', args.learnYear);
    params.append('learningStages', 2);
    params.append('postcode', args.postcode);
    params.append('schoolYear', args.schoolYear);
    params.append('status', args.status);
    params.append('title', args.title);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/playWord/addPlayWordBatch',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 修改批次记录
export function updatePlayWordBatch(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/playWord/updatePlayWordBatch',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据批次id查询批次详情
export function getPlayWordBatch(args) {
    const params = new URLSearchParams();
    params.append('batchId', args.batchId);

    return fetch({
        url: 'structure/playWord/getPlayWordBatch',
        method: 'GET',
        params
    });
}


// 删除批次记录
export function delPlayWordBatch(args) {
    const params = new URLSearchParams();
    params.append('batchId', args.batchId);

    return fetch({
        url: 'structure/playWord/delPlayWordBatch',
        method: 'GET',
        params
    });
}

// 根据学年，入学年份，区code查询是否有开启对比记录
export function getPlayWordBatchCount(args) {
    const params = new URLSearchParams();
    params.append('batchId', args.batchId);
    params.append('learnYear', args.learnYear);
    params.append('postcode', args.postcode);
    params.append('schoolYear', args.schoolYear);

    return fetch({
        url: 'structure/playWord/getPlayWordBatchCount',
        method: 'GET',
        params
    });
}

// 根据入学年份区code查询批次列表
export function getPlayWordBatchListByLearnYear(args) {
    const params = new URLSearchParams();
    params.append('learnYear', args.learnYear);
    params.append('postcode', args.postcode);

    return fetch({
        url: 'structure/playWord/getPlayWordBatchListByLearnYear',
        method: 'GET',
        params
    });
}

// 根据区code查询批次列表
export function getPlayWordBatchList(args) {
    const params = new URLSearchParams();
    params.append('postcode', args.postcode);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return fetch({
        url: 'structure/playWord/getPlayWordBatchList',
        method: 'GET',
        params
    });
}

// 根据学年区code查询批次对比列表
export function getPlayWordBatchCompareList(args) {
    const params = new URLSearchParams();
    params.append('postcode', args.postcode);
    params.append('schoolYear', args.schoolYear);

    return fetch({
        url: 'structure/playWord/getPlayWordBatchCompareList',
        method: 'GET',
        params
    });
}

// 删除批次记录对比
export function delPlayWordBatchCompare(args) {
    const params = new URLSearchParams();
    params.append('compareId', args.compareId);

    return fetch({
        url: 'structure/playWord/delPlayWordBatchCompare',
        method: 'GET',
        params
    });
}

// 增批次记录对比
export function addPlayWordBatchCompare(args) {
    const params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/playWord/addPlayWordBatchCompare',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 修改批次记录对比
export function updatePlayWordBatchCompare(args) {
    const params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/playWord/updatePlayWordBatchCompare',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据批次id查询批次记录对比
export function getPlayWordBatchCompare(args) {
    const params = new URLSearchParams();
    params.append('compareId', args.compareId);

    return fetch({
        url: 'structure/playWord/getPlayWordBatchCompare',
        method: 'GET',
        params
    });
}
