import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
//教师获取课程表
export function teacherClassScheduleList() {
    return fetch({
        url: 'structure/classSchedule/teacherClassScheduleList',
        method: 'GET'
    });
}
//复制上学期课程表
export function copyTermClassSchedule() {
    return fetch({
        url: 'structure/classSchedule/copyTermClassSchedule',
        method: 'GET'
    });
}
//刷新当前学期课程表课程名称
export function refreshClassScheduleCurr() {
    return fetch({
        url: 'structure/classSchedule/refreshClassScheduleCurr',
        method: 'GET'
    });
}
//学校获取课程表
export function schoolClassSchedule() {
    return fetch({
        url: 'structure/classSchedule/schoolClassSchedule',
        method: 'GET'
    });
}
//根据id(学期周次)获取课程表详情
export function classScheduleDetails(id) {
    let params = new URLSearchParams();
    params.append("id", id);
    return fetch({
        url: 'structure/classSchedule/classScheduleDetails',
        method: 'GET',
        params
    });
}
//根据id(学期周次)获取课程表详情
export function classScheduleDetailsWeek(id, week) {
    let params = new URLSearchParams();
    params.append("id", id);
    params.append("week", week);
    return fetch({
        url: 'structure/classSchedule/classScheduleDetailsWeek',
        method: 'GET',
        params
    });
}
//删除课程表
export function deleteClassSchedule(ids) {
    let params = new URLSearchParams();
    params.append("ids", ids);
    return fetch({
        url: 'structure/classSchedule/deleteClassSchedule',
        method: 'GET',
        params
    });
}
//根据条件查询用户列表
export function listUsersByType() {
    let params = new URLSearchParams();
    params.append('userType', 1);
    return systemFetch({
        url: 'api/user/listUsersByType',
        method: 'get',
        params
    });
}
//根据教师id获取教师课程表
export function userClassScheduleDetails(userId) {
    let params = new URLSearchParams();
    params.append("userId", userId);
    return fetch({
        url: 'structure/classSchedule/userClassScheduleDetails',
        method: 'GET',
        params
    });
}
//根据教师id获取教师课程表
export function userClassScheduleDetailsWeek(userId, week) {
    let params = new URLSearchParams();
    params.append("userId", userId);
    params.append("week", week);
    return fetch({
        url: 'structure/classSchedule/userClassScheduleDetailsWeek',
        method: 'GET',
        params
    });
}
//根据教师id获取教师课程表
export function getWxfileInfoSchool(schoolId) {
    let params = new URLSearchParams();
    params.append("schoolId", schoolId);
    return fetch({
        url: 'structure/wxfileInfo/getWxfileInfoSchool',
        method: 'GET',
        params
    });
}
//学校课程表设置
export function classScheduleSet(schoolId) {
    let params = new URLSearchParams();
    params.append("schoolId", schoolId);
    return fetch({
        url: 'structure/classSchedule/classScheduleSet',
        method: 'GET',
        params
    });
}
//新增或编辑课程表设置
export function insertOrUpdateClassScheduleSet(args) {
    let params = new URLSearchParams();
    params.append("afternoon", args.afternoon);
    params.append("forenoon", args.forenoon);
    params.append("morning", args.morning);
    params.append("night", args.night);
    params.append("noon", args.noon);
    params.append("schoolId", args.schoolId);
    params.append("singleDouble", args.singleDouble);
        params.append("weekDayCount", args.weekDayCount);
    return fetch({
        url: 'structure/classSchedule/insertOrUpdateClassScheduleSet',
        method: 'post',
        data: params
    });
}
//获得班级列表
export function querySchoolClass() {
    return systemFetch({
        url: 'api/depart/querySchoolClass',
        method: 'get'
    });
}

