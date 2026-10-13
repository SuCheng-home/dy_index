import fetch from '@/utils/fetch';

//获得会议列表（分页）
export function getMeetingPageList(args) {
    const params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("status", args.status); //0全部 1已发布
    params.append("theme", args.theme);
    return fetch({
        url: 'structure/meeting/getMeetingPageList',
        method: 'POST',
        data: params
    })
}
//删除会议
export function deleteMeeting(args) {
    const params = new URLSearchParams();
    params.append("meetingIds", args.meetingIds);
    return fetch({
        url: 'structure/meeting/deleteMeeting',
        method: 'GET',
        params
    })
}
//获取当前学期学年的开始时间和结束时间
export function getSchoolYearDate(args) {
    const params = new URLSearchParams();
    params.append("schoolId", args.schoolId);
    return fetch({
        url: 'structure/schoolTime/getSchoolYearDate',
        method: 'GET',
        params
    })
}
//查接口名称scancodeEquipmentNewService
export function getScancodeByType(args) {
    const params = new URLSearchParams();
    params.append("equipType", args.equipType);
    params.append("useType", args.useType);
    return fetch({
        url: 'structure/scancodeEquipment/getScancodeEquipmentListByType',
        method: 'GET',
        params
    })
}
//新增会议
export function addMeeting(args) {
    const params = new URLSearchParams();
    params.append("bSignTime", args.bSignTime);
    params.append("beginTime", args.beginTime);
    params.append("describe", args.describe); //会议类型 0单次会议 1常规例会
    params.append("eSignTime", args.eSignTime); //是否允许请假 0不允许 1允许
    params.append("endTime", args.endTime);
    params.append("equipmentIds", args.equipmentIds);
    params.append("equipmentJson", args.equipmentJson);
    params.append("filesJson", args.filesJson);
    params.append("finishTime", args.finishTime);
    params.append("isCanAskLeav", args.isCanAskLeav);
    params.append("isSignLimit", args.isSignLimit); //签到时间限制 0不限制 1限制
    //params.append("leavExamIds",args.leavExamIds);
    params.append("leavExamJson", args.leavExamJson);
    params.append("meetingScopes", args.meetingScopes);
    params.append("meetingType", args.meetingType); //0全部 1已发布
    params.append("place", args.place);
    params.append("signType", args.signType);
    params.append("startTime", args.startTime);
    params.append("status", args.status); //0全部 1已发布
    params.append("theme", args.theme);
    params.append("weekIds", args.weekIds);
    params.append("weekNames", args.weekNames);
    params.append("isRemind", args.isRemind);
    if (args.signType == 1 && args.isAddressLimit == 2) {
        params.append("address", args.address);
        params.append("addressDesc", args.addressDesc);
        params.append("lat", args.lat);
        params.append("lng", args.lng);
        params.append("rangeVal", args.rangeVal);
        params.append("isAddressLimit", args.isAddressLimit);
    } else {
        params.append("isAddressLimit", 0);
    }
    return fetch({
        url: 'structure/meeting/addMeeting',
        method: 'POST',
        data: params
    })
}
//编辑会议
export function editMeeting(args) {
    const params = new URLSearchParams();
    params.append("bSignTime", args.bSignTime);
    params.append("beginTime", args.beginTime);
    params.append("describe", args.describe); //会议类型 0单次会议 1常规例会
    params.append("eSignTime", args.eSignTime); //是否允许请假 0不允许 1允许
    params.append("endTime", args.endTime);
    params.append("equipmentIds", args.equipmentIds);
    params.append("equipmentJson", args.equipmentJson);
    params.append("filesJson", args.filesJson);
    params.append("finishTime", args.finishTime);
    params.append("id", args.id);
    params.append("signQrCode", args.signQrCode);
    params.append("isCanAskLeav", args.isCanAskLeav);
    params.append("isSignLimit", args.isSignLimit); //签到时间限制 0不限制 1限制
    //params.append("leavExamIds",args.leavExamIds);
    params.append("leavExamJson", args.leavExamJson);
    params.append("meetingScopes", args.meetingScopes);
    params.append("meetingType", args.meetingType); //0全部 1已发布
    params.append("place", args.place);
    params.append("signType", args.signType);
    params.append("startTime", args.startTime);
    params.append("status", args.status); //0全部 1已发布
    params.append("theme", args.theme);
    params.append("weekIds", args.weekIds);
    params.append("weekNames", args.weekNames);
    params.append("isRemind", args.isRemind);
    if (args.signType == 1 && args.isAddressLimit == 2) {
        params.append("address", args.address);
        params.append("addressDesc", args.addressDesc);
        params.append("lat", args.lat);
        params.append("lng", args.lng);
        params.append("rangeVal", args.rangeVal);
        params.append("isAddressLimit", args.isAddressLimit);
    } else {
        params.append("isAddressLimit", 0);
    }
    return fetch({
        url: 'structure/meeting/editMeeting',
        method: 'POST',
        data: params
    })
}
//获得会议详细信息
export function getMeetingInfo(args) {
    const params = new URLSearchParams();
    params.append("meetingId", args.meetingId);
    return fetch({
        url: 'structure/meeting/getMeetingInfo',
        method: 'POST',
        data: params
    })
}
//会议签到人员列表（分页）
export function getSignUserPageList(args) {
    const params = new URLSearchParams();
    params.append("meetingId", args.meetingId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("searchName", args.searchName);
    params.append("signDate", args.signDate);
    params.append("stateType", args.stateType);
    return fetch({
        url: 'structure/meeting/getSignUserPageList',
        method: 'POST',
        data: params
    })
}
//查询会议的签到日期列表
export function getMeetingSignDateList(args) {
    const params = new URLSearchParams();
    params.append("meetingId", args.meetingId);
    return fetch({
        url: 'structure/meeting/getMeetingSignDateList',
        method: 'POST',
        data: params
    })
}
//会议未签到人员列表
export function getNotSignUserPageList(args) {
    const params = new URLSearchParams();
    params.append("meetingId", args.meetingId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("searchName", args.searchName);
    params.append("signDate", args.signDate);
    params.append("stateType", args.stateType);
    return fetch({
        url: 'structure/meeting/getNotSignUserPageList',
        method: 'POST',
        data: params
    })
}
//获得会议签到上墙数据
export function getMeetingSignUserData(args) {
    const params = new URLSearchParams();
    params.append("signUserShow", args.signUserShow);
    return fetch({
        url: 'structure/meeting/getMeetingSignUserData',
        method: 'POST',
        data: params
    })
}
//获得会议参加人员数量
export function getJoinMeetingUserCount(args) {
    const params = new URLSearchParams();
    params.append("meetingId", args.meetingId);
    params.append("signDate", args.signDate);
    return fetch({
        url: 'structure/meeting/getJoinMeetingUserCount',
        method: 'POST',
        data: params
    })
}
