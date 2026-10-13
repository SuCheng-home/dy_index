import fetch from '@/utils/fetch'

/**
 * 统一处理请求参数
 * */
function filterURLSearchParams(args = {}) {
  const params = new URLSearchParams();
  Object.keys(args).forEach(key => {
    params.append(key, args[key])
  });
  return params
}

/**
 * 根据学校id获取学校菜品列表，分页
 * */
export function querySchoolDietListBySchoolId(args) {
  return fetch({
    url: 'structure/diet/querySchoolDietListBySchoolId',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 学校菜谱管理员批量把公共菜品添加到学校菜品
 * */
export function batchInsertDietSchool(args) {
  return fetch({
    url: 'structure/diet/batchInsertDietSchool',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 删除学校菜品
 * */
export function deleteSchoolDiet(args) {
  return fetch({
    url: 'structure/diet/deleteSchoolDiet',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 添加学校菜品
 * */
export function insertSchoolDiet(args) {
  return fetch({
    url: 'structure/diet/insertSchoolDiet',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 修改学校菜品
 * */
export function updateSchoolDiet(args) {
  return fetch({
    url: 'structure/diet/updateSchoolDiet',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 平台食谱管理
 * */
/**
 * 分页获取公共菜品列表
 * */
export function queryCommonDietList(args) {
  return fetch({
    url: 'structure/diet/queryCommonDietList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 管理员添加菜品
 * */
export function insertCommonDiet(args) {
  return fetch({
    url: 'structure/diet/insertCommonDiet',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 管理员删除公共菜品
 * */
export function deleteCommonDiet(args) {
  return fetch({
    url: 'structure/diet/deleteCommonDiet',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 微研管理员查看学校菜品库
 * */
export function allSchoolDietList(args) {
  return fetch({
    url: 'structure/diet/allSchoolDietList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 管理员把学校菜品批量添加到公共菜品
 * */
export function batchInsertCommonDiet(args) {
  return fetch({
    url: 'structure/diet/batchInsertCommonDiet',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 根据类型选择菜品
 * */
export function chooseDietByType(args) {
  return fetch({
    url: 'structure/diet/chooseDietByType',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 学校食谱管理
 * */
/**
 * 根据学校id获取学校菜谱，分页
 * */
export function queryDietMenuListBySchoolId(args) {
  return fetch({
    url: 'structure/diet/queryDietMenuListBySchoolId',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 学校管理员删除菜谱
 * */
export function deleteDietMenu(args) {
  return fetch({
    url: 'structure/diet/deleteDietMenu',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 学校管理员删除菜谱
 * */
/**
 * 新增食谱
 * */
export function insertOrPublishDietMenu(args) {
  return fetch({
    url: 'structure/diet/insertOrPublishDietMenu',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 编辑食谱
 * */
export function editOrPublishDietMenu(args) {
  return fetch({
    url: 'structure/diet/editOrPublishDietMenu',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 根据菜谱id获取菜谱详情
 * */
export function dietMenuDetails(args) {
  return fetch({
    url: 'structure/diet/dietMenuDetails',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 发布提醒
 * */
export function remindDiet(args) {
  return fetch({
    url: 'structure/diet/remind',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}
