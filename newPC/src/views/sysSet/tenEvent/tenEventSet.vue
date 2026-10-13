<template>
  <div class="tenEventSet">
    <div class="el-row menu-tools">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>
    <div class="main-wrap">
      <ul class="itemUl clearfix">
        <li class="itemLi" v-for="(gradeItem,gradeIndex) in gradeList" :key="gradeIndex">
          <a href="javascript:;" @click="jumpTo('tenEventList',{gradeLevel:gradeIndex+1,gradeName:gradeItem.name})">
            <div class="gradeTitle">{{gradeItem.name}}</div>
            <div class="termBox clearfix">
              <div class="term">
                <span class="termName">上学期：</span>
                <span class="termText">{{gradeItem.lastCount?gradeItem.lastCount:0}}项</span>
              </div>
              <div class="term">
                <span class="termName">下学期：</span>
                <span class="termText">{{gradeItem.nextCount?gradeItem.nextCount:0}}项</span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import {querySchoolGrade,findThingsGroupByGradeId} from '@/api/systemSet/tenEvent';
export default{
  data(){
    return{
      gradeList:[]
    }
  },
  created(){
    this.querySchoolGradeFunc();
  },
  mounted(){

  },
  methods:{
    querySchoolGradeFunc(){
      querySchoolGrade({
        isFilterNewGrade:true
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.gradeList=data.data;
          findThingsGroupByGradeId().then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              let eventData=data.data;
              this.gradeList.forEach((item,index)=>{
                eventData.forEach((subItem,subIndex)=>{
                  if(index+1==subItem.gradeLevel){
                    Vue.set(item,"lastCount",subItem.lastCount);
                    Vue.set(item,"nextCount",subItem.nextCount);
                  }
                })
              })
            }
          })
        }
      }).catch(()=>{})
    },
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    },
    goback(){
      this.$router.back();
    }
  }
}
</script>
<style lang="scss" scoped>
.tenEventSet{
  padding:12px;
  box-sizing: border-box;
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
}
.itemUl{
  padding:0;
  margin:0;
  .itemLi{
    float: left;
    width: 22%;
    margin: 0 4% 10px 0;
    color: #000;
    height: 140px;
    line-height: 140px;
    text-align: center;
    border-radius: 6px;
    overflow: hidden;
    a{
      display: block;
      text-decoration: none;
      background: #f2f2f2;
      position: relative;
      padding:20px;
      box-sizing: border-box;
    }
    .gradeTitle{
      height:60px;
      text-align: center;
      font-size:18px;
      font-weight: bold;
      line-height: 60px;
    }
    .termBox{
      height:40px;
      line-height:40px;
      font-size:14px;
    }
    .term{
      float: left;
      width:50%;
      padding:0 1%;
      line-height:24px;
      box-sizing: border-box;
    }
    a:hover{
      background:#409EFF;
      color:#fff;
    }
  }
  .itemLi:nth-child(4n){
    margin-right:0;
  }
}
</style>
