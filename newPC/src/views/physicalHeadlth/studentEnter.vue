<template>
  <div class="studentEnter padding addTabSwitch">
    <div class="botton" v-if="isStandalone">
        <span @click="jumpPage('fitnessList')" >数据汇总</span>
        <span @click="jumpPage('batchImport')">批量导入</span>
        <span  @click="jumpPage('itemEnter')">按项录入</span>
        <span class="tab-right tabcolor">按学生录入</span>
    </div> 
    <div class="header">
      <template>
          <el-select size="medium" v-model="schoolYearCode" placeholder="请选择学年" @change="changeSchoolYear" disabled="disabled">
              <el-option v-for="item in schoolYearList" :key="item.id" :label="item.year" :value="item.id">
              </el-option>
          </el-select>
      </template>
    </div>
    <div class="mainContainer" :style="isStandalone?{'height':boxH-166+'px'}:{'height':boxH-110+'px'}">
      <div class="mainWrap">
        <div v-for="(gradeItem,gradeIndex) in gradeClassList" :key="gradeIndex">
          <div class="g-title">
            {{gradeItem.name}}
          </div>
          <ul class="gradeUl clearfix">
            <li class="gradeLi" v-for="(classItem,classIndex) in gradeItem.classList" :key="classIndex">
              <!-- {{classItem.studNum}}{{classItem.id}}{{enterResult(classItem.id,classItem.studNum)}} -->
              <a href="javascript:;" class="succ" v-if="enterResult(classItem.id,classItem.studNum)==1" @click="jumpPage('studentList',{gradeId:gradeItem.id,classId:classItem.id,className:classItem.name})">
                <span class="title">{{classItem.name}}</span>
                <span class="smallTitle" >已录入</span>
              </a>
              <a href="javascript:;" class="warm" v-if="enterResult(classItem.id,classItem.studNum)==2" @click="jumpPage('studentList',{gradeId:gradeItem.id,classId:classItem.id})">
                 <span class="title">{{classItem.name}}</span>
                 <span class="smallTitle" >录入中</span>
              </a>
              <a href="javascript:;" v-if="enterResult(classItem.id,classItem.studNum)==3" @click="jumpPage('studentList',{gradeId:gradeItem.id,classId:classItem.id})">
                <span class="title">{{classItem.name}}</span>
                <span class="smallTitle" >未录入</span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {getSchoolYear,getCurrentSchoolTimeBySchoolId,querySchoolGradeClass,getClassListBySchoolYear,countUsersByDepIds} from '@/api/physicalHeadlth/index';
import mixins from '@/mixins/windowResize';
export default {
  data(){
    return{
      schoolYearName:'',
      schoolYearCode:'',
      schoolYearList:[],
      gradeClassList:[],
      enterList:[]
    }
  },
  created(){
    //获取学年
    this.getSchoolYearFunc();
  },
  mixins:[mixins],
  mounted(){

  },
  computed: {
      ...mapGetters([
          'isStandalone'
      ])
  },
  methods:{
    jumpPage(path,query={}){
      this.$router.push({
          path,
          query
      })
    },
    enterResult(id,classNum){
      var text="3";
      var flag=false;
      this.enterList.forEach((item,index)=>{
        if(item.classId==id&&classNum!=0&&item.stuEnteringCount==classNum){
         text="1";//
         flag = true;
        }
        if(item.classId==id&&classNum!=0&&item.stuEnteringCount>0&&item.stuEnteringCount<classNum){
          text= "2";//
          flag = true;
        }
       if(!flag){
         text= "3";//
       }
      })
      return text;
    },
    getClassListBySchoolYearFunc(){
      getClassListBySchoolYear({
        schoolYear:this.schoolYearName
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let enterData=data.data;
          this.enterList=enterData;
        }
      }).catch(()=>{})
    },
    querySchoolGradeClassFunc(){
      //获得年级和班级列表
      querySchoolGradeClass().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.gradeClassList=data.data;
          this.gradeClassList.forEach((item)=>{
            if(item.classList){
              item.classList.forEach((subItem)=>{
                countUsersByDepIds({
                  departIds:subItem.id,
                  userType:2
                }).then(res=>res.data)
                .then(data=>{
                  if(data.code===200){
                    if(data.data||data.data==0){
                      let numData=data.data;
                      this.$set(subItem,"studNum",numData);
                    }
                  }
                }).catch(()=>{})
              })
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
                }
              })
              this.getClassListBySchoolYearFunc();
              this.querySchoolGradeClassFunc();
            }
          })

        }
      }).catch(()=>{})
    },
    changeSchoolYear(val){
      this.schoolYearCode=val;
      let schoolYearItem=this.schoolYearList.find(item=>{
        return item.id==val;
      });
      this.schoolYearName=schoolYearItem.year;
    }
  }
}
</script>
<style lang="scss" scoped>
.addTabSwitch .botton {
    width: 80%;
    overflow: hidden;
    margin:0 auto 20px;
}
.addTabSwitch .botton span {
    width: 25%;
    line-height: 34px;
    font-size:16px;
    float: left;
    text-align: center;
    background: #fff;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    cursor: pointer;
}
.addTabSwitch .botton .tabcolor {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
    -webkit-box-shadow: -1px 0 0 0 #20a0ff;
    box-shadow: -1px 0 0 0 #20a0ff;
}
.addTabSwitch .botton .tab-right {
  border-radius: 0 4px 4px 0;
}
.addTabSwitch .botton .tab-left {
  border-radius: 4px 0 0 4px;
}
ul,li{
  list-style: none;
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
.studentEnter{
  .header{
    padding-bottom:10px;
    border-bottom:1px solid  #e7eaec;
    margin-bottom:0;
  }
  .mainContainer{
    width:100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding:20px 0;
    box-sizing: border-box;
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
  .gradeUl{
    padding:10px 20px;
    width:100%;
    box-sizing: border-box;
    .gradeLi{
      width:17%;
      height:100px;
      
      float:left;
      margin-right:3%;
      margin-bottom:20px;
      text-align: center;
      border-radius:6px;
      overflow: hidden;
      a{
        display: block;
        width:100%;
        height:100%;
        text-decoration: none;
        color:#2c3e50;
        background:#F2F2F2;
      }
      .title{
        display: block;
        padding-top:24px;
        font-weight: bold;
      }
      .smallTitle{
        display: block;
        padding-top:12px;
      }
      a.warm{
        background:#EF7F1A;
      }
      a.succ{
        background:#409EFF;
      }
    }
    .gradeLi:nth-child(5n){
      margin-right:0;
    }
    
  }
}
</style>

