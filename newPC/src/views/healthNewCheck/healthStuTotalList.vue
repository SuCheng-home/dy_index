<template>
  <div class="healthCheckStatic">
    <div class="header-wrap">
      <div class="header">
        <el-row>          
          <el-button @click="$router.back()" size="medium">返回</el-button>
          <template>
              <el-select style="width:200px;" size="medium" v-model="gradeCode" placeholder="请选择年级" @change="changeGrade">
                  <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
              </el-select>
          </template>
          <template>
              <el-select style="width:200px;" size="medium" v-model="classCode" placeholder="请选择班级" @change="changeClass">
                  <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
              </el-select>
          </template>
          <a :href="exportURL" download="导出结果" target="_blank" v-if="dataList.length">
            <el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
          </a>
          <a :href="exportAllURL" download="导出结果" target="_blank">
            <el-button type="primary" size="medium" >导出全部</el-button>
          </a>
        </el-row>
      </div>
    </div>
    <el-table id="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="`${nobottommaxH}px`">
        <el-table-column  label="学号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span >
                {{scope.row.studentId}}
              </span>
            </template>
        </el-table-column>
        <el-table-column  label="姓名" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span >
                {{scope.row.studentName}}
              </span>
            </template>
        </el-table-column>
        <el-table-column  align="center" label="班级" show-overflow-tooltip>
          <template slot-scope="scope">
            <span >
              {{scope.row.className}}
            </span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="晨检考勤" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.morningDuty==0&&scope.row.morningTemp!==0">到勤</span>
            <span v-if="scope.row.morningDuty==0&&scope.row.morningTemp==0">--</span>
            <span v-if="scope.row.morningDuty==1">事假({{scope.row.mLeaveRemark}})</span>
            <span v-if="scope.row.morningDuty==2" class="healthSectionRed">病假({{scope.row.mSickNames}})</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="晨检体温（℃）" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.morningTemp==0">--</span>
            <span v-else-if="scope.row.morningTemp>0" :class="(parseFloat(scope.row.morningTemp.toString())>=37.3?'healthSectionRed':'')">{{scope.row.morningTemp+'℃'}}</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="午检考勤" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.noonDuty==0&&scope.row.noonTemp!==0">到勤</span>
            <span v-if="scope.row.noonDuty==0&&scope.row.noonTemp==0">--</span>
            <span v-if="scope.row.noonDuty==1">事假({{scope.row.nLeaveRemark}})</span>
            <span v-if="scope.row.noonDuty==2" class="healthSectionRed">病假({{scope.row.nSickNames}})</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="午检体温（℃）">
          <template slot-scope="scope">
            <span v-if="scope.row.noonTemp==0">--</span>
            <span v-else-if="scope.row.noonTemp>0" :class="(parseFloat(scope.row.noonTemp.toString())>=37.3?'healthSectionRed':'')">{{scope.row.noonTemp+'℃'}}</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {querySchoolGrade,queryClassByGradeId,getClassStuDayTempAndDutyList} from '@/api/healthNewCheck';
export default {
  data(){
    return{
      roleId:'',
      gradeList:[],
      gradeName:'',
      gradeCode:0,
      classList:[],
      classCode:0,
      className:'',
      date:this.$route.query.day,
      isOkTemp:0,//体温是否正常 0全部 1不正常
      dataList:[],
      exportURL:'',
      exportAllURL:''
    }
  },
  created(){
    this.querySchoolGradeFunc();
  },
  mounted(){

  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mixins: [mixin],
  methods:{
    queryHandler(type){
      this.isOkTemp=type;
      this.getClassStuDayTempAndDutyListFunc();
    },
    dateChangeHandler(value){
      this.date = this.$moment(value).format('YYYY-MM-DD');
      this.getClassStuDayTempAndDutyListFunc();
    },
    getClassStuDayTempAndDutyListFunc(){
      getClassStuDayTempAndDutyList({
        classId:this.classCode,
        isOkTemp:this.isOkTemp,
        dataFrom:1,
        reportDate:this.date
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.dataList=data.data;
          this.exportURL =
          `${global.BasePath}structure/temperatureReport/exportStuTempAndDuty?classId=${this.classCode}&isOkTemp=${this.isOkTemp}&reportDate=${this.date}&token=${this.$store.getters.token}`;
          this.exportAllURL=`${global.BasePath}structure/temperatureReport/exportStuTempAndDuty?classId=0&isOkTemp=0&reportDate=${this.date}&token=${this.$store.getters.token}`;
        }
      })
    },  
    querySchoolGradeFunc(){
      //全校年级
      querySchoolGrade({
        isFilterNewGrade:true
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          const gradeData=data.data;
          this.gradeList=gradeData;
          this.gradeCode=this.gradeList[0].id;
          this.gradeName=this.gradeList[0].name;
          this.queryClassByGradeIdFunc();
        }
      }).catch(()=>{})
    },
    changeGrade(val){
      this.gradeCode=val;
      this.queryClassByGradeIdFunc();
    },
    queryClassByGradeIdFunc(){
        //
        queryClassByGradeId({
            gradeId:this.gradeCode
        }).then(res=>res.data)
        .then(data=>{
            if(data.code===200){
                this.classList=data.data;
                this.classCode=this.classList[0].id;
                this.className=this.classList[0].name;
                this.getClassStuDayTempAndDutyListFunc();
            }
        })
    },
    changeClass(val){
      this.classCode=val;
      this.getClassStuDayTempAndDutyListFunc();
    }
  }
}
</script>

<style lang="scss" scoped>
.healthCheckStatic{
  padding:12px;
  box-sizing: border-box;
  background-color: #fff;
  .header-wrap{
    padding-bottom:10px;
  }
}
.healthSectionRed{
  color:#F66C6C
}
</style>
<style lang="scss">
.healthCheckStatic .el-button+.el-button{
  margin-left:4px;
}
</style>
