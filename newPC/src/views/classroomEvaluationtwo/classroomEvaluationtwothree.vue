<template>
<div class="classroomEvaluationtwothree">
 <!-- <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()"> 
  <el-tab-pane label="课堂评价统计(单)" name="three" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"> -->
        <div class="top"> 
            <term-grade-class-selector :queryArgs="queryArgs"   @input="queryCoursesByClassIds()" ref="selector" v-model="obj" ></term-grade-class-selector>  
            <el-select size="medium" style="width: 140px;" v-model="query.curriculumId" placeholder="请选择科目" @change="classBehEvalCurrStuScores()">
                <el-option v-for="item in cuurlist" :key="item.id" :label="item.otherName" :value="item.id"></el-option>
            </el-select>            
            <a :href="exportUrl" download="导出" target="_blank" v-if="behEvalStuList.length">
                            <el-button type="primary" size="medium" icon="upload">导出</el-button>
                        </a>         
      </div>
       <el-table stripe :data="behEvalStuList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="姓名" align="center"  prop="studentName"></el-table-column>   
                        <el-table-column label="科目" align="center"  prop="curriculumName"></el-table-column> 
                        <el-table-column v-for="(item,index) in behaviorTypeList" :key="index" :label="item.title+(item.type==0?'(加)':'(减)')" align="center">
                             <template slot-scope="scope">{{ scope.row.stuScoreStringList[index] }}</template>
                        </el-table-column>  
                        <el-table-column label="分数" align="center"  prop="stuScore"></el-table-column>                         
                        <el-table-column label="排名" align="center"  prop="stuRank"></el-table-column>   
                    </el-table>
  <!-- </el-tab-pane>
  <el-tab-pane label="课堂评价老师统计" name="four" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"></el-tab-pane>
   <el-tab-pane label="课堂评价学期统计" name="one"  v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"></el-tab-pane>
  <el-tab-pane label="课堂评价统计" name="two"  v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"></el-tab-pane>
</el-tabs> -->
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import {isShowByPermission} from '@/utils/utils';
import {queryCoursesByClassId,classBehEvalCurrStuScore,possessRole} from "@/api/classroomEvaluationtwo";
import TermGradeClassSelector from "@/components/TermGradeClassSelector";
export default {
  components: { TermGradeClassSelector },
  data() {
    return {
      activeName:'three', 
      query: {
        classId:"",//	班级id	number	
        curriculumId:"",//	科目id	number	
        endDate:"",//	结束日期	string	
        schoolTimeId:"",//	学期id	number	
        startDate:"",//	开始日期	string	
      },
      queryArgs: {
        all: true, //所有班级年级
        manager: false, //班主任
        notlimit: true, //所有班级年级
        submanager: false, //副班主任
        teacher: false //普通所交
      },  
      obj: {
        termId: "",
        duration: ["", ""],
        gradeId: "",
        classId: ""
      },
      cuurlist:[],
      behaviorTypeList:[],
      behEvalStuList:[],
      exportUrl:null
    };
  },
  mixins: [mixin],
  computed:{
    ...mapGetters(['userInfo'])
  },
  mounted() {
    possessRole(50).then(res => {
        this.queryArgs.all=res.data.data.result;
     this.queryArgs.notlimit=res.data.data.result;
     this.queryArgs.manager=!res.data.data.result;
     this.queryArgs.submanager=!res.data.data.result;  
     this.queryArgs.teacher=!res.data.data.result;   
      });
       
  },
  methods: {
     isShowByPermission,
    queryCoursesByClassIds(){   
      if(this.obj.classId) {

      }else{
        this.behEvalStuList=[];
        this.behaviorTypeList=[];
        this.cuurlist=[];
        this.query.curriculumId="";
        return;
      }
       queryCoursesByClassId(this.obj.classId).then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.cuurlist=data.data;
            this.query.curriculumId=data.data[0].id;
            this.classBehEvalCurrStuScores();
          }
        });
    },
    classBehEvalCurrStuScores(){  
        this.behEvalStuList=[];
        this.behaviorTypeList=[];  
        this.query.classId=this.obj.classId;
        this.query.schoolTimeId=this.obj.termId;
        this.query.startDate = this.$moment(this.obj.duration[0]).format('YYYY-MM-DD'); //时间
        this.query.endDate = this.$moment(this.obj.duration[1]).format('YYYY-MM-DD'); //时间
        if(this.query.curriculumId&&this.query.classId){

        }else{
          return;
        }
        this.exportUrl = `${global.homeworkfetch}structure/schoolBehEval/exportCurrBehEvalStuScore?token=${this.$store.getters.token}&schoolTimeId=${this.query.schoolTimeId}&curriculumId=${this.query.curriculumId}&classId=${this.query.classId}&endDate=${this.query.endDate}&startDate=${this.query.startDate}`;
        classBehEvalCurrStuScore(this.query).then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.behEvalStuList=data.data.behEvalStuList;
            this.behaviorTypeList=data.data.behaviorTypeList;
          }
        });
    },
     activeNamefun(){
         if(this.activeName=='one'){
           this.$router.push({
            path: "classroomEvaluationtwoone"
          });
         }
         if(this.activeName=='two'){
           this.$router.push({
            path: "classroomEvaluationtwotwo"
          });
         }
         if(this.activeName=='three'){
           this.$router.push({
            path: "classroomEvaluationtwothree"
          });
         }
         if(this.activeName=='four'){
           this.$router.push({
            path: "classroomEvaluationtwofour"
          });
         }
      },
     
  }
};
</script>
<style lang="scss" scoped>
.classroomEvaluationtwothree{
    padding: 12px;
    .top {
        padding-bottom: 10px;
    }
}
</style>
