import fetch from '@/utils/fetch';
import {
    homeworkfetch,
    systemFetch
} from '@/utils/fetch';

//查询学校所有学期列表
export function getSchoolTimeAllList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'GET',
        params
    })
}



/**
 * 课堂评价班级统计
 */
export function classBehEvalCurrBehTypeStuScore(classId, curriculumId, schoolTimeId, startDate, endDate, gradeId) {
    return homeworkfetch({
        url: 'structure/schoolBehavior/classBehEvalCurrBehTypeStuScore?classId=' + classId + '&curriculumId=' + curriculumId + '&schoolTimeId=' + schoolTimeId + '&gradeId=' + (gradeId || 0) + '&startDate=' + startDate + '&endDate=' + endDate,
        method: 'get',
    });
}
/**
 * 根据科目，学生id,类型查询学生考评信息
 */
export function getSchoolBehaviorStuListInfoType(behTypeId, curriculumId, schoolTimeId, studentId) {
    return homeworkfetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorStuListInfo?behTypeId=' + behTypeId + '&curriculumId=' + curriculumId + '&schoolTimeId=' + schoolTimeId + '&studentId=' + studentId,
        method: 'get',
    });
}
export function classBehaviorStuScore(query) {
    let params = new URLSearchParams();
    params.append("endDate", query.endDate);
    params.append("schoolTimeId", query.schoolTimeId);
    params.append("startDate", query.startDate);
    params.append("classId", query.classId);
    params.append("gradeId", query.gradeId);
    return homeworkfetch({
        url: 'structure/schoolBehavior/classBehaviorStuScore',
        method: 'get',
        params
    });
}
/**
 *根据开始日期及结束日期查询老师课堂评价统计
 */
export function teacherBehaviorStuScore(curriculumId, schoolTimeId, startDate, endDate) {
    return homeworkfetch({
        url: 'structure/schoolBehavior/teacherBehaviorStuScore?curriculumId=' + curriculumId + '&schoolTimeId=' + schoolTimeId + '&startDate=' + startDate + '&endDate=' + endDate,
        method: 'get',
    });
}
//获得班级列表
export function querySchoolClass() {
    let params = new URLSearchParams();
    return fetch({
        url: 'depart/querySchoolClass',
        method: 'GET',
        params
    })
}
//根据班级ID获得课程
export function queryCourseByClassIds(classId) {
    let params = new URLSearchParams();
    return fetch({
        url: 'teacherClass/queryCoursesByClassId?classId=' + classId,
        method: 'GET',
        params
    })
}
/**
 *根据班级Id和课程ID查询关联老师
 */
export function queryTeacherByClassIdAndCourseId(classId, courseId) {
    return fetch({
        url: 'teacherClass/queryTeacherByClassIdAndCourseId?classId=' + classId + '&courseId=' + courseId,
        method: 'get',
    });
}
/**
 *查询节次列表
 */
export function getsectionNoList() {
    return fetch({
        url: 'structure/schoolBehavior/getsectionNoList',
        method: 'get',
    });
}
// 根据学校id查询学校行为配置
export function getSchoolBehaviorInstallNew() {
    return fetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorInstallNew',
        method: 'get',
    });
}

/**
 *查询每个班级某天内每一个节次的评价分数
 */
export function listByCheckDateStr(checkDateStr) {
    return fetch({
        url: 'structure/classRating/listByCheckDateStr?checkDateStr=' + checkDateStr,
        method: 'get',
    });
}
/**
 *一键满分
 */
export function oneKeyFullScore(checkDateStr) {
    return fetch({
        url: 'structure/classRating/oneKeyFullScore?checkDateStr=' + checkDateStr,
        method: 'get',
    });
}
/**
 *按日期统计 -详情
 */
export function getScoreDetailById(id) {
    return fetch({
        url: 'structure/classRating/getScoreDetailById?id=' + id,
        method: 'get',
    });
}
/**
 *根据班级Id和课程ID查询关联老师
 */
export function listByDateStr(endDateStr, startDateStr) {
    return fetch({
        url: 'structure/classRating/listByDateStr?endDateStr=' + endDateStr + '&startDateStr=' + startDateStr,
        method: 'get',
    });
}
// 学校所有的周次及对应的时间
export function findSeveralWeekListBySchoolTimeId() {
    return fetch({
        url: 'structure/classRating/findSeveralWeekListBySchoolTimeId',
        method: 'get',
    });
}
/**
 *单个班级的所有检查数据
 */
export function findClassRatingRecordList(query) {
    return fetch({
        url: 'structure/classRating/findClassRatingRecordList?classId=' + query.classId + '&endTimeStr=' + query.endDate + '&startTimeStr=' + query.startDate + '&pageNo=' + query.pageNo + '&pageSize=' + query.pageSize,
        method: 'get',
    });
}
/**
 *按条件查询考勤统计
 */
export function getSchoolBehaviorStuCallAttanceList(classId, schoolTimeId, startDate, endDate) {
    return homeworkfetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorStuCallAttanceList?classId=' + classId + '&schoolTimeId=' + schoolTimeId + '&startDate=' + startDate + '&endDate=' + endDate + '&gradeId=0',
        method: 'get',
    });
}

//关联学期课程
export function queryCourseListTerm(query) {
    return systemFetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'api/teacherClass/queryCourseListTerm',
        method: 'post',
        data: JSON.stringify(query)
    });
}


export function queryTeacherCourseListTerm(query) {
    return systemFetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'api/teacherClass/queryTeacherCourseListTerm',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function delStuInitscore(studentId) {
    let params = new URLSearchParams();
    params.append("studentId", studentId);
    return homeworkfetch({
        url: 'structure/schoolBehavior/delStuInitscore',
        method: 'get',
        params
    });
}
export function getStuInitscore(studentId) {
    let params = new URLSearchParams();
    params.append("studentId", studentId);
    return homeworkfetch({
        url: 'structure/schoolBehavior/getStuInitscore',
        method: 'get',
        params
    });
}
export function getStuInitscoreList(classId) {
    let params = new URLSearchParams();
    params.append("classId", classId);
    return homeworkfetch({
        url: 'structure/schoolBehavior/getStuInitscoreList',
        method: 'get',
        params
    });
}
export function addStuInitscore(args) {
    return homeworkfetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehavior/addStuInitscore',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function initStuInitscoreList(classId) {
    let params = new URLSearchParams();
    params.append("classId", classId);
    return homeworkfetch({
        url: 'structure/schoolBehavior/initStuInitscoreList',
        method: 'get',
        params
    });
}

export function listTimeByWeekDayByDate(args) {
    return fetch({
        url: 'structure/scheduleTime/listTimeByWeekDayByDate?customize=' + args.customize + '&isBeh=' + args.isBeh + '&secrchDate=' + args.secrchDate,
        method: 'get',
    });
}