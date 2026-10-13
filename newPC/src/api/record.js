import fetch from '@/utils/fetch';

// 获取学期列表
export function getSchoolTimeList() {
  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'POST'
  });
}

export function findDepartList() {
  let params = new URLSearchParams();
  params.append('isFromRecord', true);
  return fetch({
    url: 'structure/recordingApplication/findDepartList',
    method: 'post',
    params
  });
}

export function getApplicationList(query) {
  let params = new URLSearchParams();
  params.append('createUserName', query.createUserName);
  params.append('departmentId', query.departmentId);
  params.append('endDateStr', query.endDateStr);
  params.append('pageNo', query.pageNo);
  params.append('pageSize', query.pageSize);
  params.append('schoolTimeId', query.schoolTimeId);
  params.append('startDateStr', query.startDateStr);
  params.append('state', query.state);

  return fetch({
    url: 'structure/recordingApplication/findRecordingApplicationList',
    method: 'post',
    params
  });
}

export function getRecordingApplication(id) {
  let params = new URLSearchParams();
  params.append('id', id);

  return fetch({
    url: 'structure/recordingApplication/getRecordingApplication',
    method: 'post',
    params
  });
}
