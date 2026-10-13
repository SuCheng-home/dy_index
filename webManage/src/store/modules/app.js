const app ={
  state:{
    token:'',
    userInfo: {},
    schoolInfo: {},
    departInfo: {},
    roles:[]
  },
  mutations: {
    SET_TOKEN(state,payload){
      state.token=payload.token;
    },
    SET_USERINFO(state,userInfo){
      state.userInfo = userInfo;
    },
    SET_SCHOOLINFO(state,schoolInfo){
      state.schoolInfo = schoolInfo;
    },
    SET_DEPARTINFO(state,departInfo){
      state.departInfo = departInfo;
    },
    SET_ROLES(state,roles){
      state.roles=roles;
    }
  },
  actions: {
    SET_TOKEN({commit},payload){
      commit('SET_TOKEN',payload);
    },
    SET_LOGININFO({commit},payload){
      commit('SET_USERINFO',payload.userInfo);//用户信息
      commit('SET_SCHOOLINFO',payload.schoolInfo);//学校信息
      commit('SET_DEPARTINFO',payload.departInfo);//部门信息
      commit('SET_ROLES',payload.roleList);//	用户的角色列表
    },
    
  }
}
export default app;