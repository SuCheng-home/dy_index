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
 *
 * */
/**
 * 获取学校周红旗流动
 * */
export function getSeveralWeekList(args) {
  return fetch({
    url: 'structure/schoolTime/getSeveralWeekList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 获取学校周红旗流动
 * */
export function getWeekFlowBannerDetails(args) {
  return fetch({
    url: 'structure/flowBanner/getWeekFlowBannerDetails',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 颁发流动红旗
 * */
export function awardFlowBanner(args) {
  return fetch({
    url: 'structure/flowBanner/awardFlowBanner',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 撤回流动红旗
 * */
export function withdrawFlowBanner(args) {
  return fetch({
    url: 'structure/flowBanner/withdrawFlowBanner',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 学校旗帜类型
 * */
/**
 * 获取学校旗帜类型
 * */
export function getFlowBannerTypeBySchoolId(args) {
  return fetch({
    url: 'structure/flowBanner/getFlowBannerTypeBySchoolId',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 新增旗帜类型
 * */
export function insertFlowBannerType(args) {
  return fetch({
    url: 'structure/flowBanner/insertFlowBannerType',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 删除旗帜类型
 * */
export function deleteFlowBannerTypeById(args) {
  return fetch({
    url: 'structure/flowBanner/deleteFlowBannerTypeById',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}
