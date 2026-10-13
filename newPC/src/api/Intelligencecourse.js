import fetch from '@/utils/fetch';
import {getAxiosService} from '@/utils/fetch';
const longFetch = getAxiosService({
    timeout: 300000
});

//获取排课系统列表
export function systemScheduleList(schoolId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    return longFetch({
        url: 'structure/classSchedule/systemScheduleList',
        method: 'get',
        params
    });
}
//同步课程表
export function syncSchedule(TSJWID) {
    let params = new URLSearchParams();
    params.append('TSJWID', TSJWID);
    return longFetch({
        url: 'structure/classSchedule/syncSchedule',
        method: 'get',
        params
    });
}
//创建课表并推送基础数据给排课系统
export function systemSourceDataPost(schoolId,scheduleName) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    params.append('scheduleName', scheduleName);
    return longFetch({
        url: 'structure/classSchedule/systemSourceDataPost',
        method: 'post',
        params:params
    });
}
//获取排课系统设置
export function getSystemSetBySchoolId(schoolId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    return fetch({
        url: 'structure/classSchedule/getSystemSetBySchoolId',
        method: 'get',
        params
    });
}
//保存排课系统设置
export function saveSystemSet(schoolId,systemAdminLoginId,systemKey) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    params.append('systemAdminLoginId', systemAdminLoginId);
    params.append('systemKey', systemKey);
    return fetch({
        url: 'structure/classSchedule/saveSystemSet',
        method: 'post',
        params: params
    });
}
//删除排课系统课表
export function deleteSchedule(TSJWID) {
    let params = new URLSearchParams();
    params.append('TSJWID', TSJWID);
    return longFetch({
        url: 'structure/classSchedule/deleteSchedule',
        method: 'get',
        params
    });
}
