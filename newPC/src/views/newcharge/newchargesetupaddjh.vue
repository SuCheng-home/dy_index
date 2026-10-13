<template>
<div class="newchargesetupaddjh"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   :disabled="loading" @click="insertCcbSettings()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                 <el-form-item label="商户代号" prop="merchantId" >
                    <el-input v-model.trim="ruleForm.merchantId" placeholder="请输入商户代号" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                <el-form-item label="分行代号" prop="branchId">
                    <el-input v-model.trim="ruleForm.branchId" placeholder="请输入分行代号" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                 <el-form-item label="证书密码" prop="certPasswd">
                    <el-input v-model.trim="ruleForm.certPasswd" placeholder="请输入证书密码" :maxlength="50" :disabled="istrue" show-password auto-complete="new-password"></el-input>
                </el-form-item>
                 <el-form-item label="操作员" prop="operId">
                    <el-input v-model.trim="ruleForm.operId" placeholder="请输入操作员" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                <el-form-item label="操作员交易密码" prop="operPasswd" >
                    <el-input v-model.trim="ruleForm.operPasswd" placeholder="请输入操作员交易密码" :maxlength="50" :disabled="istrue" show-password auto-complete="new-password"></el-input>
                </el-form-item>
                 <el-form-item label="短信验证码" prop="smsCode">
                    <el-input v-model.trim="ruleForm.smsCode" placeholder="请输入验证码" :maxlength="15"></el-input>
                    <el-button type="primary" @click="queryVerificationCodes()">获取验证码</el-button>
                </el-form-item>               
                <el-form-item label="证书">
                      <uploader pathPrefix="shoufei" module="shoufei" moduleCode="" useSysBucket :extList="allFileTypeList" v-model="fileJson" :multiple="false"></uploader>
                </el-form-item>               
                 <el-form-item label="支付方式"  prop="type">
                      <el-checkbox-group v-model="ruleForm.type">
                        <el-checkbox label="龙支付" name="type"></el-checkbox>
                        <el-checkbox label="微信支付" name="type"></el-checkbox>
                        <el-checkbox label="银联支付" name="type"></el-checkbox>
                    </el-checkbox-group>
                 </el-form-item>
            </el-form>       
     </div>
</div> 
</template>
<script>
import { insertCcbSetting,queryVerificationCode} from "@/api/newcharge";
import Uploader from "@/components/Uploader/WebUploader";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {     	
        branchId:"",//	分行代码	string	
        certPasswd:"",//	证书密码	string	
        certPath:"",//	证书路径	string	
        merchantId:"",//	商户代号	string	
        operId:"",//	操作员	string	
        operPasswd:"",//	操作员密码	string	
        smsCode:"",//	验证码	string
        type:[],
        bankPayType:"",//	龙支付	string	0 未选 1选中
        unionPayType:"",//	银联支付	string	0 未选 1选中
        wxPayType:""//	微信支付	string	0 未选 1选中 
      },
      allFileTypeList: ["pfx"],
      istrue:false,
      fileJson:[],
      rules: {
        appId: [{ required: true, message: "请输入商户appid", trigger: "blur" }],
        merId: [{ required: true, message: "请输入商户号", trigger: "blur" }],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
          branchId: [
          {
            required: true,
            message: "请输入分行代码",
            trigger: "blur"
          }
        ],
        merchantId: [
          {
            required: true,
            message: "请输入商户代号",
            trigger: "blur"
          }
        ],
         certPasswd: [
          {
            required: true,
            message: "请输入证书密码",
            trigger: "blur"
          }
        ],
        operId: [
          {
            required: true,
            message: "请输入操作员号",
            trigger: "blur"
          }
        ],
        operPasswd: [
          {
            required: true,
            message: "请输入操作员交易密码",
            trigger: "blur"
          }
        ],
        type: [{ type: 'array', required: true, message: '请至少选择一个支付方式', trigger: 'change' }],
      },
      loading: false
    };
  },
  mixins: [mixin],
   components: { Uploader},
  created() {},
  methods: {
      queryVerificationCodes(){
         queryVerificationCode('ccb')
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "验证码请求成功!"
            });
          }
        })
        .catch(function() {});
      },
    insertCcbSettings() {
         if (this.fileJson.length == 0) {
        this.$message({
          type: "warning",
          message: "请上传证书！"
        });
        return;
      }else{
          this.ruleForm.certPath = this.fileJson[0].fileUrl;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
         this.loading = true;
         this.ruleForm.bankPayType=0;
         this.ruleForm.unionPayType=0;
         this.ruleForm.wxPayType=0;
         for(let i=0;i<this.ruleForm.type.length;i++){
           if(this.ruleForm.type[i]=="龙支付"){
               this.ruleForm.bankPayType=1;
           }
           if(this.ruleForm.type[i]=="银联支付"){
               this.ruleForm.unionPayType=1;
           }
           if(this.ruleForm.type[i]=="微信支付"){
               this.ruleForm.wxPayType=1;
           }
         }
          insertCcbSetting(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "新增成功！",
                  type: "success",
                  duration: 1000
                });               
                this.$router.back();
              } else{
                   this.$message({
                    type: "error",
                    message:data.msg
                  });
              }
              this.loading = false;
            })
            .catch(() => {this.loading = false;});
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.newchargesetupaddjh {
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
      .el-input {
            width: 80%;
        }
    }
  }
}
</style>
