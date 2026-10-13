import fetch from '@/utils/fetch';
import {
    homeworkfetch
} from '@/utils/fetch';

export function getSchoolBehaviorGroupListStatic(args) {
    let params = new URLSearchParams();
    params.append('behDate', args.behDate);
    params.append('classId', args.classId);
    params.append('groupId', args.groupId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('nodeNumber', args.nodeNumber);
    params.append('behGroupType', args.behGroupType)
    return homeworkfetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorGroupListStatic',
        method: 'get',
        params
    });
}
export function getSchoolBehaviorGroupDateListStatic(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('classId', args.classId);
    params.append('groupId', args.groupId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('behGroupType', args.behGroupType)
    return homeworkfetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorGroupDateListStatic',
        method: 'get',
        params
    });
}

export function getSchoolBehaviorGroupStatic(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('classId', args.classId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('behGroupType', args.behGroupType)
    return homeworkfetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorGroupStatic',
        method: 'get',
        params
    });
}

export function getClassroomInitGroupListByTh(classId) {
    let params = new URLSearchParams();
    params.append('classId', classId);
    params.append('behGroupType', 1);
    params.append('setId', 0);
    return fetch({
        url: 'structure/classroom/getClassroomGroupByTh',
        method: 'get',
        params
    });
}

export function listTimeByWeekDayByDate(args) {
    return fetch({
        url: 'structure/scheduleTime/listTimeByWeekDayByDate?customize=' + args.customize + '&isBeh=' + args.isBeh + '&secrchDate=' + args.secrchDate,
        method: 'get',
    });
}

export function getSchoolBehaviorInstallNew() {
    return fetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorInstallNew',
        method: 'get',
    });
}