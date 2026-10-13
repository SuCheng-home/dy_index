const getters={
  token:state => state.app.token,
  permission: state => state.permission.permission, // 权限数据
  permissionNameMapping: state => state.permission.permissionNameMapping,
  userAvatar:state=>state.app.userInfo.avatar,
  userName:state=>state.app.userInfo.loginname,
  schoolInfo: state => state.app.schoolInfo,
  schoolfullName:state=>state.app.schoolInfo.fullName,
  schoolrLogoUrl:state=>state.app.schoolInfo.roundLogoUrl,
  schoolId:state=>state.app.schoolInfo.id,
  name:state=>state.app.userInfo.name,
  roles: state=>state.app.roles,//角色列表
  /*网站全局变量*/
  firstWebService:state=>state.webBasic.firstWebService,
  webId:state=>state.webBasic.webId,
  webName:state=>state.webBasic.webName,
  isToModule:state=>state.webBasic.isToModule,
  templateTypeMb:state=>state.webBasic.templateTypeMb,
  templateTypePc:state=>state.webBasic.templateTypePc,
  domainName:state=>state.webBasic.domainName
};

export default getters;
