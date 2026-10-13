import {
  getSchoolWebSettingByDomainName
} from '@/api/firstPage.js'
const app = {
  state: {
    address: '', //通讯地址
    copyRight: '', //版权
    description: '', //网站描述
    domainName: '', //域名
    id: null, //网站Id
    keyWord: '', //关键字
    logoUrl: '', //网站logoUrl
    oldDomainName: '', //网站旧域名
    recodation: '', //备案号
    postRecodation: '', //公安备案号
    schoolId: '', //学校id
    templateTypeMb: '', //templateTypeMb
    templateTypePc: '', //模板类型pc	
    institution: '',
    isInstitute: '',
    webName: '' //网站名称
  },
  mutations: {
    schoolWebInfo: (state, type) => {
      state.address = type.address;
      state.copyRight = type.copyRight;
      state.description = type.description;
      state.domainName = type.domainName;
      state.id = type.id;
      state.keyWord = type.keyWord;
      state.logoUrl = type.logoUrl;
      state.oldDomainName = type.oldDomainName;
      state.recodation = type.recodation;
      state.postRecodation = type.postRecodation;
      state.institution = type.institution;
      state.isInstitute = type.isInstitute;
      state.schoolId = type.schoolId;
      state.templateTypeMb = type.templateTypeMb;
      state.templateTypePc = type.templateTypePc;
      state.webName = type.webName;
    }
  },
  actions: {
    //据网站域名查询网站信息
    schoolWebInfoFun({
      dispatch,
      commit
    }, query) {
      return new Promise((resolve, reject) => {
        getSchoolWebSettingByDomainName(query).then(res => {
          let data = res.data.data;
          if (data) {
            commit('schoolWebInfo', data);
            // const link = document.createElement('link');
            // link.type = 'image/x-icon';
            // link.rel = 'shortcut icon';
            // link.href = 'https://snj-qinhua-1251008840.cos.ap-shanghai.myqcloud.com/open/platform/lv0bfyq4k9k77c/1713147408986.png'
            // document.getElementsByTagName('head')[0].appendChild(link);
          }
          //console.log("ss",res.data.data);
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    }
  }
}

export default app;
