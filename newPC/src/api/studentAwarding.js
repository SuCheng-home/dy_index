import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

// 新增活动
export function addStuBehActivity(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/addStuBehActivity',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//
// 根据条件查询活动列表
export function getStuBehActivityList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('title', args.title);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityList',
        method: 'GET',
        params
    });
}

// 根据活动id删除活动
export function delStuBehActivity(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);

    return fetch({
        url: '/structure/stuBeh/delStuBehActivity',
        method: 'GET',
        params
    });
}
// 根据活动id查询活动
export function getStuBehActivity(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivity',
        method: 'GET',
        params
    });
}

// 修改考评活动
export function updateStuBehActivity(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updateStuBehActivity',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 新增修改校评委
export function addUpdateStuBehManger(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/addUpdateStuBehManger',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据班级查询活动列表
export function getStuBehActivityListByClassId(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('title', args.title);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityListByClassId',
        method: 'GET',
        params
    });
}

//
export function getStuBehActivityActionListByClassId(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('activityId', args.activityId);
    params.append('batchState', args.batchState);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityActionListByClassId',
        method: 'GET',
        params
    });
}
export function getClassAndStudentsByManagerId(args) {
    let params = new URLSearchParams();
    params.append('managerId', args.managerId);

    return systemFetch({
        url: 'api/depart/getClassAndStudentsByManagerId',
        method: 'GET',
        params
    });
}
export function getStuBehActivityAction(args) {
    let params = new URLSearchParams();
    params.append('studentId', args.studentId);
    params.append('activityId', args.activityId);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityAction',
        method: 'GET',
        params
    });
}
export function getStuBehActivityActionHonorList(args) {
    let params = new URLSearchParams();
    params.append('studentId', args.studentId);
    params.append('activityId', args.activityId);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityActionHonorList',
        method: 'GET',
        params
    });
}
// 根据颁发日期和证书类型id查询学生荣誉列表
export function findApproverHonorListByIssueDate(args) {
    let params = new URLSearchParams();
    params.append('certTypeCode', args.certTypeCode);
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('stuId', args.stuId);


    return fetch({
        url: '/structure/schoolHonor/findApproverHonorListByIssueDate',
        method: 'GET',
        params
    });
}

// 批量新增学生荣誉
export function addStuBehActivityActionHonorList(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/addStuBehActivityActionHonorList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 删除学生荣誉
export function delStuBehActivityActionHonor(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('honorId', args.honorId);
    params.append('studentId', args.studentId);

    return fetch({
        url: '/structure/stuBeh/delStuBehActivityActionHonor',
        method: 'GET',
        params
    });
}

// 修改老师评比状态
export function updateStuBehClassCurr(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updateStuBehClassCurr',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 修改活动用户
export function updateStuBehActivityActionHonor(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updateStuBehActivityActionHonor',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
// 修改活动用户
export function updarteStuBehActivityAction(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updarteStuBehActivityAction',
        method: 'POST',
        data: JSON.stringify(args)
    });
    }
    export function checkStuApplyAwardChoose(args) {
        let params = new URLSearchParams();
        params.append('activityId', args.activityId);
        params.append('applyAwardCode', args.applyAwardCode);
        params.append('studentId', args.studentId);

        return fetch({
            url: '/structure/stuBeh/checkStuApplyAwardChoose',
            method: 'GET',
                params
        });
    }
// 任课老师查询活动列表

export function getStuBehActivityListByTh(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('title', args.title);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityListByTh',
        method: 'GET',
        params
    });
}
// 任课老师查询负责班级科目列表

export function getStuBehClassCurrListByTh(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);

    return fetch({
        url: '/structure/stuBeh/getStuBehClassCurrListByTh',
        method: 'GET',
        params
    });
}

// 根据活动id,班级,科目id,申报奖项code查询考评学生列表
export function getStuBehListByTh(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('applyAwardCode', args.applyAwardCode);
    params.append('classId', args.classId);
    params.append('curriculumId', args.curriculumId);

    return fetch({
        url: '/structure/stuBeh/getStuBehListByTh',
        method: 'GET',
        params
    });
}

