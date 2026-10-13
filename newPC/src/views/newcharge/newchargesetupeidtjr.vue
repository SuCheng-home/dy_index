<template>
<div class="newchargesetupeidtjr"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   :disabled="loading" @click="updateCcbCampusSettings()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                 <el-form-item label="项目id" prop="projectId">
                    <el-input v-model.trim="ruleForm.projectId" placeholder="请输入项目id" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="SM4编号" prop="sm4Key">
                    <el-input v-model.trim="ruleForm.sm4Key" placeholder="请输入SM4编号" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="md5 key" prop="md5Key">
                    <el-input v-model.trim="ruleForm.md5Key" placeholder="请输入md5 key" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="schoolId" prop="ccbSchoolId">
                    <el-input v-model.trim="ruleForm.ccbSchoolId" placeholder="请输入schoolId" :maxlength="20"></el-input>
                </el-form-item>
                 <el-form-item label="短信验证码" prop="smsCode">
                    <el-input v-model.trim="ruleForm.smsCode" placeholder="请输入验证码" :maxlength="15"></el-input>
                    <el-button type="primary" @click="queryVerificationCodes()">获取验证码</el-button>
                </el-form-item>
            </el-form>
       
     </div>
</div> 
</template>
<script>
import { updateCcbCampusSetting,queryCcbCampusSetting,queryVerificationCode} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        ccbSchoolId:"",//	建融慧学学校id	string	
        md5Key:"",//	md5Key	string	
        projectId:"",//	项目id	string	
        sm4Key:"",//	sm4Key	string
        id:this.$route.query.id,
        smsCode:"",//		验证码
      },
      rules: {
        ccbSchoolId: [{ required: true, message: "请输入schoolId", trigger: "blur" }],
        md5Key: [{ required: true, message: "请输入md5Key", trigger: "blur" }],
        projectId: [{ required: true, message: "请输入项目id", trigger: "blur" }],
        sm4Key: [{ required: true, message: "请输入SM4编号", trigger: "blur" }],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      loading: false
    };
  },
  mixins: [mixin],
  created() {this.queryCcbCampusSettings();},
  methods: {
     queryVerificationCodes(){
         queryVerificationCode('ccbcampus')
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
      //获取详情
    queryCcbCampusSettings(){
        queryCcbCampusSetting(this.$route.query.id).then(res => res.data).then(data => {
            let mydata=data.data;
            this.ruleForm.ccbSchoolId=mydata.ccbSchoolId;
            this.ruleForm.md5Key=mydata.md5Key; 
            this.ruleForm.projectId=mydata.projectId;        
            this.ruleForm.sm4Key=mydata.sm4Key; 
        })
    },
    updateCcbCampusSettings() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          updateCcbCampusSetting(this.ruleForm)
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
            .catch(() => {this.loading = false;});
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.newchargesetupeidtjr {
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