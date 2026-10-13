import fetch from '@/utils/fetch';

export function querySchoolTimeListBySchoolId(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return fetch({
        url: 'structure/schoolTime/querySchoolTimeListBySchoolId',
        method: 'POST',
        params
    });

}

export function insertSchoolTime(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('isCurrent', args.isCurrent);
    params.append('schoolId', args.schoolId);
    params.append('schoolYear', args.schoolYear);
    params.append('schoolYearId', args.schoolYearId);
    params.append('startDate', args.startDate);
    params.append('term', args.term);
    params.append('afterEndDate', args.afterEndDate);
    params.append('beforeStartDate', args.beforeStartDate);

    return fetch({
        url: 'structure/schoolTime/insertSchoolTime',
        method: 'POST',
        params
    });
}

export function getSchoolTimeAllList(args) {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'POST',
        params
    });
}

export function updateSchoolTime(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('id', args.id);
    params.append('isCurrent', args.isCurrent);
    params.append('schoolId', args.schoolId);
    params.append('schoolYear', args.schoolYear);
    params.append('schoolYearId', args.schoolYearId);
    params.append('startDate', args.startDate);
    params.append('term', args.term);
    params.append('afterEndDate', args.afterEndDate);
    params.append('beforeStartDate', args.beforeStartDate);

    return fetch({
        url: 'structure/schoolTime/updateSchoolTime',
        method: 'POST',
        params
    });
}

export function getSchoolYear(args) {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/schoolTime/getSchoolYear',
        method: 'POST',
        params
    });
}

export function getMonthDate(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/schoolTime/getMonthDate',
        method: 'POST',
        params
    });
}

export function setSchoolTimeDate(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('weekDay', args.weekDay);

    return fetch({
        url: 'structure/schoolTime/setSchoolTimeDate',
        method: 'POST',
        params
    });
}

export function setIsCurrent(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/schoolTime/setIsCurrent',
        method: 'POST',
        params
    });
}

export function schoolTimeDetails(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/schoolTime/schoolTimeDetails',
        method: 'POST',
        params
    });
}

//校历同步
export function syncSchoolCalendar(args){
    let params = new URLSearchParams();
    params.append("schoolYear",args.schoolYear);
    params.append("term",args.term);

    return fetch({
        url:'structure/schoolTime/syncSchoolCalendar',
        methods:'POST',
        params
    })
}
//设置校历调休日期
export function setAdjustDate(args){
    let params = new URLSearchParams();
    params.append("adjustDate",args.adjustDate);
    params.append("date",args.date);
    params.append("isAdjust",args.isAdjust);
    params.append("schoolTimeId",args.schoolTimeId);

    return fetch({
        url:'structure/schoolTime/setAdjustDate',
        methods:'POST',
        params
    })
}
export function getMonthDayContainHoliday(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('schoolTimeId', args.schoolTimeId);

    return fetch({
        url: 'structure/schoolTime/getMonthDayContainHoliday',
        method: 'POST',
        params
    });
}