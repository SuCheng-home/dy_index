<template>
  <div class="studentDetail">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="全校汇总" name="one"></el-tab-pane>
      <el-tab-pane label="学生明细" name="two">
          <div class="header">
      <template>
          <el-select size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="changeSchool">
              <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName" :value="item.id">
              </el-option>
          </el-select>
      </template>
      <template >
          <el-select size="medium" v-model="gradeCode" placeholder="请选择年级" @change="changeGrade" style="width:150px">
              <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
      </template>
      <template>
          <el-select size="medium" v-model="classCode" placeholder="请选择班级" @change="changeClass"  style="width:150px">
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
      </template>
      <el-select size="medium" v-model="currentCertType" placeholder="请选择类型" @change="changeCertType">
        <el-option :key="0" label="全部证书级别" :value="0"></el-option>
        <el-option v-for="item in certTypeList" :key="item.certTypeId" :label="item.certType" :value="item.certTypeId"></el-option>
      </el-select>
      <a :href="exportURL" download="导出统计" target="_blank" v-if="studentList&&studentList.length!==0">
          <el-button size="medium" class="filter-item" type="primary" >导出统计</el-button>
      </a>
      <a :href="exportURL2" download="导出明细" target="_blank" v-if="studentList&&studentList.length!==0">
          <el-button size="medium" class="filter-item" type="primary">导出明细</el-button>
      </a>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="studentList"
        border
        stripe
        class="honourTable"
        :height="nobottommaxH-50"
        style="width: 100%">
        <el-table-column
          label="学号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.stuNo }}</template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="姓名" align="center">
          <template slot-scope="scope" show-overflow-tooltip>
            <span class="link-type" @click="jumpPage('studentDetail',{schoolTimeId:schoolTimeCode,stuId:scope.row.stuId,gradeId:gradeCode,classId:classCode,name:scope.row.stuName})">{{scope.row.stuName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :key="item.id" v-for="(item,index) in stuHonorsList"  :label="item.honorTypeName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.stuHonors[index].totalCount}}
          </template>
        </el-table-column>
        <el-table-column
          label="总数量" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.totalCount }}</template>
        </el-table-column>
        <el-table-column
          label="班级排名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.classRank }}</template>
        </el-table-column>
      </el-table>
    </div>
      </el-tab-pane>
      <el-tab-pane label="年级统计" name="five"></el-tab-pane>
      <el-tab-pane label="班级统计" name="three"></el-tab-pane>
</el-tabs>

  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {getSchoolTimeAllList,querySchoolGrade,queryClassByGradeId,classStuHonorStaticsCountInfo, findHonorTypeListHistory} from '@/api/honour/index';
export default {
  data(){
    return{
      schoolName:'',
      schoolTimeCode:'',
      schoolYearList:[],
      currentCertType: 0,
      certTypeList: [],
      gradeList:[],
      gradeName:'',
      gradeCode:0,
      classList:[],
      className:'',
      classCode:0,
      studentList:[],
      stuHonorsList:[],
      exportURL:'',
      exportURL2:'',
      schoolTimeId:this.$route.query.schoolTimeId?this.$route.query.schoolTimeId:'',
      gradeId:this.$route.query.gradeId?this.$route.query.gradeId:'',
      classId:this.$route.query.classId?this.$route.query.classId:'',
      activeName:'two'
    }
  },
  created(){
    this.getSchoolTimeAllListFunc();

  },
  mixins:[mixins],
  methods:{
     tabsfun(){
        if(this.activeName=='one'){
         this.$router.push({path: 'schoolTotal',});
       }else if(this.activeName=='three'){
          this.$router.push({path: 'classStatistics',});
       }else if(this.activeName=='five'){
          this.$router.push({path: 'gradeStatistics',});
       }
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
            this.schoolTimeCode=this.schoolTimeId;
            let schoolTimeItem=this.schoolYearList.find(item=>this.schoolTimeCode==item.id);
            this.schoolName=schoolTimeItem.schoolTimeName;
            this.findHonorTypeListHistory();
            this.querySchoolGradeFunc();
          }else{
            this.schoolYearList.forEach(item=>{
              if(item.isCurrent==1){
                this.schoolName=item.schoolTimeName;
                this.schoolTimeCode=item.id;
                this.findHonorTypeListHistory();
                this.querySchoolGradeFunc();
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
    querySchoolGradeFunc(){
      //年级
      querySchoolGrade({
          isFilterNewGrade:true
      }).then(res=>res.data)
      .then(data=>{
          if(data.code===200){
            this.gradeList=data.data;
            if(this.gradeId){
              this.gradeCode=this.gradeId;
              let gradeItem=this.gradeList.find(item=>this.gradeCode==item.id);
              this.gradeName=gradeItem.name;
              this.queryClassByGradeIdFunc();
            }else{
              this.gradeName=this.gradeList[0].name;
              this.gradeCode=this.gradeList[0].id;
              this.queryClassByGradeIdFunc();
            }
          }
      })
    },
    changeGrade(val){
      this.gradeCode=val;
      this.gradeId='';
      this.classId='';
      this.queryClassByGradeIdFunc();
    },
    queryClassByGradeIdFunc(){
        //班级
        queryClassByGradeId({
            gradeId:this.gradeCode
        }).then(res=>res.data)
        .then(data=>{
            if(data.code===200){
              this.classList=data.data;
              if(this.classId){
                this.classCode=this.classId;
                let classItem=this.classList.find(item=>this.classCode==item.id);
                this.className=classItem.name;
                this.classStuHonorStaticsCountInfoFunc();
              }else{
                this.className=this.classList[0].name;
                this.classCode=this.classList[0].id;
                this.classStuHonorStaticsCountInfoFunc();
              }
            }
        })
    },
    classStuHonorStaticsCountInfoFunc(){
      classStuHonorStaticsCountInfo({
        classId:this.classCode,
        gradeId:this.gradeCode,
        certTypeId:this.currentCertType,
        schoolTimeId:this.schoolTimeCode
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          let studentData=data.data;
          this.studentList=studentData.stuHonorStaticInfo;
          this.stuHonorsList=studentData.honorTypes;
          /*导出*/
          this.exportURL =global.BasePath +'structure/schoolHonor/downloadCountXls?classId='+this.classCode+'&className='+this.className+'&certTypeId='+this.currentCertType+'&schoolTimeId='+this.schoolTimeCode+ '&token=' + this.$store.getters.token;
          this.exportURL2 =global.BasePath +'structure/schoolHonor/exportClassStuSchoolHonorList?classId='+this.classCode+'&schoolTimeId='+this.schoolTimeCode+'&certTypeId='+this.currentCertType+ '&token=' + this.$store.getters.token;
        }
      })
    },
    changeCertType(){
      this.classStuHonorStaticsCountInfoFunc();
    },
    changeClass(val){
      this.classCode=val;
      let classItem=this.classList.find(item=>this.classCode==item.id);
      this.className=classItem.name;
      this.classId='';
      this.classStuHonorStaticsCountInfoFunc();
    },
    changeSchool(val){
      //切换学期
      this.schoolTimeCode=val;
      let schoolItem=this.schoolYearList.find(item=>this.schoolTimeCode==item.id);
      this.startDate=schoolItem.startDate;
      if(schoolItem.isCurrent==1){
        this.endDate=this.$moment().format('YYYY-MM-DD');
      }else{
        this.endDate=schoolItem.endDate;
      }
      this.schoolTimeId='';
      this.gradeId='';
      this.classId='';
      this.querySchoolGradeFunc();
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

