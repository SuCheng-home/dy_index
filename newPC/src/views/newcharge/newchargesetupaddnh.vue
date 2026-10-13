<template>
<div class="newchargesetupaddnh"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   :disabled="loading" @click="insertAbcSettings()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                <el-form-item label="商户号" prop="merchantId">
                    <el-input v-model.trim="ruleForm.merchantId" placeholder="请输入商户号" :maxlength="50"></el-input>
                </el-form-item>               
                 <el-form-item label="项目代码" prop="projectCode">
                    <el-input v-model.trim="ruleForm.projectCode" placeholder="请输入项目代码" :maxlength="50"></el-input>
                </el-form-item>               
                <el-form-item label="收费类型" prop="typeIds">
                   <el-select v-model="ruleForm.typeIds" placeholder="请选择收费类型">
                    <el-option :label="item.typeName" :value="item.typeId"  v-for="(item,index) in typelist" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否农行账户" >
                   <el-checkbox v-model="ruleForm.nonAbcAccout">非农行账户</el-checkbox>
                </el-form-item>
                 <el-form-item label="是否有证书" >
                   <el-checkbox v-model="ruleForm.withoutCert">无证书</el-checkbox>
                </el-form-item>
                 <el-form-item label="证书密码" prop="keystorePassword"  v-if="!ruleForm.withoutCert">
                    <el-input v-model.trim="ruleForm.keystorePassword" placeholder="请输入证书密码" auto-complete="new-password" :maxlength="50" show-password></el-input>
                </el-form-item>
                 <el-form-item label="缴费项目名称" prop="epayName" v-if="ruleForm.withoutCert">
                    <el-input v-model.trim="ruleForm.epayName" placeholder="请输入缴费项目名称" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="用户所属单位/社区/学校的名称"  prop="companyName" v-if="ruleForm.withoutCert">
                    <el-input v-model.trim="ruleForm.companyName" placeholder="请输入用户所属单位/社区/学校的名称" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="短信验证码" prop="smsCode">
                    <el-input v-model.trim="ruleForm.smsCode" placeholder="请输入验证码" :maxlength="15"></el-input>
                    <el-button type="primary" @click="queryVerificationCodes()">获取验证码</el-button>
                </el-form-item>
                <el-form-item label="证书" v-if="!ruleForm.withoutCert">
                      <uploader pathPrefix="shoufei" module="shoufei" moduleCode="" useSysBucket :extList="allFileTypeList" v-model="fileJson" :multiple="false"></uploader>
                </el-form-item> 
            </el-form>
       
     </div>
</div> 
</template>
<script>
import { insertAbcSetting, queryVerificationCode,queryAbcTypeNoUsedList} from "@/api/newcharge";
import Uploader from "@/components/Uploader/WebUploader";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        smsCode: "", //		验证码
        certPath: "", //	证书路径	string
        keystorePassword: "", //	证书密码	string
        merchantId: "", //	商户号	string
        projectCode: "", //	项目代码	string
        typeIds: "", //	收费类型id集合	string	
        typeNames: "", //	收费类型名称集合	string	
        companyName: "", //	用户所属单位/社区/学校的名称	string	
        epayName: "", //	缴费项目名称	string	
        withoutCert: false, //	是否需要证书	boolean	true不需要证书 默认false
        nonAbcAccout:false
      },
      rules: {
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        keystorePassword: [{ required: true, message: "请输入证书密码", trigger: "blur" }],
        merchantId: [{ required: true, message: "请输入商户号", trigger: "blur" }],
        projectCode: [{ required: true, message: "请输入项目代码", trigger: "blur" }],
        typeIds:[ { required: true, message: '请选择收费类型', trigger: 'change' }],
        companyName:[{ required: true, message: "请输入用户所属单位/社区/学校的名称", trigger: "blur" }],
        epayName:[{ required: true, message: "请输入缴费项目名称", trigger: "blur" }]
      },
      loading: false,
      allFileTypeList: ["pfx"],
      fileJson: [],
      typelist:[]
    };
  },
  mixins: [mixin],
  components: { Uploader},
  created() {
    this.queryAbcTypeNoUsedLists();
  },
  methods: {
    queryAbcTypeNoUsedLists(){
        queryAbcTypeNoUsedList()
        .then(res => {
          if (res.data.code === 200) {
           this.typelist=res.data.data;
           this.ruleForm.typeIds=this.typelist[0].typeId;
          }
        }).catch();
    },
    queryVerificationCodes() {
      queryVerificationCode("abc")
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
    insertAbcSettings() {
      if ((this.fileJson.length == 0)&&(!this.ruleForm.withoutCert)) {
        this.$message({
          type: "warning",
          message: "请上传证书！"
        });
        return;
      } else {
        if(!this.ruleForm.withoutCert){
           this.ruleForm.certPath = this.fileJson[0].fileUrl;
        }         
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          for(let i=0;i<this.typelist.length;i++){
            if(this.ruleForm.typeIds==this.typelist[i].typeId){
              this.ruleForm.typeNames=this.typelist[i].typeName
            }
          }
          insertAbcSetting(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "新增成功！",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
              } else {
                this.$message({
                  type: "error",
                  message: data.msg
                });
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.newchargesetupaddnh {
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
      .el-input,.el-select{
        width: 80%;
      }
    }
  }
}
</style>
