<template>
<div class="IntelligencecourseSetup" >
     <div class="top"> 
         <el-button  size="medium" type="default" @click="$router.back()">返回</el-button>
         <el-button  size="medium" type="primary" @click="saveSystemSets()">保存</el-button> 
     </div>        
     <div class="subject">
       <div class="body">
         <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="140px" class="demo-ruleForm">
            <el-form-item label="排课软件账号" prop="systemAdminLoginId" :rules="[{ required: true, message: '排课软件账号不能为空'}]">
                <el-input type="text" v-model="numberValidateForm.systemAdminLoginId"    placeholder="请输入排课软件账号"></el-input>
            </el-form-item>
            <el-form-item label="授权Key" prop="systemKey" :rules="[{ required: true, message: '授权Key不能为空'}]">
                <el-input type="text" v-model="numberValidateForm.systemKey"  placeholder="请输入授权Key"></el-input>
            </el-form-item>
         </el-form>
       </div>         
     </div>
</div> 
</template>
<script>
//窗口大小调整
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {getSystemSetBySchoolId,saveSystemSet} from "@/api/Intelligencecourse";
export default {
  data() {
    return {
      numberValidateForm:{
         systemAdminLoginId:'',//	排课系统登录id	string	
         systemKey:'',//	排课系统key	string
      }
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(['schoolInfo'])
  },
  mounted() {
    //获取详情
    getSystemSetBySchoolId(this.schoolInfo.id).then(res => {                
                if (res.data.code === 200) {
                    if(res.data.data.systemAdminLoginId){
                        this.numberValidateForm.systemAdminLoginId=res.data.data.systemAdminLoginId;
                    };
                    if(res.data.data.systemKey){
                        this.numberValidateForm.systemKey=res.data.data.systemKey;
                    }
                } 
              })
              .catch(function() {
              });
  }, 
  methods: { 
   //保存
     saveSystemSets() {
        this.$refs['numberValidateForm'].validate((valid) => {
          if (valid) {
          this.$confirm("确认保存吗？", "提示").then(() => {
            saveSystemSet(this.schoolInfo.id,this.numberValidateForm.systemAdminLoginId,this.numberValidateForm.systemKey).then(res => {                
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "保存成功!"
                  });
                 this.$router.back();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {
              });
          });
          } 
        });
      },
  }
};
</script>
<style scoped>
.IntelligencecourseSetup{
    padding:12px;
}
.IntelligencecourseSetup .top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.IntelligencecourseSetup .subject .body{
    width: 810px;
    margin: 0 auto;
    padding-top: 20px;
}
</style>