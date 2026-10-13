import fetch from '@/utils/fetchNew';
import fetchNormal from '@/utils/fetch';

/**
 * 根据id获取所在部门
 * @param {*} userId 
 * @param {*} depType 
 */
export function queryDepartByUserId(userId, depType) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('depType', depType);
    return fetch({
        url: 'api/user/depart/queryDepartByUserId',
        method: 'post',
        data: params
    });
}
export function queryDepartByUserId2(userId, depType) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('depType', depType);
    return fetchNormal({
        url: 'userDepart/queryDepartByUserId',
        method: 'post',
        params
    });
}


/**
 * 获得班级列表
 */
export function querySchoolClass(args = {isFilterNewGrade: true}) {
    let params = new URLSearchParams();
    params.append('isFilterNewGrade', args.isFilterNewGrade);

    return fetch({
        url: 'api/depart/querySchoolClass',
        method: 'post',
        data: params
    });
}

/**
 * 获得年级列表
 */
export function querySchoolGrade(args = {isFilterNewGrade: true}) {
    let params = new URLSearchParams();
    params.append('isFilterNewGrade', args.isFilterNewGrade);

    return fetch({
        url: 'api/depart/querySchoolGrade',
        method: 'post',
        data: params
    });
}

/**
 * 获得所教班级和年级(班级里包含年级信息)
 */
export function queryClassGrade() {
    return fetch({
        url: 'api/teacherClass/queryClassGrade',
        method: 'post'
    });
}
/**
 * 根据老师ID获得所教班级和所带班级
 */
export function queryAllClassCourse() {
    let params = new URLSearchParams();
    return fetch({
        url: 'api/teacherClass/queryAllClassCourse',
        method: 'post'
    });
}
/**
 * 根据年级获得课程(查询年级下的班级，老师所教这些班级的课程)
 * 
 */
export function queryCourseByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return fetch({
        url: 'api/teacherClass/queryCourseByGradeId',
        method: 'post',
        data: params
    });

}

/**
 * 根据班级ID获得课程(根据当前登录用户ID和班级ID（多个逗号分隔），查询去重后的课程)
 * @param {*} classIdsStr 
 */
export function queryCourseByClassIds(classIdsStr) {
    let params = new URLSearchParams();
    params.append('classIdsStr', classIdsStr);
    return fetch({
        url: 'api/teacherClass/queryCourseByClassIds',
        method: 'post',
        data: params
    });
}


/**
 * 查询学校所有学期列表
 */
export function getSchoolTimeAllList() {

    return fetch({
        baseURL: global.BasePath,
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'post'
    });
}



/**
 * 根据班级ID获取负责人wxcepClient1/depart/queryManager
 * @param {*} classIdsStr 
 */
export function queryManager(departId) {
    let params = new URLSearchParams();
    params.append('departId', departId);
    return fetch({
        url: 'api/depart/queryManager',
        method: 'post',
        data: params
    });
}

/**
 * 根据字典code获得字典数据
 * @param {*} dicCode 
 */
export function findDicsByCode(dicCode){
    let params = new URLSearchParams();
    params.append('dicCode', dicCode);
    return fetch({
        baseURL: global.BasePath,
        url: 'structure/sysDictionary/findDicsByCode',
        method: 'post',
        data: params
    });
}

/**
 * 根据id获取用户角色userRole/queryRoleList
 * @param {*} parentId, studentId
 */
export function queryRoleList(userId) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    return fetch({
        url: 'api/user/role/queryRoleList',
        method: 'post',
        params
    });
}

/*邀请函*/
export function invitationIndex(query){
    let params = new URLSearchParams();
    params.append('departId', query.departId);
    return fetch({
        url: 'sys/invitation/index',
        method: 'get',
        params
    });
}
/*日志管理分页查询日志*/
export function recordByType(query){
    let params = new URLSearchParams();
    params.append('begin_date', query.begin_date);
    params.append('end_date', query.end_date);
    params.append('operationName', query.operationName);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('type', query.type);
    return fetch({
        url: 'sys/operation/recordByType',
        method: 'get',
        params
    });
}
/*用户分析首页*/
export function statisticsSchool(){
    let params = new URLSearchParams();
    return fetch({
        url: 'sys/statistics/school/index',
        method: 'get'
    });
}

/*用户数据统计动态查询*/
export function getUserCount(query){
    let params = new URLSearchParams();
    params.append('days', query.days);
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'sys/statistics/school/getUserCount',
        method: 'get',
        params
    });
}

/*用户登录统计动态查询*/
export function getUserLoginCount(query){
    let params = new URLSearchParams();
    params.append('days', query.days);
    params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    return fetch({
        url: 'sys/statistics/school/getUserLoginCount',
        method: 'get',
        params
    });
}
/*模块使用总量分析*/
export function statisticsTotalListPage(query){
    let params = new URLSearchParams();
    return fetchNormal({
        url: 'modulestatistics/statisticsTotalListPage',
        method: 'get'
    });
}
/*每个模块使用分析*/
export function statisticsList(query){
    let params = new URLSearchParams();
    params.append('days', query.days);
    params.append('startDate', query.startDate);
    params.append('endDate', query.endDate);
    params.append('moduleCode', query.moduleCode);
    return fetchNormal({
        url:'modulestatistics/statisticsList',
        method: 'get',
        params
    })
}

/*学校已安装的应用列表*/
export function moduleManageIndex(query){
    let params = new URLSearchParams();
    params.append('moduleName', query.moduleName);
    return fetch({
        url: 'sys/module/index',
        method: 'get',
        params
    });
}
/*查看应用角色*/
export function roleSee(query){
    let params = new URLSearchParams();
    params.append('moduleCode', query.moduleCode);
    return fetch({
        url: 'sys/module/roleSee',
        method: 'get',
        params
    });
}
/*部门主任首页*/
export function master(query){
    let params = new URLSearchParams();
    params.append('name',query.name);
    params.append('type',query.type);
    return fetch({
        url:'sys/depart/master',
        method:'get',
        params
    })
}
/*修改部门负责人*/
export function masterUpdate(query){
    let params = new URLSearchParams();
    params.append('departId',query.departId);
    params.append('managerOtherUserIds',query.managerOtherUserIds);
    params.append('managerUserId',query.managerUserId);
    return fetch({
        url:'sys/depart/master/update',
        method:'get',
        params
    })
}
/*企业微信新家校全量同步班主任、年级主任*/
export function updateDepartManagerSyncWxDepartAdmins(query){
    let params = new URLSearchParams();
    params.append('departType', query.departType);
    return fetch({
        url:'sys/depart/master/updateDepartManagerSyncWxDepartAdmins',
        method:'get',
        params
    })
}
//根据年级ID获得班级列表
export function queryClassByGradeId(args) {
    let params = new URLSearchParams();
    params.append('gradeId', args.gradeId);
    return fetch({
        url: 'api/depart/queryClassByGradeId',
        method: 'get',
        params
    });
}
