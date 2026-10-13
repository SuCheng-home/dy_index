import fetch from '@/utils/fetch';

export function resetSchoolDate(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);
    return fetch({
        url: 'structure/schoolCalendar/resetSchoolDate',
        method: 'POST',
        params
    });
}

export function deleteSchoolCalendar(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);
    return fetch({
        url: 'structure/schoolCalendar/deleteSchoolCalendar',
        method: 'POST',
        params
    });
}

export function insertSchoolCalendar(args) {
    const params = new URLSearchParams();
    params.append('firstEndDate', args.firstEndDate);
    params.append('firstStartDate', args.firstStartDate);
    params.append('schoolYear', args.schoolYear);
    params.append('schoolYearId', args.schoolYearId);
    params.append('secondEndDate', args.secondEndDate);
    params.append('secondStartDate', args.secondStartDate);

    return fetch({
        url: 'structure/schoolCalendar/insertSchoolCalendar',
        method: 'POST',
        params
    });
}

export function schoolCalendarList() {
    const params = new URLSearchParams();

    return fetch({
        url: 'structure/schoolCalendar/schoolCalendarList',
        method: 'POST',
        params
    });
}

export function editSchoolCalendar(args) {
    const params = new URLSearchParams();
    params.append('firstEndDate', args.firstEndDate);
    params.append('firstStartDate', args.firstStartDate);
    params.append('id', args.id);
    params.append('schoolYear', args.schoolYear);
    params.append('schoolYearId', args.schoolYearId);
    params.append('secondEndDate', args.secondEndDate);
    params.append('secondStartDate', args.secondStartDate);

    return fetch({
        url: 'structure/schoolCalendar/editSchoolCalendar',
        method: 'POST',
        params
    });
}

export function getMonthDate(args) {
    const params = new URLSearchParams();
    params.append('date', args.date);

    return fetch({
        url: 'structure/schoolCalendar/getMonthDate',
        method: 'POST',
        params
    });
}

export function setCalendarDate(args) {
    const params = new URLSearchParams();
    params.append('date', args.date);
    params.append('weekDay', args.weekDay);

    return fetch({
        url: 'structure/schoolCalendar/setCalendarDate',
        method: 'POST',
        params
    });
}

export function getSchoolYear() {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/schoolTime/getSchoolYear',
        method: 'POST',
        params
    });
}

export function getSchoolCalendarDetails(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/schoolCalendar/getSchoolCalendarDetails',
        method: 'POST',
        params
    });
}

