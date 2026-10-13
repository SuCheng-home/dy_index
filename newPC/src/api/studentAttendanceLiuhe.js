import fetch from '@/utils/fetch';

// 删除学生考勤规则
export function delStuAttendanceRuleById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: '/structure/stuAttendance/delStuAttendanceRuleById',
        method: 'POST',
        data: params
    });
}

// 新增学生考勤规则
export function addStuAttendanceRule(args) {
    let params = new URLSearchParams();
    params.append('beginTime', args.beginTime);
    params.append('endTime', args.endTime);
    params.append('remindMaster', args.remindMaster);
    params.append('ruleName', args.ruleName);
    params.append('remindParent', args.remindParent);

    return fetch({
        url: '/structure/stuAttendance/addStuAttendanceRule',
        method: 'POST',
        data: params
    });
}

// 新增学生考勤规则
export function editStuAttendanceRule(args) {
    let params = new URLSearchParams();
    params.append('beginTime', args.beginTime);
    params.append('endTime', args.endTime);
    params.append('remindMaster', args.remindMaster);
    params.append('ruleName', args.ruleName);
    params.append('remindParent', args.remindParent);
    params.append('id', args.id);

    return fetch({
        url: '/structure/stuAttendance/editStuAttendanceRule',
        method: 'POST',
        data: params
    });
}

// 查询学校学生考勤规则列表
export function getSchoolStuAttendanceRuleList() {

    return fetch({
        url: '/structure/stuAttendance/getSchoolStuAttendanceRuleList',
        method: 'POST',
    });
}

// 查询学生考勤规则详细信息
export function getStuAttendanceRuleInfoById(args) {
    let params = new URLSearchParams();

    params.append('id', args.id);

    return fetch({
        url: '/structure/stuAttendance/getStuAttendanceRuleInfoById',
        method: 'POST',
    });
}

// 查询学生考勤记录统计（分页）
export function getPriodStuAttendanceRecordPageList(args) {
    let params = new URLSearchParams();

    params.append('beginDate', args.beginDate);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('userName', args.userName);

    return fetch({
        url: '/structure/stuAttendance/getPriodStuAttendanceRecordPageList',
        method: 'POST',
        data: params
    });
}
