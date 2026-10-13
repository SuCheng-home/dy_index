import fetch from '@/utils/fetch';

/**
 * 新增学校上报记录
 * @param {*} createDate
 */
export function addWatchSchool(query) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/campusMan/addWatchSchool',
    method: 'POST',
    data: JSON.stringify(query)
  });
}

/**
 * 根据学校id,日期查询统计信息
 * @param {*} createDate
 */
export function getWatchSchool(createDate) {
  let params = new URLSearchParams();
  params.append('createDate', createDate);

  return fetch({
    url: 'structure/campusMan/getWatchSchool',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id,日期,类型，姓名查询登记列表
 * @param {*} args
 */
export function getManUserList(args) {
  let params = new URLSearchParams();
  params.append('createDate', args.createDate);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('searchTitle', args.searchTitle);
  params.append('userType', args.userType);

  return fetch({
    url: 'structure/campusMan/getManUserList',
    method: 'GET',
    params
  });
}
