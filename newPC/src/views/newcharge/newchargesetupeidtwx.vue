<template>
<div class="newchargesetupeidtwx"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   :disabled="loading" @click="updateWxSettings()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                 <el-form-item label="商户ID" prop="mchId">
                    <el-input v-model.trim="ruleForm.mchId" placeholder="请输入商户ID" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="KEY" prop="key">
                    <el-input v-model.trim="ruleForm.key" placeholder="请输入KEY" :maxlength="50"></el-input>
                </el-form-item>
            </el-form>
       
     </div>
</div> 
</template>
<script>
import { updateWxSetting,queryWxSetting} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        key: "", //密码	string
        mchId: "",//商户id	string
        id:this.$route.query.id
      },
      rules: {
        mchId: [{ required: true, message: "请输入商户ID", trigger: "blur" }],
        key: [{ required: true, message: "请输入KEY", trigger: "blur" }]
      },
      loading: false
    };
  },
  mixins: [mixin],
  created() {
      this.queryWxSettings();
  },
  methods: {
    //获取详情
    queryWxSettings(){
        queryWxSetting(this.$route.query.id).then(res => res.data).then(data => {
            let mydata=data.data;
            this.ruleForm.key=mydata.key;
            this.ruleForm.mchId=mydata.mchId;        
        })
    },
    updateWxSettings() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          updateWxSetting(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "编辑成功！",
                  type: "success",
                  duration: 1000
                });
                this.loading = false;
                this.$router.back();
              }else{
                this.loading = false;
                this.$message({
                    type: "error",
                    message:data.msg
                  });
              }
            })
            .catch(() => {});
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.newchargesetupeidtwx {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .el-form {
      padding-top: 20px;
      width: 810px;
      margin: 0 auto;
    }
  }
}
</style>