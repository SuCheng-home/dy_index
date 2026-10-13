<template>
  <div class="healthCheckStatic">
    <div class="header-wrap">
      <div class="header">
        <el-row>
          <template>
            <el-date-picker
                    v-model="date"
                    type="date"
                    size="medium"
                    class="btnLeftLine"
                    placeholder="请选择日期"
                    :clearable="false"
                    @change="dateChangeHandler"
            >
            </el-date-picker>
          </template>
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
          <el-button type="primary" size="medium" @click="queryHandler(0)">查询</el-button>
          <el-button type="primary" size="medium" @click="queryHandler(1)">查询体温异常人员</el-button>
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
        <el-table-column  label="姓名" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :class="((parseFloat(scope.row.morningTemp)>=37.3)||(parseFloat(scope.row.noonTemp)>=37.3)?'healthSectionRed':'')">
                {{scope.row.studentName}}
              </span>
            </template>
        </el-table-column>
        <el-table-column  align="center" label="所在班级" show-overflow-tooltip>
          <template slot-scope="scope">
            <span >
              {{scope.row.className}}
            </span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="晨检体温（℃）" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="(parseFloat(scope.row.morningTemp)>=37.3?'healthSectionRed':'')">
              {{scope.row.morningTemp?scope.row.morningTemp+'℃':'--'}}
            </span>    
          </template>
        </el-table-column>
        <el-table-column  align="center" label="午检体温（℃）">
          <template slot-scope="scope">
            <span :class="(parseFloat(scope.row.noonTemp)>=37.3?'healthSectionRed':'')">
              {{scope.row.noonTemp?scope.row.noonTemp+'℃':'--'}}
            </span>  
          </template>
        </el-table-column>
        <el-table-column  align="center" label="症状描述" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>
              {{scope.row.symptoms?scope.row.symptoms:'--'}}{{scope.row.otherSymptom?`(${scope.row.otherSymptom})`:''}}
            </span>  
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {queryRoleList,querySchoolGrade,queryClassByGradeId,getClassStuDayTemperatureList} from '@/api/healthCheckStatic';
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
      date:this.$moment(new Date()).format('YYYY-MM-DD'),
      isOkTemp:0,//体温是否正常 0全部 1不正常
      dataList:[],
      exportURL:'',
      exportAllURL:''
    }
  },
  created(){
    this.queryRoleListFunc();
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
      this.getClassStuDayTemperatureListFunc();
    },
    dateChangeHandler(value){
      this.date = this.$moment(value).format('YYYY-MM-DD');
      this.getClassStuDayTemperatureListFunc();
    },
    getClassStuDayTemperatureListFunc(){
      getClassStuDayTemperatureList({
        classId:this.classCode,
        isOkTemp:this.isOkTemp,
        reportDate:this.date
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.dataList=data.data;
          this.exportURL =
          `${global.BasePath}structure/temperatureReport/exportStuTemperture?classId=${this.classCode}&isOkTemp=${this.isOkTemp}&reportDate=${this.date}&token=${this.$store.getters.token}`;
          this.exportAllURL=`${global.BasePath}structure/temperatureReport/exportStuTemperture?classId=0&isOkTemp=0&reportDate=${this.date}&token=${this.$store.getters.token}`;
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
                this.getClassStuDayTemperatureListFunc();
            }
        })
    },
    changeClass(val){
      this.classCode=val;
    },
    queryRoleListFunc(){
      //角色
      queryRoleList({
        userId:this.userInfo.id
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          const userArray=data.data;
          const userRoleList=[];
          if(userArray&&userArray.length!==0){
            userArray.forEach((item)=>{
              userRoleList.push(item.constantId);
            })
            if(userRoleList.indexOf(303)!==-1){
              this.roleId=303;
              this.querySchoolGradeFunc();
            }
          }
        }
      }).catch(()=>{
        
      })
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
