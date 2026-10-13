<template>
  <div class="wagestypeeidt">
    <div class="wagestypeeidt-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary"  size="medium" @click="updatePayrollTypes('ruleForm')">保存</el-button>
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
              <el-form-item label="分类名称" prop="payrollType">
                <el-input v-model.trim="ruleForm.payrollType"  :maxlength='20' placeholder='请输入分类名称'></el-input>
              </el-form-item>  
              <el-form-item label="排序号" prop="orderNo" >
                      <el-input v-model="ruleForm.orderNo"  type="number" :maxlength='4'  placeholder='请输入排序号'  ></el-input>
              </el-form-item>              
              <el-form-item label="分类描述">
                <el-input type="textarea" v-model.trim="ruleForm.payrollTypeDes" :maxlength='200'  placeholder='请输入分类描述'></el-input>
              </el-form-item>
            </el-form>
        </div>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {updatePayrollType,payrollTypeDetails} from "@/api/wages";
  export default {
    data() {
      let checkPrice = (rule,value,callback)=>{
        if(value){
          let rgx =/^[0-9a-zA-Z]+$/;
          if(value.match(rgx)==null){
            return callback(new Error('请检查输入格式,只能输入数字！'))
          }else{
            callback();
          }
        }
      };
      return {
         ruleForm: {
            orderNo: '',//	排序	number	
            payrollType: '',//	工资类型	string	
            payrollTypeDes: '',//	描述	string
            id:this.$route.query.id
        },
        rules: {
          payrollType: [{ required: true, message: '请输入分类名称', trigger: 'blur' },],
          orderNo: [ { required: true, message: '请输入排序', trigger: 'blur' }, {validator:checkPrice,trigger:'change'},{  max: 5, message: '最长 5 字符', trigger: 'blur' }],
         
        }
      }
    },
    mixins: [mixin],
    created() {
        this.payrollTypeDetailss()
    },
    methods: {  
         //详情
         payrollTypeDetailss(){
            payrollTypeDetails(this.ruleForm.id).then(res => res.data).then(data => {
                            if(data.code==200) {
                               this.ruleForm.orderNo=data.data.orderNo+'';
                               this.ruleForm.payrollType=data.data.payrollType;
                               this.ruleForm.payrollTypeDes=data.data.payrollTypeDes;
                             }
                        })
         },
         //编辑
         updatePayrollTypes(formName){
           this.$refs[formName].validate((valid) => {
              if (valid) {
                 updatePayrollType(this.ruleForm).then(res => res.data).then(data => {
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
.wagestypeeidt{
    padding:12px;
    .wagestypeeidt-top{
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