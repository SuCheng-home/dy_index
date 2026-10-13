import fetch from '@/utils/fetch';

// 分页获取教师评语
export function queryTeacherComment(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);

    return fetch({
        url: 'structure/teacherComment/queryTeacherComment',
        method: 'GET',
        params
    });
}

// 删除教师评语
export function batchDeleteTeacherComment(args) {
    const params = new URLSearchParams();
    params.append('ids', args.ids);

    return fetch({
        url: 'structure/teacherComment/batchDeleteTeacherComment',
        method: 'GET',
        params
    });
}

// 教师评语详情
export function teacherCommentDetails(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/teacherComment/teacherCommentDetails',
        method: 'GET',
        params
    });
}

// 新增教师评语
export function insertTeacherComment(args) {
    const params = new URLSearchParams();
    params.append('content', args.content);
    params.append('type', args.type);
    params.append('typeName', args.typeName);

    return fetch({
        url: 'structure/teacherComment/insertTeacherComment',
        method: 'POST',
        data: params
    });
}

// 编辑教师评语
export function updateTeacherComment(args) {
    const params = new URLSearchParams();
    params.append('content', args.content);
    params.append('type', args.type);
    params.append('typeName', args.typeName);
    params.append('id', args.id);

    return fetch({
        url: 'structure/teacherComment/updateTeacherComment',
        method: 'POST',
        data: params
    });
}
