<template>
  <div class="dataTotal">
    <div class="header">
      <el-row>
        <el-col :span="19">
        <el-button  @click="goBack" type="default" size="medium">返回</el-button>
      <template>
          <el-select size="medium" v-model="schoolYearCode" placeholder="请选择学年" @change="changeSchoolYear" disabled="disabled">
              <el-option v-for="item in schoolYearList" :key="item.id" :label="item.year" :value="item.id">
              </el-option>
          </el-select>
      </template>
      <template>
          <el-select size="medium" v-model="classCode" placeholder="请选择班级" @change="changeClass">
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
      </template>
        </el-col>
        <el-col :span="5">
          <el-input size="medium" v-model.trim="searchTitle" placeholder="姓名/学号/学籍号" @change="handleInputChange">
            <el-button slot="append" icon="el-icon-search" size="medium" @click="handleInputChange"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table border stripe :data="classDataList" :height="nobottommaxH" style="width: 100%">
        <el-table-column
          prop="date"
          label="学号" align="center">
          <template slot-scope="scope">
            {{scope.row.learnNum}}
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="姓名" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="jumpPage('studentDetail',{studentId:scope.row.studentId,schoolId:scope.row.schoolId,schoolYear:schoolYearName,gradeId:gradeId,classId:classId})">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :key="index" v-for="(item,index) in typeStand"  :label="changeVal(item)" show-overflow-tooltip>
          <template slot-scope="scope">
            {{getProjectItem(scope.row.projectList, item).projectScore}}
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="标准分" align="center">
          <template slot-scope="scope">
            {{scope.row.standardScore}}
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="附加分" align="center">
          <template slot-scope="scope">
            {{scope.row.additionalScore}}
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="总分" align="center">
          <template slot-scope="scope">
            {{scope.row.totalScore}}
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="总分等级" align="center">
          <template slot-scope="scope">
            {{scope.row.totalLevel}}
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
import {getSchoolYear,getCurrentSchoolTimeBySchoolId,queryClassByGradeId,getUserDepInfoByDepIds,getFitnessTestList,getParentByChildId,getLevelByGradeId} from '@/api/physicalHeadlth/index';
import _ from 'lodash';
import mixins from '@/mixins/windowResize';
export default {
  data(){
    return{
      schoolYearName:'',
      schoolYearCode:'',
      schoolYearList:[],
      classCode:'',
      className:'',
      classList:[],
      pageNo:1,
      pageSize:20,
      currentYear:'',
      searchTitle:'',
      fitnessTable:[],
      total:null,
      listLoading:false,
      gradeId:this.$route.query.gradeId,
      classId:this.$route.query.classId,
      classStudent:{
        dataList:[],
        columnList:[1, 2, 3, 4, 5, 6, 7]
      },
      classDataList:[],
      columnList:[],
      subId:'',
      level:'',
      typeStand:[],
      fitnessData:[]
    }
  },
  created(){
    //获取学年
    this.getSchoolYearFunc();
  },
  methods:{
    getProjectItem(list,type){
      return list.find(({projectType})=>projectType==type) || {projectScore:'--'};
    },
    goBack(){
      this.$router.push({
        path:'studentEnter'
      })
    },
    jumpPage(path,query={}){
      this.$router.push({
          path,
          query
      })
    },
    changeVal(item){
      var text='';
      switch(item){
        case 1:
          text='体重指数';
          break;
        case 2:
          text='肺活量';
          break;
        case 3:
          text="50米跑";
          break;
        case 4:
          text="坐位体前屈";
          break;
        case 5:
          text="1分钟仰卧起坐";
          break;
        case 6:
          text="50米*8往返跑";
          break;
        case 7:
          text="一分钟跳绳";
          break;
        default:
          break;
      }
      return text;
    },
    handleInputChange(){
      this.getUserDepInfoByDepIdsFunc();
    },
    getUserDepInfoByDepIdsFunc(){
      this.classStudent.dataList=[];
      this.classStudent.columnList=[];
      getUserDepInfoByDepIds({
        userType:2,
        searchVal:this.searchTitle,
        departIds:this.classCode
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let classData=data.data;
          classData.forEach((item)=>{
            this.classStudent.dataList.push({
              // learnJi:item.learnJi,
              learnNum:item.learnNum,
              name:item.name,
              schoolId:item.schoolId,
              // mobile:item.mobile,
              studentId:item.id,
              standardScore:'',
              additionalScore:'',
              totalScore:'',
              totalLevel:'',
              projectList:item.projectList=[]
            })
          })
          
          getFitnessTestList({
            schoolYear:this.schoolYearName,
            classId:this.classCode,
            searchTitle:'',
            pageNo:1,
            pageSize:120
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              let fitnessData=data.data;
              this.fitnessData=data.data;
              if(fitnessData.scorelist.dataList&&fitnessData.scorelist.dataList.length!==0){
                this.fitnessTable=fitnessData.scorelist.dataList;
                // this.classStudent.columnList=fitnessData.columnList;
                this.fitnessTable.forEach(fitnessItem=>{
                  this.classStudent.dataList.forEach(classItem=>{
                    if(fitnessItem.studentId==classItem.studentId){
                      classItem.standardScore=fitnessItem.standardScore;
                      classItem.additionalScore=fitnessItem.additionalScore;
                      classItem.totalScore=fitnessItem.totalScore;
                      classItem.totalLevel=fitnessItem.totalLevel;
                      classItem.projectList=fitnessItem.projectList;
                    }
                  })
                })
                this.classStudent.dataList.forEach((item)=>{
                  if(item.projectList.length==0){
                    this.typeStand.forEach((subItem)=>{
                      item.projectList.push({
                        additionalScore:'',
                        projectType:subItem,
                        projectValue:'',
                        releaseValue:'',
                        projectScore:'',
                        projectLevel:''
                      })
                    })
                  }
                })
                this.classDataList=this.classStudent.dataList;
                // this.columnList=this.classStudent.columnList;
              }else{
                this.classStudent.dataList.forEach((item)=>{
                  if(item.projectList.length==0){
                    this.typeStand.forEach((typeItem,typeIndex)=>{
                      item.projectList.push({
                        additionalScore:'',
                        projectType:typeItem,
                        projectValue:'',
                        releaseValue:'',
                        projectScore:'',
                        projectLevel:''
                      })
                    })
                  }
                })
                this.classDataList=this.classStudent.dataList;
              }
            }
          })
        }
      })
    },
    queryClassByGradeIdFunc(){
       queryClassByGradeId({
        gradeId:this.gradeId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.classList=data.data;
          this.classCode=this.classId;
          this.getParentByChildIdFunc();
        }
      }).catch(()=>{})
    },
    getParentByChildIdFunc(){
      getParentByChildId({
        childId:this.classCode
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.subId=data.data.id;
          getLevelByGradeId({
            gradeId:this.subId
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.level=data.data.level;
              if(this.level>=1&&this.level<3){
                this.typeStand=[1,2,3,4,7];
              }
              if(this.level>=3&&this.level<5){
                this.typeStand=[1,2,3,4,5,7];
              }
              if(this.level>=5&&this.level<=6){
                this.typeStand=[1,2,3,4,5,6,7];
              }
              this.getUserDepInfoByDepIdsFunc();
            }
          })
        }
      })
    },
    getSchoolYearFunc(){
      getSchoolYear().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.schoolYearList=data.data;
          getCurrentSchoolTimeBySchoolId().then(res=>{
            let data=res.data;
            if(data.code===200){
              let currentYearData=data.data;
              this.currentYear=currentYearData.schoolYear;
              this.schoolYearList.forEach(item=>{
                if(item.year==this.currentYear){
                  this.schoolYearName=item.year;
                  this.schoolYearCode=item.id;
                  this.queryClassByGradeIdFunc();
                }
              })
            }
          })

        }
      }).catch(()=>{})
    },
    changeSchoolYear(val){
      this.searchTitle='';
      this.schoolYearCode=val;
      let schoolYearItem=this.schoolYearList.find(item=>{
        return item.id==val;
      });
      this.schoolYearName=schoolYearItem.year;
    },
    changeClass(val){
      this.searchTitle='';
      this.classCode=val;
      this.getParentByChildIdFunc();
    } 
  },
  mixins:[mixins]
}
</script>
<style lang="scss" scoped>
.dataTotal{
  padding:12px;
  box-sizing: border-box;
  font-size:14px;
  .header{
    margin-bottom:10px;
    
  }
  .pagination-container{
    margin-top:20px;
  }
}
.link-type, .link-type:focus{
  color: #337ab7;
  cursor: pointer;
}
</style>

