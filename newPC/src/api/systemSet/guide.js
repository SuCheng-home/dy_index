import fetch from '@/utils/fetch';

/**
 * 护导组
 */
/**
 * 获得学校护导组列表（分页）
 * */
export function getSchoolGuideGroupPageList(args) {
  let params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("searchName", args.searchName);

  return fetch({
    url: 'structure/guide/getSchoolGuideGroupPageList',
    method: 'GET',
    params
  });
}

/**
 * 删除护导组
 */
export function deleteGuideGroup(groupIds) {
  let params = new URLSearchParams();
  params.append('groupIds', groupIds);

  return fetch({
    url: 'structure/guide/deleteGuideGroup',
    method: 'POST',
    params
  });
}

/**
 * 获得护导组信息
 */
export function getGuideGroupInfoById(groupId) {
  let params = new URLSearchParams();
  params.append('groupId', groupId);

  return fetch({
    url: 'structure/guide/getGuideGroupInfoById',
    method: 'POST',
    params
  });
}

/**
 * 保存护导组
 * */
export function addGuideGroup(args) {
  let params = new URLSearchParams();
  params.append("checkerJson", args.checkerJson);
  params.append("groupName", args.groupName);
  params.append("id", args.id);
  params.append("isSendReport", args.isSendReport);
  params.append("reportUserJson", args.reportUserJson);
  params.append("sendReportTime", args.sendReportTime);
  params.append("holidayGuid", args.holidayGuid);
  return fetch({
    url: 'structure/guide/addGuideGroup',
    method: 'POST',
    data: params
  });
}

/**
 * 护导设置
 */
/**
 * 保存学校护导提醒设置
 * */
export function addGuidRemindSet(args) {
  let params = new URLSearchParams();
  params.append("dayClearManagers", args.dayClearManagers);
  params.append("dayClearReport", args.dayClearReport);
  params.append("feedbackUsers", args.feedbackUsers);
  params.append("guideType", args.guideType);
  params.append("id", args.id);
  params.append("isFeedback", args.isFeedback);
  params.append("isPushByDay", args.isPushByDay);
  params.append("isPushByWeek", args.isPushByWeek);
  params.append("isRemind", args.isRemind);
  params.append("isSendReport", args.isSendReport);
  params.append("pushByDayScope", args.pushByDayScope);
  params.append("pushByWeekScope", args.pushByWeekScope);
  params.append("pushDayNo", args.pushDayNo);
  params.append("remindScopesJson", args.remindScopesJson);
  params.append("remindTime", args.remindTime);
  params.append("dayClearReportTime", args.dayClearReportTime);
  params.append("sendReportTime", args.sendReportTime);
  params.append("remindType", args.remindType);
  params.append("beginRemindTime", args.beginRemindTime);
  return fetch({
    url: 'structure/guide/addGuidRemindSet',
    method: 'POST',
    data: params
  });
}

/**
 * 获得学校护导设置信息
 */
export function getSchoolGuideRemindSetInfo() {
  return fetch({
    url: 'structure/guide/getSchoolGuideRemindSetInfo',
    method: 'GET'
  });
}

/**
 * 护导岗
 */
/**
 * 获得护导组下的护导岗列表（分页）
 * */
export function getGroupGuidePageList(args) {
  let params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("groupId", args.groupId);
  params.append("searchName", args.searchName);

  return fetch({
    url: 'structure/guide/getGroupGuidePageList',
    method: 'GET',
    params
  });
}

/**
 * 保存护导岗
 * */
export function addGuide(args) {
  let params = new URLSearchParams();
  params.append("groupId", args.groupId);
  params.append("place", args.place);
  params.append("remarkInfo", args.remarkInfo);
  return fetch({
    url: 'structure/guide/addGuide',
    method: 'POST',
    data: params
  });
}

/**
 * 编辑护导岗
 * */
