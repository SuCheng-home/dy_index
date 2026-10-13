<template>
    <div class="classroomEvaluationtwofour">
        <!-- <el-tabs type="border-card"  v-model="activeName" @tab-click="activeNamefun()">               
                <el-tab-pane label="课堂评价统计(单)" name="three" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"></el-tab-pane>
                <el-tab-pane label="课堂评价老师统计" name="four" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"> -->
                    <div class="top">
                        <el-select size="medium" v-model="query.schoolTimeId" placeholder="请选择学期" @change="changeSchool()">
                           <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName" :value="item.id"></el-option>
                        </el-select>
                        <el-date-picker size="medium" v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"  @change="teacherBehEvalStuScores()" :clearable="false" >
                        </el-date-picker>
                        <a :href="exportUrl" download="导出" target="_blank"  v-if="behEvalThList.length">
                            <el-button type="primary" size="medium" icon="upload">导出</el-button>
                        </a>
                        <el-button  type="primary" size="medium" @click="sendThCommonAnalysisByThs()">发送老师学期报告</el-button>
                    </div>
                   <el-table stripe :data="behEvalThList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="姓名" align="center" sortable prop="teacherUserName"></el-table-column>   
                        <el-table-column label="课时数" align="center" sortable prop="sectionNoCount"></el-table-column> 
                        <el-table-column label="评价次数" align="center" sortable prop="totalCount"></el-table-column>  
                        <el-table-column label="加分次数" align="center" sortable prop="addCount"></el-table-column> 
                        <el-table-column label="扣分次数" align="center" sortable prop="lessCount"></el-table-column> 
                        <el-table-column v-for="(item,index) in behaviorTypeList" :key="index" :label="item.title+(item.type==0?'(加)':'(减)')" align="center">
                             <template slot-scope="scope">{{ scope.row.stuScoreStringList[index] }}</template>
                        </el-table-column>                        
                    </el-table>
                <!-- </el-tab-pane>
                <el-tab-pane label="课堂评价学期统计" name="one"  v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"></el-tab-pane>
                <el-tab-pane label="课堂评价统计" name="two" v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"></el-tab-pane> -->
    </el-tabs>
    </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {isShowByPermission} from '@/utils/utils';
import { sendThCommonAnalysisByTh,teacherBehEvalStuScore,getSchoolTimeAllList,possessRole} from "@/api/classroomEvaluationtwo";
export default {
  data() {
    return {
      activeName: "four",
      query: {
        schoolTimeId: "",
        startDate: "",
        endDate: ""
      },
      schoolYearList:[],
      daterange:["",""],
      behEvalThList:[],
      behaviorTypeList:[],
      exportUrl:null,
      result:false
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
       //学期列表
      getSchoolTimeAllList().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.schoolYearList=data.data;
          this.schoolYearList.forEach(item=>{
            if(item.isCurrent==1){
              this.query.schoolTimeId=item.id;          
              this.daterange= [item.startDate, this.$moment().format('YYYY-MM-DD')];
               possessRole(50).then(res => {
                 this.result=res.data.data.result;
                 this.teacherBehEvalStuScores();
              });
              
            }
          })
        }
      })
  },
  methods: {
     isShowByPermission,
    teacherBehEvalStuScores(){
        this.datalist=[];
        this.query.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
        this.query.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
        this.exportUrl = `${global.homeworkfetch}structure/schoolBehEval/exportTeacherBehEvalStuScore?token=${this.$store.getters.token}&schoolTimeId=${this.query.schoolTimeId}&endDate=${this.query.endDate}&startDate=${this.query.startDate}`;
        teacherBehEvalStuScore(this.query).then(res=>res.data).then(data=>{
           if(data.code===200){            
            if(this.result){
                this.behEvalThList=data.data.behEvalThList;
            }else{
              for(let i=0;i<data.data.behEvalThList.length;i++){
                if(data.data.behEvalThList[i].teacherUserId==this.userInfo.id){
                   this.behEvalThList=[data.data.behEvalThList[i]]
                }
              }
            }
            this.behaviorTypeList=data.data.behaviorTypeList;
            }
        })
    },
     //切换学期
    changeSchool(){
      let schoolItem='';
      for(let i=0;i<this.schoolYearList.length;i++){
        if(this.schoolYearList[i].id==this.query.schoolTimeId){
            schoolItem=this.schoolYearList[i]
        }
      };
      if(schoolItem.isCurrent==1){
        if(schoolItem.startDate>this.$moment().format('YYYY-MM-DD')){
            this.daterange= [ this.$moment().format('YYYY-MM-DD'),schoolItem.startDate];
        }else{
            this.daterange= [schoolItem.startDate, this.$moment().format('YYYY-MM-DD')];
        }
          
      }else{
          this.daterange= [schoolItem.startDate, schoolItem.endDate];
      };
      this.teacherBehEvalStuScores()
    },
    activeNamefun() {
      if (this.activeName == "one") {
        this.$router.push({
          path: "classroomEvaluationtwoone"
        });
      }
      if (this.activeName == "two") {
        this.$router.push({
          path: "classroomEvaluationtwotwo"
        });
      }
      if (this.activeName == "three") {
        this.$router.push({
          path: "classroomEvaluationtwothree"
        });
      }
      if (this.activeName == "four") {
        this.$router.push({
          path: "classroomEvaluationtwofour"
        });
      }
    },
    sendThCommonAnalysisByThs() {
      this.$confirm("是否发送老师学期报告？", "发送", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        sendThCommonAnalysisByTh(this.query.schoolTimeId).then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "发送成功！",
              type: "success",
              duration: 1000
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.classroomEvaluationtwofour {
  padding: 12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
