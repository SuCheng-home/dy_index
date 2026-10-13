import {getSchoolWebSettingBySchoolId,getSchoolWebSettingById} from '@/api/webService';

const webBasic={
  state:{
    firstWebService:[],
    webId:null,
    webName:'',
    isToModule:null,
    templateTypeMb:'',
    templateTypePc:'',
    oneWebService:{},
    domainName:''
  },
  mutations: {
    setwebBasic(state,type){
      state.firstWebService=type;
    },
    OneWebInfo(state,type){
      state.oneWebService=type;
      if(type){
        state.webId=type.id;
        state.webName=type.webName;
        state.isToModule=type.isToModule;//微笑+消息是否进行模块1不进入，2进入
        state.templateTypeMb=type.templateTypeMb;//手机使用的模板
        state.templateTypePc=type.templateTypePc;//pc使用的模板
        state.domainName=type.domainName;
      } 
    }
  },
  actions:{
    getWebBasic({dispatch,commit}){
      return new Promise((resolve,reject)=>{
        getSchoolWebSettingBySchoolId().then(res=>{
          const data=res.data.data;
         // console.log(data);
          commit('setwebBasic',data);
          resolve(res);
        }).catch(error=>{
					reject(error);
				})
      })
    },
    getOneWebInfo({dispatch,commit},query){
      return new Promise((resolve,reject)=>{
        getSchoolWebSettingById(query).then(res=>{
          const data=res.data.data;
         // console.log(data);
          commit('OneWebInfo',data);
          resolve(res);
        }).catch(error=>{
					reject(error);
				})
      })
    }
  }
}

export default webBasic;