<template>
  <div class="checkWorkAttendanceStatistics">
    <div class="header">

        <el-col :span="19">
             <term-grade-class-selector :queryArgs="queryArgs"   @input="getSchoolBehaviorStuCallAttanceLists()" ref="selector" v-model="obj" ></term-grade-class-selector>  
         <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `课堂考勤统计(学生).xlsx`)"   v-if="datalist.length>0">导出</el-button>
            </el-col>
            <el-col :span="5">
              <el-input  size="medium" placeholder="请输入学生姓名" v-model.trim="name" @input="handleInputChange">
            <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
       </el-input>
            </el-col>
     </div>
    <div>
           <el-table  :data="mydatalist"  border stripe  :height="nobottommaxH">
                <el-table-column   prop="studentNo" label="学号" sortable align="center"> </el-table-column>
                <el-table-column   prop="studentName" label="姓名" sortable  align="center"> </el-table-column>
                <el-table-column   prop="toCount" label="到勤次数（节）" sortable align="center"> </el-table-column>
                <el-table-column   prop="lateCount" label="迟到次数（节）" sortable align="center"> </el-table-column>
                <el-table-column   prop="leaveCount" label="请假次数（节）" sortable align="center"> </el-table-column>
                <el-table-column   prop="notTotCount" label="缺勤次数（节）" sortable align="center"> </el-table-column>
            </el-table>
    </div>
    <div style="display: none;" id="outTable">
           <el-table  :data="datalist"  border stripe  :height="maxH">
                <el-table-column   prop="studentNo" label="学号" sortable align="center"> </el-table-column>
                <el-table-column   prop="studentName" label="姓名" sortable  align="center"> </el-table-column>
                <el-table-column   prop="toCount" label="到勤次数（节）" sortable align="center"> </el-table-column>
                <el-table-column   prop="lateCount" label="迟到次数（节）" sortable align="center"> </el-table-column>
                <el-table-column   prop="leaveCount" label="请假次数（节）" sortable align="center"> </el-table-column>
                <el-table-column   prop="notTotCount" label="缺勤次数（节）" sortable align="center"> </el-table-column>
            </el-table>
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import baseMixin from '@/mixins/baseMixin';
import moment from "moment";
import {getSchoolBehaviorStuCallAttanceList} from '@/api/classroomEvaluation';
import TermGradeClassSelector from "@/components/TermGradeClassSelector";
import {possessRole} from "@/api/classroomEvaluationtwo";
export default {
  data(){
    return{
      schoolName:'',
      schoolTimeCode:'',
      classId:'',
      startDate:'',
      endDate:'',
      classlist:[],
      datalist:[],
      mydatalist:[],
      name:'',
       queryArgs: {
        all: false, //所有班级年级
        manager: true, //班主任
        notlimit: false, //所有班级年级
        submanager: true, //副班主任
        teacher: true //普通所交
      },  
      obj: {
        termId: "",
        duration: ["", ""],
        gradeId: "",
        classId: ""
      },
    }
  },
  created(){
      possessRole(231).then(res => {
        this.queryArgs.all=res.data.data.result;
     this.queryArgs.notlimit=res.data.data.result;
     this.queryArgs.manager=!res.data.data.result;
     this.queryArgs.submanager=!res.data.data.result;  
     this.queryArgs.teacher=!res.data.data.result; 
     this.getSchoolBehaviorStuCallAttanceLists();
      });
  },
  mixins:[mixins,baseMixin],
  components: { TermGradeClassSelector },
  methods:{
    //前端搜索
    handleInputChange(){
      let list=[];
      for(let i=0;i<this.datalist.length;i++){
        if(this.datalist[i].studentName.indexOf(this.name) !== -1){
          list.push(this.datalist[i])
        };
      };
      this.mydatalist=list;

    },
  
    //获取列表
    getSchoolBehaviorStuCallAttanceLists(){
        this.datalist=[];
        this.name=''
        this.startDate = this.$moment(this.obj.duration[0]).format('YYYY-MM-DD'); //时间
        this.endDate = this.$moment(this.obj.duration[1]).format('YYYY-MM-DD'); //时间
        if(this.obj.classId=='') {return};
        getSchoolBehaviorStuCallAttanceList(this.obj.classId,this.obj.termId,this.startDate,this.endDate).then(res=>res.data).then(data=>{
           if(data.code===200){
               this.datalist=data.data;
               this.mydatalist=this.datalist;
            }
        })
    }

  }
}
</script>
<style scoped>
 .el-range-editor--medium .el-range-separator {
    width: 30px;
}
</style>
<style lang="scss" scoped>
.checkWorkAttendanceStatistics{
  padding:12px;
  box-sizing: border-box;
  font-size:14px;
  *{
    box-sizing: border-box;
  }
 .header{
    padding-bottom:10px;
    overflow: hidden;
   
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 240px;
    }
    .el-select {
        width: 165px;
    }
    .search-input--right {
    width: 190px !important;
}


}
</style>