export function updateGuide(args) {
  let params = new URLSearchParams();
  params.append("id", args.id);
  params.append("place", args.place);
  params.append("remarkInfo", args.remarkInfo);
  return fetch({
    url: 'structure/guide/updateGuide',
    method: 'POST',
    data: params
  });
}

/**
 * 删除护导岗
 */
export function deleteGuide(stionIds) {
  let params = new URLSearchParams();
  params.append('stionIds', stionIds);

  return fetch({
    url: 'structure/guide/deleteGuide',
    method: 'POST',
    params
  });
}

/**
 * 获得学校当前学期周列表信息
 */
export function getSchoolWeekTimeList(groupId) {
  let params = new URLSearchParams();
  params.append('groupId', groupId);

  return fetch({
    url: 'structure/guide/getSchoolWeekTimeList',
    method: 'GET',
    params
  });
}



/**
 * 负责人设置页
 * */
/**
 * 获得护导组下周护导岗负责人列表
 * */
export function getGroupWeekGuideManagerList(args) {
  let params = new URLSearchParams();
  params.append("groupId", args.groupId);
  params.append("weekNo", args.weekNo);

  return fetch({
    url: 'structure/guide/getGroupWeekGuideManagerList',
    method: 'GET',
    params
  });
}

/**
 * 复制上一周护导组护导岗负责人数据
 * */
export function copyBeforeWeekGroupGuideManagerList(args) {
  let params = new URLSearchParams();
  params.append("groupId", args.groupId);
  params.append("weekNo", args.weekNo);

  return fetch({
    url: 'structure/guide/copyBeforeWeekGroupGuideManagerList',
    method: 'POST',
    data: params
  });
}

/**
 * 删除本周护导组护导岗负责人数据
 * */
export function deleteGroupWeekGuideManager(args) {
  let params = new URLSearchParams();
  params.append("groupId", args.groupId);
  params.append("weekNo", args.weekNo);

  return fetch({
    url: 'structure/guide/deleteGroupWeekGuideManager',
    method: 'POST',
    data: params
  });
}

/**
 * 保存护导岗某天的负责人信息
 * */
export function saveGuideWeekNumberManager(args) {
  let params = new URLSearchParams();
  params.append("groupId", args.groupId);
  params.append("guideDate", args.guideDate);
  params.append("managerJson", args.managerJson);
  params.append("stationId", args.stationId);
  params.append("weekNo", args.weekNo);
  params.append("weekNumber", args.weekNumber);

  return fetch({
    url: 'structure/guide/saveGuideWeekNumberManager',
    method: 'POST',
    data: params
  });
}

/**
 * 护导组时间设置
 * */
/**
 * 获得护导组时间设置列表
 * */
export function getGroupGuideTimeList(groupId) {
  let params = new URLSearchParams();
  params.append("groupId", groupId);

  return fetch({
    url: 'structure/guide/getGroupGuideTimeList',
    method: 'GET',
    params
  });
}

/**
 * 设置护导时间
 * */
export function addGuidTimeSet(args) {
  let params = new URLSearchParams();
  params.append("groupId", args.groupId);
  params.append("guideTimesJson", args.guideTimesJson);

  return fetch({
    url: 'structure/guide/addGuidTimeSet',
    method: 'POST',
    data: params
  });
}
/**
 * 护导导出
 * */
 export function exportGuideWeekManagerDatas(args) {
  let params = new URLSearchParams();
  params.append("groupId", args.groupId);
  params.append("weekNo", args.weekNo);

  return fetch({
    url: 'structure/guide/exportGuideWeekManagerDatas',
    method: 'POST',
    data: params
  });
}
export function copyGuideManagerToNextOtherWeek(args) {
    let params = new URLSearchParams();
    params.append("groupId", args.groupId);
    params.append("weekNo", args.weekNo);

    return fetch({
        url: 'structure/guide/copyGuideManagerToNextOtherWeek',
        method: 'POST',
        data: params
    });
}