// 新增修改老师对学生评比
export function updateStuBehActivityTh(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updateStuBehActivityTh',
        method: 'POST',
        data: JSON.stringify(args)

    });
}
// 根据活动id,班级id，申请奖项 查询已经通过的学生列表
export function getPassStuListByClassId(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('applyAwardCode', args.applyAwardCode);
    params.append('classId', args.classId);

    return fetch({
        url: '/structure/stuBeh/getPassStuListByClassId',
        method: 'GET',
        params
    });
}
// 根据学生id,活动id,奖项code查询老师考评列表
export function getStuBehActivityThList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('applyAwardCode', args.applyAwardCode);
    params.append('studentId', args.studentId);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityThList',
        method: 'GET',
        params
    });
}

// 修改学生奖项信息
export function updateStuBehActivityAward(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updateStuBehActivityAward',
        method: 'POST',
        data: JSON.stringify(args)

    });
}
// 根据学生id,活动id,奖项code查询奖项信息
export function getStuApplyAward(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('applyAwardCode', args.applyAwardCode);
    params.append('studentId', args.studentId);

    return fetch({
        url: '/structure/stuBeh/getStuApplyAward',
        method: 'GET',
        params
    });
}
// 根据活动id,班级id查询各科目上报情况列表
export function getStuBehActivityCurrList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);

    return fetch({
        url: '/structure/stuBeh/getStuBehActivityCurrList',
        method: 'GET',
        params
    });
}
// 修改活动班级上报信息
export function updateStuBehActivityClass(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updateStuBehActivityClass',
        method: 'POST',
        data: JSON.stringify(args)

    });
}
// 按班级通知任课老师进行评价
export function remindBehActivityThByClassId(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);
    params.append('title', args.title);

    return fetch({
        url: '/structure/stuBeh/remindBehActivityThByClassId',
        method: 'GET',
        params
    });
}
export function resetBehActivityThByClassId(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);
    return fetch({
        url: '/structure/stuBeh/resetBehActivityThByClassId',
        method: 'GET',
        params
    });
}
// 根据活动id,用户id查询年级列表(考评管理员及校评委）
export function getStuBehGradeListByUserId(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);

    return fetch({
        url: '/structure/stuBeh/getStuBehGradeListByUserId',
        method: 'GET',
        params
    });
}
// 根据活动id,年级id,状态查询活动班级列表
export function getStuBehClassList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('gradeId', args.gradeId);
    params.append('reportState', args.reportState);

    return fetch({
        url: '/structure/stuBeh/getStuBehClassList',
        method: 'GET',
        params
    });
}
// 批量修改学生信息
export function updateStuBehActivityActionList(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/updateStuBehActivityActionList',
        method: 'POST',
        data: JSON.stringify(args)

    });
}
// 根据活动id,班级id，申请奖项 查询已经上报学校的学生列表
export function getReportSchStuListByClassId(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);
    params.append('gradeId', args.gradeId);
    params.append('applyAwardCode', args.applyAwardCode);

    return fetch({
        url: '/structure/stuBeh/getReportSchStuListByClassId',
        method: 'GET',
        params
    });
}
// 根据活动id,班级,审批状态,申报奖项code查询考评学生列表
export function getStuBehListAll(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);
    params.append('applyAwardCode', args.applyAwardCode);
    params.append('batchState', args.batchState);

    return fetch({
        url: '/structure/stuBeh/getStuBehListAll',
        method: 'GET',
        params
    });
}
// 分页查询考评学生列表
export function getStuBehListAllPum(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);
    params.append('gradeId', args.gradeId);

    params.append('applyAwardCode', args.applyAwardCode);
    params.append('choseAwardCode', args.choseAwardCode);
    params.append('isClassChose', args.isClassChose);
    params.append('isSchChose', args.isSchChose);

    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('studentName', args.studentName);


    return fetch({
        url: '/structure/stuBeh/getStuBehListAllPum',
        method: 'GET',
        params
    });
}

// 补发考评活动
export function againStuBehActivity(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/stuBeh/againStuBehActivity',
        method: 'POST',
        data: JSON.stringify(args)

    });
}
// 更新考评老师
export function updateStuBehActivityTeacher(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);

    return fetch({
        url: '/structure/stuBeh/updateStuBehActivityTeacher',
        method: 'GET',
        params
    });
}
// 根据活动id,班级id导出已经上传头像学生列表
export function exportStuBehActivityActionStuAvatarList(args) {
    let params = new URLSearchParams();
    params.append('activityId', args.activityId);
    params.append('classId', args.classId);
    params.append('title', args.title);

    return fetch({
        url: '/structure/stuBeh/exportStuBehActivityActionStuAvatarList',
        method: 'GET',
        params
    });
}
