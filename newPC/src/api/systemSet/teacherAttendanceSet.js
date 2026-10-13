import fetch from '@/utils/fetch';

// ---------------------  考勤规则  ---------------------------
/**
 * 考勤规则列表
 */
export function queryAttendanceRuleBySchoolId() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/attendance/queryAttendanceRuleBySchoolId',
        method: 'GET',
        data: params
    });
}

/**
 * 删除考勤规则
 */
export function deleteAttendanceRule(attendanceRuleId) {
    let params = new URLSearchParams();
    params.append('attendanceRuleId', attendanceRuleId);

    return fetch({
        url: 'structure/attendance/deleteAttendanceRule',
        method: 'POST',
        data: params
    });
}

/**
 *  新增考勤规则
 */
export function insertAttendanceRule(query) {
    let params = new URLSearchParams();
    params.append('addressIds', query.addressIds);
    params.append('defaultSame', query.defaultSame);
    params.append('remindSignIn', query.remindSignIn);
    params.append('remindSignInDate', query.remindSignInDate);
    params.append('remindSignOut', query.remindSignOut);
    params.append('remindSignOutDate', query.remindSignOutDate);
    params.append('resetDate', query.resetDate);
    params.append('ruleDateListJson', query.ruleDateListJson);
    params.append('ruleName', query.ruleName);
    params.append('signInDate', query.signInDate);
    params.append('signOut', query.signOut);
    params.append('signOutDate', query.signOutDate);
    params.append('isMarkCard', query.isMarkCard);
    params.append('markCardBatchUserJson', query.markCardBatchUserJson);
    params.append('markCardBatchbType', query.markCardBatchbType);
    params.append('markCardLimit', query.markCardLimit);

    return fetch({
        url: 'structure/attendance/insertAttendanceRule',
        method: 'POST',
        data: params
    });
}

/**
 *  编辑考勤规则
 */
export function editAttendanceRule(query) {
    let params = new URLSearchParams();
    params.append('addressIds', query.addressIds);
    params.append('defaultSame', query.defaultSame);
    params.append('id', query.id);
    params.append('remindSignIn', query.remindSignIn);
    params.append('remindSignInDate', query.remindSignInDate);
    params.append('remindSignOut', query.remindSignOut);
    params.append('remindSignOutDate', query.remindSignOutDate);
    params.append('resetDate', query.resetDate);
    params.append('ruleDateListJson', query.ruleDateListJson);
    params.append('ruleName', query.ruleName);
    params.append('signInDate', query.signInDate);
    params.append('signOut', query.signOut);
    params.append('signOutDate', query.signOutDate);
    params.append('isMarkCard', query.isMarkCard);
    params.append('markCardBatchUserJson', query.markCardBatchUserJson);
    params.append('markCardBatchbType', query.markCardBatchbType);
    params.append('markCardLimit', query.markCardLimit);

    return fetch({
        url: 'structure/attendance/editAttendanceRule',
        method: 'POST',
        data: params
    });
}

/**
 * 获取考勤规则详情
 */
export function getAttendanceRuleById(attendanceRuleId) {
    let params = new URLSearchParams();
    params.append('attendanceRuleId', attendanceRuleId);

    return fetch({
        url: 'structure/attendance/getAttendanceRuleById',
        method: 'POST',
        data: params
    });
}

/**
 * 根据规则id立即生效
 */
export function rightEffectByRuleId(ruleId) {
    let params = new URLSearchParams();
    params.append('ruleId', ruleId);

    return fetch({
        url: 'structure/attendance/rightEffectByRuleId',
        method: 'POST',
        data: params
    });
}

// ---------------------  考勤用户  ---------------------------
/**
 *  获取考勤规则里的用户
 */
export function queryRuleUserByRuleId(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('ruleId', query.ruleId);
    params.append('searchName', query.searchName);

    return fetch({
        url: 'structure/attendance/queryRuleUserByRuleId',
        method: 'POST',
        data: params
    });
}

/**
 *  添加用户
 */
export function addRuleUser(query) {
    let params = new URLSearchParams();
    params.append('departIds', query.departIds);
    params.append('ruleId', query.ruleId);
    params.append('userIds', query.userIds);

    return fetch({
        url: 'structure/attendance/addRuleUser',
        method: 'POST',
        data: params
    });
}

/**
 *  根据规则里的用户立即生效
 */
export function rightEffectByRuleUserIds(query) {
    let params = new URLSearchParams();
    params.append('ruleId', query.ruleId);
    params.append('ruleUserIds', query.ruleUserIds);

    return fetch({
        url: 'structure/attendance/rightEffectByRuleUserIds',
        method: 'POST',
        data: params
    });
}

/**
 *  移除用户
 */
export function deleteRuleUserByIds(ruleUserIds) {
    let params = new URLSearchParams();
    params.append('ruleUserIds', ruleUserIds);

    return fetch({
        url: 'structure/attendance/deleteRuleUserByIds',
        method: 'POST',
        data: params
    });
}

// ---------------------  发送报告 考勤设置  ---------------------------
/**
 *  获取考勤设置
 */
export function getAttendanceSet() {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/attendance/getAttendanceSet',
        method: 'GET',
        data: params
    });
}

/**
 *  保存设置
 */
export function saveAttendanceSet(args) {
    let params = new URLSearchParams();
    params.append('pushMsg', args.pushMsg);
    params.append('pushAnalysisMsg', args.pushAnalysisMsg);
    params.append('attendanceMachine', args.attendanceMachine);

    return fetch({
        url: 'structure/attendance/saveAttendanceSet',
        method: 'POST',
        data: params
    });
}

// ---------------------  地点维护  ---------------------------
/**
 *  地点列表
 */
export function queryAttendanceAddressBySchoolId() {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/attendance/queryAttendanceAddressBySchoolId',
        method: 'GET',
        data: params
    });
}

/**
 *  新增地点
 */
export function insertAttendanceAddress(query) {
    let params = new URLSearchParams();
    params.append('address', query.address);
    params.append('addressDesc', query.addressDesc);
    params.append('lat', query.lat);
    params.append('lng', query.lng);
    params.append('rangeVal', query.rangeVal);

    return fetch({
        url: 'structure/attendance/insertAttendanceAddress',
        method: 'POST',
        data: params
    });
}

/**
 *  编辑地点
 */
export function editAttendanceAddress(query) {
    let params = new URLSearchParams();
    params.append('address', query.address);
    params.append('addressDesc', query.addressDesc);
    params.append('id', query.id);
    params.append('lat', query.lat);
    params.append('lng', query.lng);
    params.append('rangeVal', query.rangeVal);

    return fetch({
        url: 'structure/attendance/editAttendanceAddress',
        method: 'POST',
        data: params
    });
}

/**
 *  根据id删除地点
 */
export function deleteAttendanceAddress(attendanceAddressId) {
    let params = new URLSearchParams();
    params.append('attendanceAddressId', attendanceAddressId);

    return fetch({
        url: 'structure/attendance/deleteAttendanceAddress',
        method: 'POST',
        data: params
    });
}

/**
 *  根据地点id获取地点详情
 */
export function getAttendanceAddressById(attendanceAddressId) {
    let params = new URLSearchParams();
    params.append('attendanceAddressId', attendanceAddressId);

    return fetch({
        url: 'structure/attendance/getAttendanceAddressById',
        method: 'POST',
        data: params
    });
}
