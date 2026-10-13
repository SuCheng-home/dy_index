<template>
<div class="classroomEvaluationtwotwo">
 <!-- <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="课堂评价统计(单)" name="three" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"></el-tab-pane>
  <el-tab-pane label="课堂评价老师统计" name="four" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"></el-tab-pane>
  <el-tab-pane label="课堂评价学期统计" name="one" v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"></el-tab-pane>
  <el-tab-pane label="课堂评价统计" name="two" v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"> -->
   <div class="top"> 
            <term-grade-class-selector :queryArgs="queryArgs"   @input="classBehEvalStuScores()" ref="selector" v-model="obj" ></term-grade-class-selector>  
            <el-select size="medium" style="width: 140px;" v-model="query.behTypeId" placeholder="请选择考核项" @change="classBehEvalStuScores()">
                <el-option label="全部考核项" value="0"></el-option>
                <el-option v-for="item in typelist" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>            
            <a :href="exportUrl" download="导出" target="_blank" v-if="behEvalStuList.length">
                            <el-button type="primary" size="medium" icon="upload">导出</el-button>
                        </a>         
      </div>
       <el-table stripe :data="behEvalStuList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="姓名" align="center">
                           <template slot-scope="scope">
                              <el-button  @click.native.prevent="classroomEvaluationtwotwodetails(scope.row)"  type="text" size="small">{{scope.row.studentName}}</el-button>
                          </template>
                        </el-table-column>   
                        <el-table-column v-for="(item,index) in currList" :key="index" :label="item.curriculumName" align="center">
                             <template slot-scope="scope">{{ scope.row.stuScoreStringList[index].split(",")[2] }}</template>
                        </el-table-column>  
                        <el-table-column label="分数" align="center"  prop="totalScore"></el-table-column>                         
                        <el-table-column label="排名" align="center"  prop="stuRank"></el-table-column>   
      </el-table>

  <!-- </el-tab-pane>  
</el-tabs> -->
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import {isShowByPermission} from '@/utils/utils';
import {classBehEvalStuScore,getSchoolBehaviorTypeListBySchoolId,possessRole} from "@/api/classroomEvaluationtwo";
import TermGradeClassSelector from "@/components/TermGradeClassSelector";
export default {
  components: { TermGradeClassSelector },
  data() {
    return {
      activeName:'two', 
      query: {
        classId:"",//	班级id	number	
        behTypeId:"0",
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
      typelist:[],
      currList:[],
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
      this.getSchoolBehaviorTypeListBySchoolIds();  
      });
     
  },
  methods: {
    isShowByPermission,
     getSchoolBehaviorTypeListBySchoolIds() {
      getSchoolBehaviorTypeListBySchoolId(0) //加分
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          for (let i = 0; i < mydata.length; i++) {
            this.typelist.push({
              id: mydata[i].id,
              name: mydata[i].title + "（加）"
            });
          }
          getSchoolBehaviorTypeListBySchoolId(1) //减分
            .then(res => res.data)
            .then(data => {
              let mydata = data.data;
              for (let i = 0; i < mydata.length; i++) {
                this.typelist.push({
                  id: mydata[i].id,
                  name: mydata[i].title + "（减）"
                });
              }
            });
        });
    },
   
    classBehEvalStuScores(){  
        this.behEvalStuList=[];
        this.currList=[];  
        this.query.classId=this.obj.classId;
        this.query.schoolTimeId=this.obj.termId;
        this.query.startDate = this.$moment(this.obj.duration[0]).format('YYYY-MM-DD'); //时间
        this.query.endDate = this.$moment(this.obj.duration[1]).format('YYYY-MM-DD'); //时间
        if(this.query.classId){

        }else{
          return;
        }
        this.exportUrl = `${global.homeworkfetch}structure/schoolBehEval/exportClassBehEvalStuScore?token=${this.$store.getters.token}&schoolTimeId=${this.query.schoolTimeId}&behTypeId=${this.query.behTypeId}&classId=${this.query.classId}&endDate=${this.query.endDate}&startDate=${this.query.startDate}`;
        classBehEvalStuScore(this.query).then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.behEvalStuList=data.data.behEvalStuList;
            this.currList=data.data.currList;
          }
        });
    },
    classroomEvaluationtwotwodetails(obj){
       this.$router.push({
            path: "classroomEvaluationtwotwodetails",
            query:{
              classId:obj.classId,
              name:obj.studentName,
              studentId:obj.studentId,
              schoolTimeId:this.query.schoolTimeId
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
.classroomEvaluationtwotwo{
    padding: 12px;
    .top {
        padding-bottom: 10px;
    }
}
</style>
