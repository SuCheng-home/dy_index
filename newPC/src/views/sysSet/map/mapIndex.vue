<template>
<div class="mapIndex" >
     <div class="top"> 
         <el-button  size="medium" type="default" @click="$router.back()">返回</el-button>
         <el-button  size="medium" type="primary" @click="addUpdateSchoolMapInit()">保存</el-button> 
     </div>        
     <div class="subject">
       <div class="body">
         <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="90px" class="demo-ruleForm">
            <el-form-item label="Key名称" prop="mapKeyName" :rules="[{ required: true, message: 'Key名称不能为空'}]">
                <el-input type="text" v-model.trim="numberValidateForm.mapKeyName"    placeholder="请输入Key名称"></el-input>
            </el-form-item>
            <el-form-item label="Key" prop="mapKey" :rules="[{ required: true, message: 'Key不能为空'}]">
                <el-input type="text" v-model.trim="numberValidateForm.mapKey"  placeholder="请输入Key"></el-input>
            </el-form-item>
             <el-form-item label="安全密钥" prop="mapSecurity" :rules="[{ required: true, message: '安全密钥不能为空'}]">
                <el-input type="text" v-model.trim="numberValidateForm.mapSecurity"  placeholder="请输入安全密钥"></el-input>
            </el-form-item>
         </el-form>
         <div class="txt">
             TIPS:
            <div class="p">根据国家对地图定位管理要求，所有非自用场景(即给第三方提供服务的系统和软件)都必须购买商用授权，如果您在使用以下相关功能，为了保障您的定位功能能够正常使用，请您在高德地图中申请用以自用的个人授权，并将相关参数配置在此平台，确保如下功能的正常使用:</div>
            <div class="p">1、考勤定位功能</div>
            <div class="p">2、活动签到定位功能</div>
            <div class="p">3、会议签到定位功能</div>
            <div class="p">4、15分钟教育圈的定位功能</div>
            <div class="p">具体操作请参考如下手册: <a href="https://docs.qq.com/doc/DQUhrc2NZalVvRkVx"  target="_blank">高德地图授权开通及配置手册</a></div>





         </div>
       </div>         
     </div>
</div> 
</template>
<script>
//窗口大小调整
import mixin from '@/mixins/windowResize';
import {addUpdateSchoolMapInit,getSchoolMapInit} from "@/api/map";
export default {
  data() {
    return {
      numberValidateForm:{
        mapKey:"",//	地图key	string	
        mapKeyName:"",//	key名称	string	
        mapSecurity:""//	地图密钥	string
      }
    };
  },
  mixins: [mixin],
  mounted() {
    //获取详情
    getSchoolMapInit().then(res => {    
                if (res.data.code === 200&&res.data.data) {
                    if(res.data.data.mapKey){
                        this.numberValidateForm.mapKey=res.data.data.mapKey;
                    };
                    if(res.data.data.mapKeyName){
                        this.numberValidateForm.mapKeyName=res.data.data.mapKeyName;
                    }
                     if(res.data.data.mapSecurity){
                        this.numberValidateForm.mapSecurity=res.data.data.mapSecurity;
                    }
                } 
              })
              .catch(function() {
              });
  }, 
  methods: { 
   //保存
     addUpdateSchoolMapInit() {
        this.$refs['numberValidateForm'].validate((valid) => {
          if (valid) {
          this.$confirm("确认保存吗？", "提示").then(() => {
            addUpdateSchoolMapInit(this.numberValidateForm).then(res => {                
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
.txt{
    background-color: #fdf6ec;
    border: #faecd8 1px solid;
    color: #e6a23c;
    padding: 15px;
    line-height: 24px;
    border-radius: 10px;
    font-size: 14px;
} 
.txt .p{
    text-indent: 28px;
}
.txt .p a{
    color:#409eff;
}
.mapIndex{
    padding:12px;
}
.mapIndex .top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.mapIndex .subject .body{
    width: 810px;
    margin: 0 auto;
    padding-top: 20px;
}
</style>