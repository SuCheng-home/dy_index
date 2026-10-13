import {getSchoolWebTemplatePcTwHome} from '@/api/firstPage.js';
const homePage={
  state:{
    photoJson:[],
    columnList:[],
    initJson:{},
    rollModuleJson:{},
    leftModuleJson:{},
    urlLeftModuleJson:[],
    leftMessageJson:{},
    middleModuleJson:[],
    rightColumnList:[],
    bottomPhotoModuleJson:{}
  },
  mutations: {
    setPhotoJson(state,photoJson){
      state.photoJson=photoJson;
    },
    setColumnList(state,columnList){
      state.columnList=columnList;
    },
    setInitJson(state,initJson){
      state.initJson=initJson;
    },
    setRollModuleJson(state,rollModuleJson){
      state.rollModuleJson=rollModuleJson;
    },
    setLeftModuleJson(state,leftModuleJson){
      state.leftModuleJson=leftModuleJson;
    },
    setUrlLeftModuleJson(state,urlLeftModuleJson){
      state.urlLeftModuleJson=urlLeftModuleJson;
    },
    setLeftMessageJson(state,leftMessageJson){
      state.leftMessageJson=leftMessageJson;
    },
    setMiddleModuleJson(state,middleModuleJson){
      state.middleModuleJson=middleModuleJson;
    },
    setRightColumnList(state,rightColumnList){
      state.rightColumnList=rightColumnList;
    },
    setBottomPhotoModuleJson(state,bottomPhotoModuleJson){
      state.bottomPhotoModuleJson=bottomPhotoModuleJson;
    }
  },
  actions:{
    pcHomeTwoFun({dispatch,commit},query){
      return new Promise((resolve,reject)=>{   
        getSchoolWebTemplatePcTwHome(query).then(res=>{
          let moduleTwoData=res.data.data;
          if(moduleTwoData){
            //console.log("模板二",moduleTwoData);
            for(var i=0;i<moduleTwoData.columnList.length;i++){
              moduleTwoData.columnList[i].navShow=false;
              moduleTwoData.columnList[i].firstColumn=1;
              if(moduleTwoData.columnList[i].moduleList){
                for(var j=0;j<moduleTwoData.columnList[i].moduleList.length;j++){
                  if(!(moduleTwoData.columnList[i].moduleList[j].type==4)){
                    moduleTwoData.columnList[i].moduleList[j].secondColumn=2;
                  }
                }
              }
            }
            commit('setPhotoJson',JSON.parse(moduleTwoData.photoJson));
            commit('setColumnList',moduleTwoData.columnList);
            commit('setInitJson',JSON.parse(moduleTwoData.initJson));
            commit('setRollModuleJson',JSON.parse(moduleTwoData.rollModuleJson));
            commit('setLeftModuleJson',JSON.parse(moduleTwoData.leftModuleJson));
            commit('setUrlLeftModuleJson',JSON.parse(moduleTwoData.urlLeftModuleJson));
            commit('setLeftMessageJson',JSON.parse(moduleTwoData.leftMessageJson));
            commit('setMiddleModuleJson',JSON.parse(moduleTwoData.middleModuleJson));
            commit('setRightColumnList',moduleTwoData.rightColumnList);
            commit('setBottomPhotoModuleJson',JSON.parse(moduleTwoData.bottomPhotoModuleJson));
            resolve(res);
          }
        }).catch(error=>{
          reject(error);
        })
      })
    }
  }
}
export default homePage;