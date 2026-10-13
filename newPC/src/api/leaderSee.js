import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';

// 查询模块统计图片分析
export function getModuleEcharts(args) {
    const params = new URLSearchParams();
    return fetch({
        url: 'structure/leaderStatistics/getModuleEcharts',
        method: 'POST',
        params
    });
}

// 获取当日考勤数据
export function getSchoolLog(args) {
    const params = new URLSearchParams();
    return fetch({
        url: 'structure/leaderStatistics/getSchoolLog',
        method: 'POST',
        params
    });
}

// 获取请假及报修数据
export function getModuleDataStatisticsInfo(args) {
    const params = new URLSearchParams();
    return fetch({
        url: 'structure/leaderStatistics/getModuleDataStatisticsInfo',
        method: 'POST',
        params
    });
}

// 未关注学生 未关注老师
export function noAttendUserList(args) {
    const params = new URLSearchParams();
    params.append('userType', args.userType);
    return fetch({
        url: 'structure/leaderStatistics/noAttendUserList',
        method: 'POST',
        params
    });
}

// 用户统计
export function userIndex(args) {
    const params = new URLSearchParams();
    return fetch({
        url: 'structure/leaderStatistics/userIndex',
        method: 'POST',
        params
    });
}

// V获取今天教师停伙次数以及学生停课间餐以及午餐次数统计
export function fireCountAnalysis() {
    return fetch({
        url: 'structure/fire/fireCountAnalysis',
        method: 'GET'
    });
}

// 当前学校,某天的到勤人数
export function getArriveStuCount(args) {
    const params = new URLSearchParams();
    params.append('transferDate', args.transferDate);

    return fetch({
        url: 'structure/stuTransfer/getArriveStuCount',
        method: 'GET',
        params
    });
}

// 根据学校id,日期查询老师到勤人数
export function getCheckWorkUserCount(args) {
    const params = new URLSearchParams();
    params.append('searchDate', args.searchDate);

    return fetch({
        url: 'structure/checkWork/getCheckWorkUserCount',
        method: 'GET',
        params
    });
}

// 统计列表(学生考勤)
export function getStuTransferRecordList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('stuName', args.stuName);

    return fetch({
        url: 'structure/stuTransfer/findStuTransferRecordListByModel2',
        method: 'GET',
        params
    });
}

/**
 * 查询用户所负责的部门列表
 */
export function getDepartListByUserId() {
    return systemFetch({
        url: 'api/depart/getDepartListByUserId?type=4&containsParent=true',
        method: 'get',
    });
}
