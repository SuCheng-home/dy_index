import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
//获取套餐库套餐列表
export function getMealSetBySchoolId() {
    return fetch({
        url: 'structure/meal/getMealSetBySchoolId',
        method: 'get'
    });
}
//删除套餐
export function deleteMealSet(mealSetId) {
    let params = new URLSearchParams();
    params.append('mealSetId', mealSetId);
    return fetch({
        url: 'structure/meal/deleteMealSet',
        method: 'get',
        params
    });
}
//新增套餐
export function insertMealSet(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/meal/insertMealSet',
        method: 'POST',
        data: JSON.stringify(query)
    });
}
//新增套餐
export function editMealSet(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/meal/editMealSet',
        method: 'POST',
        data: JSON.stringify(query)
    });
}
//获取套餐详情
export function getMealSetInfo(mealSetId) {
    let params = new URLSearchParams();
    params.append('mealSetId', mealSetId);
    return fetch({
        url: 'structure/meal/getMealSetInfo',
        method: 'get',
        params
    });
}
//查询周次列表
export function getSeveralWeekList() {
    return fetch({
        url: 'structure/schoolTime/getSeveralWeekList',
        method: 'get'
    });
}
//新增或发布食谱
export function insertMealMenu(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/meal/insertMealMenu',
        method: 'POST',
        data: JSON.stringify(query)
    });
}
//编辑或发布食谱
export function editMealMenu(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/meal/editMealMenu',
        method: 'POST',
        data: JSON.stringify(query)
    });
}
//发布食谱
export function publishMealMenu(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/meal/publishMealMenu',
        method: 'POST',
        data: JSON.stringify(query)
    });
}
//根据食谱id获取详情
export function getMealMenuInfo(mealMenuId) {
    let params = new URLSearchParams();
    params.append('mealMenuId', mealMenuId);
    return fetch({
        url: 'structure/meal/getMealMenuInfo',
        method: 'get',
        params
    });
}
//删除食谱
export function deleteMealMenu(mealMenuId) {
    let params = new URLSearchParams();
    params.append('mealMenuId', mealMenuId);
    return fetch({
        url: 'structure/meal/deleteMealMenu',
        method: 'get',
        params
    });
}
//分页获取食谱
export function queryMealMenu(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('schoolTimeId', query.schoolTimeId);
    return fetch({
        url: 'structure/meal/queryMealMenu',
        method: 'get',
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
//分页获取食谱
export function queryTeacherOrderSetByMenuId(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('mealMenuId', query.mealMenuId);
    params.append('setType', query.setType);
    params.append('weekDay', query.weekDay);
    return fetch({
        url: 'structure/meal/queryTeacherOrderSetByMenuId',
        method: 'get',
        params
    });
}
//分页获取学生周食谱订餐统计
export function queryStuOrderSetByMenuId(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('mealMenuId', query.mealMenuId);
    params.append('setType', query.setType);
    params.append('weekDay', query.weekDay);
    params.append('classId', query.classId);
    params.append('gradeId', query.gradeId);
    return fetch({
        url: 'structure/meal/queryStuOrderSetByMenuId',
        method: 'get',
        params
    });
}
/**
 * 获得年级列表
 * **/
export function querySchoolGrade() {
    return systemFetch({
        url: 'api/depart/querySchoolGrade',
        method: 'get'
    });
}
//获得班级列表
export function queryClassByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return systemFetch({
        url: 'api/depart/queryClassByGradeId',
        method: 'get',
        params
    });
}
//获取周食谱菜品以及评价
export function getMealMenuFoodAndAppraise(mealMenuId) {
    let params = new URLSearchParams();
    params.append('mealMenuId', mealMenuId);
    return fetch({
        url: 'structure/meal/getMealMenuFoodAndAppraise',
        method: 'get',
        params
    });
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
//根据学校id和学期id获取年级列表
export function getGradeByTermId(schoolId, termId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    params.append('termId', termId);
    return fetch({
        url: 'structure/termClass/getGradeByTermId',
        method: 'get',
        params
    });
}
//根据学校id，学期id，年级id获取班级列表
export function getClassByGradeId(schoolId, termId, gradeId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    params.append('termId', termId);
    params.append('gradeId', gradeId);
    return fetch({
        url: 'structure/termClass/getClassByGradeId',
        method: 'get',
        params
    });
}
//根据学期id, 用户id查询历史班主任
export function queryClassManagerListByTermIdAndUid(termId) {
    let params = new URLSearchParams();
    params.append('termId', termId);
    return fetch({
        url: 'structure/termClass/queryClassManagerListByTermIdAndUid',
        method: 'get',
        params
    });
}
//分页获取学生订餐统计
export function queryStuOrderAnalysis(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('setType', query.setType);
    params.append('week', query.week);
    params.append('classId', query.classId);
    params.append('gradeId', query.gradeId);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/meal/queryStuOrderAnalysis',
        method: 'get',
        params
    });
}
//分页获取教师订餐统计
export function queryTeacherOrderAnalysis(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('setType', query.setType);
    params.append('week', query.week);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/meal/queryTeacherOrderAnalysis',
        method: 'get',
        params
    });
}
//食材统计
export function getOrderMaterialAnalysis(query) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('week', query.week);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/meal/getOrderMaterialAnalysis',
        method: 'get',
        params
    });
}
//菜品评价统计
export function getFoodAppraiseAnalysis(query) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('week', query.week);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/meal/getFoodAppraiseAnalysis',
        method: 'get',
        params
    });
}
//判断用户是否具备某角色
export function possessRole(roleConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', roleConstantId);
    return systemFetch({
        url: 'api/user/role/possessRole',
        method: 'GET',
        params
    });
}
//班级订餐汇总
export function classOrderAnalysis(query) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('setType', query.setType);
    params.append('week', query.week);
    params.append('gradeId', query.gradeId);
    return fetch({
        url: 'structure/meal/classOrderAnalysis',
        method: 'get',
        params
    });
}

//获取食谱年级(根据学期id和周次)
export function getMealMenuGradeByWeek(schoolTimeId, week) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);
    params.append('week', week);
    return fetch({
        url: 'structure/meal/getMealMenuGradeByWeek',
        method: 'get',
        params
    });
}
//获取食谱年级(根据食谱id)
export function getMealMenuGrade(mealMenuId) {
    let params = new URLSearchParams();
    params.append('mealMenuId', mealMenuId);
    return fetch({
        url: 'structure/meal/getMealMenuGrade',
        method: 'get',
        params
    });
}
//获取食谱年级下的班级(根据学期id和周次)
export function getMealMenuGradeClassByWeek(gradeId, schoolTimeId, week) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    params.append('schoolTimeId', schoolTimeId);
    params.append('week', week);
    return fetch({
        url: 'structure/meal/getMealMenuGradeClassByWeek',
        method: 'get',
        params
    });
}
//获取食谱年级下的班级(根据食谱id)
export function getMealMenuGradeClass(gradeId, mealMenuId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    params.append('mealMenuId', mealMenuId);
    return fetch({
        url: 'structure/meal/getMealMenuGradeClass',
        method: 'get',
        params
    });
}
//补发食谱
export function reissueMealMenu(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/meal/reissueMealMenu',
        method: 'POST',
        data: JSON.stringify(query)
    });
}
