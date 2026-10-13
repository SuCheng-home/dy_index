import fetch from '@/utils/fetch';

/**
 * 获取二维码路径
 */
export function getWatchSchoolQrCode() {
  return fetch({
    url: 'structure/campusMan/getWatchSchoolQrCode',
    method: 'GET'
  });
}

/**
 * 查询周列表
 */
export function getCampusManWeekList() {
  return fetch({
    url: 'structure/campusMan/getCampusManweekList',
    method: 'GET'
  });
}

/**
 * 查询每周值班信息
 * @param {*} severalWeek
 */
export function getCampusManWeekInfo(severalWeek) {
  let params = new URLSearchParams();
  params.append('severalWeek', severalWeek);

  return fetch({
    url: 'structure/campusMan/getCampusManweekInfo',
    method: 'post',
    params
  });
}

/**
 * 新增修改值班数据
 * @param {*} query
 */
export function addAndUpdateWatch(query) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/campusMan/addAndUpdateWacth',
    method: 'post',
    data:JSON.stringify(query)
  });
}

/**
 * 复制上一周数据值班数据
 * @param {*} severalWeek
 */
export function copyLastCampusManWeek(severalWeek) {
  let params = new URLSearchParams();
  params.append('severalWeek', severalWeek);

  return fetch({
    url: 'structure/campusMan/copyLastCampusManweek',
    method: 'post',
    params
  });
}

/**
 * 根据周次清空值班数据
 * @param {*} severalWeek
 */
export function delCampusManWeek(severalWeek) {
  let params = new URLSearchParams();
  params.append('severalWeek', severalWeek);

  return fetch({
    url: 'structure/campusMan/delCampusManweek',
    method: 'post',
    params
  });
}
