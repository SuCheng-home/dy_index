<template>
<div class="diningsurveyadd">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="insertFireSurvey()">保存</el-button>   
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="订餐时间段" prop="dateRange">
            <el-date-picker v-model="ruleForm.dateRange" size="medium" :clearable="false" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>    
             <el-form-item label="面向对象" prop="type">
                <el-radio-group v-model="ruleForm.type" @change="zhuengtaichange()">
                <el-radio :label="2">学生</el-radio>
                <el-radio :label="1">老师</el-radio>
                </el-radio-group>
            </el-form-item>     
            <el-form-item label="订餐发布范围" prop="addressDataprop">
              <address-book title="订餐发布范围" v-model="ruleForm.addressData" :config="ruleForm.type==1?teacherConfigData:teacherConfigDatatwo" :isSchoolManager="true"></address-book>
            </el-form-item>
              <el-form-item label="可订餐种" >
                  <span v-if="ruleForm.type==2">
                    <el-checkbox v-if="query.stuBreakfast" v-model="ruleForm.breakfast">早餐</el-checkbox>
                    <el-checkbox v-if="query.breakMeal" v-model="ruleForm.breakMeal">课间餐</el-checkbox>
                    <el-checkbox v-if="query.lunch" v-model="ruleForm.lunch">午餐</el-checkbox>
                    <el-checkbox v-if="query.stuSupper" v-model="ruleForm.supper">晚餐</el-checkbox>
                  </span>
                  <span v-else>       
                     <el-checkbox v-if="query.breakfast" v-model="ruleForm.breakfast">早餐</el-checkbox>
                    <el-checkbox v-if="query.teacherLunch" v-model="ruleForm.lunch">午餐</el-checkbox>
                    <el-checkbox v-if="query.supper" v-model="ruleForm.supper">晚餐</el-checkbox> 
                  </span>                    
                </el-form-item>
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import AddressBook from "@/components/AddressBook/indexExpand";
import {insertFireSurvey} from "@/api/diningsurvey";
 import {getFireSet} from "@/api/fire";
export default {
  components: { AddressBook},
  data() {
    const addressDatapropfun = (rule, value, callback) => {
      if (this.ruleForm.addressData.departJson.length) {
        return callback();
      } else {
        return callback(new Error("请选择订餐发布范围"));
      }
    };
    return {
      teacherConfigData: {
        title: "订餐发布范围",
        depart: { target: "depart", departType: "t", userTypes: "1,2" },
        group: false
      },
      teacherConfigDatatwo: {
        title: "订餐发布范围",
        depart: { target: "depart", departType: "s", userTypes: "1,2" },
        group: false
      },
      ruleForm: {
        addressData: { departJson: [], groupJson: [], userJson: [] },
        type:2,
        state:2,
        schoolTimeId:"",
        dateRange:[],
        breakMeal:false,
        breakfast:false,
        supper:false,
        lunch:false,
      },
      rules: {
        addressDataprop: [{ validator: addressDatapropfun, trigger: "change", required: true }],
        dateRange: [{type: "array", required: true, message: "订餐时间段",trigger: "change"}],
        type: [{ required: true, message: '请选择面向对象', trigger: 'change' }],
      },
       query: {
                    lunch:true,//	午餐，1代表有午餐，0代表无午餐	number
                    stuSupper:"",//	学生晚餐，1代表有晚餐，0代表无晚餐	number
                    stuBreakfast:"",//	学生早餐，1代表有早餐，0代表无早餐	number	
                    breakMeal:"",//	课间餐，1代表有课间餐，0代表无课间餐	number
                    teacherLunch:true,//	教师午餐，1代表有午餐，0代表无午餐	number
                    breakfast:"",//	早餐，1代表有早餐，0代表无早餐	number
                    supper:"",//	晚餐，0无晚餐，1有晚餐	number
                },      
    };
  },
   watch: {
            'ruleForm.addressData': {
                handler: function () {
                    this.$refs.ruleForm.validateField('addressDataprop');
                },
                deep: true
            },
        },
  mixins: [mixin],
  created() {
                getFireSet().then(res => {
                    let data = res.data.data;
                    this.query.supper = data.supper == 1; 
                    this.query.breakMeal = data.breakMeal == 1;
                    this.query.lunch = data.lunch == 1;
                    this.query.teacherLunch = data.teacherLunch == 1;
                    this.query.stuBreakfast = data.stuBreakfast == 1;
                    this.query.stuSupper = data.stuSupper == 1;
                    this.query.breakfast = data.breakfast == 1;
                }).catch();
  },
  methods: {   
    zhuengtaichange(){
        this.ruleForm.breakMeal=false;
        this.ruleForm.breakfast=false;
        this.ruleForm.supper=false;
        this.ruleForm.lunch=false;
    },
    insertFireSurvey() {  
      this.$refs.ruleForm.validate(valid => {        
        if (valid) {  
          if(!this.ruleForm.breakMeal&&!this.ruleForm.breakfast&&!this.ruleForm.supper&&!this.ruleForm.lunch) {
            this.$message({type: 'error', message:'请选择可订餐种！'});
                 return;
          }
            let obj={
                departJson:JSON.stringify(this.ruleForm.addressData.departJson),//	部门json	string	
                endDate:moment(this.ruleForm.dateRange[1]).format('YYYY-MM-DD'),//	结束时间	string	
                schoolTimeId:this.$route.query.schoolTimeId,//	学期id	number	
                startDate:moment(this.ruleForm.dateRange[0]).format('YYYY-MM-DD'),//	开始时间	string	
                state:this.ruleForm.state,//	状态，1保存，2发布，3完成调查	number	
                type:this.ruleForm.type,//	1教师，2学生	number	
                breakMeal:this.ruleForm.breakMeal-0,
                breakfast:this.ruleForm.breakfast-0,
                supper:this.ruleForm.supper-0,
                lunch:this.ruleForm.lunch-0,
            }       
           insertFireSurvey(obj).then(res => res.data).then(data => {
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