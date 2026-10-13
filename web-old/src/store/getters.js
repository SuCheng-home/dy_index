const getters = {
  //根据域名查询网站信息
  address: state => state.app.address, //地址
  copyRight: state => state.app.copyRight, //版权
  description: state => state.app.description, //页面描述
  domainName: state => state.app.domainName, //域名
  id: state => state.app.id, //网站Id
  keyWord: state => state.app.keyWord, //关键字
  logoUrl: state => state.app.logoUrl, //网站logoUrl
  oldDomainName: state => state.app.oldDomainName, //网站旧域名
  recodation: state => state.app.recodation, //备案号
  institution: state => state.app.institution,
  isInstitute: state => state.app.isInstitute,
  postRecodation: state => state.app.postRecodation, //公安备案号
  templateTypeMb: state => state.app.templateTypeMb, //templateTypeMb
  templateTypePc: state => state.app.templateTypePc, //模板类型pc	
  webName: state => state.app.webName, //网站名称
  schoolId: state => state.app.schoolId, //学校id
  //first详情
  firstData: state => state.detail.firstData,
  firstlogoUrl: state => state.detail.firstlogoUrl,
  firstcontent: state => state.detail.firstcontent,
  firstname: state => state.detail.firstname,
  firstid: state => state.detail.firstid,
  //second详情
  secondData: state => state.detail.secondData,
  secondlogoUrl: state => state.detail.secondlogoUrl,
  secondcontent: state => state.detail.secondcontent,
  secondname: state => state.detail.secondname,
  secondid: state => state.detail.secondid,
  //homePage首页
  infoType: state => state.homePage.initJson.infoType,
  shufflingTime: state => state.homePage.initJson.shufflingTime,
  windowType: state => (state.homePage.initJson.windowType ? state.homePage.initJson.windowType : 1),
  initPhoto: state => state.homePage.initJson.initPhoto,
  columnList: state => state.homePage.columnList,
  photoJson: state => state.homePage.photoJson,
  urlModuleJson: state => state.homePage.urlModuleJson,
  moduleList: state => state.homePage.moduleList, //主体区域的数据
  urlModule2Array: state => state.homePage.urlModule2Array,
  urlModuleType: state => state.homePage.urlModuleType,
  //网站2首页
  infoTypeTwo: state => state.homePageTwo.initJson.infoType,
  shufflingTimeTwo: state => state.homePageTwo.initJson.shufflingTime,
  initPhotoTwo: state => state.homePageTwo.initJson.initPhoto,
  photoJsonTwo: state => state.homePageTwo.photoJson,
  columnListTwo: state => state.homePageTwo.columnList,
  rollModuleJsonTwo: state => state.homePageTwo.rollModuleJson,
  leftModuleJsonTwo: state => state.homePageTwo.leftModuleJson,
  urlLeftModuleJsonTwo: state => state.homePageTwo.urlLeftModuleJson,
  leftMessageJsonTwo: state => state.homePageTwo.leftMessageJson,
  middleModuleJsonTwo: state => state.homePageTwo.middleModuleJson,
  rightColumnListTwo: state => state.homePageTwo.rightColumnList,
  bottomPhotoModuleJsonTwo: state => state.homePageTwo.bottomPhotoModuleJson
};
export default getters;
