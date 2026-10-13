<template>
  <div class="dataTotal">
    <div class="header">
      <el-row>
        <el-col :span="20">
         <el-button  @click="goBack" type="default" size="medium">返回</el-button>
      <template>
          <el-select  size="medium" v-model="schoolYearCode" placeholder="请选择学年" @change="changeSchoolYear" disabled="disabled">
              <el-option v-for="item in schoolYearList" :key="item.id" :label="item.year" :value="item.id">
              </el-option>
          </el-select>
      </template>
      <template>
          <el-select  size="medium" v-model="gradeCode" placeholder="请选择年级" @change="changeGeade">
              <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
      </template>
      <template>
          <el-select  size="medium" v-model="classCode" placeholder="请选择班级" @change="changeClass">
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
      </template>
        </el-col>
        <el-col :span="4">
          <el-input size="medium" v-model.trim="searchTitle" placeholder="姓名/学号/学籍号" @change="handleInputChange">
            <el-button slot="append" icon="el-icon-search" size="medium" @click="handleInputChange"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table border :data="classStudent" :height="maxH" style="width: 100%">
        <el-table-column
          prop="date"
          label="学号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.learnNum}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="firstLevelColumns[index]" :key="index"  v-for="(subItem,index) in subClassStudent" v-if="type.indexOf(',')!==-1">
          <el-table-column align="center" :label="secondLevelColumns[index].name[sunIndex]" :key="sunIndex" v-for="(sunItem,sunIndex) in secondLevelColumns[index].key" >
            <template slot-scope="scope">
              <span v-if="index==0&&subItem.projectType==1">
                <input class="inputStyle" v-model="scope.row.projectList[index][sunItem]" type="text" @blur="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])" v-if="sunItem!=='projectLevel'" maxlength="6" @keyup.native="scope.row.projectList[index][sunItem]=scope.row.projectList[index][sunItem].replace(/[^\-?\d.]/g,'')">
                <select class="inputSelect" v-model="scope.row.projectList[index][sunItem]" v-if="sunItem=='projectLevel'" @change="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])">
                  <option label="肥胖"  value="肥胖">肥胖</option>
                  <option label="超重"  value="超重">超重</option>
                  <option label="正常"  value="正常">正常</option>
                  <option label="低体重"  value="低体重">低体重</option>
                </select>
              </span>
              <span v-if="index==1&&subItem.projectType==2">
                <input class="inputStyle" v-model="scope.row.projectList[index][sunItem]" type="text" @blur="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])" v-if="sunItem!=='projectLevel'" maxlength="6">
                <select class="inputSelect" v-model="scope.row.projectList[index][sunItem]" v-if="sunItem=='projectLevel'" @change="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])">
                  <option label="优秀"  value="优秀">优秀</option>
                  <option label="良好"  value="良好">良好</option>
                  <option label="及格"  value="及格">及格</option>
                  <option label="不及格"  value="不及格">不及格</option>
                </select>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" :label="firstLevelColumns" :key="index"  show-overflow-tooltip v-for="(subItem,index) in subClassStudent" v-if="type.indexOf(',')==-1&&type<8">
          <el-table-column align="center" :label="secondLevelColumns[index].name[sunIndex]" :key="sunIndex"  show-overflow-tooltip v-for="(sunItem,sunIndex) in secondLevelColumns[index].key" >
            <template slot-scope="scope">
              <span >
                <input class="inputStyle" v-model="scope.row.projectList[index][sunItem]" type="text" @blur="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])" v-if="sunItem!=='projectLevel'" maxlength="6">
                <select class="inputSelect" v-model="scope.row.projectList[index][sunItem]" v-if="sunItem=='projectLevel'" @change="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])">
                  <option label="优秀"  value="优秀">优秀</option>
                  <option label="良好"  value="良好">良好</option>
                  <option label="及格"  value="及格">及格</option>
                  <option label="不及格"  value="不及格">不及格</option>
                </select>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" :label="firstLevelColumns" :key="index"  show-overflow-tooltip v-for="(subItem,index) in subClassStudent" v-if="type.indexOf(',')==-1&&type==8">
          <el-table-column align="center" :label="secondLevelColumns[index].name[sunIndex]" :key="sunIndex"  show-overflow-tooltip v-for="(sunItem,sunIndex) in secondLevelColumns[index].key" >
            <template slot-scope="scope">
              <span v-if="scope.row.projectList">
                <input class="inputStyle" v-model="scope.row.projectList[index][sunItem]" type="text" @blur="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])" v-if="sunItem!=='projectLevel'" maxlength="6">
                <select class="inputSelect" v-model="scope.row.projectList[index][sunItem]" v-if="sunItem=='projectLevel'" @change="itemSave(scope.row,sunItem,scope.row.projectList[index][sunItem])">
                  <option label="正常"  value="正常">正常</option>
                  <option label="轻度视力低下"  value="轻度视力低下">轻度视力低下</option>
                  <option label="中度视力低下"  value="中度视力低下">中度视力低下</option>
                  <option label="重度视力低下"  value="重度视力低下">重度视力低下</option>
                </select>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {getSchoolYear,getCurrentSchoolTimeBySchoolId,querySchoolGrade,queryClassByGradeId,getUserDepInfoByDepIds,getFitnessTestList,addFitnessTestListByProject,getLevelByGradeId} from '@/api/physicalHeadlth/index';
