import fetch from '@/utils/fetch';

/**
 * 护导统计--按天
 */
export function getGuideStaticsDataByDay(searchDay) {
    let params = new URLSearchParams();
    params.append('searchDay', searchDay);

    return fetch({
        url: 'structure/guide/getGuideStaticsDataByDay',
        method: 'GET',
        params
    });
}

/**
 * 护导统计--按周
 * */
export function getGuideStaticsDataByWeek(args) {
    let params = new URLSearchParams();
    params.append("schoolTimeId", args.schoolTimeId);
    params.append("weekNo", args.weekNo);

    return fetch({
        url: 'structure/guide/getGuideStaticsDataByWeek',
        method: 'GET',
        params
    });
}
export function getSeveralWeekListBySchoolTimeIdContainHoliday(schoolTimeId) {
    let params = new URLSearchParams();
    params.append("schoolTimeId", schoolTimeId);
    return fetch({
        url: 'structure/schoolTime/getSeveralWeekListBySchoolTimeIdContainHoliday',
        method: 'GET',
        params
    });
}


/**
 * 获得学期周次下的护导日期列表
 * */
export function getGuideDayNoList(args) {
    let params = new URLSearchParams();
    params.append("schoolTimeId", args.schoolTimeId);
    params.append("weekNo", args.weekNo);

    return fetch({
        url: 'structure/guide/getGuideDayNoList',
        method: 'GET',
        params
    });
}

/**
 * 护导统计--按类型
 * */
export function getGuideStaticsDataByType(args) {
    let params = new URLSearchParams();
    params.append("endTime", args.endTime);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("startTime", args.startTime);
    params.append("state", args.state);

    return fetch({
        url: 'structure/guide/getGuideStaticsDataByType',
        method: 'GET',
        params
    });
}

/**
 * 护导统计--按教师
 * */
export function getGuideStaticsDataByTeacher(args) {
    let params = new URLSearchParams();
    params.append("endTime", args.endTime);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("startTime", args.startTime);

    return fetch({
        url: 'structure/guide/getGuideStaticsDataByTeacher',
        timeout: 60000,
        method: 'GET',
        params
    });
}

/**
 * 根据周几获得具体的护导详细信息
 * */
export function getManagerGuideRecordsByWeek(args) {
    let params = new URLSearchParams();
    params.append("guideId", args.guideId);
    params.append("manageUserId", args.manageUserId);
    params.append("schoolTimeId", args.schoolTimeId);
    params.append("weekId", args.weekId);
    params.append("weekNumber", args.weekNumber);

    return fetch({
        url: 'structure/guide/getManagerGuideRecordsByWeek',
        method: 'GET',
        params
    });
}
