<template>
  <div class="studentDetail">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="全校汇总" name="one"></el-tab-pane>
      <el-tab-pane label="学生明细" name="two"></el-tab-pane>
      <el-tab-pane label="年级统计" name="five">
        <div class="header">
      <template>
          <el-select class="btnLeftLine btnLeftLine1" size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="changeSchool">
              <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName" :value="item.id">
              </el-option>
          </el-select>
      </template>
      <el-date-picker  style="width: 250px;" size="medium" ref="date" v-model="date" type="daterange" class="mywidthdaterange" :editable="false" :clearable='false' align="right"
                       unlink-panels placeholder="选择时间范围" @change="dateChange"></el-date-picker>
           <el-select size="medium" v-model="currentCertType" placeholder="请选择类型">
        <el-option :key="0" label="全部证书级别" :value="0"></el-option>
        <el-option v-for="item in certTypeList" :key="item.certTypeId" :label="item.certType" :value="item.certTypeId"></el-option>
      </el-select>
      <el-button type="primary" size="medium"   @click="examHandler">统计</el-button>
      <a :href="exportURL" download="导出" target="_blank" v-if="classList&&classList.length!==0">
          <el-button size="medium" class="filter-item" type="primary" >导出</el-button>
      </a>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="classList"
        border
        stripe
        class="honourTable"
        :height="nobottommaxH-50"
        style="width: 100%">
        <el-table-column
          label="年级" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.gradeName }}</template>
        </el-table-column>

        <el-table-column align="center" :key="item.id" v-for="(item,index) in classListType"  :label="item.honorTypeName" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="link-type" @click="jumpPage('classTotalDetailSec',{honorTypeId:item.id,schoolTimeId:schoolTimeCode,startDate:date[0],endDate:date[1],gradeId:scope.row.gradeId})" v-if="Number(scope.row.countStringList[index])>0">{{Number(scope.row.countStringList[index])}}</span>
            <span v-else>{{scope.row.countStringList[index]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总计" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.totalCount }}</template>
        </el-table-column>
      </el-table>
    </div>
      </el-tab-pane>
      <el-tab-pane label="班级统计" name="three"></el-tab-pane>
     </el-tabs>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {getSchoolTimeAllList,getstatisticalSchoolHonorGradeList, findHonorTypeListHistory} from '@/api/honour/index';
export default {
  data(){
    return{
      date: [],
      schoolName:'',
      schoolTimeCode:'',
      schoolYearList:[],
      currentCertType: 0,
      certTypeList: [],
      gradeList:[],
      gradeName:'',
      gradeCode:0,
      classList:[],
      classListType:[],
      exportURL:'',
      schoolTimeId:this.$route.query.schoolTimeId?this.$route.query.schoolTimeId:'',
      startDateNew:this.$route.query.startDateNew?this.$route.query.startDateNew:'',
      endDateNew:this.$route.query.endDateNew?this.$route.query.endDateNew:'',
      activeName:'five'
    }
  },
  created(){
    this.getSchoolTimeAllListFunc();
  },
  mixins:[mixins],
  methods:{
    tabsfun(){
        if(this.activeName=='two'){
         this.$router.push({path: 'studentList',});
       }else if(this.activeName=='three'){
          this.$router.push({path: 'classStatistics',});
       }else if(this.activeName=='one'){
          this.$router.push({path: 'schoolTotal',});
       }
    },
    dateChange(val) {
      this.date = [this.$moment(val[0]).format("YYYY-MM-DD"), this.$moment(val[1]).format("YYYY-MM-DD")]; //时间
      this.startDateNew='';
      this.endDateNew='';
    },
    examHandler(){
      if(!this.date.length){
        this.$message({
          type:'error',
          message:'请选择时间范围!'
        });
        return false;
      }
      this.getstatisticalSchoolHonorGradeListFunc();
    },
    jumpPage(path,query={}){
      this.$router.push({
          path,
          query
      })
    },
    getSchoolTimeAllListFunc(){
      //学期列表
      getSchoolTimeAllList().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.schoolYearList=data.data;
          if(this.schoolTimeId){
            this.schoolYearList.forEach((item,index)=>{
              if(this.schoolTimeId==item.id){
                this.schoolName=item.schoolTimeName;
                this.schoolTimeCode=item.id;
              }
            });
            this.date=[this.startDateNew, this.endDateNew];
            this.findHonorTypeListHistory();
            this.getstatisticalSchoolHonorGradeListFunc();
          }else{
            this.schoolYearList.forEach(item=>{
              if(item.isCurrent==1){
                this.schoolName=item.schoolTimeName;
                this.schoolTimeCode=item.id;
                this.date=[item.startDate, this.$moment().format('YYYY-MM-DD')];
                this.findHonorTypeListHistory();
                this.getstatisticalSchoolHonorGradeListFunc();
              }
            })
          }
        }
      })
    },
    findHonorTypeListHistory(){
      findHonorTypeListHistory({schoolTimeId: this.schoolTimeCode}).then(res=>res.data).then(data=>{
        if(data.code===200 && data.result && data.data.length){
          this.certTypeList = data.data;
        }
      })
    },
    getstatisticalSchoolHonorGradeListFunc(){
      getstatisticalSchoolHonorGradeList({
        startDate:this.date[0],
        endDate:this.date[1],
        certTypeId:this.currentCertType,
        selectSchoolTime:this.schoolTimeCode,
        schoolTimeId:this.schoolTimeCode
      }).then(res=>res.data)
      .then(data=>{
          if(data.code===200){
            let classData=data.data;
            this.classList=classData.honorStuList;
            this.classListType=classData.honorTypeList;
            /*导出*/
            this.exportURL =global.BasePath +'structure/schoolHonor/exportStatisticalSchoolHonorGradeList?schoolTimeId='+this.schoolTimeCode+'&startDate='+this.date[0]+'&endDate='+this.date[1]+'&certTypeId='+this.currentCertType+ '&token=' + this.$store.getters.token;
          }
      })
    },
     changeSchool(val){
      //切换学期
      this.schoolTimeCode=val;
      let schoolItem=this.schoolYearList.find(item=>this.schoolTimeCode==item.id);
      this.date[0]=schoolItem.startDate;
       if(schoolItem.isCurrent==1){
         this.date[1]=this.$moment().format('YYYY-MM-DD');
       }else{
         this.date[1]=schoolItem.endDate;
       }
      this.schoolTimeId='';
      this.startDateNew='';
      this.endDateNew='';
      this.getstatisticalSchoolHonorGradeListFunc();
    },
  }
}
</script>
<style lang="scss" scoped>
.studentDetail{
  padding: 12px;
  box-sizing: border-box;
  font-size:14px;
  .header{
    padding-bottom:10px;
    //border-bottom:1px solid  #e7eaec;
    
  }
}
.link-type, .link-type:focus{
  color: #337ab7;
  cursor: pointer;
}
.filter-item{
  margin-left:5px;
}

</style>

