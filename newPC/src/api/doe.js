import {systemFetch} from '@/utils/fetch';
import fetch from '@/utils/fetchNew';
// import fetchs from '@/utils/fetch';

// 获取年级列表
export function getAgeList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageSize', listQuery.pageSize);
    params.append('postcode', listQuery.postcode);
    return systemFetch({
        url:'/common/school/countActiveLogByPostcode',
        method: 'GET',
        params
    });
}

// 获取区组织架构tree
export function getSchoolList() {
    return fetch({
        url: 'edu/schoolEdu/queryDeptTreeByPostCode',
        method: 'get'
    });
}

// 根据学校的id获取对应的tree
export function getSchoolItems(schoolId) {
    let params = new URLSearchParams();
    params.append('schoolId',schoolId);
    return fetch({
        url: 'edu/schoolEdu/queryDepartsBySchoolId',
        method: 'get',
        params
    });
}
export function getUserList(listQuery) {
    let params = new URLSearchParams();
    params.append('schoolId', listQuery.id);
    params.append('pid', listQuery.pid);
    params.append('searchVal', listQuery.searchVal);
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('filterStatus', listQuery.filterStatus);
    return fetch({
        url: 'edu/schoolEdu/queryUserListBySchoolId',
        method: 'get',
        params
    });
}

// 获取详情页
export function loadTeacherDetail(listQuery) {
    let params = new URLSearchParams();
    params.append('userId', listQuery.userId);
    params.append('userType', listQuery.userType);
    return fetch({
        url: 'edu/schoolEdu/queryUserDetail',
        method: 'get',
        params
    });
}

//区组织架构详情更多接口
export function queryRoleAndModuleByUserId(query) {
    let params = new URLSearchParams();
    params.append('userId', query.userId);
    params.append('source', query.source);
    params.append('schoolId', query.schoolId);
    params.append('schoolType', query.schoolType);
    return fetch({
        url: 'edu/schoolEdu/queryRoleAndModuleBySchoolId',
        method: 'GET',
        params
    });
}


export function countSchoolByPostcodeBoe() {
    let params = new URLSearchParams();
    return fetch({
        url: 'edu/schoolStatistical/countSchoolByPostcode',
        method: 'GET',
        params
    })
}




