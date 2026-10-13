import fetch from '@/utils/fetch';

// 列表 优雅班级/雅美教师/雅行辅导员
export function listByModelAndPage(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('state', args.state);
    params.append('type', args.type);
    params.append('title', args.title);

    return fetch({
        url: 'structure/gracefulThreeTypes/listByModelAndPage',
        method: 'GET',
        params
    });
}

// 新增 优雅班级/雅美教师/雅行辅导员
export function insertYaxing(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/gracefulThreeTypes/insert',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 删除优雅班级/雅美教师/雅行辅导员
export function deleteYaxing(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/gracefulThreeTypes/delete',
        method: 'POST',
        data: params
    });
}

// 发布 优雅班级/雅美教师/雅行辅导员
export function publishYaxing(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/gracefulThreeTypes/publish',
        method: 'POST',
        data: params
    });
}

// 详情 优雅班级/雅美教师/雅行辅导员
export function getYaxingById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/gracefulThreeTypes/getById',
        method: 'GET',
        params
    });
}

// 修改 优雅班级/雅美教师/雅行辅导员
export function updateYaxing(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/gracefulThreeTypes/update',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
