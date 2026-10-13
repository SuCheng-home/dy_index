<template>
<div class="classroomEvaluationtwotwo">
   <div class="top"> 
            <term-grade-class-selector :isGradeShowAll='false' :queryArgs="queryArgs"   @input="classBehaviorStuScore()" ref="selector" v-model="obj" ></term-grade-class-selector>  
              <a :href="exportUrl" download="导出" target="_blank" v-if="behEvalStuList.length">
                            <el-button type="primary" size="medium" icon="upload">导出</el-button>
                        </a>   
               <a :href="newexportUrl" download="导出" target="_blank" >
                            <el-button type="primary" size="medium" icon="upload">导出全部</el-button>
                        </a>         
      </div>
       <el-table stripe :data="behEvalStuList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="姓名" align="center">
                           <template slot-scope="scope">
                              {{scope.row.studentName}}
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
import {classBehaviorStuScore} from "@/api/classroomEvaluation";
import {possessRole} from "@/api/classroomEvaluationtwo";
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
        classId: "",
        className:""
      },
      currList:[],
      behEvalStuList:[],
      exportUrl:null,
      newexportUrl:null
    };
  },
  mixins: [mixin],
  mounted() {
     possessRole(50).then(res => {
        this.queryArgs.all=res.data.data.result;
     this.queryArgs.notlimit=res.data.data.result;
     this.queryArgs.manager=!res.data.data.result;
     this.queryArgs.submanager=!res.data.data.result;  
     this.queryArgs.teacher=!res.data.data.result; 
     this.classBehaviorStuScore();
      });
     
  },
  methods: {
    classBehaviorStuScore(){  
      if(this.obj.termId){
        this.behEvalStuList=[];
        this.currList=[];  
        this.query.classId=this.obj.classId;
        this.query.gradeId=this.obj.gradeId;
        this.query.schoolTimeId=this.obj.termId;
        this.query.startDate = this.$moment(this.obj.duration[0]).format('YYYY-MM-DD'); //时间
        this.query.endDate = this.$moment(this.obj.duration[1]).format('YYYY-MM-DD'); //时间       
        this.exportUrl = `${global.homeworkfetch}/structure/schoolBehavior/exportClassBehaviorStuScore?token=${this.$store.getters.token}&gradeId=${this.obj.gradeId}&schoolTimeId=${this.query.schoolTimeId}&classId=${this.query.classId}&endDate=${this.query.endDate}&startDate=${this.query.startDate}&lastFileName=${this.obj.className}`;
        this.newexportUrl = `${global.homeworkfetch}/structure/schoolBehavior/exportClassBehaviorStuScore?token=${this.$store.getters.token}&gradeId=0&schoolTimeId=${this.query.schoolTimeId}&classId=0&endDate=${this.query.endDate}&startDate=${this.query.startDate}`;
        classBehaviorStuScore(this.query).then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.behEvalStuList=data.data.behhaviorStuList;
            this.currList=data.data.currList;
          }
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
