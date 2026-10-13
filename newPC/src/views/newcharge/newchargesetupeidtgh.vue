<template>
<div class="newchargesetupeidtgh"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   :disabled="loading" @click="updateIcbcSettings()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                 <el-form-item label="APPID" prop="appId">
                    <el-input v-model.trim="ruleForm.appId" placeholder="api注册时生成，可以联系工行获取" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="merid" prop="merId">
                    <el-input v-model.trim="ruleForm.merId" placeholder="请输入商户编号" :maxlength="50"></el-input>
                </el-form-item>
                   <el-form-item label="收费类型" prop="typeId">
                   <el-select v-model="ruleForm.typeId" placeholder="请选择收费类型">
                    <el-option :label="item.typeName" :value="item.typeId"  v-for="(item,index) in typelist" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="短信验证码" prop="smsCode">
                    <el-input v-model.trim="ruleForm.smsCode" placeholder="请输入验证码" :maxlength="15"></el-input>
                    <el-button type="primary" @click="queryVerificationCodes()">获取验证码</el-button>
                </el-form-item>
                <el-form-item label="支付方式" prop="type">
                    <el-checkbox-group v-model="ruleForm.type">
                        <el-checkbox label="EPay" name="type"></el-checkbox>
                        <el-checkbox label="微信支付" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
       
     </div>
</div> 
</template>
<script>
import { updateIcbcSetting,queryVerificationCode,queryIcbcSetting,queryAbcTypeNoUsedList} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        appId:"",//	建融慧学学校id	string	       	
        merId:"",//		商户号	string	
        smsCode:"",//		验证码		
        wxPayType:0,//		微信支付	string
        epayPayType:0,//		h5支付	string
        type:[],
        id:this.$route.query.id,
        typeId:"",
        typeName:""
      },
      rules: {
        appId: [{ required: true, message: "请输入商户appid", trigger: "blur" }],
        merId: [{ required: true, message: "请输入商户号", trigger: "blur" }],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        typeId:[ { required: true, message: '请选择收费类型', trigger: 'change' }],
        type: [{ type: 'array', required: true, message: '请至少选择一个支付方式', trigger: 'change' }],
      },
      loading: false,
       typelist:[]
    };
  },
  mixins: [mixin],
  created() {
     this.queryAbcTypeNoUsedList();
    this.queryIcbcSettings()
    },
  methods: {
     queryAbcTypeNoUsedList(){
        queryAbcTypeNoUsedList()
        .then(res => {
          if (res.data.code === 200) {
           this.typelist=res.data.data;          
          }
        }).catch();
    },
       //获取详情
    queryIcbcSettings(){
        queryIcbcSetting(this.$route.query.id).then(res => res.data).then(data => {
            let mydata=data.data;
            this.ruleForm.appId=mydata.appId;
            this.ruleForm.merId=mydata.merId;  
            this.ruleForm.typeId=mydata.typeId;
            if(mydata.wxPayType==1){
                this.ruleForm.type.push("微信支付")
            }  
            if(mydata.epayPayType==1){
                this.ruleForm.type.push("EPay")
            }      
        })
    },
      queryVerificationCodes(){
         queryVerificationCode('icbc')
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
    updateIcbcSettings() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
         this.loading = true;
         this.ruleForm.epayPayType=0;
         this.ruleForm.wxPayType=0;
           for(let i=0;i<this.typelist.length;i++){
           if(this.typelist[i].typeId==this.ruleForm.typeId){
               this.ruleForm.typeName=this.typelist[i].typeName;
           }
         }
         for(let i=0;i<this.ruleForm.type.length;i++){
           if(this.ruleForm.type[i]=="EPay"){
               this.ruleForm.epayPayType=1;
           }
           if(this.ruleForm.type[i]=="微信支付"){
               this.ruleForm.wxPayType=1;
           }
         }
          updateIcbcSetting(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "编辑成功！",
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
.newchargesetupeidtgh {
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