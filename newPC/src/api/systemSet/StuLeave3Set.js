import fetch from '@/utils/fetch';

/**
 * 根据学校id查询请假设置
 */
export function getStuAskLeaveThreeInit() {
  return fetch({
    url: 'structure/stuAskleaveThree/getStuAskleaveThreeInit',
    method: 'GET'
  });
}

/**
 * 新增修改请假设置
 * @param {*} params
 */
export function addAndUpdateStuAskleaveThreeInit(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/stuAskleaveThree/addAndUpdateStuAskleaveThreeInit',
    method: 'POST',
    data: JSON.stringify(args)
  });
}
