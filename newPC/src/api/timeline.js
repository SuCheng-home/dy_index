import fetch from '@/utils/fetch';

// 查看作息时间设置(当前学期)
export function findNodeLevelList2() {
    return fetch({
        url: 'structure/nodeLevel2/findNodeLevelList2',
        method: 'GET'
    });
}

// 学校课程表设置
export function classScheduleSet(args) {
    let params = new URLSearchParams();
    params.append('schoolId', args.schoolId);

    return fetch({
        url: 'structure/classSchedule/classScheduleSet',
        method: 'GET',
        params
    });
}

// 新增or修改作息时间设置
export function addNodeLevel2(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/nodeLevel2/addNodeLevel2',
        method: 'POST',
        data:JSON.stringify(args)
    });
}

// 清空节次信息
export function deleteNodeLevel2() {

    return fetch({
        url: 'structure/nodeLevel2/deleteNodeLevel2',
        method: 'POST'
    });
}

// copy新增模板设置
export function copyScheduleTemplate(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/scheduleTime/copyScheduleTemplate',
        method: 'GET',
        params
    });
}

// 新增or修改作息时间模板
export function addScheduleTemplate(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/scheduleTime/addScheduleTemplate',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//查询模板列表
export function listTemplateBySchoolId() {

    return fetch({
        url: 'structure/scheduleTime/listTemplateBySchoolId',
        method: 'GET'
    });
}

export function listTemplateBySchoolIdLastSchTime() {

    return fetch({
        url: 'structure/scheduleTime/listTemplateBySchoolIdLastSchTime',
        method: 'GET'
    });
}

// 删除模板
export function deleteScheduleTemplate(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/scheduleTime/deleteScheduleTemplate',
        method: 'GET',
        params
    });
}
