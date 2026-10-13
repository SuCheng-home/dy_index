<template>
<div class="diningsurveyadd">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="generateAnalysis()">保存</el-button>   
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
             <el-form-item label="统计批次" prop="surveyId">
                  <el-select size="medium" v-model="ruleForm.surveyId" placeholder="请选择统计批次" @change="surveyIdfun" >
                        <el-option v-for="item in surveyList" :key="item.id" :label="item.startDate+'~'+item.endDate+'（'+(item.type==2?'学生':'老师')+'）'" :value="item.id"></el-option>
                </el-select>
            </el-form-item>   
            <el-form-item label="统计时间段" prop="dateRange">
            <el-date-picker v-model="ruleForm.dateRange" size="medium" :clearable="false" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>    
             <el-form-item label="统计对象" prop="type">
                 {{ruleForm.type==2?"学生":"老师"}}
            </el-form-item>  
              <el-form-item label="备注">
                  统计时段不能重叠，并且不超过批次时段
              </el-form-item>
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import {generateAnalysis,getFireSurveyBySchoolTimeId} from "@/api/diningsurvey";
export default {
  data() {   
     const dateRangefun = (rule, value, callback) => {
       if(!this.ruleForm.dateRange[0]){
            return callback(new Error("请选择订餐开始时间"));
       }
       if(moment(this.ruleForm.dateRange[1]).format('YYYY-MM-DD')>this.endDate){
            return callback(new Error("统计时间不能超过当天"));
       }
        if(moment(this.ruleForm.dateRange[1]).format('YYYY-MM-DD')>this.endDate||moment(this.ruleForm.dateRange[0]).format('YYYY-MM-DD')<this.startDate){
             return callback(new Error("请选择批次内时间"));
         }else {
          return callback();
      }
    };
    return {     
      ruleForm: {
        surveyId:2,
        schoolTimeId:"",
        dateRange:["",""],
        type:1
      },
      surveyList:[],
      rules: {
        dateRange: [{validator: dateRangefun, required: true, trigger: "change"}],
        surveyId: [{ required: true, message: '请选择批次', trigger: 'change' }],
      },
      startDate:"",
      endDate:""
    };
  },
  mixins: [mixin],
  created() {
    getFireSurveyBySchoolTimeId(this.$route.query.schoolTimeId).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.surveyList=data.data;
                        this.endDate=this.surveyList[0].endDate;
                        this.startDate=this.surveyList[0].startDate;
                        this.ruleForm.surveyId=this.surveyList[0].id;
                        this.ruleForm.type=this.surveyList[0].type;
                    }
                })
  },
  methods: {   
      surveyIdfun(val){
          for(let i=0;i<this.surveyList.length;i++){
              if(val==this.surveyList[i].id){
                  this.endDate=this.surveyList[i].endDate;
                  this.startDate=this.surveyList[i].startDate;
                  this.ruleForm.type=this.surveyList[i].type;
              }
          }
            
      },
    generateAnalysis() {  
      this.$refs.ruleForm.validate(valid => {        
        if (valid) {   
            let obj={	
                endDate:moment(this.ruleForm.dateRange[1]).format('YYYY-MM-DD'),//	结束时间	string	
                startDate:moment(this.ruleForm.dateRange[0]).format('YYYY-MM-DD'),//	开始时间	string	
                surveyId:this.ruleForm.surveyId,//	状态，1保存，2发布，3完成调查	number	
                type:this.ruleForm.type,//	1教师，2学生	number	
                schoolTimeId:this.$route.query.schoolTimeId
            }       
           generateAnalysis(obj).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '新增成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.back();
                }
            }).catch(() => {})
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.diningsurveyadd {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 20px auto;
      .el-select{
          width: 100%;
      }
    }
  }
}
</style>