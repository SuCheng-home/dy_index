import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
/*news*/
//根据域名查询网站设置
export function getSchoolWebSettingByDomainName(query){
  let params = new URLSearchParams();
  params.append('domain', query.domain);
  return fetch({
      url: `common/schoolWebTwo/getSchoolWebSettingByDomainName`,
      method: 'get',
      params
  });
}
//根据模块类型及webId查询版本一首页
export function getSchoolWebTemplatePcHome(query){
  let params = new URLSearchParams();
  params.append('templateType', query.templateType);//模板类型
  params.append('webId', query.webId);
  return fetch({
      url: `common/schoolWebTwo/getSchoolWebTemplatePcHome`,
      method: 'get',
      params
  });
}
//查询网站访问量
export function getAccessNumber(query){
  let params = new URLSearchParams();
  params.append('webId',query.webId);
  return fetch({
    url: `common/schoolWebTwo/getAccessNumber`,
    method: 'get',
    params
  })
}
//根据栏目Id查询栏目信息
export function getSchooWebColumnById(query){
  let params = new URLSearchParams();
  params.append('columnId',query.columnId);
  return fetch({
    url: `common/schoolWebTwo/getSchooWebColumnById`,
    method: 'get',
    params
  })
}
//根据模块Id查询模块详情
export function getSchoolWebModuleById(query){
  let params = new URLSearchParams();
  params.append('moduleId',query.moduleId);
  return fetch({
    url: `common/schoolWebTwo/getSchoolWebModuleById`,
    method: 'get',
    params
  })
}
//根据模块id,学校id,消息标题查询消息列表
export function getSchoolWebModuleMessageList(query){
  let params = new URLSearchParams();
  params.append('pageNo',query.pageNo);
  params.append('pageSize',query.pageSize);
  params.append('moduleId',query.moduleId);
  return fetch({
    url: `common/schoolWebTwo/getSchoolWebModuleMessageList`,
    method: 'get',
    params
  })
}
//根据消息id查询模块消息信息
export function getSchoolWebModuleMessageById(query){
  let params = new URLSearchParams();
  params.append('messageId',query.messageId);
  return fetch({
    url: `common/schoolWebTwo/getSchoolWebModuleMessageById`,
    method: 'get',
    params
  })
}
//根据网站Id,查询时间查询悬浮消息信息列表
export function getSchoolWebSuspendMessageListByTime(query){
  let params = new URLSearchParams();
  params.append('searchTime',query.searchTime);
  params.append('webId',query.webId);
  return fetch({
    url: `common/schoolWebTwo/getSchoolWebSuspendMessageListByTime`,
    method: 'get',
    params
  })
}
/*news*/
/*模板二*/
//根据模块类型及webId查询版本二首页
export function getSchoolWebTemplatePcTwHome(query){
  let params = new URLSearchParams();
  params.append('templateType', query.templateType);//模板类型
  params.append('webId', query.webId);
  return fetch({
      url: `common/schoolWebTwo/getSchoolWebTemplatePcTwHome`,
      method: 'get',
      params
  });
}
export function getSchoolWebSearch(query){
  //用于搜索的接口，只有模板二有
  let params = new URLSearchParams();
  params.append('pageNo',query.pageNo);
  params.append('pageSize',query.pageSize);
  params.append('moduleId',query.moduleId);//模块id,可传0为所有
  params.append('schoolId',query.schoolId);//选填如果模块Id为0时必传
  params.append('title',query.title);//搜索条件
  return fetch({
    url: `common/schoolWebTwo/getSchoolWebModuleMessageList`,
    method: 'get',
    params
  })
}
/*模板二校长信箱*/
export function addSchoolWebLetterBox(query){
  //用于搜索的接口，只有模板二有
  return fetch({
    url: `common/schoolWebTwo/addSchoolWebLetterBox`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data:JSON.stringify(query)
  })
}
/*模板二根据模块id,及创建时间查询一下个消息及下一个消息*/
export function getLastAndNextSchoolMessage(query){
  //用于搜索的接口，只有模板二有
  let params = new URLSearchParams();
  params.append('createTime',query.createTime);
  params.append('moduleId',query.moduleId);
  return fetch({
    url: `common/schoolWebTwo/getLastAndNextSchoolMessage`,
    method: 'get',
    params
  })
}
/*模板二*/
/*用户登录：PC*/
export function login(query){
  let params = new URLSearchParams();
  params.append('account',query.account);
  params.append('password',query.password);
  return systemFetch({
    url: `login`,
    method: 'get',
    params
  })
}
/**
 * 选择学校登录
 * @param {*} account 
 * @param {*} password 
 * @param {*} schoolId 
 */
export function loginForChosedSchoold(query){
  let params = new URLSearchParams();
  params.append('account', query.account);
  params.append('password',query.password);
  params.append('schoolId', query.schoolId);
  return systemFetch({
      url: `login`,
      method: 'post',
      data: params
  });
}
/**
 * 登录的用户修改自己的密码
 * @param {*} newPwd 
 * @param {*} oldPwd 
 */
export function modifyPassword(newPwd,oldPwd,userId){
  let params = new URLSearchParams();
  params.append('newPwd', newPwd);
  params.append('oldPwd', oldPwd);
  params.append('userId', userId);
  return systemFetch({
      url: `login/modifyPassword`,
      method: 'post',
      data: params
  });
}

/**
 * 微信登录
 */
export function loginForWX(code,state){
    let params = new URLSearchParams();
    params.append('code', code);
    params.append('state', state);
    return systemFetch({
        url: `login/weixin`,
        method: 'post',
        data: params
    });
}
/**
 * 微信登录：微信接口配置
 */
export function getWXInitData(){
  let params = new URLSearchParams();
  return systemFetch({
      url: `login/weixin/permit`,
      method: 'post'
  });
}


/**
 * 扫码登录
 * @param {*} schoolId 
 * @param {*} wxToken 
 */
export function loginWx(schoolId,wxToken){
  let params = new URLSearchParams();
  params.append('schoolId', schoolId);
  params.append('wxToken', wxToken);
  return systemFetch({
      url:`login/weixin`,
      method: 'post',
      data: params
  });
}

/**
 * 微信登录：获得验证码(这个接口用来做绑定微信登录的时候使用)
 * @param {*} mobile 
 */
export function getCode(mobile){
  let params = new URLSearchParams();
  params.append('mobile', mobile);
  return systemFetch({
      url: `login/weixin/bind/getCode`,
      method: 'post',
      data: params
  });
}

/**
 * 微信登录：绑定接口(先调用【微信登录：获得验证码】接口，引导客户输入收到的验证码后，调用此接口 如果成功后，会自动进行登录操作)
 * @param {*} code 
 * @param {*} mobile 
 * @param {*} wxToken 
 */
export function  wxBind(code,mobile,wxToken){
  let params = new URLSearchParams();
  params.append('code', code);
  params.append('mobile', mobile);
  params.append('wxToken', wxToken);
  return systemFetch({
      url: `login/weixin/bind`,
      method: 'post',
      data: params
  });
}

