<template>
    <div class="restaurantRefundadd">
        <div class="top">
          <el-button  size="medium"  @click="$router.back()">返回</el-button>     
          <el-button  size="medium" type="primary" @click="restaurantRefundNextstep('ruleForm')">下一步</el-button> 
        </div>
        <div class="restaurantRefundadd-box">
          <div class="body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm"> 
                   <el-form-item label="退费名称" prop="title">
                    <el-input v-model.trim="ruleForm.title" placeholder="请输入退费名称" :maxlength="30"></el-input>
                  </el-form-item>
                   <el-form-item label="类型" >
                       <el-radio-group v-model="ruleForm.fireType" @change="queryChargeNoticeListCurrentTerms()">
                          <el-radio :label="1">学生</el-radio>
                          <el-radio :label="2">老师</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="收费名称" prop="region">
                      <el-select v-model="ruleForm.region" placeholder="请选择收费名称">
                        <el-option :label="item.chargeName" :value="item.id" v-for="(item,index) in chargeNotices" :key="index"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="停伙时段" required>
                        <el-form-item prop="date">
                          <el-date-picker v-model="ruleForm.date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-form-item>
                  </el-form>

          </div>
                 

            </div>
       
    </div>
</template>
<script>
import moment from "moment";
import {queryChargeNoticeListCurrentTerm,submitReturnMoney} from '@/api/newrestaurantRefund';
import mixin from "@/mixins/windowResize";
export default {
  name: "newrestaurantRefundadd",
  data: function() {
    return {
      ruleForm: {
        date: [],
        region: "",
        fireType:1,
        title:''
      },
      chargeNotices:[],
      rules: {
        region: [
          { required: true, message: "请选择收费名称", trigger: "change" }
        ],
        date: [
          { type: 'array', required: true, message: '请选择停伙时段', trigger: 'change' }
        ],
        title: { required: true, message: '请输入退费名称', trigger: 'blur' },
      }
    };
  },
  mixins: [mixin],
  created() {
   this.queryChargeNoticeListCurrentTerms();
  },
  methods: {
    queryChargeNoticeListCurrentTerms(){
          queryChargeNoticeListCurrentTerm(this.ruleForm.fireType).then(res => {
                     this.ruleForm.region='';
                     this.chargeNotices=res.data.data.chargeNotices;
                     if(this.chargeNotices.length>0){
                       this.ruleForm.region=this.chargeNotices[0].id;
                     };
                    }).catch(function (error) {
                    })
    },
    //下一步    
    restaurantRefundNextstep(formName) {  
        let obj={
          id:this.ruleForm.region,
          name:'',
          startDate:this.$moment(this.ruleForm.date[0]).format("YYYY-MM-DD"),
          endDate:this.$moment(this.ruleForm.date[1]).format("YYYY-MM-DD"),
          fireType:1,
          title:this.ruleForm.title
          };
          if(this.ruleForm.fireType==1){
            obj.fireType=2
          }
        for(let i=0;i<this.chargeNotices.length;i++){
          if(this.chargeNotices[i].id==this.ruleForm.region){
            obj.name=this.chargeNotices[i].chargeName
          }
        };
      this.$refs[formName].validate(valid => {
        if (valid) {
          submitReturnMoney(obj).then(res => {
                   this.$router.replace({
                    path: "newrestaurantRefunddetails",
                    query:{id:res.data.data.id,fireType:obj.fireType,status:0}
                  });
            }).catch(function (error) {
                    })
          
        }
      });
    }
  }
};
</script>
<style scoped="scoped">
.restaurantRefundadd {
  padding:12px;
}
.body{
  width: 810px;
  margin: 0 auto;
}
.restaurantRefundadd .top {
  border-bottom: 1px solid #e7eaec;
  height: 46px;
}
.red {
  line-height: 40px;
  font-size: 24px;
  text-align: center;
  color: red;
}
.restaurantRefundadd-box{
    margin-top: 30px;
}
.el-select,.el-range-editor.el-input__inner{
    width: 100%;
}
</style>
