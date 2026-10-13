<template>
  <div class="wagesSupplement">
    <div class="wagesSupplement-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary"  size="medium" @click="payrollInserts('ruleForm')">保存</el-button>
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
              <el-form-item label="姓名" prop="userName">
                <el-input v-model.trim="ruleForm.userName"  :maxlength='10' placeholder='请输入姓名'></el-input>
              </el-form-item>  
              <el-form-item label="身份证" prop="userIdNumber" >
                      <el-input v-model="ruleForm.userIdNumber"  :maxlength='20'  placeholder='请输入身份证'  ></el-input>
              </el-form-item>              
              <el-form-item :label="item.title" v-for="(item,index) in ruleForm.dataStrlist" :key="index" >
                <el-input  v-model.trim="item.dataVal" :maxlength='20'  placeholder='请输入'></el-input>
              </el-form-item>
            </el-form>
        </div>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {payrollInsert,payrollBatchDetails} from "@/api/wages";
  export default {
    data() {     
      return {
         ruleForm: {
            batchId: this.$route.query.batchId,//	批次Id	number
            dataStr:[],	//	数据	array<object>
            dataStrlist: [],	
            monthDate: '',//	月份时间	string	
            payrollTitle: '',//	工资单表头	string	
            payrollType: '',//	工资单类型名称	string	
            payrollTypeId: '',//	工资单类型id	number	
            userIdNumber: '',//	用户身份证号码	string	
            userName: '',//	用户名字	string
        },
        rules: {
          userName: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
          userIdNumber: [{ required: true, message: '请输入身份证', trigger: 'blur' },],         
        }
      }
    },
    mixins: [mixin],
    created() {
        this.payrollBatchDetailss()
    },
    methods: {  
        //获取批次详情
        payrollBatchDetailss(){
            payrollBatchDetails(this.ruleForm.batchId).then(res => res.data).then(data => {
                            if(data.code==200) {
                               this.ruleForm.monthDate=data.data.monthDate;
                               this.ruleForm.payrollTitle=data.data.payrollTitle;
                               this.ruleForm.payrollTypeId=data.data.payrollTypeId;
                               this.ruleForm.payrollType=data.data.payrollType;
                               let list=JSON.parse(data.data.payrollTitle);
                               for(let i=2;i<list.length;i++){
                                   this.ruleForm.dataStrlist.push({dataVal:'',title:list[i]})
                               }
                             }
                        })
        },
        //补录
        payrollInserts(formName){
           this.$refs[formName].validate((valid) => {
              if (valid) {                
                 this.ruleForm.dataStr=JSON.stringify([{dataVal:this.ruleForm.userName,title:'姓名'},{dataVal:this.ruleForm.userIdNumber,title:'身份证'}].concat(this.ruleForm.dataStrlist));
                 payrollInsert(this.ruleForm).then(res => res.data).then(data => {
                            if(data.code==200) {
                                  this.$message({type: 'success', message: '补录成功!' });
                                  this.$router.back();
                             }
                        })
              } 
        });
         }
    }
  };
</script>

<style lang="scss" scoped>
.wagesSupplement{
    padding:12px;
    .wagesSupplement-top{
       padding-bottom: 10px;
       border-bottom: 1px solid #e7eaec;
    }
    .subject{
        overflow: auto;
        .body{
            width: 810px;
            margin: 20px auto;
        }
    }
}
</style>