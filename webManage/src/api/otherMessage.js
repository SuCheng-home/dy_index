import fetch from '@/utils/fetch';

/*修改网站初始化设置*/
export function updateSchoolWebSettingInit(args){
  return fetch({
    url:'structure/schoolWebTwo/updateSchoolWebSettingInit',
    method:'post',
    data: JSON.stringify(args)
  })
}

/*新增悬浮消息*/
export function addSchoolWebSuspendMessage(args){
  return fetch({
    url:'structure/schoolWebTwo/addSchoolWebSuspendMessage',
    method:'post',
    data: JSON.stringify(args)
  })
}

/*根据网站Id,消息标题查询悬浮消息列表*/
export function getSchoolWebSuspendMessageList(args){
  let params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("title",args.title);
  params.append("webId",args.webId);
  return fetch({
    url:'structure/schoolWebTwo/getSchoolWebSuspendMessageList',
    method:'get',
    params
  })
}

/*根据消息ids删除悬浮消息信息*/
export function delSchoolWebSuspendMessageByIds(args){
  let params=new URLSearchParams();
  params.append("messageIds",args.messageIds);
  return fetch({
    url:'structure/schoolWebTwo/delSchoolWebSuspendMessageByIds',
    method:'get',
    params
  })
}

/*修改悬浮消息*/
export function updateSchoolWebSuspendMessage(args){
  return fetch({
    url:'structure/schoolWebTwo/updateSchoolWebSuspendMessage',
    method:'post',
    data: JSON.stringify(args)
  })
}

/*根据消息id查询悬浮消息信息*/
export function getSchoolWebSuspendMessageById(args){
  let params=new URLSearchParams();
  params.append("messageId",args.messageId);
  return fetch({
    url:'structure/schoolWebTwo/getSchoolWebSuspendMessageById',
    method:'get',
    params
  })
}