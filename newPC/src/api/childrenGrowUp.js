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
 * PC
 * */
/**
 * 成长发布会统计
 * */
export function growthConferenceAnalysis(args) {
  return fetch({
    url: 'structure/growthConference/growthConferenceAnalysis',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * pc分页查询成长发布会详细
 * */
export function queryGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/queryGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 获取成长发布会详情
 * */
export function getGrowthConferenceInfo(args) {
  return fetch({
    url: 'structure/growthConference/getGrowthConferenceInfo',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}




/**
 * 家长
 * */
/**
 * 家长根据学生id获取成长发布会列表
 * */
export function queryStuGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/queryStuGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 新增成长发布会
 * */
export function insertGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/insertGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 编辑成长发布会
 * */
export function editGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/editGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 获取成长发布会详情
 * */
export function deleteGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/deleteGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 获取待审核的成长发布会
 * */
export function getUnAuditGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/getUnAuditGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 获取已审核的成长发布会
 * */
export function getAuditedGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/getAuditedGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 初审
 * */
export function firstAuditGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/firstAuditGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 终审
 * */
export function secondAuditGrowthConference(args) {
  return fetch({
    url: 'structure/growthConference/secondAuditGrowthConference',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}
