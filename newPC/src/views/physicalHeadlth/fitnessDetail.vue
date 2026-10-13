<template>
  <div class="fitnessDetail padding">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button  @click="goBack" type="default" size="medium">返回</el-button>
          <el-button @click="print()" type="primary" size="medium">打印</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="mainContainer" :style="{height:nobottommaxH+'px'}" ref="print" id="print">
      <div class="mainWrap" :fitnessInfo="fitnessInfo" >
        <div class="h2">
          <span v-if="fitnessInfo.schoolYear">{{fitnessInfo.schoolYear}}学年</span>学生体质健康登记卡
        </div>
        <div class="g-title">
          基础信息
        </div>
        <div class="basicInfo">
          <ul class="clearfix"> 
            <li>
              <span class="title">姓名：</span>
              <span class="txt">{{name}}</span>
            </li>
            <li>
              <span class="title">性别：</span>
              <span class="txt">{{gender|filterSex}}</span>
            </li>
            <li>
              <span class="title">学号：</span>
              <span class="txt">{{learnNum}}</span>
            </li>
            <li>
              <span class="title">班级：</span>
              <span class="txt">{{className}}</span>
            </li>
            <li>
              <span class="title">出生日期：</span>
              <span class="txt">{{birthDate}}</span>
            </li>
            <li style="opacity:0;">
              <span class="title">民族：</span>
              <span class="txt"></span>
            </li>
            <li>
              <span class="title">身高：</span>
              <span class="txt" v-if="height">{{height}} cm</span>
            </li>
            <li>
              <span class="title">体重：</span>
              <span class="txt" v-if="weight">{{weight}} kg</span>
            </li>
          </ul>
        </div>
        <div class="g-title">
          综合评分
        </div>
        <div class="combindScore">
          <ul class="clearfix">
            <li>
              <span class="title">标准分：</span>
              <span class="txt">{{fitnessInfo.standardScore}}</span>
            </li>
            <li>
              <span class="title">附加分：</span>
              <span class="txt">{{fitnessInfo.additionalScore}}</span>
            </li>
            <li>
              <span class="title">学年总分：</span>
              <span class="txt">{{fitnessInfo.totalScore}}</span>
            </li>
            <li>
              <span class="title">等级评定：</span>
              <span class="txt">{{fitnessInfo.totalLevel}}</span>
            </li>
          </ul>
        </div>
        <div class="g-title">
          评分明细
        </div>
        <div style="margin-bottom:40px;">
          <el-table
          :data="fitnessInfo.projectList"
          style="width: 100%">
          <el-table-column
            label="考核项"
            align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{changeVal(scope.row.projectType)}}
            </template>
          </el-table-column>
          <el-table-column
            label="成绩"
            align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.projectType==1">
                {{scope.row.projectValue}}/{{scope.row.releaseValue}}
              </span>
              <span v-else>{{scope.row.projectValue}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="评分"
            align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.projectScore}}
            </template>
          </el-table-column>
          <el-table-column
            label="等级"
            align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.projectLevel}}
            </template>
          </el-table-column>
          <el-table-column
            label="附加分"
            align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.additionalScore}}
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getStudentInfoAndCardById,getFitnessTestDetail,getParentByChildId,getLevelByGradeId} from '@/api/physicalHeadlth/index';
import mixins from '@/mixins/windowResize';
export default {
  data(){
    return{
      fitnessTestId:this.$route.query.id,
      studentId:this.$route.query.studentId,
      schoolId:this.$route.query.schoolId,
      classId:this.$route.query.classId,
      schoolYear:this.$route.query.schoolYear,
      fitnessInfo:{},
      height:'',
      weight:'',
      name:'',
      gender:'',
      learnNum:'',
      className:'',
      birthDate:'',
      subId:'',
      level:'',
      typeStand:[],
      newFitnessInfo:{}
    }
  },
  created(){
    //根据体质健康id查单条
    this.getStudentInfoAndCardByIdFunc();
    this.getParentByChildIdFunc();
  },
  mixins:[mixins],
  mounted(){
    
  },
  filters:{
    filterSex(val){
      if(val){
        switch(Number(val)){
          case 1:
            return "男";
            break;
          case 2:
            return "女";
            break;
          default:
            break;
        }
      }
    }
  },
  methods:{
    print() {
      this.$print(this.$refs.print);
    },
    getParentByChildIdFunc(){
      getParentByChildId({
        childId:this.classId
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
                this.typeStand=[1,2,3,4,7,8,9,10,11,12,13];
              }
              if(this.level>=3&&this.level<5){
                this.typeStand=[1,2,3,4,5,7,8,9,10,11,12,13];
              }
              if(this.level>=5&&this.level<=6){
                this.typeStand=[1,2,3,4,5,6,7,8,9,10,11,12,13];
              }
              this.getFitnessTestDetailFunc();
            }
          })
        }
      })
    },
    getStudentInfoAndCardByIdFunc(){
      getStudentInfoAndCardById({
        schoolId:this.schoolId,
        searchType:'',
        studentId:this.studentId,
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          if(data.data){
            let StuInfo=data.data.studentInfo;
            this.name=StuInfo.name;
            this.gender=StuInfo.gender;
            this.learnNum=StuInfo.learnNum;
            this.className=StuInfo.className;
            this.birthDate=StuInfo.birthDate;
          }
        }
      }).catch(()=>{})
    },
    changeVal(item){
      var text='';
      switch(item){
        case 1:
          text='体重指数(cm/kg)';
          break;
        case 2:
          text='肺活量(ml)';
          break;
        case 3:
          text="50米跑(秒)";
          break;
        case 4:
          text="坐位体前屈(cm)";
          break;
        case 5:
          text="1分钟仰卧起坐(次)";
          break;
        case 6:
          text="50米*8往返跑(秒)";
          break;
        case 7:
          text="一分钟跳绳(次)";
          break;
        case 8:
          text="左眼裸眼视力";
          break;
        case 9:
          text="右眼裸眼视力";
          break; 
        case 10:
          text="左眼屈光不正";
          break; 
        case 11:
          text="右眼屈光不正";
          break; 
        case 12:
          text="左眼串镜";
          break; 
        case 13:
          text="右眼串镜";
          break; 
        case 14:
          text="总分";
          break;
        default:
          break;
      }
      return text;
    },
    getFitnessTestDetailFunc(){
      getFitnessTestDetail({
        fitnessTestId:this.fitnessTestId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let fitnessData=data.data;
          this.fitnessInfo=fitnessData;
          if(this.fitnessInfo.projectList.length!==0){
            if(this.fitnessInfo.projectList.length>this.typeStand.length){
              let flags=[];
              this.fitnessInfo.projectList.forEach((subItem,subIndex)=>{
                if(this.typeStand.indexOf(subItem.projectType)==-1){
                  flags.unshift(subIndex);
                }
              })  
              flags.forEach((flagItem,flagIndex)=>{
                this.fitnessInfo.projectList.splice(flagItem,1)
              })
            }
            if(this.fitnessInfo.projectList.length<this.typeStand.length){
              const convArr = this.typeStand.map(item => {
                const xdX = this.fitnessInfo.projectList.filter(j_item => {
                  return item == j_item.projectType
                })[0]
                if(xdX) {
                  return xdX
                } else {
                  return {
                    additionalScore:'',
                    projectType:item,
                    projectValue:'',
                    releaseValue:'',
                    projectScore:'',
                    projectLevel:''
                  }
                }
              })
              this.fitnessInfo.projectList=convArr;
            }
          }
          
          this.height=fitnessData.projectList[0].projectValue;
          this.weight=fitnessData.projectList[0].releaseValue;
          // this.fitnessInfo.projectList.push({
          //   additionalScore: this.fitnessInfo.additionalScore,
          //   fitnessId: '',
          //   id: '',
          //   isDelete: 0,
          //   projectLevel: this.fitnessInfo.totalLevel,
          //   projectScore: this.fitnessInfo.totalScore,
          //   projectType: 8,
          //   projectValue: '',
          //   releaseValue: '',
          //   schoolId: '',
          // })
        }
      }).catch(()=>{})
    },
    goBack(){
      this.$router.push({
        path:'fitnessList',
        query:{
          classId:this.classId,
          schoolYear:this.schoolYear
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
ul,li{
  list-style: none;
}
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
.clearfix:after{
    content:'';
    display: block;
    height:0;
    clear: both;
    visibility: hidden;
}
.padding{
  padding:12px;
  box-sizing: border-box;
}
.fitnessDetail{
  .header{
    padding-bottom:10px;
    border-bottom:1px solid  #e7eaec;
    margin-bottom:0px;
  }
  .mainContainer{
    width:100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top:20px;
    box-sizing: border-box;
  }
  .mainWrap{
    width:810px;
    height:100%;
    
    margin:0 auto;
    .h2{
      font-size: 26px;
      text-align: center;
      font-weight: 700;
      position: relative;
      padding-top:10px;
      margin-bottom:20px;
    }
    .g-title{
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      font-weight: 700;
      padding-left:12px;
    }
    .g-title:before{
      content: '';
      position:absolute;
      left:0;
      display: block;
      width:4px;
      height:20px;
      top:10px;
      background:#409EFF;
    }
    .title{
      //font-weight: bold;
      color:#333;
    }
    .txt{
      color:#5f5f5f;
    }
    .basicInfo{
      ul{ 
        padding:10px 30px;
        box-sizing: border-box;
      }
      li{
        float:left;
        width:30%;
        padding:5px 0;
      }
    }
    .combindScore{
      ul{
        padding:10px 30px;
        box-sizing: border-box;
      }
      li{
        float:left;
        width:25%;
        padding:5px 0;
        box-sizing: border-box;
      }
    }
  }
}
@media print {
  .mainWrap{
    width:810px;
    height:100%;
    
    margin:0 auto;
    .h2{
      font-size: 26px;
      text-align: center;
      font-weight: 700;
      position: relative;
      padding-top:10px;
      margin-bottom:20px;
    }
    .g-title{
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      font-weight: 700;
      padding-left:12px;
    }
    .g-title:before{
      content: '';
      position:absolute;
      left:0;
      display: block;
      width:4px;
      height:20px;
      top:10px;
      background:#409EFF;
    }
    .title{
      //font-weight: bold;
      color:#333;
    }
    .txt{
      color:#5f5f5f;
    }
    .basicInfo{
      ul{ 
        padding:10px 30px;
        box-sizing: border-box;
      }
      li{
        float:left;
        width:30%;
        padding:5px 0;
      }
    }
    .combindScore{
      ul{
        padding:10px 30px;
        box-sizing: border-box;
      }
      li{
        float:left;
        width:25%;
        padding:5px 0;
        box-sizing: border-box;
      }
    }
  }
}
</style>

