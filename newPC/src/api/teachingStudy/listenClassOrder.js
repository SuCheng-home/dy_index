import fetch from '@/utils/fetch';

/**
 * 获取学期列表
 * */
export function getSchoolTimeList() {
  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'GET'
  });
}

/**
 * 听课统计
 * */
export function getTeacherMonOrderNum(schoolTimeId) {
  let params = new URLSearchParams();
  params.append("schoolTimeId", schoolTimeId);

  return fetch({
    url: 'structure/listenClassOrder/getTeacherMonOrderNum',
    method: 'GET',
    params
  });
}

/**
 * 听课明细
 * */
export function getTeacherOrderDetail(args) {
  let params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("schoolTimeId", args.schoolTimeId);

  return fetch({
    url: 'structure/listenClassOrder/getTeacherOrderDetail',
    method: 'GET',
    params
  });
}
