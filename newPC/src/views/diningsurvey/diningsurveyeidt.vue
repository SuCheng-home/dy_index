<template>
<div class="diningsurveyeidt">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="submitSurvey()">保存</el-button>   
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="订餐时间" prop="dateRange">
              {{startDate}}~{{endDate}}
            </el-form-item>    
            <el-form-item label="订餐天数" prop="dateRange">
                本期共计订餐{{repastCont}}天
            </el-form-item>
             <el-form-item label="是否订餐" prop="dateRange">
                         <el-checkbox v-model="ruleForm.repastState">订餐</el-checkbox>
            </el-form-item> 
            <el-form-item label="选择餐次" prop="dateRange" v-if="ruleForm.repastState">
               <div v-if="type==2">
                        <el-checkbox  v-if="query.stuBreakfast" v-model="ruleForm.breakfast">早餐({{query.stuBreakfastPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.lunch" v-model="ruleForm.lunch">午餐({{query.lunchPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.stuSupper" v-model="ruleForm.supper">晚餐({{query.stuSupperPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.breakMeal" v-model="ruleForm.breakMeal">课间餐({{query.breakMealPrice/100}}元)</el-checkbox>
               </div>              
               <div v-if="type==1">
                        <el-checkbox v-if="query.breakfast"  v-model="ruleForm.breakfast">早餐({{query.breakfastPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.teacherLunch" v-model="ruleForm.lunch">午餐({{query.teacherLunchPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.supper" v-model="ruleForm.supper">晚餐({{query.supperPrice/100}}元)</el-checkbox>
               </div>
            </el-form-item> 
            <el-form-item label="备注" prop="dateRange">
              如果不在学校订餐，请选择不订餐，如果未提交调查，则视为不订餐
            </el-form-item>     
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import {submitSurvey,getSurveyUserByUserId,getFireSurveyById} from "@/api/diningsurvey";
export default {
  data() {   
    return {     
      ruleForm: {
            breakMeal:true,	//课间餐，默认1不订餐 ,2订餐	number	
            breakfast:true,	//早餐，默认1不订餐 ,2订餐	number	
            id:"",//	主键	number	
            lunch:true,//午餐，默认1不订餐 ,2订餐	number	
            repastState:true,//订餐状态，1不订餐，2订餐	number	
            supper:true,//	晚餐，默认1不订餐 ,2订餐	number
      },    
       type:this.$route.query.type,//	主键	number  
       query: {
                    lunch:true,//	午餐，1代表有午餐，0代表无午餐	number
                    stuSupper:"",//	学生晚餐，1代表有晚餐，0代表无晚餐	number
                    stuBreakfast:"",//	学生早餐，1代表有早餐，0代表无早餐	number	
                    breakMeal:"",//	课间餐，1代表有课间餐，0代表无课间餐	number
                    teacherLunch:true,//	教师午餐，1代表有午餐，0代表无午餐	number
                    breakfast:"",//	早餐，1代表有早餐，0代表无早餐	number
                    supper:"",//	晚餐，0无晚餐，1有晚餐	number
                    lunchPrice: '', //	学生午餐价位	string
                    breakMealPrice: '', //	课间餐价位	string
                    stuBreakfastPrice: '', //	学生早餐价位	number
                    stuSupperPrice: '', //	学生晚餐价位	number
                    teacherLunchPrice: '', //	教师午餐餐标	string
                    breakfastPrice: '', //	早餐价位	string
                    supperPrice: '',                   
                },    
                endDate:"", 
                startDate:"",
                repastCont:"" 
    };
  },
  mixins: [mixin],
  created() {
                getFireSurveyById(this.$route.query.surveyId).then(res => {
                    let data = res.data.data;
                    this.query.supper = data.supper == 1; 
                    this.query.stuSupper = data.supper == 1;
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.stuBreakfast = data.breakfast == 1;                    
                    this.query.breakfast = data.breakfast == 1;
                    this.query.lunch = data.lunch == 1;
                    this.query.teacherLunch = data.lunch == 1;
                    this.query.lunchPrice = data.lunchPrice-0;
                    this.query.teacherLunchPrice = data.lunchPrice-0;
                    this.query.stuBreakfastPrice = data.breakfastPrice-0;
                    this.query.breakfastPrice = data.breakfastPrice-0;
                    this.query.breakMealPrice = data.breakMealPrice-0;                    
                    this.query.stuSupperPrice = data.supperPrice-0; 
                    this.query.supperPrice = data.supperPrice-0;
                }).catch();
                 getSurveyUserByUserId(this.$route.query).then(res => {
                    let data = res.data.data;
                    // if(data.submitState==2){
                        this.ruleForm.breakMeal = data.breakMeal==2; 
                        this.ruleForm.breakfast = data.breakfast==2; 
                        this.ruleForm.id = data.id; 
                        this.ruleForm.lunch = data.lunch==2; 
                        this.ruleForm.repastState = data.repastState==2; 
                        this.ruleForm.supper = data.supper==2;
                        this.endDate=data.endDate;
                        this.startDate=data.startDate;
                        this.repastCont=data.repastCont;
                    // }
                   
                }).catch();
  },
  methods: {   
    submitSurvey() {  
      this.$refs.ruleForm.validate(valid => {        
        if (valid) {  
            let obj={}     
            if(!this.ruleForm.repastState)  {
               obj={
                    breakMeal:1,	//课间餐，默认1不订餐 ,2订餐	number	
                    breakfast:1,	//早餐，默认1不订餐 ,2订餐	number	
                    id:this.ruleForm.id,//	主键	number	
                    lunch:1,//午餐，默认1不订餐 ,2订餐	number	
                    repastState:1,//订餐状态，1不订餐，2订餐	number	
                    supper:1,//	晚餐，默认1不订餐 ,2订餐	number
               }
            }else{
                 obj={
                    breakMeal:this.ruleForm.breakMeal?2:1,	//课间餐，默认1不订餐 ,2订餐	number	
                    breakfast:this.ruleForm.breakfast?2:1,	//早餐，默认1不订餐 ,2订餐	number	
                    id:this.ruleForm.id,//	主键	number	
                    lunch:this.ruleForm.lunch?2:1,//午餐，默认1不订餐 ,2订餐	number	
                    repastState:2,//订餐状态，1不订餐，2订餐	number	
                    supper:this.ruleForm.supper?2:1,//	晚餐，默认1不订餐 ,2订餐	number
               }
            }
           submitSurvey(obj).then(res => res.data).then(data => {
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
.diningsurveyeidt {
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
    }
  }
}
</style>