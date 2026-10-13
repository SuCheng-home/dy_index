import {systemFetch} from "../../utils/fetch";
// 初始化集团校组织架构
export function intAreaOrg() {

    return systemFetch({
        url: 'groupSchool/address/intAreaOrg',
        method: 'GET'
    });
}

// 根据部门id获取用户和子级部门列表
export function queryByDepartId(args) {
    const params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('userTypes', args.userTypes || '1,3,5,6');

    return systemFetch({
        url: 'groupSchool/address/queryByDepartId',
        method: 'GET',
        params
    });
}

// 根据常用组id获取用户列表
export function queryByGroupId(args) {
    const params = new URLSearchParams();
    params.append('groupId', args.groupId);

    return systemFetch({
        url: 'groupSchool/address/queryByGroupId',
        method: 'GET',
        params
    });
}

// 检索用户
export function retrievalUsers(args) {
    const params = new URLSearchParams();
    params.append('condition', args.condition);
    params.append('excludeUserIdsStr', args.excludeUserIdsStr);
    params.append('userTypes', '1,3,5,6');

    return systemFetch({
        url: 'groupSchool/address/retrievalUsers',
        method: 'GET',
        params
    });
}

// 分页获得部门下用户
export function queryUserListBySchoolId(args) {
    const params = new URLSearchParams();
    params.append('filterStatus', args.filterStatus);
    params.append('id', args.id);
    params.append('isIncludeChild', args.isIncludeChild);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolId', args.schoolId);
    params.append('searchVal', args.searchVal);
    params.append('type', args.type);

    return systemFetch({
        url: 'groupSchool/school/queryUserListBySchoolId',
        method: 'GET',
        params
    });
}

// 集团校用户详情
export function queryUserDetail(userId,userType,convertConstant){
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('userType', userType);
    params.append('convertConstant', convertConstant);
    return systemFetch({
        url: 'groupSchool/school/queryUserDetail',
        method: 'post',
        data: params
    });
}

// 集团校查询父母信息
export function queryParentByChildId(args){
    let params = new URLSearchParams();
    params.append('childId', args.childId);

    return systemFetch({
        url: 'groupSchool/school/queryParentByChildId',
        method: 'get',
        params
    });
}

// 集团校组织架构
export function queryGroupSchoolTree(){

    return systemFetch({
        url: 'groupSchool/school/queryGroupSchoolTree',
        method: 'get'
    });
}

// 集团校部门 ztree格式
export function queryDepartsBySchoolId(args){
    let params = new URLSearchParams();
    params.append('pid', args.pid);
    params.append('schoolId', args.schoolId);

    return systemFetch({
        url: 'groupSchool/school/queryDepartsBySchoolId',
        method: 'get',
        params
    });
}

// 集团校查询用户角色
export function queryRoleAndModuleBySchoolId(args){
    let params = new URLSearchParams();
    params.append('schoolId', args.schoolId);
    params.append('source', args.source);
    params.append('userId', args.userId);

    return systemFetch({
        url: 'groupSchool/school/queryRoleAndModuleBySchoolId',
        method: 'get',
        params
    });
}
