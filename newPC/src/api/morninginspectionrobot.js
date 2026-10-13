import fetch from '@/utils/fetch';
import {systemFetch} from "@/utils/fetch";
//查询用户所负责的部门和其他负责部门副主任：如年级副主任、副班主任
export function getManageAndOtherDepart() {
    let params = new URLSearchParams();
    params.append('type', 4);
    return systemFetch({
        url: 'api/depart/getManageAndOtherDepart',
        method: 'get',
        params
    });
}
//获得班级列表
export function querySchoolClass() {
    let params = new URLSearchParams();
    params.append('isExcludNewClass', true);
    return systemFetch({
      url: 'api/depart/querySchoolClass',
      method: 'get'
    });
  }
  // 判断该用户是否为运动数据管理员
export const possessRole = () => {
    let params = new URLSearchParams();
    params.append('roleConstantId', 2022032102);
    return systemFetch({
        url: 'api/user/role/possessRole',
        method: 'GET',
        params
    });
  }

  /*根据条件查询晨检列表*/
export function getScancodeFaceRecordList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('createDate', listQuery.checkDate);
    params.append('classId', listQuery.classId);
    params.append('searchType', listQuery.searchType);
    params.append('studentName', listQuery.studentName);
    params.append('userId', 0);
    return fetch({
        url: 'structure/scancodeEquipment/getScancodeFaceRecordList',
        method: 'get',
        params
    });
}
/*根据记录id查询晨检记录*/
export function getScancodeFaceRecord(recordId) {
    let params = new URLSearchParams();
    params.append('recordId', recordId);
    return fetch({
        url: 'structure/scancodeEquipment/getScancodeFaceRecord',
        method: 'get',
        params
    });
}