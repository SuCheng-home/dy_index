<template>
<div class="campusCirclelistone">
   <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="按老师统计" name="one">
        <div class="top"> 
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>   
    </div>        
     <div class="subject" :style="`height: ${nobottommaxH-60}px;overflow: auto;`">
         <div class="title">统计汇总</div>
          <el-table stripe ref="multipleTable" border :data="numlist" tooltip-effect="dark" >
                <el-table-column  align="center" :label="item" v-for="(item,index) in namelist" :key="index">
                    <template slot-scope="scope">
                       {{scope.row.list[index]}}
                    </template>
                </el-table-column>
            </el-table>
        
         <div class="title">分类统计</div>
          <el-table stripe ref="multipleTable" border :data="dataList" tooltip-effect="dark" >
                <el-table-column prop="userName" align="center"  label="姓名"></el-table-column>
                <el-table-column prop="digestCount" align="center" label="加精数"></el-table-column>
                <el-table-column prop="fabulousCount" align="center" label="点赞数"></el-table-column>
                <el-table-column prop="commentCount" align="center" label="评论数"></el-table-column>
            </el-table>
         
              
     </div>
      </el-tab-pane>
      <el-tab-pane label="按学生统计" name="two" ></el-tab-pane>
     </el-tabs>  
    
</div>  
</template>
<script>
import mixin from "@/mixins/windowResize";
import {getThSchoolCircleAnalysisDataList,getSchoolCircleAnalysisData} from "@/api/campusCircle";
export default {
  data() {
    return {
      dataList: [],
      activeName:'one',
      id: this.$route.query.id,
      namelist:["帖子总数","精华贴"],
      numlist:[{list:[]}],
    };
  },
  mixins: [mixin],
  mounted() {
  this.getThSchoolCircleAnalysisDataLists();
  this.getSchoolCircleAnalysisDatas();
  },
  methods: {
      getSchoolCircleAnalysisDatas(){
         getSchoolCircleAnalysisData(this.id).then(res => res.data)
        .then(data => {
            this.numlist[0].list.push(data.data.circleCount);
            this.numlist[0].list.push(data.data.digestCount);            
            for(let i=0;i<data.data.topicOptions.length;i++){
                this.namelist.push(data.data.topicOptions[i].optionName);
                this.numlist[0].list.push(data.data.topicOptions[i].optionCount);
            }
            this.numlist[0].list.push(data.data.commentCount);
            this.numlist[0].list.push(data.data.fabulousCount);
            this.numlist[0].list.push(data.data.videoCount);
            this.numlist[0].list.push(data.data.picCount);
            this.namelist.push("评论总数");
            this.namelist.push("点赞总数");
            this.namelist.push("视频总数");
            this.namelist.push("图片总数");
        });
      },
      getThSchoolCircleAnalysisDataLists(){
        getThSchoolCircleAnalysisDataList(this.id).then(res => res.data)
        .then(data => {
            this.dataList=data.data;
        });
      },
      tabsfun(){
        if(this.activeName=='two'){
          this.$router.replace({
            path: "campusCirclelisttwo",
            query: { id: this.id }
          });
        }
      }
  }
};
</script>
<style lang="scss" scoped>
.campusCirclelistone{
    padding: 12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .title{
          line-height: 20px;
    font-size: 16px;
    border-left: 3px solid #409eff;
    padding-left: 10px;
    margin: 15px 0;
    color:#606266;
  }
}
</style>
