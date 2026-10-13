<template>
  <div class="wageslistoneeidt">
    <div class="wageslistoneeidt-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary"  size="medium" @click="updatePayrolls('ruleForm')">保存</el-button>
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
              <el-form-item label="姓名" prop="userName">
                <el-input v-model.trim="ruleForm.userName" :disabled="true"  :maxlength='10' placeholder='请输入姓名'></el-input>
              </el-form-item>  
              <el-form-item label="身份证" prop="userIdNumber" >
                      <el-input v-model="ruleForm.userIdNumber"  :disabled="true" :maxlength='20'  placeholder='请输入身份证'  ></el-input>
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
  import {updatePayroll,payrollDetails} from "@/api/wages";
  export default {
    data() {     
      return {
         ruleForm: {
            payrollId: this.$route.query.payrollId,//	批次Id	number
            dataStr:[],	//	数据	array<object>
            dataStrlist: [],	           	
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
        this.payrollDetailss()
    },
    methods: {  
        //获取批次详情
        payrollDetailss(){
            payrollDetails(this.ruleForm.payrollId).then(res => res.data).then(data => {
                            if(data.code==200) {                           
                               this.ruleForm.userName=data.data.userName;
                               this.ruleForm.userIdNumber=data.data.userIdNumber;
                               let list=data.data.dataList;
                               for(let i=2;i<list.length;i++){
                                   this.ruleForm.dataStrlist.push({dataVal:list[i].dataVal,title:list[i].title})
                               }
                             }
                        })
        },
        //编辑
        updatePayrolls(formName){
           this.$refs[formName].validate((valid) => {
              if (valid) {                
                 this.ruleForm.dataStr=JSON.stringify([{dataVal:this.ruleForm.userName,title:'姓名'},{dataVal:this.ruleForm.userIdNumber,title:'身份证'}].concat(this.ruleForm.dataStrlist));
                 updatePayroll(this.ruleForm.payrollId,this.ruleForm.dataStr).then(res => res.data).then(data => {
                            if(data.code==200) {
                                  this.$message({type: 'success', message: '编辑成功!' });
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
.wageslistoneeidt{
    padding:12px;
    .wageslistoneeidt-top{
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