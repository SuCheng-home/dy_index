import {getSchoolWebTemplatePcHome} from '@/api/firstPage.js';
const homePage={
  state:{
    columnList:[],
    initJson:{},
    moduleList:[],
    photoJson:[],
    urlModuleJson:[],
    urlModule2Array:[],
    urlModuleType:""
  },
  mutations: {
    setColumnList(state,columnList){
      state.columnList=columnList;
    },
    setInitJson(state,initJson){
      state.initJson=initJson;
    },
    setModuleList(state,moduleList){
      state.moduleList=moduleList;
    },
    setPhotoJson(state,photoJson){
      state.photoJson=photoJson;
    },
    setUrlModuleJson(state,urlModuleJson){
      state.urlModuleJson=urlModuleJson;
    },
    urlModule2Array(state,urlModule2Array){
      state.urlModule2Array=urlModule2Array;
    },
    urlModuleType(state,urlModuleType){
      state.urlModuleType=urlModuleType;
    }
  },
  actions:{
    pcHomeFun({dispatch,commit},query){
      return new Promise((resolve,reject)=>{   
        getSchoolWebTemplatePcHome(query).then(res=>{
          let data=res.data.data;
          if(data){
            for(var i=0;i<data.columnList.length;i++){
              data.columnList[i].navShow=false;
              data.columnList[i].firstColumn=1;
              if(data.columnList[i].moduleList){
                for(var j=0;j<data.columnList[i].moduleList.length;j++){
                  //console.log(dataList[i].moduleList[j]);
                  if(!(data.columnList[i].moduleList[j].type===4)){
                    data.columnList[i].moduleList[j].secondColumn=2;
                  }
                }
              }
            }
            if(data.urlModuleType==2){
              for(var j=0;j<data.urlModule2Array.length;j++){
                data.urlModule2Array[j].id='';
             }
            }
            
            let navList=data;
            commit('setColumnList',navList.columnList);
            commit('setInitJson',JSON.parse(navList.initJson));
            commit('setModuleList',navList.moduleList);
            commit('setPhotoJson',JSON.parse(navList.photoJson));
            commit('setUrlModuleJson',JSON.parse(navList.urlModuleJson));
            commit('urlModule2Array',navList.urlModule2Array);
            commit('urlModuleType',navList.urlModuleType==2?2:1);
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