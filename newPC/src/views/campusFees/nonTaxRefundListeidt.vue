<template>
    <div class="nonTaxRefundListeidt">
        <back-tool>
            <el-button  type="primary" size="medium" @click="batchFeesave()">保存</el-button>
        </back-tool>
        <div :style="'overflow: auto;padding-top:20px;height:'+nobottommaxH+'px'"  >
          <div class="body">
              <el-form ref="query" :model="query" label-width="140px" :rules="rules">
                 <el-form-item label="姓名" >
                    {{obj.uName}}
                </el-form-item> 
                <el-form-item label="学号" >
                    {{obj.loginname}}
                </el-form-item> 
                <el-form-item label="班级" >
                    {{obj.departName}}
                </el-form-item> 
                <el-form-item label="缴款码" prop="orderId">
                    <el-input  v-model.trim="query.orderId" placeholder="请输入缴款码" :maxlength="100"></el-input>
                </el-form-item> 
                 <el-form-item label="账单金额" prop="payMoney">
                      <el-input-number v-model.trim="query.payMoney" size="medium" placeholder="请输入金额" :precision="2"  :min="0.01" :max="99999999" :step="1"></el-input-number> 元
                </el-form-item> 
                 <el-form-item label="备注" prop="content">
                    <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model.trim="query.content" placeholder="请输入备注" :maxlength="300"></el-input>
                </el-form-item> 
            </el-form>
          </div>
            
        </div>
    </div>
</template>

<script>
import BackTool from "@/components/BackTool";
import baseMixin from '@/mixins/baseMixin';
import moment from "moment";
import {getById,finaceOrderupdate} from "@/api/campusFees";
import mixin from "@/mixins/windowResize";
export default {
  //引入返回模块
  components: { BackTool },
  data: function() {   
    return {     
      rules: {
        orderId: [
          {
            required: true,
            message: "请输入缴款码",
            trigger: "blur"
          }
        ] ,
         payMoney: [
          {
            required: true,
            message: "请输入账单金额",
            trigger: "blur"
          }
        ]  ,
         content: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur"
          }
        ]  
      },
      query: {
        orderId:'',
        payMoney:'',
        content:'',
      },
      obj:{},
      id:this.$route.query.id
    };
  },
  mixins: [mixin,baseMixin],
  created() {
      getById(this.$route.query.id)
        .then(res => res.data)
        .then(data => {
            this.query.orderId=data.data.orderId
            this.query.content=data.data.content
            this.query.payMoney=data.data.payMoney/100
            this.obj=data.data;
        });
  },
  methods: {     
    //保存
    batchFeesave() {    
        let obj={
            orderId:this.query.orderId,
            payMoney:(this.query.payMoney*100).toFixed(2)-0,
            content:this.query.content,
            id:this.id
        }        
        this.$refs["query"].validate(valid => {
            if (valid) {
                finaceOrderupdate(obj)
                                .then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: "success",
                                            message: "保存成功!"
                                        });
                                        this.$router.back();
                                    }
                                })
                                .catch(function () {});
            }
        });
    }
  }
};
</script>
<style scoped>
.nonTaxRefundListeidt {
  padding:12px;
}
.body{
  width: 810px;
  margin: 0 auto;
}
.el-select,
.el-input {
  width: 100%;
}

</style>
