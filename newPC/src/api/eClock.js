import fetch from '@/utils/fetch'
import {systemFetch} from '@/utils/fetch'

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
 * 查询用户所负责的部门列表//主任：如年级主任、班主任
 * */
export function getDepartListByUserId(args={}) {
  let params = new URLSearchParams();
  params.append('type', args.type || 4);

  return systemFetch({
    url: 'api/depart/getDepartListByUserId',
    method: 'get',
    params
  })
}
/**
 * 模板
 * */
/**
 * 根据学校id,标题查询模板列表
 * */
export function getEcardTempList(args) {
  return fetch({
    url: 'structure/ecard/getEcardTempList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 根据模板id查询模板
 * */
export function getEcardTemp(args) {
  return fetch({
    url: 'structure/ecard/getEcardTemp',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 新增模板
 * */
export function addEcardTemp(query) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/ecard/addEcardTemp',
    method: 'POST',
    data: JSON.stringify(query)
  })
}

/**
 * 编辑模板
 * */
export function updateEcardTemp(query) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/ecard/updateEcardTemp',
    method: 'POST',
    data: JSON.stringify(query)
  })
}

/**
 * 删除模板
 * */
export function delEcardTemp(args) {
  return fetch({
    url: 'structure/ecard/delEcardTemp',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 任务批次
 * */
/**
 * 根据条件查询e打卡批次列表
 * */
export function getEcardList(args) {
  return fetch({
    url: 'structure/ecard/getEcardList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 根据e打卡id查询e打卡批次
 * */
export function getEcard(args) {
  return fetch({
    url: 'structure/ecard/getEcard',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 新增e打卡批次
 * */
export function addEcard(query) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/ecard/addEcard',
    method: 'POST',
    data: JSON.stringify(query)
  })
}
/**
 * 修改e打卡批次
 * */
export function updateEcard(query) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/ecard/updateEcard',
    method: 'POST',
    data: JSON.stringify(query)
  })
}

/**
 * 修改e打卡批次
 * */
export function updateEcardUserSelected(query) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/ecard/updateEcardUserSelected',
    method: 'POST',
    data: JSON.stringify(query)
  })
}

/**
 * 根据e打卡id删除e打卡批次
 * */
export function delEcard(args) {
  return fetch({
    url: 'structure/ecard/delEcard',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 统计
 * */
/**
 * 根据e打卡id统计每天打卡人数
 * */
export function getDatestatisticsList(args) {
  return fetch({
    url: 'structure/ecard/getDatestatisticsList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 提醒未打卡人员
 * */
export function remindNotEcardUserList(args) {
  return fetch({
    url: 'structure/ecard/remindNotEcardUserList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 根据e打卡id,状态，日期，姓名查询查询用户每天打卡记录
 * */
export function getEcardUserDateList(args) {
  return fetch({
    url: 'structure/ecard/getEcardUserDateList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 根据e打卡id,班级id,姓名查询用户成果列表
 * */
export function getEcardUserList(args) {
  return fetch({
    url: 'structure/ecard/getEcardUserList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 根据e打卡id,用户id查询用户成果详情
 * */
export function getEcardUser(args) {
  return fetch({
    url: 'structure/ecard/getEcardUser',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 修改用户成果
 * */
export function updateEcardUser(query) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/ecard/updateEcardUser',
    method: 'POST',
    data: JSON.stringify(query)
  })
}

/**
 * 根据学校id,开始日期，结束日期，发布类型，年级id,班级id,用户姓名查询人员统计
 * */
export function getEcardUserstatisticsList(args) {
  return fetch({
    url: 'structure/ecard/getEcardUserstatisticsList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 评价e打卡用户日期记录
 * */
export function batchEcardUserDate(query) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/ecard/batchEcardUserDate',
    method: 'POST',
    data: JSON.stringify(query)
  })
}

/**
 * 根据e打卡id,班级id,姓名查询用户打卡统计列表
 * */
export function getEcardUserCardStaticList(args) {
  return fetch({
    url: 'structure/ecard/getEcardUserCardStaticList',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}
