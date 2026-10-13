import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

export function getSchoolYear() {

    return fetch({
        url: 'common/schoolYear/getSchoolYear',
        method: 'post'
    });
}
export function getCurrentSchoolTimeBySchoolId() {

    return fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'get'
    });
}

export function possessRole(ConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId', ConstantId);
    return fetch({
        url: 'userRole/possessRole',
        method: 'POST',
        params
    });
}

/**
 * 宿舍楼
 */
/**
 * 删除宿舍楼
 */
export function delDormBuilding(id) {
    let params = new URLSearchParams();
    params.append('id', id);

    return fetch({
        url: 'structure/dormManage/delDormBuilding',
        method: 'post',
        data: params
    });
}

/**
 * 新增宿舍楼
 */
export function addDormBuilding(args) {
    let params = new URLSearchParams();
    params.append('floorNum', args.floorNum);
    params.append('managerJson', args.managerJson);
    params.append('managerMobile', args.managerMobile);
    params.append('name', args.name);

    return fetch({
        url: 'structure/dormManage/addDormBuilding',
        method: 'post',
        data: params
    });
}

/**
 * 编辑宿舍楼
 */
export function editDormBuilding(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    params.append('managerJson', args.managerJson);
    params.append('managerMobile', args.managerMobile);
    params.append('name', args.name);

    return fetch({
        url: 'structure/dormManage/editDormBuilding',
        method: 'post',
        data: params
    });
}

/**
 * 获得学校宿舍楼列表
 */
export function getSchoolDormBuildingList() {

    return fetch({
        url: 'structure/dormManage/getSchoolDormBuildingList',
        method: 'post'
    });
}

/**
 * 获得宿舍楼班级列表
 */
export function getDormBuildingClassList(buildId) {
    let params = new URLSearchParams();
    params.append('buildId', buildId);

    return fetch({
        url: 'structure/dormManage/getDormBuildingClassList',
        method: 'post',
        data: params
    });
}

/**
 * 获得宿舍楼详细信息
 */
export function getDormBuildingInfo(id) {
    let params = new URLSearchParams();
    params.append('id', id);

    return fetch({
        url: 'structure/dormManage/getDormBuildingInfo',
        method: 'post',
        data: params
    });
}

/**
 * 获得用户负责的宿舍楼列表
 */
export function getUserManageDormBuildingList() {

    return fetch({
        url: 'structure/dormManage/getUserManageDormBuildingList',
        method: 'post'
    });
}

/**
 * 宿舍
 */
/**
 * 删除宿舍
 */
export function delDorm(id) {
    let params = new URLSearchParams();
    params.append('id', id);

    return fetch({
        url: 'structure/dormManage/delDorm',
        method: 'post',
        data: params
    });
}

/**
 * 宿舍入住统计
 */
export function getDormStaticsData(args) {
    let params = new URLSearchParams();
    params.append('buildId', args.buildId);
    params.append('classIds', args.classIds);
    params.append('liveNum', args.liveNum);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('type', args.type);

    return fetch({
        url: 'structure/dormManage/getDormStaticsData',
        method: 'post',
        data: params
    });
}

/**
 * 新增宿舍
 */
export function addDorm(args) {
    let params = new URLSearchParams();
    params.append('bedNum', args.bedNum);
    params.append('buildId', args.buildId);
    params.append('classJson', args.classJson);
    params.append('dormImage', args.dormImage);
    params.append('floorNo', args.floorNo);
    params.append('name', args.name);
    params.append('orderNo', args.orderNo);
    params.append('type', args.type);

    return fetch({
        url: 'structure/dormManage/addDorm',
        method: 'post',
        data: params
    });
}

/**
 * 根据宿舍楼ID和班级ID获得宿舍列表
 */
export function getDormListByClassIdAndBuildId(args) {
    let params = new URLSearchParams();
    params.append('buildId', args.buildId);
    params.append('classIds', args.classIds);

    return fetch({
        url: 'structure/dormManage/getDormListByClassIdAndBuildId',
        method: 'post',
        data: params
    });
}

/**
 * 编辑宿舍
 */
