import {getSchooWebColumnById,getSchoolWebModuleById} from '@/api/firstPage.js'
const detail={
	state:{
    firstData:'',
    firstlogoUrl:'',
    firstcontent:'',
    firstname:'',
    firstid:'',
    secondData:'',
    secondlogoUrl:'',
    secondcontent:'',
    secondname:'',
    secondid:''
	},
	mutations:{
		getSchooWebColumn(state,type){
			if(type){
				state.firstData=type;
				state.firstid=type.id;
				state.firstlogoUrl=type.logoUrl;
				state.firstcontent=type.content;
				state.firstname=type.name; 
			}
       
		},
		getSchoolWebModuleById(state,type){
			state.secondData=type,
      state.secondid=type.id,
      state.secondlogoUrl=type.logoUrl,
      state.secondcontent=type.content,
      state.secondname=type.name 
		}
	},
	actions:{

		//根据一级栏目Id查询栏目详情
		getSchooWebColumnByIdFunc({dispatch,commit},query){
			return new Promise((resolve,reject)=>{
				getSchooWebColumnById(query).then(res=>{
          let dataList=res.data.data;
				  commit('getSchooWebColumn',dataList);
					//console.log("ss",res.data.data);
			  	resolve(res);
				}).catch(error=>{
					reject(error);
				})
			})
    },
    // ,
    getSchoolWebModuleByIdFunc({dispatch,commit},query){
			return new Promise((resolve,reject)=>{
				getSchoolWebModuleById(query).then(res=>{
					//console.log(res);
					let dataList=res.data.data;
					//console.log("sws",dataList);
				  commit('getSchoolWebModuleById',dataList);
					//console.log("ss",res.data.data);
			  	resolve(res);
				}).catch(error=>{
					reject(error);
				})
			})
		}
  }
  
}

export default detail;