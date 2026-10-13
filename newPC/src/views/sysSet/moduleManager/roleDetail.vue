<template>
  <div class="app-container moduleManage-wrap">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
        </el-col>
      </el-row>
    </div>
    <div class="mainCont" :style="`height: ${nobottommaxH}px;`">
      <ul class="clearfix">
        <li class="clearfix" v-for="(roleUserItem,roleUserIndex) in roleUserList" :key="roleUserIndex">
          <div class="left-Title">
            <span>{{roleUserItem.roleName}}</span>
          </div>
          <div class="right-Text">
            <span class="textItem" v-for="(subItem,subIndex) in roleUserItem.userList" :key="subIndex">
              {{subItem.name}}
            </span>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce';
import {roleSee} from '@/api/system';
import mixin from '@/mixins/windowResize';
export default{
  data(){
    return{
      code:this.$route.query.moduleCode,
      roleUserList:[]
    }
  },
  created(){
    this.roleSeeFunc();
  },
  mounted(){

  },  
  mixins:[mixin],
  methods:{
    goback(){
      this.$router.push({
        path:'index'
      })
    },
    roleSeeFunc(){
      roleSee({
        moduleCode:this.code
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.roleUserList=data.data;
        }
      })
    },
    roleSearch:debounce(function(){
      this.moduleManageIndexFunc();
    },500)
  }
}
</script>
<style lang="scss" scoped>
.moduleManage-wrap{
  overflow:hidden;
}
.header{
  border-bottom: 1px solid #e7eaec;
  padding-bottom:10px;
}
.clearfix:after{
  content:"";
  height:0;
  display: block;
  clear: both;
  visibility: hidden;
}
.mainCont{
  width:100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top:20px;
}
.mainCont::-webkit-scrollbar-thumb {
  background: #99a9bf;
  border-radius: 20px;
}
.mainCont::-webkit-scrollbar {
  width: 6px;
}
.mainCont::after {
  top: 0;
  right: 0;
  width: 0px;
  height: 100%;
}
.mainCont li{
  list-style-type: none;
  width:810px;
  box-sizing: border-box;
  margin-bottom:20px;
  margin: 0 auto;
}
.left-Title{
  float:left;
  color: #333;
  font-weight: 600;
  width: 140px;
  text-align: right;
  font-size:14px;
  margin-right:2%;
  line-height:24px;
}
.right-Text{
  float:left;
  width:78%;
  line-height:24px;
  span{
    margin-right:6px;
    font-size:14px;
    color:#666;
  }
}
</style>