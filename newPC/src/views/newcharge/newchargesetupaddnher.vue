<template>
<div class="newchargesetupaddnh"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   :disabled="loading" @click="addAbcsubmerh()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                <el-form-item label="二级商户名称" prop="subMerName">
                    <el-input v-model.trim="ruleForm.subMerName" placeholder="请输入二级商户名称" :maxlength="30"></el-input>
                </el-form-item>               
                 <el-form-item label="二级商户编号" prop="subMerId">
                    <el-input v-model.trim="ruleForm.subMerId" placeholder="请输入二级商户编号" :maxlength="30"></el-input>
                </el-form-item>    
                 <el-form-item label="收款账号" prop="account">
                    <el-input v-model.trim="ruleForm.account" placeholder="请输入收款账号" :maxlength="30"></el-input>
                </el-form-item>   
                 <el-form-item label="收款账户名" prop="accountName">
                    <el-input v-model.trim="ruleForm.accountName" placeholder="请输入收款账户名" :maxlength="30"></el-input>
                </el-form-item>              
                <el-form-item label="他行行号" prop="recBankNo">
                    <el-input v-model.trim="ruleForm.recBankNo" placeholder="请输入他行行号" :maxlength="30"></el-input>
                </el-form-item>      
                <el-form-item label="缴费类型" prop="typeId">
                   <el-select v-model="ruleForm.typeId" placeholder="请选择缴费类型">
                    <el-option :label="item.typeName" :value="item.typeId"  v-for="(item,index) in typelist" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="监管账户" prop="merId">
                   <el-select v-model="ruleForm.merId" placeholder="请选择监管账户">
                    <el-option :label="item.merName" :value="item.merId"  v-for="(item,index) in merIdlist" :key="index"></el-option>
                  </el-select>
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
import { addAbcsubmerh, queryVerificationCode,queryAbcTypeNoUsedList,queryAbcagentDefaultList} from "@/api/newcharge";
import Uploader from "@/components/Uploader/WebUploader";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        smsCode: "", //		验证码
        account: "", //		收款账号	string	
        accountName: "", //		收款账户名	string	
        merId: "", //		选择监管账户，目前默认平台账户	string	
        recBankNo: "", //		他行行号	string	出金至他行卡且金额大于50000时必须上送
        subMerId: "", //		二级商户编号	string	
        subMerName: "", //		二级商户名称	string
        typeId:""	
      },
      rules: {
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        account: [{ required: true, message: "请输入收款账号", trigger: "blur" }],
        accountName: [{ required: true, message: "请输入收款账户名", trigger: "blur" }],
        recBankNo: [{ required: true, message: "请输入他行行号", trigger: "blur" }],
        typeId:[ { required: true, message: '请选择缴费类型', trigger: 'change' }],
        merId:[ { required: true, message: '请选择监管账户', trigger: 'change' }],
        subMerId:[{ required: true, message: "请输入二级商户编号", trigger: "blur" }],
        subMerName:[{ required: true, message: "请输入二级商户名称", trigger: "blur" }]
      },
      loading: false,
      fileJson: [],
      typelist:[],
      merIdlist:[]
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
           this.ruleForm.typeId=this.typelist[0].typeId;
          }
        }).catch();
        queryAbcagentDefaultList()
        .then(res => {
          if (res.data.code === 200) {
           this.merIdlist=res.data.data;
           this.ruleForm.merId=this.merIdlist[0].merId;
          }
        }).catch();
    },
    queryVerificationCodes() {
      queryVerificationCode("abcagent")
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
    addAbcsubmerh() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let myobj={
              account:this.ruleForm.account,
              accountName:this.ruleForm.accountName,
              merId:this.ruleForm.merId,
              recBankNo:this.ruleForm.recBankNo,
              subMerId:this.ruleForm.subMerId,
              subMerName:this.ruleForm.subMerName,
              typeList:[{
                  typeId:this.ruleForm.typeId,typeName:""
              }],
          }
          for(let i=0;i<this.typelist.length;i++){
            if(this.ruleForm.typeId==this.typelist[i].typeId){
              myobj.typeList[0].typeName=this.typelist[i].typeName
            }
          }
          addAbcsubmerh(myobj,this.ruleForm.smsCode)
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