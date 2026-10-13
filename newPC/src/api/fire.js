import fetch from '@/utils/fetch';
import { timers } from 'jquery';


//获取停伙统计数据
export function statistics(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('fireType', query.fireType);
    params.append('mealType', query.mealType);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    params.append('searchName', query.searchName);
    params.append('gradeId', query.gradeId);
    params.append('classId', query.classId);
    params.append('operateType', query.operateType);
    return fetch({
        url: '/structure/fire/statistics',
        method: 'POST',
        data: params
    });
}

//获取停伙设置
export function getFireSet() {
    return fetch({
        url: '/structure/fire/getFireSet',
        method: 'POST',
        data: ''
    });
}

//获取停伙统计数据
export function insertOrEditFireSet(query) {
    let params = new URLSearchParams();
    params.append('breakMeal', query.breakMeal);
    params.append('breakMealCheck', query.breakMealCheck);
    params.append('breakMealPrice', query.breakMealPrice);
    params.append('breakfast', query.breakfast);
    params.append('breakfastCheck', query.breakfastCheck);
    params.append('breakfastPrice', query.breakfastPrice);
    params.append('lunch', query.lunch);
    params.append('lunchCheck', query.lunchCheck);
    params.append('lunchPrice', query.lunchPrice);
    params.append('schoolId', query.schoolId);
    params.append('stuBreakfast', query.stuBreakfast);
    params.append('stuBreakfastPrice', query.stuBreakfastPrice);
    params.append('stuFireDate', query.stuFireDate);
    params.append('stuFireDayState', query.stuFireDayState);
    params.append('stuSupper', query.stuSupper);
    params.append('stuSupperCheck', query.stuSupperCheck);
    params.append('stuSupperPrice', query.stuSupperPrice);
    params.append('supper', query.supper);
    params.append('teacherFireDate', query.teacherFireDate);
    params.append('teacherFireDayState', query.teacherFireDayState);
    params.append('teacherLunch', query.teacherLunch);
    params.append('teacherLunchCheck', query.teacherLunchCheck);
    params.append('teacherLunchPrice', query.teacherLunchPrice);
    params.append('teacherMilk', query.teacherMilk);
    params.append('stuBreakfastCheck', query.stuBreakfastCheck);
    params.append('supperCheck', query.supperCheck);
    params.append('supperPrice', query.supperPrice);
    params.append('remindHeadTeacher', query.remindHeadTeacher);
    params.append('remindHeadTeacherTime', query.remindHeadTeacherTime);
    params.append('isSameSch', query.isSameSch ? query.isSameSch : 1);
    params.append('stuFire', query.stuFire || 0);
    params.append('thFire', query.thFire || 0);
    params.append('limitDayCountTh', query.limitDayCountTh || 0);
    if (query.samePushDate) {
        params.append('samePushDate', query.samePushDate);
        params.append('breakMealPushState', query.breakMealPushState);
        params.append('breakMealPushDate', query.breakMealPushDate);
        params.append('stuLunchPushState', query.stuLunchPushState);
        params.append('stuLunchPushDate', query.stuLunchPushDate);
        params.append('teacherLunchPushState', query.teacherLunchPushState);
        params.append('teacherLunchPushDate', query.teacherLunchPushDate);
        params.append('teacherBreakfastPushState', query.teacherBreakfastPushState);
        params.append('teacherBreakfastPushDate', query.teacherBreakfastPushDate);
        params.append('teacherSupperPushState', query.teacherSupperPushState);
        params.append('teacherSupperPushDate', query.teacherSupperPushDate);
        params.append('stuBreakfastPushState', query.stuBreakfastPushState);
        params.append('stuBreakfastPushDate', query.stuBreakfastPushDate);
        params.append('stuSupperPushState', query.stuSupperPushState);
        params.append('stuSupperPushDate', query.stuSupperPushDate);
    }
     params.append('isRemindManTh', query.isRemindManTh||2);
     params.append('remindManUserJsonTh', query.remindManUserJsonTh||'[]');
    params.append('isBatchSt', query.isBatchSt || 2);
    return fetch({
        url: '/structure/fire/insertOrEditFireSet',
        method: 'POST',
        data: params
    });
}


//加餐统计
export function reportAddAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    return fetch({
        url: '/structure/report/reportAddAnalysis',
        method: 'POST',
        data: params
    });
}


//加餐统计
export function reportMissAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('startDate', query.startDate);
    return fetch({
        url: '/structure/report/reportMissAnalysis',
        method: 'POST',
        data: params
    });
}

//停伙初始化设置停伙时间
export function initFireManage() {
    return fetch({
        url: '/structure/fire/initFireManage',
        method: 'GET',
        data: ''
    });
}
//判断学校是否已初始化
export function judgeInitFire() {
    return fetch({
        url: '/structure/fire/judgeInitFire',
        method: 'GET',
        data: ''
    });
}


