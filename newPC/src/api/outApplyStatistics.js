import fetch from '@/utils/fetch';

//保存外出申请设置
export function saveOutApplySet(args) {
  let params = new URLSearchParams();
  params.append('firstAudit', args.firstAudit);
  params.append('firstUserJson', args.firstUserJson);
  params.append('secondAudit', args.secondAudit);
  params.append('sencondUserJson', args.sencondUserJson);
  return fetch({
    url: 'structure/outApply/saveOutApplySet',
    method: 'post',
    data:params
  });
}
//获取外出申请设置
export function getOutApplySetBySchoolId(args) {
  let params = new URLSearchParams();
  return fetch({
      url: 'structure/outApply/getOutApplySetBySchoolId',
      method: 'get',
      params
  });
}


//获取学校审核后已发布外出申请
export function queryOutApplyBySchoolId(args) {
  let params = new URLSearchParams();
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('searchName', args.searchName);
  params.append('searchAddress', args.searchAddress);
  return fetch({
      url: 'structure/outApply/queryOutApplyBySchoolId',
      method: 'get',
      params
  });
}

//获取外出申请详情
export function getOutApplyInfoById(args) {
  let params = new URLSearchParams();
  params.append('applyId', args.applyId);
  return fetch({
    url: 'structure/outApply/getOutApplyInfoById',
    method: 'get',
    params
  });
}