<template>
  <div class="wagestypeadd">
    <div class="wagestypeadd-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary"  size="medium" @click="insertPayrollTypes('ruleForm')">保存</el-button>
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
  import {insertPayrollType} from "@/api/wages";
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
        },
        rules: {
          payrollType: [{ required: true, message: '请输入分类名称', trigger: 'blur' },],
          orderNo: [ { required: true, message: '请输入排序', trigger: 'blur' }, {validator:checkPrice,trigger:'change'},{  max: 5, message: '最长 5 字符', trigger: 'blur' }],
         
        }
      }
    },
    mixins: [mixin],
    created() {
        
    },
    methods: {  
         insertPayrollTypes(formName){
           this.$refs[formName].validate((valid) => {
              if (valid) {
                 insertPayrollType(this.ruleForm).then(res => res.data).then(data => {
                            if(data.code==200) {
                                  this.$message({type: 'success', message: '新增成功!' });
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
.wagestypeadd{
    padding:12px;
    .wagestypeadd-top{
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