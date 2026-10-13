<template>
<div class="diningsurveyadd">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="addSurveyUsers()">保存</el-button>   
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="订餐人员" prop="addressDataprop">
              <address-book title="订餐人员" v-model="ruleForm.addressData" :config="ruleForm.type==1?teacherConfigData:teacherConfigDatatwo" :isSchoolManager="true"></address-book>
            </el-form-item>
            <el-form-item label="订餐开始时间" prop="repastDate">
              <el-date-picker  :picker-options="pickerOptions" v-model="ruleForm.repastDate" size="medium" :clearable="false" type="date" placeholder="请选择订餐开始时间" ></el-date-picker>
            </el-form-item> 
             <el-form-item label="订餐餐次" prop="meals">
                  <span v-if="ruleForm.type==2">
                     <el-checkbox  v-if="query.stuBreakfast" v-model="ruleForm.breakfast">早餐({{query.stuBreakfastPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.lunch" v-model="ruleForm.lunch">午餐({{query.lunchPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.stuSupper" v-model="ruleForm.supper">晚餐({{query.stuSupperPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.breakMeal" v-model="ruleForm.breakMeal">课间餐({{query.breakMealPrice/100}}元)</el-checkbox>
                  </span>
                  <span v-else>
                    <el-checkbox v-if="query.breakfast"  v-model="ruleForm.breakfast">早餐({{query.breakfastPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.teacherLunch" v-model="ruleForm.lunch">午餐({{query.teacherLunchPrice/100}}元)</el-checkbox>
                        <el-checkbox v-if="query.supper" v-model="ruleForm.supper">晚餐({{query.supperPrice/100}}元)</el-checkbox>
                  </span>                    
               </el-form-item>
             <el-form-item label="备注">
                 添加订餐人员时间段必须在调查范围之内
            </el-form-item> 
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import AddressBook from "@/components/AddressBook/indexExpand";
import {addSurveyUsers,getFireSurveyById} from "@/api/diningsurvey";
export default {
  components: { AddressBook},
  data() {
    const addressDatapropfun = (rule, value, callback) => {
      if (this.ruleForm.addressData.userJson.length) {
        return callback();
      } else {
        return callback(new Error("请选择订餐人员"));
      }
    };
    const mealsfun = (rule, value, callback) => {
      if (this.ruleForm.supper||this.ruleForm.breakMeal||this.ruleForm.breakfast||this.ruleForm.lunch) {
        return callback();
      } else {
        return callback(new Error("请选择餐次"));
      }
    };
     const repastDatefun = (rule, value, callback) => {
       if(!this.ruleForm.repastDate){
            return callback(new Error("请选择订餐开始时间"));
       }
        if(moment(this.ruleForm.repastDate).format('YYYY-MM-DD')>this.endDate||moment(this.ruleForm.repastDate).format('YYYY-MM-DD')<this.startDate){
             return callback(new Error("请选择批次内时间"));
         }else {
          return callback();
      }
    };
    return {
      endDate:this.$route.query.endDate,
      state:this.$route.query.state,
      startDate:this.$route.query.startDate,     
      teacherConfigData: {
        title: "订餐人员",
        depart: { target: "user", departType: "t", userTypes: "1" },
        group: false
      },
      teacherConfigDatatwo: {
        title: "订餐人员",
        depart: { target: "user", departType: "s", userTypes: "2" },
        group: false
      },
      ruleForm: {
        addressData: { departJson: [], groupJson: [], userJson: [] },
        type:this.$route.query.type,
        surveyId:this.$route.query.surveyId,
        state:2,
        schoolTimeId:"",
        repastDate:"",
        supper:false,
        breakMeal:false,
        breakfast:false,
        lunch:false,
      },
      rules: {
        meals: [{ validator: mealsfun, trigger: "change", required: true }],
        addressDataprop: [{ validator: addressDatapropfun, trigger: "change", required: true }],
        repastDate: [{ validator: repastDatefun, trigger: "change", required: true }],
        // repastDate: [{ required: true, message: '请选择订餐开始时间', trigger: 'change' }],
      },
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
                    this.query.lunchPrice = data.lunchPrice-0;
                    this.query.lunch = data.lunch == 1;
                    this.query.teacherLunch = data.lunch == 1;
                    this.query.teacherLunchPrice = data.lunchPrice-0;
                    this.query.stuBreakfastPrice = data.breakfastPrice-0;
                    this.query.breakfastPrice = data.breakfastPrice-0;
                    this.query.breakMealPrice = data.breakMealPrice-0;                    
                    this.query.stuSupperPrice = data.supperPrice-0; 
                    this.query.supperPrice = data.supperPrice-0;
                }).catch();
  },
  methods: {   
    addSurveyUsers() {  
      this.$refs.ruleForm.validate(valid => {        
        if (valid) {   
            let userIds="";
            for(let i=0;i<this.ruleForm.addressData.userJson.length;i++){
                if(i<this.ruleForm.addressData.userJson.length-1){
                    userIds+=(this.ruleForm.addressData.userJson[i].id+',');
                }else{
                    userIds+=this.ruleForm.addressData.userJson[i].id;
                }
                }           
            let obj={
                userIds:userIds,//	部门json	string	
                repastDate:moment(this.ruleForm.repastDate).format('YYYY-MM-DD'),//	结束时间	string		
                surveyId:this.ruleForm.surveyId,//	状态，1保存，2发布，3完成调查	number	
                type:this.ruleForm.type,//	1教师，2学生	number	
                breakMeal:this.ruleForm.breakMeal?2:1,
                breakfast:this.ruleForm.breakfast?2:1,
                lunch:this.ruleForm.lunch?2:1,
                supper:this.ruleForm.supper?2:1,
                startDate:this.startDate,
                endDate:this.endDate,
                state:this.state
            }       
           addSurveyUsers(obj).then(res => res.data).then(data => {
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
    }
  }
}
</style>