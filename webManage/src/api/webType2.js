import fetch from '@/utils/fetch';

//新增修改pcTw模板
export function addAndUpdateSchoolWebTemplatePcTw(args){
  return fetch({
    url:'structure/schoolWebTwo/addAndUpdateSchoolWebTemplatePcTw',
    method:'post',
    data:JSON.stringify(args)
  })
}
/*根据模块类型及webId查询pcTw模板信息*/
export function getSchoolWebTemplatePcTw(args){
  let params=new URLSearchParams();
  params.append("templateType",args.templateType);
  params.append("webId",args.webId);
  return fetch({
    url:'structure/schoolWebTwo/getSchoolWebTemplatePcTw',
    method:'get',
    params
  })
}