// 根据停伙类型和时间范围统计各用户停午餐以及课间餐次数
export function userFireAnalysis(query) {
    let params = new URLSearchParams();
    params.append('endDate', query.endDate);
    params.append('fireType', query.fireType);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('startDate', query.startDate);

    return fetch({
        url: '/structure/fire/userFireAnalysisByFireTypeAndDateRangeGroupByUserId',
        method: 'GET',
        params
    });
}
// 根据停伙类型和时间范围统计各用户停午餐以及课间餐次数
export function queryStuFireMonthDayAnalysis(query) {
    let params = new URLSearchParams();
    params.append('classId', query.fireType == 2 ? query.classId : 0);
    params.append('fireType', query.fireType);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);
    params.append('gradeId', query.fireType == 2 ? query.gradeId : 0);
    params.append('monthDate', query.monthDate);
    params.append('mealType', query.mealType || -1);

    return fetch({
        url: '/structure/fire/queryStuFireMonthDayAnalysis',
        method: 'GET',
        params
    });
}
// 根据时间和停伙类型获取一个月的可停伙时间
export function getMonthDateTw(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('fireType', args.fireType);
    params.append('isManage', args.isManage);
    if (args.fireType == 1) {
        params.append('gradeId', 0);
    } else {
        params.append('gradeId', args.gradeId);
    }


    return fetch({
        url: 'structure/fire/getMonthDateTw',
        method: 'get',
        params
    });
}
export function getMonthDate(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('fireType', args.fireType);
    params.append('isManage', args.isManage);
    return fetch({
        url: 'structure/fire/getMonthDate',
        method: 'get',
        params
    });
}
// 管理员管理停伙
export function insertFireManage(args) {
    let params = new URLSearchParams();
    params.append('fireDate', args.fireDate);
    params.append('fireType', args.fireType);
    if (args.gradeId != 0) {
        params.append('gradeId', args.gradeId);
        params.append('gradeName', args.gradeName);
    }
    params.append('manageDateListStr', args.manageDateListStr);

    return fetch({
        url: 'structure/fire/insertFireManageTw',
        method: 'get',
        params
    });
}
// 本学期全停
export function oneKeyFire(args) {
    let params = new URLSearchParams();
    params.append('breakMeal', args.breakMeal || 0);
    params.append('fireDate', args.fireDate);
    params.append('fireType', args.fireType);
    params.append('lunch', args.lunch || 0);
    params.append('breakfask', args.breakfask || 0);
    params.append('supper', args.supper || 0);
    params.append('operateType', args.operateType);
    params.append('remark', args.remark || '');
    if (args.studentIds) {
        params.append('studentIds', args.studentIds);
    }
    if (args.stuDepartIds) {
        params.append('stuDepartIds', args.stuDepartIds);
    }
    if (args.teacherIds) {
        params.append('teacherIds', args.teacherIds);
    }

    return fetch({
        url: 'structure/fire/oneKeyFire',
        method: 'post',
        data: params
    });
}
// 新增停伙 请求时长为5分钟则默认停5分钟
export function insertFire(args) {
    let params = new URLSearchParams();
    params.append('breakMeal', args.breakMeal || 0);
    params.append('dateStr', args.dateStr);
    params.append('fireType', args.fireType);
    params.append('lunch', args.lunch || 0);
    params.append('breakfask', args.breakfask || 0);
    params.append('supper', args.supper || 0);
    params.append('operateType', args.operateType);
    params.append('remark', args.remark || '');
    if (args.stuDepartIds) {
        params.append('stuDepartIds', args.stuDepartIds);
    }
    if (args.studentIds) {
        params.append('studentIds', args.studentIds);
    }
    if (args.teacherIds) {
        params.append('teacherIds', args.teacherIds);
    }


    return fetch({
        url: 'structure/fire/insertFire',
        method: 'post',
        timeout: 300000,
        data: params
    });
}



//取消停伙
export function cancelFireById(fireId) {
    let params = new URLSearchParams();
    params.append('fireId', fireId);
    return fetch({
        url: 'structure/fire/cancelFireById',
        method: 'get',
        params
    });
}
// 批量取消停伙 2024-05-28
export function cancelFireByIds(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/fire/cancelFireByIds',
        method: 'POST',
        data: JSON.stringify(args)
    })
}


export function updateStuClassInfoList(startDate) {
    let params = new URLSearchParams();
    params.append('startDate', startDate);
    return fetch({
        url: 'structure/fire/updateStuClassInfoList',
        method: 'get',
        params
    });
}


// 查询停伙确认月数据列表
export function getFireRecordMonthList(query) {
    let params = new URLSearchParams();
    params.append('fireType', query.fireType);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    // params.append('searchName', query.searchName);
    params.append('month', query.month);
    params.append('moduleType', query.moduleType);

    return fetch({
        url: 'structure/fire/getFireRecordMonthList',
        method: 'GET',
        params
    });
}

// 新增停伙
export function addFireRecordMonthList(args) {
    let params = new URLSearchParams();
    params.append('moduleType', args.moduleType);
    params.append('month', args.month);
    return fetch({
        url: 'structure/fire/addFireRecordMonthList',
        method: 'post',
        data: params
    });
}

// 新增停伙
export function remindFireRecordMonth(args) {
    let params = new URLSearchParams();
    params.append('moduleType', args.moduleType);
    params.append('month', args.month);
    params.append('fireType', args.fireType);
    return fetch({
        url: 'structure/fire/remindFireRecordMonth',
        method: 'post',
        data: params
    });
}
// 刷新停伙月数据
export function refreshFireRecordMonth(args) {
    let params = new URLSearchParams();
    params.append('moduleType', args.moduleType);
    params.append('month', args.month);
    params.append('userId', args.userId);
    params.append('fireType', args.fireType);
    return fetch({
        url: 'structure/fire/refreshFireRecordMonth',
        method: 'post',
        data: params
    });
}

// 批量取消停伙 2024-05-28
export function initFireManageByGroup(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/fire/initFireManageByGroup',
        method: 'POST',
        data: JSON.stringify(args)
    })
}