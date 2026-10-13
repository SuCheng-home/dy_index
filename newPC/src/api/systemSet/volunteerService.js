import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
  const params = new URLSearchParams();
  Object.keys(args).forEach(key => {
    params.append(key, args[key]);
  })
  return params;
}

/**
 * 新增修改志愿服务设置
 * @param {*} params
 */
export function addUpdateHeartVolunteerInit(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/heartEdu/addUpdateHeartVolunteerInit',
    method: 'POST',
    data: JSON.stringify(args)
  });
}


// 获取志愿服务设置
export const getHeartVolunteerInit = params =>
  fetch({
    url: 'structure/heartEdu/getHeartVolunteerInit',
    method: 'GET',
    params: filterURLSearchParams(params)
  })


/**
 * 新增分组
 * @param {*} params
 */
export function addHeartVolunteerGroup(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/heartEdu/addHeartVolunteerGroup',
    method: 'POST',
    data: JSON.stringify(args)
  });
}
/**
 * 更新分组
 * @param {*} params
 */
export function updateHeartVolunteerGroup(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/heartEdu/updateHeartVolunteerGroup',
    method: 'POST',
    data: JSON.stringify(args)
  });
}
 /**
 * 获取分组列表
 * @param {*} params
 */
export function getHeartVolunteerGroupList(args) {
  return fetch({
    url: 'structure/heartEdu/getHeartVolunteerGroupList',
    method: 'GET',
    params: filterURLSearchParams(args)
  });
}
/**
 * 删除分组
 * @param {*} params
 */
export function delHeartVolunteerGroup(args) {
  return fetch({
    url: 'structure/heartEdu/delHeartVolunteerGroup',
    method: 'GET',
   params: filterURLSearchParams(args)
  });
}

/**
 * 查询分组详情
 * @param {*} params
 */
export function getHeartVolunteerGroup(args) {
  return fetch({
    url: 'structure/heartEdu/getHeartVolunteerGroup',
    method: 'GET',
   params: filterURLSearchParams(args)
  });
}
