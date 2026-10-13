<template>
  <div class="app-container moduleManage-wrap">
    <div class="header">
      <el-row>
        <el-col :span="19">&nbsp;</el-col>
        <el-col :span="5">
          <el-input placeholder="应用名称"  size="medium" icon="el-icon-search" class="search-input" v-model.trim="moduleName" @keyup.enter.native="roleSearch">
            <el-button slot="append" icon="el-icon-search" @click="roleSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="mainCont" :style="{  height: (nobottommaxH) + 'px' }">
      <ul class="app-row clearfix">
        <li class="app-tag" v-for="(moduleItem,moduleIndex) in moduleList" :key="moduleIndex">
          <img class="appLogoImg" :src="moduleItem.logoUrl" alt="">
          <div class="app-info">
            <p class="title">{{moduleItem.name}}</p>
            <p class="desc" title="作业模块 中小学">{{moduleItem.profile}}</p>
          </div>
          <span class="add_check">
            <a href="javascript:;" @click="justTo(moduleItem.code)">角色查看</a>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce';
import {moduleManageIndex} from '@/api/system';
import mixin from '@/mixins/windowResize';
export default{
  data(){
    return{
      moduleName:'',
      moduleList:[]
    }
  },
  created(){
    this.moduleManageIndexFunc();
  },
  mounted(){

  },  
  mixins:[mixin],
  methods:{
    justTo(code){
      this.$router.push({
        path:'roleDetail',
        query:{
          moduleCode:code
        }
      })
    },
    moduleManageIndexFunc(){
      moduleManageIndex({
        moduleName:this.moduleName
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.moduleList=data.data;
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
  .app-row{
    width:100%;
    padding:0;
    padding-right:6px;
  }
  .app-tag{
    float:left;
    width:32%;
    margin-right:2%;
    margin-bottom:2%;
    border: 1px solid #E0E0E0;
    list-style-type: none;
    position: relative;
    padding:20px;
    box-sizing: border-box;
    border-radius:4px;
    overflow: hidden;
  }
  .app-tag:nth-child(3n){
    margin-right:0;
  }
  .appLogoImg{
    float:left;
    width:60px;
    height:60px;
    border-radius:4px;
    background-size:cover;
    overflow: hidden;
    margin-right:10px;
  }
  .app-info{
    float:left;
    width: 50%;
    .title{
      font-size: 14px;
      overflow: hidden;
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin:0;
    }
    .desc{
      word-break: break-all;
      margin-top: 8px;
      font-size: 12px;
      line-height: 18px;
      color: #999;
      height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      margin:0;
      margin-top:6px;
    }
  }
  .add_check{
    position:absolute;
    right:20px;
    top:20px;
    display:block;
    cursor: pointer;
    line-height:18px;
    a{
      font-size:12px;
      color: #4787c5;
    }
    a:hover{
      text-decoration: underline;
    }
  }
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
</style>
