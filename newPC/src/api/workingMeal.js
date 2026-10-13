import fetch from '@/utils/fetch';
//根据学校id查询初始化设置
export function getSarahInit() {
    return fetch({
        url: 'structure/sarah/getSarahInit',
        method: 'GET'
    });
}
//新增修改初始化设置
export function addSarahInit(query) {  
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/sarah/addSarahInit',
        method: 'post',
        data: JSON.stringify(query)
    });
}
//根据条件查询工作餐地点列表
export function getSarahPlaceList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
      url: 'structure/sarah/getSarahPlaceList',
      method: 'get',
      params
    });
  }
//删除工作餐地点
export function delSarahPlace(placeIds) {
    let params = new URLSearchParams();
    params.append('placeIds', placeIds);
    return fetch({
      url: 'structure/sarah/delSarahPlace',
      method: 'get',
      params
    });
  }
  //新增地点
export function addSarahPlace(query) {  
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/sarah/addSarahPlace',
        method: 'post',
        data: JSON.stringify(query)
    });
}
 //修改工作餐地点
 export function updateSarahPlace(query) {  
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/sarah/updateSarahPlace',
        method: 'post',
        data: JSON.stringify(query)
    });
}
//工作餐地点详情
export function getSarahPlaceByPlaceId(placeId) {
    let params = new URLSearchParams();
    params.append('placeId', placeId);
    return fetch({
      url: 'structure/sarah/getSarahPlaceByPlaceId',
      method: 'get',
      params
    });
  }
  //根据日期查询订单列表
export function getSarahListBySendDate(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    return fetch({
      url: 'structure/sarah/getSarahListBySendDate',
      method: 'get',
      params
    });
  }
  //根据日期查询订单列表
export function getSarahDepartList() {
    return fetch({
      url: 'structure/sarah/getSarahDepartList',
      method: 'get'
    });
  }