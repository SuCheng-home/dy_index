import fetch from '@/utils/fetch';
import {
    xjlyuanFetch,
    client1Fetch,
    systemFetch
} from '@/utils/fetch';

/**
 * 学生考勤记录(总)(当天)
 */
export function statisticByClassId() {
    return fetch({
        url: '/structure/stuTransfer/statisticByClassId',
        method: 'GET',
    });
}

/**
 * 获得所教班级
 */
export function possessRole(ConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', ConstantId);
    return fetch({
        url: 'userRole/possessRole',
        method: 'POST',
        params
    });
}

/**
 * 获得年级和班级列表
 **/
export function getSchoolGradeClass() {
    let params = new URLSearchParams();

    return systemFetch({
        url: 'api/depart/querySchoolGradeClass',
        method: 'get',
        params
    });
}

/**
 * 获得班级列表
 */
export function querySchoolClass() {
    let params = new URLSearchParams();
    params.append('isExcludNewClass', true);

    return systemFetch({
        url: 'api/depart/querySchoolClass',
        method: 'GET',
        params
    });
}

/**
 * 根据老师ID获得所教班级和班主任的班级
 */
export function queryAllClassCourse(teacherId) {
    let params = new URLSearchParams();
    params.append('teacherId', teacherId);
    params.append('isExcludNewClass', true);

    return systemFetch({
        url: 'api/teacherClass/queryAllClassCourse',
        method: 'GET',
        params
    });
}

/**
 *  学生考勤明细
 */
export function findStuAttendanceList(query) {
    let params = new URLSearchParams();
    params.append('classId', query.classId);
    params.append('dateStr', query.dateStr);
    params.append('gradeId', query.gradeId);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('stuName', query.stuName);
    params.append('stateAttendance', query.stateAttendance);
    return fetch({
        url: 'structure/stuTransfer/findStuAttendanceList',
        method: 'GET',
        params
    });
}

/**
 *  统计汇总
 */
export function statisticsSummary(query) {
    let params = new URLSearchParams();
    params.append('classId', query.classId);
    params.append('endDate', query.endDate);
    params.append('gradeId', query.gradeId);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('stuName', query.stuName);

    return fetch({
        url: 'structure/stuTransfer/statisticsSummary',
        method: 'GET',
        params
    });
}