import _ from 'lodash';
import mixins from '@/mixins/windowResize';
export default {
  data(){
    return{
      schoolYearName:'',
      schoolYearCode:'',
      schoolYearList:[],
      gradeList:[],
      gradeName:'',
      gradeCode:'',
      classCode:'',
      className:'',
      classList:[],
      pageNo:1,
      pageSize:20,
      currentYear:'',
      searchTitle:'',
      type:this.$route.query.type,
      classStudent:[],
      subClassStudent:[],
      fitnessTestListJson:[],
      firstLevelColumns:[],
      secondLevelColumns:[],
      level:'',
      typeStand:[],
      fitnessJson:{},
      classData:[],
      newType:[]
    }
  },
  created(){
    //获取学年
    this.getSchoolYearFunc();
    const nameMapping = ['身高体重', '肺活量', '50米跑', '坐位体前屈', '1分钟仰卧起坐', '50米*8往返跑', '一分钟跳绳','视力'];
    const secondLevelColumns = [];
    if(this.type.indexOf(',')!==-1){
      this.firstLevelColumns=this.type.split(',').map(item=>nameMapping[Number.parseInt(item-1)]);
      this.type.split(',').forEach(item=>{
      switch(Number.parseInt(item)){
          case 1:
          secondLevelColumns.push({
            name: ['身高(cm)','体重(kg)','体重评分','体重等级'],
            key: ['projectValue','releaseValue','projectScore','projectLevel']
          })
          break;
          case 2:
          secondLevelColumns.push({
            name: ['肺活量(ml)','肺活量评分','肺活量等级'],
            key:  ['projectValue','projectScore','projectLevel']
          })
          break;
          default:
            break;
        }
      })
    }else if(this.type.indexOf(',')==-1&&this.type<8){
      this.firstLevelColumns=nameMapping[Number.parseInt(this.type-1)];
      switch(Number.parseInt(this.type)){
          case 3:
          secondLevelColumns.push({
            name: ['50米跑(秒)','50米跑评分','50米跑等级'],
            key:  ['projectValue','projectScore','projectLevel']
          })
          break;
          case 4:
          secondLevelColumns.push({
            name: ['坐位体前屈(cm)','坐位体前屈评分','坐位体前屈等级'],
            key: ['projectValue','projectScore','projectLevel']
          })
          break;
          case 5:
          secondLevelColumns.push({
            name: ['1分钟仰卧起坐(次)','1分钟仰卧起坐评分','1分钟仰卧起坐等级'],
            key:  ['projectValue','projectScore','projectLevel']
          })
          break;
          case 6:
          secondLevelColumns.push({
            name:  ['50米*8往返跑(秒)','50米*8往返跑评分','50米*8往返跑等级'],
            key: ['projectValue','projectScore','projectLevel']
          })
          break;
          case 7:
          secondLevelColumns.push({
            name: ['一分钟跳绳(次)','一分钟跳绳评分','一分钟跳绳等级','一分钟跳绳附加分'],
            key: ['projectValue','projectScore','projectLevel','additionalScore']
          });
          default:
            break;
        }
    }else if(this.type.indexOf(',')==-1&&this.type==8){
      //组装2级表头
      this.firstLevelColumns=nameMapping[Number.parseInt(this.type-1)];
      this.newType=[8,9,10,11,12,13];
      this.newType.forEach(item=>{
      switch(Number.parseInt(item)){
          case 8:
          secondLevelColumns.push({
            name: ['左眼裸眼视力','左眼裸眼视力等级'],
            key: ['projectValue','projectLevel']
          })
          break;
          case 9:
          secondLevelColumns.push({
            name: ['右眼裸眼视力','右眼裸眼视力等级'],
            key:  ['projectValue','projectLevel']
          })
          break;
          case 10:
          secondLevelColumns.push({
            name: ['左眼屈光不正'],
            key:  ['projectValue']
          })
          break;
          case 11:
          secondLevelColumns.push({
            name: ['右眼屈光不正'],
            key:  ['projectValue']
          })
          break;
          case 12:
          secondLevelColumns.push({
            name: ['左眼串镜'],
            key:  ['projectValue']
          })
          break;
          case 13:
          secondLevelColumns.push({
            name: ['右眼串镜'],
            key:  ['projectValue']
          })
          break;
          default:
            break;
        }
      })
    }
    //二级表头数据
    this.secondLevelColumns=secondLevelColumns;
  },
  methods:{
    itemSave(row,subItem,inputValue){
      var pattern=/[^\-?\d.]/g;
      if(subItem!=="projectLevel"&&pattern.test(inputValue)){
        this.$message({
          type: 'error',
          message: '请输入数字类型'
        });
        return false;
      }
      
      delete row.id;
      this.fitnessTestListJson=[];
      this.fitnessJson={
        additionalScore:row.additionalScore?row.additionalScore:'',
        learnNum:row.learnNum?row.learnNum:'',
        name:row.name?row.name:'',
        projectList:[],
        standardScore:row.standardScore?row.standardScore:'',
        studentId:row.studentId?row.studentId:'',
        totalLevel:row.totalLevel?row.totalLevel:'',
        totalScore:row.totalScore?row.totalScore:''
      };
      /*有值*/
      if(this.fitnessTable.length!==0){
        let flag=false;
        this.fitnessTable.forEach((item,itemIndex)=>{
          if(item.studentId==this.fitnessJson.studentId){
            this.fitnessJson.projectList=item.projectList;
            flag=true;
          }
        })
        //没有的数据自行组装
        if(!flag){
          this.fitnessJson.projectList=[];
          this.typeStand.forEach((typeItem,typeIndex)=>{
            this.fitnessJson.projectList.push({
              additionalScore:'',
              projectType:typeItem,
              projectValue:'',
              releaseValue:'',
              projectScore:'',
              projectLevel:''
            })
          })
        }
        row.projectList.forEach((item,itemIndex)=>{
          this.fitnessJson.projectList.forEach((subItem,subIndex)=>{
            if(item.projectType==subItem.projectType){
              subItem.projectValue=item.projectValue;
              subItem.releaseValue=item.releaseValue;
              subItem.projectScore=item.projectScore;
              subItem.projectLevel=item.projectLevel;
            }
          })
        })
      }
      if(this.fitnessTable.length==0){
        this.typeStand.forEach((typeItem,typeIndex)=>{
          this.fitnessJson.projectList.push({
            additionalScore:'',
            projectType:typeItem,
            projectValue:'',
            releaseValue:'',
            projectScore:'',
            projectLevel:''
          })
        })
        row.projectList.forEach((item,itemIndex)=>{
          this.fitnessJson.projectList.forEach((subItem,subIndex)=>{
            if(item.projectType==subItem.projectType){
              subItem.projectValue=item.projectValue;
              subItem.releaseValue=item.releaseValue;
              subItem.projectScore=item.projectScore;
              subItem.projectLevel=item.projectLevel;
            }
          })
        })
      }
      this.fitnessTestListJson.push(this.fitnessJson);
      if(inputValue!==''){
        addFitnessTestListByProject({
          classId:this.classCode,
          className:this.className,
          schoolYear:this.schoolYearName,
          fitnessTestListJson:JSON.stringify(this.fitnessTestListJson)
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            //this.getUserDepInfoByDepIdsFunc();
          }else{
            this.$message({
              type: 'warn',
              message: '保存失败!'
            });
          }
        })
      }
    },
    getUserDepInfoByDepIdsFunc(){
      this.classStudent=[];
      this.subClassStudent=[];
      this.classData=[];
      getUserDepInfoByDepIds({
        userType:2,
        searchVal:this.searchTitle,
        departIds:this.classCode
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let classData=data.data;
          this.classData=classData;
          //需要数据组装
          if(this.type.indexOf(",")!==-1){
            classData.forEach((item)=>{
              this.classStudent.push({
                // learnJi:item.learnJi,
                learnNum:item.learnNum,
                name:item.name,
                // schoolId:item.schoolId,
                // mobile:item.mobile,
                id:item.id,
                studentId:item.id,
                standardScore:item.standardScore,
                additionalScore:item.additionalScore,
                totalScore:item.totalScore,
                totalLevel:item.totalLevel,
                projectList:item.projectList=[{
                  additionalScore:'',
                  projectType:this.type.split(',')[0],
                  projectValue:'',
                  releaseValue:'',
                  projectScore:'',
                  projectLevel:'',
                },{
                  additionalScore:'',
                  projectType:this.type.split(',')[1],
                  projectValue:'',
                  releaseValue:'',
                  projectScore:'',
                  projectLevel:'',
                }]
              })
            })
          }else if(this.type.indexOf(',')==-1&&this.type<8){
            classData.forEach((item)=>{
              this.classStudent.push({
                // learnJi:item.learnJi,
                learnNum:item.learnNum,
                name:item.name,
                // schoolId:item.schoolId,
                // mobile:item.mobile,
                id:item.id,
                studentId:item.id,
                standardScore:item.standardScore,
                additionalScore:item.additionalScore,
                totalScore:item.totalScore,
                totalLevel:item.totalLevel,
                projectList:item.projectList=[{
                  additionalScore:'',
                  projectType:this.type,
                  projectValue:'',
                  releaseValue:'',
                  projectScore:'',
                  projectLevel:'',
                }]
              })
            })
          }else if(this.type.indexOf(',')==-1&&this.type==8){
            classData.forEach((item)=>{
             
              this.classStudent.push({
                // learnJi:item.learnJi,
                learnNum:item.learnNum,
                name:item.name,
                // schoolId:item.schoolId,
                // mobile:item.mobile,
                id:item.id,
                studentId:item.id,
                standardScore:item.standardScore,
                additionalScore:item.additionalScore,
                totalScore:item.totalScore,
                totalLevel:item.totalLevel,
                projectList:item.projectList=JSON.parse(JSON.stringify(
                  [
                  {
                  additionalScore:'',
                  projectType:this.newType[0],
                  projectValue:'',
                  releaseValue:'',
                  projectScore:'',
                  projectLevel:'',
                  },{
                    additionalScore:'',
                    projectType:this.newType[1],
                    projectValue:'',
                    releaseValue:'',
                    projectScore:'',
                    projectLevel:'',
                  },{
                    additionalScore:'',
                    projectType:this.newType[2],
                    projectValue:'',
                    releaseValue:'',
                    projectScore:'',
                    projectLevel:'',
                  },{
                    additionalScore:'',
                    projectType:this.newType[3],
                    projectValue:'',
                    releaseValue:'',
                    projectScore:'',
                    projectLevel:'',
                  },{
                    additionalScore:'',
                    projectType:this.newType[4],
                    projectValue:'',
                    releaseValue:'',
                    projectScore:'',
                    projectLevel:'',
                  },{
                    additionalScore:'',
                    projectType:this.newType[5],
                    projectValue:'',
                    releaseValue:'',
                    projectScore:'',
                    projectLevel:'',
                  }
                ]
                ))
                
              })

            })
          }
          getFitnessTestList({
            schoolYear:this.schoolYearName,
            classId:this.classCode,
            searchTitle:'',
            pageNo:1,
            pageSize:100
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              let fitnessData=data.data;
              this.fitnessTable=fitnessData.scorelist.dataList;
              //把已有数据进行赋值，赋值给组装的数据
              if(this.fitnessTable&&this.fitnessTable.length!==0){
                this.fitnessTable.forEach((fitnessItem=>{
                  this.classStudent.forEach(classItem=>{
                    if(fitnessItem.studentId==classItem.id){
                      classItem.standardScore=fitnessItem.standardScore;
                      classItem.additionalScore=fitnessItem.additionalScore;
                      classItem.totalScore=fitnessItem.totalScore;
                      classItem.totalLevel=fitnessItem.totalLevel;
                      if(this.type.indexOf(",")!==-1){
                        fitnessItem.projectList.forEach(projectItem=>{
                          if(projectItem.projectType==this.type.split(",")[0]){
                            classItem.projectList[0]={
                              additionalScore:projectItem.additionalScore?projectItem.additionalScore:'',
                              projectType:projectItem.projectType?projectItem.projectType:'',
                              projectValue:projectItem.projectValue?projectItem.projectValue:'',
                              releaseValue:projectItem.releaseValue?projectItem.releaseValue:'',
                              projectScore:projectItem.projectScore?projectItem.projectScore:'',
                              projectLevel:projectItem.projectLevel?projectItem.projectLevel:'',
                            }
                          }else if(projectItem.projectType==this.type.split(",")[1]){
                            classItem.projectList[1]={
                              additionalScore:projectItem.additionalScore?projectItem.additionalScore:'',
                              projectLevel:projectItem.projectLevel?projectItem.projectLevel:'',
                              projectScore:projectItem.projectScore?projectItem.projectScore:'',
                              projectType:projectItem.projectType?projectItem.projectType:'',
                              projectValue:projectItem.projectValue?projectItem.projectValue:'',
                              releaseValue:projectItem.releaseValue?projectItem.releaseValue:'',
                              projectScore:projectItem.projectScore?projectItem.projectScore:'',
                              projectLevel:projectItem.projectLevel?projectItem.projectLevel:''
                            }
                          }
                        })
                      }else if(this.type.indexOf(',')==-1&&this.type<8){
                        fitnessItem.projectList.forEach(projectItem=>{
                          if(projectItem.projectType==this.type){
                            classItem.projectList=[{
                              additionalScore:projectItem.additionalScore?projectItem.additionalScore:'',
                              projectType:projectItem.projectType?projectItem.projectType:'',
                              projectValue:projectItem.projectValue?projectItem.projectValue:'',
                              releaseValue:projectItem.releaseValue?projectItem.releaseValue:'',
                              projectScore:projectItem.projectScore?projectItem.projectScore:'',
                              projectLevel:projectItem.projectLevel?projectItem.projectLevel:'',
                            }]
                          }
                        })
                      }else if(this.type.indexOf(',')==-1&&this.type==8){
                        fitnessItem.projectList.forEach((projectItem,index)=>{
                          this.newType.forEach((newTypeItem,newIndex)=>{
                            //只赋值8，。。。13
                            if(projectItem.projectType==newTypeItem){
                              classItem.projectList[newIndex]={
                                additionalScore:projectItem.additionalScore?projectItem.additionalScore:'',
                                projectType:projectItem.projectType?projectItem.projectType:'',
                                projectValue:projectItem.projectValue?projectItem.projectValue:'',
                                releaseValue:projectItem.releaseValue?projectItem.releaseValue:'',
                                projectScore:projectItem.projectScore?projectItem.projectScore:'',
                                projectLevel:projectItem.projectLevel?projectItem.projectLevel:'',
                              };
                            }
                          })
                        })
                      }
                      
                    // flst=true;
                    }
                  })
                }))
              }
              if(this.classStudent.length!==0){
                //二级对应的循环次数
                this.subClassStudent=this.classStudent[0].projectList;
              }
            }
          })
        }
      }).catch(()=>{})
    },
    goBack(){
      this.$router.push({
          path:'itemEnter'
      })
    },
    jumpPage(path,query={}){
      this.$router.push({
          path,
          query
      })
    },
    handleInputChange(){
      this.getUserDepInfoByDepIdsFunc();
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
                }
              })
              //年级
              this.querySchoolGradeFunc();
            }
          })
        }
      }).catch(()=>{})
    },
    querySchoolGradeFunc(){
      querySchoolGrade({
        isFilterNewGrade:true
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.gradeList=data.data;
          this.gradeName=this.gradeList[0].name;
          this.gradeCode=this.gradeList[0].id;
          this.queryClassByGradeIdFunc();
        }
      }).catch(()=>{})
    },
    changeGeade(val){
      this.searchTitle='';
      this.gradeCode=val;
      this.queryClassByGradeIdFunc();
    },
    queryClassByGradeIdFunc(){
      queryClassByGradeId({
        gradeId:this.gradeCode
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.classList=data.data;
          this.className=this.classList[0].name;
          this.classCode=this.classList[0].id;
          this.getUserDepInfoByDepIdsFunc();
          getLevelByGradeId({
            gradeId:this.gradeCode
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.level=data.data.level;
              if(this.level>=1&&this.level<3){
                this.typeStand=[1,2,3,4,7,8,9,10,11,12,13];
              }
              if(this.level>=3&&this.level<5){
                this.typeStand=[1,2,3,4,5,7,8,9,10,11,12,13];
              }
              if(this.level>=5&&this.level<=6){
                this.typeStand=[1,2,3,4,5,6,7,8,9,10,11,12,13];
              }
            }
          })
        }
      })
    },
    changeClass(val){
      this.searchTitle='';
      this.classCode=val;
      this.getUserDepInfoByDepIdsFunc();
    },
    changeSchoolYear(val){
      this.searchTitle='';
      this.schoolYearCode=val;
      let schoolYearItem=this.schoolYearList.find(item=>{
        return item.id==val;
      });
      this.schoolYearName=schoolYearItem.year;
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
  .inputStyle{
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .inputSelect{
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    outline: 0;
    width:100%;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
  }
  
}
.link-type, .link-type:focus{
  color: #337ab7;
  cursor: pointer;
}
</style>

