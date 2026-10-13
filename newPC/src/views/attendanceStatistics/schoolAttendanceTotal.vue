<template>
  <div class="schoolAttendanceTotal">
    <div class="header">
      <el-date-picker v-model.trim="reportDate" size="medium" type="date" :clearable="false" placeholder="请选择日期" @change="timeChangeHandler"></el-date-picker>
      <el-button type="primary" size="medium"  v-if="studentList.length||studentListOther.length"
        @click="exportAllTable()">导出</el-button>
    </div>

    <div class="duty_school_list_box scrollBar" :style="`height:${boxH}px`">
      <el-table stripe :data="studentList" border style="width: 100%;" id="outTable">
        <el-table-column label="中小学" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.LearningStagesName.indexOf('共计')!==-1">
              <span>{{scope.row.LearningStagesName}}</span>
            </span>
            <span @click="jumpDifferent(scope.row)" class="school_title" v-else>
              <span>{{scope.row.LearningStagesName}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="应到" align="center">
          <template slot-scope="scope">
            {{scope.row.stuCount}}
          </template>
        </el-table-column>
        <el-table-column label="实到" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? scope.row.stuCount-scope.row.stuNoCome : '0'}}
          </template>
        </el-table-column>
        <el-table-column :label="typeItem.leaveTypeName" align="center" v-for="(typeItem,typeIndex) in typeList" :key="typeIndex">
          <template slot-scope="scope">
            {{scope.row.typeList[typeIndex].peopleCount}}
          </template>
        </el-table-column>
        <el-table-column label="到勤率" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? computeTotal(scope.row) : '0%'}}
          </template>
        </el-table-column>
      </el-table>
      <el-table stripe :data="studentListOther" border style="width: 100%;" id="outTable2">
        <el-table-column label="幼儿园" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span  class="school_title" @click="jumpDifferentOther(scope.row)">
              <span v-if="scope.row.LearningStagesName.indexOf('幼儿园')!==-1">学生</span>
              <span v-else>{{scope.row.LearningStagesName}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="应到" align="center">
          <template slot-scope="scope">
            {{scope.row.stuCount}}
          </template>
        </el-table-column>
        <el-table-column label="实到" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? scope.row.stuCount-scope.row.stuNoCome : '0'}}
          </template>
        </el-table-column>
        <el-table-column :label="typeItem.leaveTypeName" align="center" v-for="(typeItem,typeIndex) in typeListOther" :key="typeIndex">
          <template slot-scope="scope">
            {{scope.row.typeList[typeIndex].peopleCount}}
          </template>
        </el-table-column>
        <el-table-column label="到勤率" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? computeTotal(scope.row) : '0%'}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {getLearnStatgeListByDate,getLearnStatgeListByDateOther, getSchoolTimeDate} from "@/api/attendanceStatistics";

  export default {
    data() {
      return {
        isOnWeek: false,
        reportDate: this.$moment(new Date()).format('YYYY-MM-DD'),
        postcode:this.$route.query.postcode,//区code
        studentList:[],
        typeList:[],
        totalRow:{
          LearningStagesName:'共计',
          stuCount:0,
          stuNoCome:0,
          typeList:[]
        },
        thInfo:{},
        //幼儿园
        studentListOther:[],
        typeListOther:[],
        thInfoOther:{},
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e6就是不可以选择今天的
          }
        }
      }
    },
    created() {
      //根据区code,日期查询请假统计
      if(sessionStorage.getItem('schoolAttendDetail')){
        if(sessionStorage.getItem('schoolAttendDay')){
          this.reportDate=sessionStorage.getItem('schoolAttendDay');
        }else{
          this.reportDate=this.$moment(new Date()).format('YYYY-MM-DD');
        }
      }else{
        this.reportDate=this.$moment(new Date()).format('YYYY-MM-DD');
        sessionStorage.removeItem('schoolAttendDay');
      }
      this.getSchoolTimeDate();
      this.TwoTotalFunc();

    },
    beforeDestroy(){
      sessionStorage.removeItem("schoolAttendDetail");
    },
    mixins: [mixins,baseMixin],
    filters: {
      formatTimeMap(date) {
        return date?date.slice(0,19):'';
      }
    },
    methods: {
      exportAllTable(){
        this.exportExcel('#outTable', `${(this.reportDate)}考勤汇总数据统计.xlsx`);
        this.exportExcel('#outTable2', `${(this.reportDate)}幼儿园考勤汇总数据统计.xlsx`);
      },
      TwoTotalFunc(){
        this.getLearnStatgeListByDateFunc();
        this.getLearnStatgeListByDateOtherFunc();
      },
      jumpDifferent(row){
        if(row.learningStages){
          this.$router.push({
            path:'schoolAttendanceDetail',
            query:{
              learningStages:row.learningStages,
              postcode:this.postcode,
              leaveDate:this.reportDate,
              LearningStagesName:row.LearningStagesName,
              isOnWeek: this.isOnWeek ? 1 : 0
            }
          })
        }else{
          this.$router.push({
            path:'teacherAttendanceTotal',
            query:{
              postcode:this.postcode,
              leaveDate:this.reportDate,
              isOnWeek: this.isOnWeek ? 1 : 0
            }
          })
        }
      },
      jumpDifferentOther(row){
        if(row.learningStages){
          let LearningStagesName='';
          if(row.LearningStagesName.indexOf('幼儿园')!==-1){
            LearningStagesName="学生";
          }else{
            LearningStagesName=row.LearningStagesName;
          }
          this.$router.push({
            path:'schoolAttendanceDetail',
            query:{
              learningStages:row.learningStages,
              postcode:this.postcode,
              leaveDate:this.reportDate,
              LearningStagesName:LearningStagesName,
              kindergarten:1,
              isOnWeek: this.isOnWeek ? 1 : 0
            }
          })
        }else{
          this.$router.push({
            path:'teacherAttendanceTotal',
            query:{
              postcode:this.postcode,
              leaveDate:this.reportDate,
              kindergarten:1,
              isOnWeek: this.isOnWeek ? 1 : 0
            }
          })
        }
      },
      computeTotal(row){
        var aa=(((row.stuCount-row.stuNoCome)/row.stuCount)*100).toFixed(2)+'%';
        return aa;
      },
      timeChangeHandler(val){
        this.reportDate=this.$moment(val).format('YYYY-MM-DD');
        sessionStorage.setItem('schoolAttendDay',this.reportDate);
        this.getSchoolTimeDate();
        this.TwoTotalFunc();
      },
      getSchoolTimeDate(){
        getSchoolTimeDate(this.$moment(this.reportDate).format('YYYY-MM-DD')).then(res=>res.data).then(data=>{
          if(data.code===200 && data.data && data.data.weekDate === 1){
            this.isOnWeek = true;
          } else {
            this.isOnWeek = false
          }
        })
      },
      getLearnStatgeListByDateFunc(){
        getLearnStatgeListByDate({
          leaveDate:this.$moment(this.reportDate).format('YYYY-MM-DD'),
          postcode:this.postcode
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            const allSchoolData=data.data;
            const stuInfo=allSchoolData.stuInfo;
            this.studentList=stuInfo.learningList;//主数据
            this.typeList=stuInfo.typeList;
            this.totalRow.typeList=this.typeList;
            this.totalRow.stuCount=stuInfo.stuCount;
            this.totalRow.stuNoCome=stuInfo.stuNoCome;
            this.thInfo=allSchoolData.thInfo;
            this.thInfo={
              LearningStagesName:"教职工",
              stuCount:this.thInfo.thCount,
              stuNoCome:this.thInfo.thNoCome,
              typeList:this.thInfo.typeList
            }
            this.studentList.push(this.totalRow,this.thInfo);
          }
        })
      },
      getLearnStatgeListByDateOtherFunc(){
        getLearnStatgeListByDateOther({
          leaveDate:this.$moment(this.reportDate).format('YYYY-MM-DD'),
          postcode:this.postcode
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200&&data.data){
            const allSchoolData=data.data;
            const stuInfo=allSchoolData.stuInfo;
            //幼儿园
            // studentListOther:[],
            // typeListOther:[],
            // thInfoOther:{}
            if(stuInfo){
              this.studentListOther=stuInfo.learningList;//主数据
              this.typeListOther=stuInfo.typeList;
              this.thInfoOther=allSchoolData.thInfo;
              this.thInfoOther={
                LearningStagesName:"教职工",
                stuCount:this.thInfoOther.thCount,
                stuNoCome:this.thInfoOther.thNoCome,
                typeList:this.thInfoOther.typeList
              }
              this.studentListOther.push(this.thInfoOther);
            }
          }
        })
      },
      goBack() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="scss" scoped>
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
  }
  &::-webkit-scrollbar {
      width: 6px;
  }
  &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
  }
}
  .schoolAttendanceTotal {
    .header {
      margin-bottom: 0;
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
    }

    .duty_school_list_box {
      padding: 20px;
      overflow-x: hidden;
      overflow-y: auto;
      .school_title{
        color: #409eff;
        cursor: pointer;
      }
    }
    #outTable2{
      margin-top:30px;
    }
  }
</style>
