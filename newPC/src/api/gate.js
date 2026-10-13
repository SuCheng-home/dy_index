import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
/**
 *根据条件查询通行方式列表
 */
export function findGateInfoList(query) {
    return fetch({
        url: 'structure/gateNew/findGateInfoList?endDate='+query.endDate+'&gateType='+query.gateType+'&startDate='+query.startDate+'&userName='+query.userName+'&userTypeStr='+query.userTypeStr+'&pageNo='+query.pageNo+'&pageSize='+query.pageSize+ "&gradeId="+( query.userTypeStr==2?query.gradeId:0)+ "&classId=" + (query.userTypeStr==2?query.classId:0),
        method: 'get',
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
//新增进出校时间设置
export function addStuTransferTime(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/stuTransfer/addStuTransferTime',
        method: 'post',
        data: JSON.stringify(args)
    });
}
/**
 *获得年级列表
 */
export function findStuTransferTimeList() {
    return fetch({
        url: 'structure/stuTransfer/findStuTransferTimeList',
        method: 'get',
    });
}
/**
 * 获得所教班级
 */
export function queryClass() {
    return fetch({
        url: 'teacherClass/queryClass',
        method: 'get',
    });
}
/**
 *统计列表
 */
export function findStuTransferRecordList(query) {
    return fetch({
        url: 'structure/stuTransfer/findStuTransferRecordList?endDate='+query.endDate+'&classId	='+query.classId+'&startDate='+query.startDate+'&stuNameOrTransferName='+query.stuNameOrTransferName+'&pageNo='+query.pageNo+'&pageSize='+query.pageSize,
        method: 'get',
    });
}
/**
 *查看角色
 */
export function possessRole(ConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', ConstantId);
    return fetch({
      baseURL: global.BaseNewPath,
      url: 'api/user/role/possessRole',
      method: 'POST',
      params
    });
  }
  /**
 * 获得全校班级
 */
export function querySchoolClass() {
    return fetch({
        url: 'depart/querySchoolClass',
        method: 'get',
    });
}
/**
 * 获得详情
 */
export function getStuTransferRemindSetBySchoolId() {
    return fetch({
        url: 'structure/stuTransferRemindSet/getStuTransferRemindSetBySchoolId',
        method: 'get',
    });
}
//新增or修改
export function insertOrUpdateStuTransferRemindSet(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/stuTransferRemindSet/insertOrUpdateStuTransferRemindSet',
        method: 'post',
        data: JSON.stringify(args)
    });
}

