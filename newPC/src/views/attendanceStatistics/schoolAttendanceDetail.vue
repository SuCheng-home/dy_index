<template>
  <div class="schoolAttendanceDetail">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" size="medium"  v-if="studentList.length"
        @click="exportExcel('#outTable', `${(leaveDate)}考勤汇总数据统计.xlsx`)">导出</el-button>
      <div class="center-title">{{leaveDate}} <span v-if="kindergarten">幼儿园</span>{{LearningStagesName}}考勤汇总数据统计</div>
    </div>

    <div class="duty_school_list_box">
      <el-table stripe :data="studentList" border style="width: 100%;" :height="boxH-27" ref="table" v-loading="loading">
        <el-table-column label="学校名称" width="160" align="center" fixed="left" :key="Math.random()">
          <template slot-scope="scope">
            {{scope.row.schoolName}}
          </template>
        </el-table-column>
        <el-table-column :label="gradeItem.gradeName" prop="leaderName" align="center" v-for="(gradeItem,gradeIndex) in gradeList" :key="gradeIndex">
          <el-table-column label="学生应到数" align="center">
            <template slot-scope="scope">
              {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex]}}
            </template>
          </el-table-column>
          <el-table-column label="学生实到数" align="center">
            <template slot-scope="scope">
              {{isOnWeek ? scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex]-scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+1] : '0'}}
            </template>
          </el-table-column>
          <el-table-column :label="leaveItem.leaveTypeName" align="center" v-for="(leaveItem,leaveIndex) in gradeItem.leaveTypeList" :key="leaveIndex">
            <template slot-scope="scope">
              <span v-if="gradeItem.leaveTypeList[0].leaveTypeName.indexOf('事假')!==-1">
                <span v-if="leaveIndex==0">{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+2]}}</span>
                <span v-else>
                  {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+gradeItem.leaveTypeList[1].sickList.length+leaveIndex+1]}}
                </span>
              </span>
              <span v-else-if="gradeItem.leaveTypeList[0].sickList">
                {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+gradeItem.leaveTypeList[0].sickList.length+leaveIndex+1]}}
              </span>
              <span v-else>
                {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+leaveIndex+2]}}
              </span>
                <!-- <span>{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+gradeItem.leaveTypeList[1].sickList.length+leaveIndex+1]}}</span> -->
            </template>
            <el-table-column :label="sickItem.sickTypeName" align="center" v-for="(sickItem,sickIndex) in leaveItem.sickList" :key="sickIndex">
              <template slot-scope="scope">
                <span v-if="gradeItem.leaveTypeList[0].leaveTypeName.indexOf('事假')!==-1">{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+sickIndex+3]}}</span>
                <span v-else>{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+sickIndex+2]}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="duty_school_list_box" style="display: none;">
      <el-table stripe :data="studentList" border style="width: 100%;" :height="boxH-27" ref="table2" id="outTable">
        <el-table-column label="学校名称" align="center">
          <template slot-scope="scope">
            {{scope.row.schoolName}}
          </template>
        </el-table-column>
        <el-table-column :label="gradeItem.gradeName" prop="leaderName" align="center" v-for="(gradeItem,gradeIndex) in gradeList" :key="gradeIndex">
          <el-table-column label="学生应到数" align="center">
            <template slot-scope="scope">
              {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex]}}
            </template>
          </el-table-column>
          <el-table-column label="学生实到数" align="center">
            <template slot-scope="scope">
              {{isOnWeek ? scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex]-scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+1] : '0'}}
            </template>
          </el-table-column>
          <el-table-column :label="leaveItem.leaveTypeName" align="center" v-for="(leaveItem,leaveIndex) in gradeItem.leaveTypeList" :key="leaveIndex">
            <template slot-scope="scope">
              <span v-if="gradeItem.leaveTypeList[0].leaveTypeName.indexOf('事假')!==-1">
                <span v-if="leaveIndex==0">{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+2]}}</span>
                <span v-else>
                  {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+gradeItem.leaveTypeList[1].sickList.length+leaveIndex+1]}}
                </span>
              </span>
              <span v-else-if="gradeItem.leaveTypeList[0].sickList">
                {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+gradeItem.leaveTypeList[0].sickList.length+leaveIndex+1]}}
              </span>
              <span v-else>
                {{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+leaveIndex+2]}}
              </span>
                <!-- <span>{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+gradeItem.leaveTypeList[1].sickList.length+leaveIndex+1]}}</span> -->
            </template>
            <el-table-column :label="sickItem.sickTypeName" align="center" v-for="(sickItem,sickIndex) in leaveItem.sickList" :key="sickIndex">
              <template slot-scope="scope">
                <span v-if="gradeItem.leaveTypeList[0].leaveTypeName.indexOf('事假')!==-1">{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+sickIndex+3]}}</span>
                <span v-else>{{scope.row.stringList[scope.row.stringList.length/gradeList.length*gradeIndex+sickIndex+2]}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {getSchoolListStByDate,getSchoolListStByDateOther} from "@/api/attendanceStatistics";

  export default {
    data() {
      return {
        leaveDate: this.$route.query.leaveDate,
        isOnWeek: Number(this.$route.query.isOnWeek) === 1,
        postcode:this.$route.query.postcode,
        LearningStagesName:this.$route.query.LearningStagesName,
        learningStages:this.$route.query.learningStages,
        kindergarten:this.$route.query.kindergarten?this.$route.query.kindergarten:0,
        studentList: [],
        gradeList:[],
        totalRow:{
          schoolName:'合计',
          stringList:[]
        },
        loading:false,
        timer:null
      }
    },
    created() {
      this.twoAllFunc();
    },
    mounted(){
      this.refreshDomBox();
      sessionStorage.setItem("schoolAttendDetail",true);
    },
    beforeDestroy(){
      clearTimeout(this.timer);
    },
    mixins: [mixins,baseMixin],
    filters: {
      formatTimeMap(date) {
        return date?date.slice(0,19):'';
      }
    },
    methods: {
      twoAllFunc(){
        if(this.kindergarten){
          this.getSchoolListStByDateOtherFunc();
        }else{
          this.getSchoolListStByDateFunc();
        }
      },
      refreshDomBox(){
        this.$nextTick(()=>{
          this.timer=setTimeout(()=> {
            this.$refs.table.doLayout();
            this.$refs.table2.doLayout();
          }, 300)
        });
      },
      computeTotal(row){
        if(row.shouldArrive){
          var aa=(((row.shouldArrive-row.sickLeave-row.thingLeave)/row.shouldArrive)*100).toFixed(2)+'%';
          return aa;
        }else{
          return '--';
        }
      },
      timeChangeHandler(val){
        this.reportDate=val;
        this.twoAllFunc();
      },
      getSchoolListStByDateOtherFunc(){
        this.loading=true;
        getSchoolListStByDateOther({
          learningStages:this.learningStages,
          leaveDate:this.leaveDate,
          postcode:this.postcode
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            const studentData=data.data;
            this.studentList=studentData.schoolList;
            this.gradeList=studentData.gradeList;
            this.totalRow.stringList=[];
            this.studentList.forEach((stuItem,stuIndex)=>{
              stuItem.stringList.forEach((subItem,subIndex)=>{
                if(!this.totalRow.stringList.length || this.totalRow.stringList.length < stuItem.stringList.length) {
                  this.totalRow.stringList.push(0);
                }
                this.totalRow.stringList[subIndex] += subItem;
              })
            })
            this.studentList.push(this.totalRow);
            this.loading=false;
            this.refreshDomBox();
          }else{
            this.loading=false;
          }
        }).catch(()=>{
          this.loading=false;
        })
      },
      getSchoolListStByDateFunc(){
        this.loading=true;
        getSchoolListStByDate({
          learningStages:this.learningStages,
          leaveDate:this.leaveDate,
          postcode:this.postcode
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            const studentData=data.data;
            this.studentList=studentData.schoolList;
            this.gradeList=studentData.gradeList;
            this.totalRow.stringList=[];
            this.studentList.forEach((stuItem,stuIndex)=>{
              stuItem.stringList.forEach((subItem,subIndex)=>{
                if(!this.totalRow.stringList.length || this.totalRow.stringList.length < stuItem.stringList.length) {
                  this.totalRow.stringList.push(0);
                }
                this.totalRow.stringList[subIndex] += subItem;
              })
            })
            this.studentList.push(this.totalRow);
            this.loading=false;
            this.refreshDomBox();
          }else{
            this.loading=false;
          }
        }).catch(()=>{
          this.loading=false;
        })
      },
      goBack() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .schoolAttendanceDetail {
    .header {
      margin-bottom: 0;
      padding: 15px 20px;
      position: relative;
      border-bottom: 1px solid #eee;
      .center-title{
        position: absolute;
        left:50%;
        top:50%;
        padding:0 100px;
        transform: translate(-50%,-50%);
        box-sizing: border-box;
        font-weight:bold;
      }
    }

    .duty_school_list_box {
      padding: 20px;
      position: relative;
      .school_title{
        color: #409eff;
        cursor: pointer;
      }
    }
  }
</style>
