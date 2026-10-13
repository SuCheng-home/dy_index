import fetch from '@/utils/fetch';
/**
 * 统一处理请求参数
 * */
 function filterURLSearchParams(args = {}) {
  const params = new URLSearchParams();
  Object.keys(args).forEach(key => {
    params.append(key, args[key]);
  });
  return params;
}
// 工作人员分页获取预约列表
export function queryDetail(e) {
  let params = new URLSearchParams();
  params.append('id', e);
  return fetch({
    url: 'structure/psychological/getSubscribeById',
    method: 'GET',
    params
  });
}

// 工作人员分页获取预约列表
export function querySubscribeByState(pageNo,pageSize,searchName,state) {
  let params = new URLSearchParams();
  params.append('pageNo', pageNo);
  params.append('pageSize', pageSize);
  params.append('searchName', searchName);
  params.append('state', state);
  return fetch({
    url: 'structure/psychological/querySubscribeByState',
    method: 'GET',
    params
  });
}
// 删除预约
export function deleteSubscribeById(id) {
  let params = new URLSearchParams();
  params.append('id', id);
  return fetch({
    url: 'structure/psychological/deleteSubscribeById',
    method: 'GET',
    params
  });
}

// 获取面询教师以及分配情况
export function getTeacherAllotMeetCount(e) {
  let params = new URLSearchParams();
  params.append('date', e);
  return fetch({
    url: 'structure/psychological/getTeacherAllotMeetCount',
    method: 'GET',
    params
  });
}

// 分配
export function allotMeet(e) {
  let params = new URLSearchParams();
  params.append('meetTeacherId', e.meetTeacherId);
  params.append('meetTeacherName', e.meetTeacherName);
  params.append('subscribeId', e.subscribeId);
  return fetch({
    url: 'structure/psychological/allotMeet',
    method: 'POST',
    data: params
  });
}

// 分页获取验证码
export function queryTeacherTaoCode(args) {
  let params = new URLSearchParams();
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('searchName', args.searchName);
  params.append('status', args.status);
  return fetch({
    url: 'structure/teacherTao/queryTeacherTaoCode',
    method: 'GET',
    params
  });
}

// 分配
export function updateCodeStatus(e) {
  let params = new URLSearchParams();
  params.append('authCode', e.authCode);
  params.append('status', e.status);
  return fetch({
    url: 'structure/teacherTao/updateCodeStatus',
    method: 'POST',
    params
  });
}
// 获取安排表
export function querySchedule(pageNo, pageSize, searchTime, searchSure, searchName) {
  let startDate = searchTime && searchTime.length > 0 ? searchTime[0] : '2000-01-01';
  let endDate = searchTime && searchTime.length > 0 ? searchTime[1] : '2050-01-01';
  let params = new URLSearchParams();
  params.append('pageNo', pageNo);
  params.append('pageSize', pageSize);
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('state', searchSure);
  params.append('searchName', searchName);
  return fetch({
    url: 'structure/psychological/querySchedule',
    method: 'GET',
    params
  });
}

// 面询统计列表
export function queryStatisticsList(pageNo, pageSize, searchTime, state, searchName) {
  let startDate = searchTime && searchTime.length > 0 ? searchTime[0] : '2000-01-01';
  let endDate = searchTime && searchTime.length > 0 ? searchTime[1] : '2050-01-01';
  let params = new URLSearchParams();
  params.append('pageNo', pageNo);
  params.append('pageSize', pageSize);
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('state', state);
  params.append('searchName', searchName);
  return fetch({
    url: 'structure/psychological/querySubscribeAnalysis',
    method: 'GET',
    params
  });
}

// 工作量列表
export function queryWorkLoadList(searchTime) {
  let startDate = searchTime && searchTime.length > 0 ? searchTime[0] : '2000-01-01';
  let endDate = searchTime && searchTime.length > 0 ? searchTime[1] : '2050-01-01';
  let params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  // params.append('searchName', searchName);
  return fetch({
    url: 'structure/psychological/teacherWorkAnalysis',
    method: 'GET',
    params
  });
}

// 问题统计
export function queryQuestionData(searchTime, e, v) {
  let startDate = searchTime && searchTime.length > 0 ? searchTime[0] : '2000-01-01';
  let endDate = searchTime && searchTime.length > 0 ? searchTime[1] : '2050-01-01';
  let params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('startAge', e ? e : 0);
  params.append('endAge', v ? v : 100);
  return fetch({
    url: 'structure/psychological/illnessAnalysis',
    method: 'GET',
    params
  });
}

// 导出面询统计列表
export function outStatisticsList(searchTime, state, searchName) {
  let startDate = searchTime && searchTime.length > 0 ? searchTime[0] : '2000-01-01';
  let endDate = searchTime && searchTime.length > 0 ? searchTime[1] : '2050-01-01';
  let params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  params.append('state', state);
  params.append('searchName', searchName);
  return fetch({
    url: 'structure/psychological/downSubscribeAnalysis',
    method: 'GET',
    params
  });
} 
// 获取时间段
export function getDateScheduleByDateRange(args) {
  let params = new URLSearchParams();
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  return fetch({
    url: 'structure/psychological/getDateScheduleByDateRange',
    method: 'GET',
    params
  });
}
// 添加预约
export function insertSubscribe(args) {
  return fetch({
    url: 'structure/psychological/insertSubscribe',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}
// 获取预约时间表
export function queryDateSchedule(args) {
  return fetch({
    url: '/structure/psychological/queryDateSchedule',
    method: 'GET',
    params: filterURLSearchParams(args)
  });
} 
// 新增时间计划
export function insertDateSchedule(args) {
  return fetch({
    url: 'structure/psychological/insertDateSchedule',
    method: 'GET',
    params: filterURLSearchParams(args)
  });
}
// 编辑时间计划
export function editDateSchedule(args) {
  return fetch({
    url: 'structure/psychological/editDateSchedule',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
} 

// 删除时间计划
export function deleteDateScheduleById(args) {
  return fetch({
    url: 'structure/psychological/deleteDateScheduleById',
    method: 'GET',
    params: filterURLSearchParams(args)
  });
}
