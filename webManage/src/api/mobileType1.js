import fetch from '@/utils/fetch';

/*根据字典code获得字典数据*/
export function findDicsByCode(args){
  let params=new URLSearchParams();
  params.append("dicCode",args.dicCode);
  return fetch({
    url:'structure/sysDictionary/findDicsByCode',
    method:'post',
    params
  })
}

/*新增修改MbTw模板*/
export function WebTemplateMbTw(args){
  return fetch({
    url:'structure/schoolWebTwo/addAndUpdateSchoolWebTemplateMbTw',
    method:'post',
    data:JSON.stringify(args)
  })
}
/*根据模块类型及webId查询MbTw模板信息*/
export function getSchoolWebTemplateMbTw(args){
  let params=new URLSearchParams();
  params.append("templateType",args.templateType);
  params.append("webId",args.webId);
  return fetch({
    url:'structure/schoolWebTwo/getSchoolWebTemplateMbTw',
    method:'get',
    params
  })
}