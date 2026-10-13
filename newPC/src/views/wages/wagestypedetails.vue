<template>
  <div class="wagestypedetails">
    <div class="wagestypedetails-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
              <el-form-item label="分类名称" prop="payrollType">
               {{ruleForm.payrollType}}
              </el-form-item>  
              <el-form-item label="排序号" prop="orderNo" >
                     {{ruleForm.orderNo}}
              </el-form-item>              
              <el-form-item label="分类描述" v-if="ruleForm.payrollTypeDes">
               {{ruleForm.payrollTypeDes}}
              </el-form-item>
            </el-form>
        </div>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {payrollTypeDetails} from "@/api/wages";
  export default {
    data() {
      let checkPrice = (rule,value,callback)=>{
        if(value){
          let rgx =/^[0-9a-zA-Z]+$/;
          if(value.match(rgx)==null){
            return callback(new Error('请检查输入格式,只能输入字母数字！'))
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
                               this.ruleForm.orderNo=data.data.orderNo;
                               this.ruleForm.payrollType=data.data.payrollType;
                               this.ruleForm.payrollTypeDes=data.data.payrollTypeDes;
                             }
                        })
         },        
    }
  };
</script>

<style lang="scss" scoped>
.wagestypedetails{
    padding:12px;
    .wagestypedetails-top{
       padding-bottom: 10px;
       border-bottom: 1px solid #e7eaec;
    }
    .subject{
        overflow: auto;
        .body{
            width: 810px;
            margin: 20px auto;
            .el-form-item {
              margin-bottom: 0px;
          }
        }
    }
}
</style>