export function editDorm(args) {
    let params = new URLSearchParams();
    params.append('classJson', args.classJson);
    params.append('classNames', args.classNames);
    params.append('dormImage', args.dormImage);
    params.append('id', args.id);
    params.append('name', args.name);
    params.append('orderNo', args.orderNo);
    params.append('type', args.type);

    return fetch({
        url: 'structure/dormManage/editDorm',
        method: 'post',
        data: params
    });
}

/**
 * 获得宿舍列表
 */
export function getDormList(args) {
    let params = new URLSearchParams();
    params.append('buildId', args.buildId);
    params.append('floorNo', args.floorNo);

    return fetch({
        url: 'structure/dormManage/getDormList',
        method: 'post',
        data: params
    });
}

/**
 * 获得宿舍详细信息
 */
export function getDormInfo(id) {
    let params = new URLSearchParams();
    params.append('id', id);

    return fetch({
        url: 'structure/dormManage/getDormInfo',
        method: 'post',
        data: params
    });
}

/**
 * 宿舍学生
 */
/**
 * 删除宿舍学生
 */
export function delDormStu(id) {
    let params = new URLSearchParams();
    params.append('id', id);

    return fetch({
        url: 'structure/dormManage/delDormStu',
        method: 'post',
        data: params
    });
}

/**
 * 新增宿舍学生
 */
export function addDormStu(args) {
    let params = new URLSearchParams();
    params.append('bedNo', args.bedNo);
    params.append('buildId', args.buildId);
    params.append('dormId', args.dormId);
    params.append('stuId', args.stuId);

    return fetch({
        url: 'structure/dormManage/addDormStu',
        method: 'post',
        data: params
    });
}

/**
 * 根据宿舍ID查询未安排宿舍的班级学生列表
 */
export function getNoDormStuList(dormId) {
    let params = new URLSearchParams();
    params.append('dormId', dormId);

    return fetch({
        url: 'structure/dormManage/getNoDormStuList',
        method: 'post',
        data: params
    });
}

/**
 * 获得学生宿舍信息
 */
export function getStuDormInfo(stuId) {
    let params = new URLSearchParams();
    params.append('stuId', stuId);

    return fetch({
        url: 'structure/dormManage/getStuDormInfo',
        method: 'post',
        data: params
    });
}

/**
 * 获得宿舍学生列表
 */
export function getDormStuList(dormId) {
    let params = new URLSearchParams();
    params.append('dormId', dormId);

    return fetch({
        url: 'structure/dormManage/getDormStuList',
        method: 'post',
        data: params
    });
}

/**
 * 重置宿舍楼宿舍学生
 */
export function clearBuildDormStu(buildId) {
    let params = new URLSearchParams();
    params.append('buildId', buildId);

    return fetch({
        url: 'structure/dormManage/clearBuildDormStu',
        method: 'post',
        data: params
    });
}

/**
 * 进出记录
 */
/**
 * 宿舍进出记录
 */
export function getDormInOutPageList(args) {
    let params = new URLSearchParams();
    params.append('buildId', args.buildId);
    params.append('classId', args.classId);
    params.append('dormId', args.dormId);
    params.append('endDate', args.endDate);
    params.append('schoolYearId', args.schoolYearId);
    params.append('startDate', args.startDate);
    params.append('userName', args.userName);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return fetch({
        url: 'structure/dormManage/getDormInOutPageList',
        method: 'post',
        data: params
    });
}

/**
 * 归寝预警
 */
/**
 * 获得学校归寝预警设置信息
 */
export function getSchoolDormWarnSetInfo() {

    return fetch({
        url: 'structure/dormManage/getSchoolDormWarnSetInfo',
        method: 'post'
    });
}

/**
 * 保存归寝预警设置
 */
export function saveDormWarnSet(args) {
    let params = new URLSearchParams();
    params.append('isWarn', args.isWarn);
    params.append('sendOtherUsers', args.sendOtherUsers);
    params.append('sendUserTypes', args.sendUserTypes);
    params.append('sendWeek', args.sendWeek);
    params.append('warnTimeJson', args.warnTimeJson);

    return fetch({
        url: 'structure/dormManage/saveDormWarnSet',
        method: 'post',
        data: params
    });
}
