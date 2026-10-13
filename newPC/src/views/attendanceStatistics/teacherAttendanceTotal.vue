<template>
  <div class="schoolAttendanceDetail">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" size="medium"  v-if="teacherList.length"
        @click="exportExcel('#outTable', `${(leaveDate)}考勤汇总数据统计.xlsx`)">导出</el-button>
      <div class="center-title">{{leaveDate}} <span v-if="kindergarten">幼儿园</span>教职工考勤汇总数据统计</div>
    </div>
    <div class="duty_school_list_box">
      <el-table stripe :data="teacherList" border style="width: 100%;" :height="boxH-27" ref="table">
        <el-table-column label="学校名称" width="160" align="center" >
          <template slot-scope="scope">
            {{scope.row.schoolName}}
          </template>
        </el-table-column>
        <el-table-column label="教师应到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{scope.row.peopleCount}}
          </template>
        </el-table-column>
        <el-table-column label="教师实到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? scope.row.peopleCount-scope.row.notComeCount : '0'}}
          </template>
        </el-table-column>
        <el-table-column label="其他员工应到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{scope.row.peopleCountEle}}
          </template>
        </el-table-column>
        <el-table-column label="其他员工实到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? scope.row.peopleCountEle-scope.row.notComeCountEle : '0'}}
          </template>
        </el-table-column>
        <el-table-column :label="typeItem.leaveTypeName" align="center" v-for="(typeItem,typeIndex) in typeList" :key="typeIndex">
          <template slot-scope="scope">
            <span v-if="typeList[0].leaveTypeName.indexOf('事假')!==-1">
              <span v-if="typeIndex==0">{{scope.row.stringList[0]}}</span>
              <span v-else>{{scope.row.stringList[typeList[1].sickList.length+typeIndex-1]}}</span>
            </span>
            <span v-else-if="typeList[0].sickList&&typeList[0].sickList.length!==0">
              {{scope.row.stringList[typeList[0].sickList.length+typeIndex-1]}}
            </span>
            <span v-else>
              {{scope.row.stringList[typeIndex]}}
            </span>
          </template>
          <el-table-column :label="sickItem.sickTypeName" align="center" v-for="(sickItem,sickIndex) in typeItem.sickList" :key="sickIndex">
             <template slot-scope="scope">
               <span v-if="typeList[0].leaveTypeName.indexOf('事假')!==-1">{{scope.row.stringList[sickIndex+1]}}</span>
               <span v-else>{{scope.row.stringList[sickIndex]}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="duty_school_list_box" style="display: none;">
      <el-table stripe :data="teacherList" border style="width: 100%;" :height="boxH-27" ref="table2" id="outTable">
        <el-table-column label="学校名称" align="center">
          <template slot-scope="scope">
            {{scope.row.schoolName}}
          </template>
        </el-table-column>
        <el-table-column label="老师应到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{scope.row.peopleCount}}
          </template>
        </el-table-column>
        <el-table-column label="教师实到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? scope.row.peopleCount-scope.row.notComeCount : '0'}}
          </template>
        </el-table-column>
        <el-table-column label="其他员工应到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{scope.row.peopleCountEle}}
          </template>
        </el-table-column>
        <el-table-column label="其他员工实到数" prop="leaderName" align="center">
          <template slot-scope="scope">
            {{isOnWeek ? scope.row.peopleCountEle-scope.row.notComeCountEle : '0'}}
          </template>
        </el-table-column>
        <el-table-column :label="typeItem.leaveTypeName" align="center" v-for="(typeItem,typeIndex) in typeList" :key="typeIndex">
          <template slot-scope="scope">
            <span v-if="typeList[0].leaveTypeName.indexOf('事假')!==-1">
              <span v-if="typeIndex==0">{{scope.row.stringList[0]}}</span>
              <span v-else>{{scope.row.stringList[typeList[1].sickList.length+typeIndex-1]}}</span>
            </span>
            <span v-else-if="typeList[0].sickList">
              {{scope.row.stringList[typeList[0].sickList.length+typeIndex-1]}}
            </span>
            <span v-else>
              {{scope.row.stringList[typeIndex]}}
            </span>
          </template>
          <el-table-column :label="sickItem.sickTypeName" align="center" v-for="(sickItem,sickIndex) in typeItem.sickList" :key="sickIndex">
             <template slot-scope="scope">
               <span v-if="typeList[0].leaveTypeName.indexOf('事假')!==-1">{{scope.row.stringList[sickIndex+1]}}</span>
               <span v-else>{{scope.row.stringList[sickIndex]}}</span>
            </template>
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
  import {getSchoolListThByDate,getSchoolListThByDateOther} from "@/api/attendanceStatistics";

  export default {
    data() {
      return {
        leaveDate: this.$route.query.leaveDate,
        isOnWeek: Number(this.$route.query.isOnWeek) === 1,
        postcode:this.$route.query.postcode,
        kindergarten:this.$route.query.kindergarten?this.$route.query.kindergarten:0,
        teacherList: [],
        typeList:[],
        totalRow:{
          schoolName:'合计',
          peopleCount:0,
          notComeCount:0,
          peopleCountEle:0,
          notComeCountEle:0,
          stringList:[]
        },
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
          this.getSchoolListThByDateOtherFunc();
        }else{
          this.getSchoolListThByDateFunc();
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
      getSchoolListThByDateOtherFunc(){
        getSchoolListThByDateOther({
          leaveDate:this.leaveDate,
          postcode:this.postcode
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            const teacherData=data.data;
            this.teacherList=teacherData.schoolList;
            this.typeList=teacherData.typeList;
            this.totalRow.stringList=[];
            this.teacherList.forEach((teacherItem,teacherIndex)=>{
              this.totalRow.peopleCount+=teacherItem.peopleCount;
              this.totalRow.notComeCount+=teacherItem.notComeCount;
              this.totalRow.peopleCountEle+=teacherItem.peopleCountEle;
              this.totalRow.notComeCountEle+=teacherItem.notComeCountEle;
              teacherItem.stringList.forEach((subItem,subIndex)=>{
                if(!this.totalRow.stringList.length || this.totalRow.stringList.length < teacherItem.stringList.length) {
                  this.totalRow.stringList.push(0);
                }
                this.totalRow.stringList[subIndex] += subItem;
              })
            })
            this.teacherList.push(this.totalRow);
            this.refreshDomBox();
          }
        })
      },
      getSchoolListThByDateFunc(){
        getSchoolListThByDate({
          leaveDate:this.leaveDate,
          postcode:this.postcode
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            const teacherData=data.data;
            this.teacherList=teacherData.schoolList;
            this.typeList=teacherData.typeList;
            this.totalRow.stringList=[];
            this.teacherList.forEach((teacherItem,teacherIndex)=>{
              this.totalRow.peopleCount+=teacherItem.peopleCount;
              this.totalRow.notComeCount+=teacherItem.notComeCount;
              this.totalRow.peopleCountEle+=teacherItem.peopleCountEle;
              this.totalRow.notComeCountEle+=teacherItem.notComeCountEle;
              teacherItem.stringList.forEach((subItem,subIndex)=>{
                if(!this.totalRow.stringList.length || this.totalRow.stringList.length < teacherItem.stringList.length) {
                  this.totalRow.stringList.push(0);
                }
                this.totalRow.stringList[subIndex] += subItem;
              })
            })
            this.teacherList.push(this.totalRow);

            this.refreshDomBox();
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
      .school_title{
        color: #409eff;
        cursor: pointer;
      }
    }
  }
</style>