//根据班级ID获得所教这个班级的老师和课程
export function queryTeacherCourseByClassId(classId) {
    let params = new URLSearchParams();
    params.append('classId', classId);
    return systemFetch({
        url: 'api/teacherClass/queryTeacherCourseByClassId',
        method: 'get',
        params
    });
}
//创建课程表
export function insertClassSchedule(args) {
    let params = new URLSearchParams();
    params.append("currSchedule", args.currSchedule);
    params.append("departId", args.departId);
    params.append("schoolId", args.schoolId);
    return fetch({
        url: 'structure/classSchedule/insertClassSchedule',
        method: 'post',
        data: params
    });
}
//编辑课程表
export function updateClassSchedule(args) {
    let params = new URLSearchParams();
    params.append("currSchedule", args.currSchedule);
    params.append("departId", args.departId);
    params.append("schoolId", args.schoolId);
    params.append("id", args.id);
    return fetch({
        url: 'structure/classSchedule/updateClassSchedule',
        method: 'post',
        data: params
    });
}
//根据id获取课程表详情
export function classScheduleDetailsById(id) {
    let params = new URLSearchParams();
    params.append("id", id);
    return fetch({
        url: 'structure/classSchedule/classScheduleDetailsById',
        method: 'GET',
        params
    });
}
//判断是否指定部门负责人
export function isManager(departId, userId) {
    let params = new URLSearchParams();
    params.append('departId', departId);
    params.append('userId', userId);
    return systemFetch({
        url: 'api/depart/isManager',
        method: 'get',
        params
    });
}

//删除该教师当前学期的课表
export function deleteTeacherScheduleBySchoolTimeId(teacherId) {
    let params = new URLSearchParams();
    params.append("teacherId", teacherId);
    return fetch({
        url: 'structure/classSchedule/deleteTeacherScheduleBySchoolTimeId',
        method: 'GET',
        params
    });
}
//查询学校所有学期列表
export function getSchoolTimeAllList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'GET',
        params
    })
}
//根据schoolTimeId获取学期的周次
export function getSeveralWeekListBySchoolTImeId(schoolTimeId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    return fetch({
        url: 'structure/schoolTime/getSeveralWeekListBySchoolTImeId',
        method: 'get',
        params
    });
}
//查询全校课程表信息2023-06-28
export function getClassScheduleDetailsBySchIdAndWeek2(week) {
    let params = new URLSearchParams();
    params.append("week", week);
    return fetch({
        url: 'structure/classSchedule/getClassScheduleDetailsBySchIdAndWeek2',
        timeout: 300000,
        method: 'GET',
        params
    });
}


//根据学期id,开始日期、结束日期查询老师课统计
export function getClassScheduleTeacherStaticList(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("schoolTimeId", args.schoolTimeId);
    params.append("startDate", args.startDate);
    params.append("currId", args.currId);
    return fetch({
        url: 'structure/classSchedule/getClassScheduleTeacherStaticList',
        method: 'post',
        data: params
    });
}
//根据学期id,开始日期、结束日期查询老师课统计
export function getClassScheduleTeacherStaticListWeek(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("schoolTimeId", args.schoolTimeId);
    params.append("startDate", args.startDate);
    params.append("currId", args.currId);
    return fetch({
        url: 'structure/classSchedule/getClassScheduleTeacherStaticListWeek',
        method: 'get',
        params
    });
}
//模版课程表复制到执行课程表中
export function copyClassScheduleCurrWeek(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        timeout: 300000,
        url: 'structure/classSchedule/copyClassScheduleCurrWeek',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//新增停课记录
export function addClassScheduleStop(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        timeout: 300000,
        url: 'structure/classSchedule/addClassScheduleStop',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function getClassScheduleStopDeails(stopId) {
    let params = new URLSearchParams();
    params.append('stopId', stopId);
    return fetch({
        url: 'structure/classSchedule/getClassScheduleStopDeails',
        method: 'get',
        params
    });
}
export function delClassScheduleStop(stopId) {
    let params = new URLSearchParams();
    params.append('stopId', stopId);
    return fetch({
        url: 'structure/classSchedule/delClassScheduleStop',
        method: 'get',
        params
    });
}
//根据学期id,开始日期、结束日期查询老师课统计
export function getClassScheduleStopList(args) {
    let params = new URLSearchParams();
    params.append("reason", args.reason);
    params.append("schoolTimeId", args.schoolTimeId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    return fetch({
        url: 'structure/classSchedule/getClassScheduleStopList',
        method: 'get',
        timeout: 300000,
        params
    });
}
