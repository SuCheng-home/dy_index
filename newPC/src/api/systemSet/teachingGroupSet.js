import fetch from '@/utils/fetchNew';

// 获取教研组列表
export function teachingResearchList() {
    let params = new URLSearchParams();

    return fetch({
        url: 'teachingResearch/list',
        method: 'GET',
        params
    });
}

// 详情
export function teachingResearchDetail(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'teachingResearch/detail',
        method: 'GET',
        params
    });
}

// 删除
export function teachingResearchDelete(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'teachingResearch/delete',
        method: 'GET',
        params
    });
}

// 新增
export function teachingResearchAdd(args) {
    let params = new URLSearchParams();
    params.append('memberNames', args.memberNames);
    params.append('memberIds', args.memberIds);
    params.append('deputyleaderIds', args.deputyleaderIds);
    params.append('deputyleaderNames', args.deputyleaderNames);
    params.append('gradeIds', args.gradeIds);
    params.append('gradeNames', args.gradeNames);
    params.append('leaderIds', args.leaderIds);
    params.append('leaderNames', args.leaderNames);
    params.append('pid', args.pid);
    params.append('subjectId', args.subjectId);
    params.append('subjectName', args.subjectName);
    params.append('tmgName', args.tmgName);

    return fetch({
        url: 'teachingResearch/add',
        method: 'POST',
        data: params
    });
}
// 修改
export function teachingResearchUpdate(args) {
    let params = new URLSearchParams();
    params.append('memberNames', args.memberNames);
    params.append('memberIds', args.memberIds);
    params.append('deputyleaderIds', args.deputyleaderIds);
    params.append('deputyleaderNames', args.deputyleaderNames);
    params.append('gradeIds', args.gradeIds);
    params.append('gradeNames', args.gradeNames);
    params.append('leaderIds', args.leaderIds);
    params.append('leaderNames', args.leaderNames);
    params.append('id', args.id);
    params.append('subjectId', args.subjectId);
    params.append('subjectName', args.subjectName);
    params.append('tmgName', args.tmgName);

    return fetch({
        url: 'teachingResearch/update',
        method: 'POST',
        data: params
    });
}
