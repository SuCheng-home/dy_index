<template>
    <div class="restaurantRefundadd">
        <div class="top">
            <el-col :span="6">
                <el-button  @click="$router.back()" size="medium">返回</el-button>     
                <el-button type="primary" @click="restaurantRefundNextstep('ruleForm')" size="medium">下一步</el-button>          
            </el-col>
             <el-col :span="12">
               <div class="red">每个缴费订单只能退费一次</div>   
            </el-col>
        </div>
        <div class="restaurantRefundadd-box">
          <div class="body">
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm"> 
                    <el-form-item label="收费名称" prop="region">
                      <el-select v-model="ruleForm.region" placeholder="请选择收费名称">
                        <el-option :label="item.chargeName" :value="item.id" v-for="(item,index) in chargeNotices" :key="index"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="停伙时段" required>
                        <el-col>
                        <el-form-item prop="date">
                            <el-date-picker
                        v-model="ruleForm.date"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                        </el-form-item>
                        </el-col>
                    
                    </el-form-item>
                    
                    </el-form>

          </div>
                 
            </div>
       
    </div>
</template>
<script>
import moment from "moment";
import {queryChargeNoticeListCurrentTerm} from '@/api/restaurantRefund';
import mixin from "@/mixins/windowResize";
export default {
  name: "restaurantRefundadd",
  data: function() {
    return {
      ruleForm: {
        date: [],
        region: ""
      },
      chargeNotices:[],
      rules: {
        region: [
          { required: true, message: "请选择收费名称", trigger: "change" }
        ],
        date: [
          { type: 'array', required: true, message: '请选择停伙时段', trigger: 'change' }
        ]
      }
    };
  },
  mixins: [mixin],
  created() {
    queryChargeNoticeListCurrentTerm(this.listQuery).then(res => {
                     this.chargeNotices=res.data.data.chargeNotices;
                     if(this.chargeNotices.length>0){
                       this.ruleForm.region=this.chargeNotices[0].id;
                     };
                    }).catch(function (error) {
                    })
  },
  methods: {
    //下一步    
    restaurantRefundNextstep(formName) {  
        let obj={id:this.ruleForm.region,name:'',startDate:this.$moment(this.ruleForm.date[0]).format("YYYY-MM-DD"),endDate:this.$moment(this.ruleForm.date[1]).format("YYYY-MM-DD")};
        for(let i=0;i<this.chargeNotices.length;i++){
          if(this.chargeNotices[i].id==this.ruleForm.region){
            obj.name=this.chargeNotices[i].chargeName
          }
        };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$router.replace({
            path: "restaurantRefundNextstep",
            query:obj
          });
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
.restaurantRefundadd .top {
    border-bottom: 1px solid #e7eaec;
    overflow: hidden;
    padding-bottom: 10px;
}
.red {
  line-height: 36px;
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
.body{
  width: 810px;
  margin: 0 auto;
}
</style>
