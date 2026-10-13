<template>
  <div class="itemEnter padding addTabSwitch">
    <div class="botton" v-if="isStandalone">
        <span @click="jumpPage('fitnessList')" >数据汇总</span>
        <span @click="jumpPage('batchImport')">批量导入</span>
        <span  class="tab-left tabcolor">按项录入</span>
        <span class="tab-right" @click="jumpPage('studentEnter')">按学生录入</span>
    </div> 
    <ul class="itemUl clearfix">
      <li class="itemLi" v-for="(projectType,typeIndex) in projectTypeList"  :key="typeIndex" @click="jumpTo(projectType.projectType)">
        <a href="javascript:;" >
          {{projectType.addProjectName}}
          <span class="tag1" v-if="projectType.projectType==5">3-6年级</span>
          <span class="tag1" v-if="projectType.projectType==6">5-6年级</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
  data(){
    return{
      projectTypeList:[
        {
          projectType:"1,2",
          addProjectName:"身高体重,肺活量"
        },
        {
          projectType:"3",
          addProjectName:"50米跑"
        },
        {
          projectType:"4",
          addProjectName:"坐位体前屈"
        },
        {
          projectType:"7",
          addProjectName:"一分钟跳绳"
        },
        {
          projectType:"8",
          addProjectName:"视力"
        },
        {
          projectType:"5",
          addProjectName:"1分钟仰卧起坐"
        },
        {
          projectType:"6",
          addProjectName:"50米*8往返跑"
        }
      ]
    }
  },
  created(){

  },
  mounted(){

  },
  computed: {
      ...mapGetters([
          'isStandalone'
      ])
  },
  methods:{
    jumpPage(path,query={}){
      this.$router.push({
          path,
          query
      })
    },
    jumpTo(type){
      this.$router.push({
        path:'addItem',
        query:{
          type:type
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addTabSwitch .botton {
    width: 80%;
    overflow: hidden;
    margin:0 auto 20px;
}
.addTabSwitch .botton span {
    width: 25%;
    line-height: 34px;
    font-size:16px;
    float: left;
    text-align: center;
    background: #fff;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    cursor: pointer;
}
.addTabSwitch .botton .tabcolor {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
    -webkit-box-shadow: -1px 0 0 0 #20a0ff;
    box-shadow: -1px 0 0 0 #20a0ff;
}
.addTabSwitch .botton .tab-right {
  border-radius: 0 4px 4px 0;
}
.addTabSwitch .botton .tab-left {
  border-radius: 4px 0 0 4px;
}
.padding{
  padding:12px;
  box-sizing: border-box;
}
.clearfix:after{
  content:'';
  display: block;
  height:0;
  clear: both;
  visibility: hidden;
}
.itemEnter{
  .itemUl{
    li{
      float:left;
      width:22%;
      margin:0 4% 40px 0;
      color:#000;
      height:140px;
      line-height: 140px;
      text-align: center;
      border-radius:6px;
      overflow: hidden;
      a{
        display: block;
        text-decoration: none;
        font-size:20px;
        color:#000;
        font-weight: bold;
        background:#F2F2F2;
        position: relative;
      }
      a:hover{
        background:#409EFF;
        color:#fff;
        .tag1{
          color:#fff;
        }
      }
      .tag1{
        display: block;
        position: absolute;
        left:0;
        width:100%;
        top:30px;
        color:#1893FB;
        text-align: center;
        font-size:14px;
        z-index:10;
      }
      .tag1{
        display: block;
        position: absolute;
        left:0;
        width:100%;
        top:30px;
        color:#1893FB;
        text-align: center;
        font-size:14px;
        z-index:10;
      }
    }
    li:nth-child(4){
      margin-right:0;
    }
  }
}
</style>

