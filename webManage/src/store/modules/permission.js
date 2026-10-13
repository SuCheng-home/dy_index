import {  permissions } from '@/api/index';
const permission={
  state:{
    permission:[],
    permissionNameMapping:{}
  },
  mutations: {
    SET_PERMISSIONS(state,permission){
      const permissionList=[];
      const permissionNameMapping={};
      function getPermission(permission){
        permission.forEach(permissionItem=>{
          permissionList.push(permissionItem.url.trim());
          permissionNameMapping[permissionItem.url.trim()]=permissionItem.name.trim();
          if(permissionItem.children && permissionItem.children.length !== 0) {
              getPermission(permissionItem.children)
          }
        })
      }
      getPermission(permission);
      state.permissionNameMapping = permissionNameMapping;
      state.permission = permissionList;
    }
  },
  actions: {
    GetPermission({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
          permissions().then(response => response.data)
              .then(data => {
                  commit('SET_PERMISSIONS', data.data);
                  resolve();
              })
              .catch(error => {
                  reject(error);
              });
      });
    },
  }
}
export default permission;