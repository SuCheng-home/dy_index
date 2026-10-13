import fetch from '@/utils/fetch';

/**
 * 统一处理请求参数
 * */
function filterURLSearchParams (args = {}) {
  const params = new URLSearchParams()
  Object.keys(args).forEach(key => {
    params.append(key, args[key])
  });
  return params
}

/**
 *
 * */
/**
 * 保存信用积分自主申领设置
 * */
export function saveCreditPointRemindSet(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/creditPoint/saveCreditPointRemindSet',
    method: 'POST',
    data: JSON.stringify(args)
  })
}

/**
 * 根据schoolId获取自主申领设置
 * */
export function getCreditPointRemindSet(args) {
  return fetch({
    url: 'structure/creditPoint/getCreditPointRemindSet',
    method: 'GET',
    data: filterURLSearchParams(args)
  })
}

/**
 * 积分等级
 * */
/**
 * 获取积分等级
 * */
export function getCreditPointLevelList(args) {
  return fetch({
    url: 'structure/creditPoint/getCreditPointLevelList',
    method: 'GET',
    data: filterURLSearchParams(args)
  })
}

/**
 * 删除积分等级
 * */
export function deleteCreditPointLevelById(args) {
  return fetch({
    url: 'structure/creditPoint/deleteCreditPointLevelById',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 新增积分等级
 * */
export function insertCreditPointLevel(args) {
  return fetch({
    url: 'structure/creditPoint/insertCreditPointLevel',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}

/**
 * 编辑积分等级
 * */
export function updateCreditPointLevel(args) {
  return fetch({
    url: 'structure/creditPoint/updateCreditPointLevel',
    method: 'POST',
    data: filterURLSearchParams(args)
  })
}




/*保存获取信用积分基础设置*/
export function saveCreditPointInitSet(args) {
  let params = new URLSearchParams();
  params.append('chargeClass', args.chargeClass);
  params.append('chooseAuditor', args.chooseAuditor);
  params.append('typeJson', args.typeJson);
  params.append('userJson', args.userJson);
  return fetch({
      url: 'structure/creditPoint/saveCreditPointInitSet',
      method: 'post',
      data: params
  });
}
/*获取信用积分基础设置*/
export function getCreditPointInitSet(args) {
  let params = new URLSearchParams();
  return fetch({
      url: 'structure/creditPoint/getCreditPointInitSet',
      method: 'get',
      data: params
  });
}

/*创建积分对应物品时选择物品*/
export function chooseGood(args) {
  let params = new URLSearchParams();
  params.append('cpgId', args.cpgId);
  return fetch({
      url: 'structure/creditPoint/chooseGood',
      method: 'post',
      data: params
  });
}

/*保存积分对应物品设置*/
export function saveCreditPointGood(args) {
  let params = new URLSearchParams();
  params.append('goodJson', args.goodJson);
  params.append('id', args.id);
  params.append('point', args.point);
  return fetch({
      url: 'structure/creditPoint/saveCreditPointGood',
      method: 'post',
      data: params
  });
}

/*获取学校积分对应物品列表*/
export function getCreditPointGood(args) {
  let params = new URLSearchParams();
  return fetch({
      url: 'structure/creditPoint/getCreditPointGood',
      method: 'post',
      data: params
  });
}

/*获取学校积分对应物品列表*/
export function deleteCreditPointGood(args) {
  let params = new URLSearchParams();
  params.append('cpgIds', args.cpgIds);
  return fetch({
      url: 'structure/creditPoint/deleteCreditPointGood',
      method: 'post',
      data: params
  });
}

/*根据id获取信用积分对应物品详情*/
export function getCreditPointGoodById(args) {
  let params = new URLSearchParams();
  params.append('cpgId', args.cpgId);
  return fetch({
      url: 'structure/creditPoint/getCreditPointGoodById',
      method: 'post',
      data: params
  });
}
