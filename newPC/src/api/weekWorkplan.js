import fetch from '@/utils/fetch';

//查询学校所有学期列表
export function getSchoolTimeAllList() {
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'POST'
    });
}
//查询审核设置
export function queryReviewSetting() {
    return fetch({
        url: 'weeklyWorkplan/simple/queryReviewSetting',
        method: 'get'
    });
}
//获取周工作计划列表
export function listWeeklyPlan(termId) {
    return fetch({
        url: 'weeklyWorkplan/simple/listWeeklyPlan?termId='+termId,
        method: 'get'
    });
}
//获取下周周次和下周周一到周日日期
export function getWeeks() {
    return fetch({
        url: 'weeklyWorkplan/simple/getWeeks',
        method: 'get'
    });
}
//周工作计划详情
export function detailWeeklyWorkPlan(reportId) {
    return fetch({
        url: 'weeklyWorkplan/simple/detailWeeklyWorkPlan?reportId='+reportId,
        method: 'get'
    });
}
//删除周工作计划
export function deleteWeeklyWorkPlan(reportId) {
    return fetch({
        url: 'weeklyWorkplan/simple/deleteWeeklyWorkPlan?reportId='+reportId,
        method: 'get'
    });
}
//根据周次获取日期范围
export function getWeekDate(weekId) {
    return fetch({
        url: 'weeklyWorkplan/simple/getWeekDate?weekId='+weekId,
        method: 'get'
    });
}
//保存修改
export function updateSubmitted(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'weeklyWorkplan/simple/updateSubmitted',
        method: 'post',
        data: JSON.stringify(query)
    });

}
//保存修改
export function saveWeeklyWorkPlan(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'weeklyWorkplan/simple/saveWeeklyWorkPlan',
        method: 'post',
        data: JSON.stringify(query)
    });

}
//根据周次获取日期范围
export function detailByWeekId(weekId,currentTermId) {
    return fetch({
        url: 'weeklyWorkplan/simple/detailByWeekId?weekId='+weekId+'&currentTermId='+currentTermId,
        method: 'get'
    });
}
//核设置
export function udapteReviewSetting(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.id);
    params.append('reviewUsers', listQuery.reviewUsers);
    params.append('status', listQuery.status);
  
    return fetch({
        url: 'weeklyWorkplan/simple/udapteReviewSetting',
        method: 'post',
        data: params
    });

}