<template>
<div class="deyuRemindersettings"  >
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="saveSchoolConductRemindInfos()">保存</el-button>     
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
        <el-form label-width="140px" class="demo-ruleForm">
                 <el-form-item label="banner设置"> 
                     <uploader useSysBucket :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" openDelete showMode="button" v-model="logoUrl"></uploader>
                </el-form-item>
                <el-form-item label="实时提醒设置">
                   <el-checkbox v-model="query.sendParentAdd" :true-label="1" :false-label="2">表扬推送家长</el-checkbox> 
                   <el-checkbox v-model="query.sendParentLess" :true-label="1" :false-label="2">批评推送家长</el-checkbox>  
                </el-form-item>
                <el-form-item label="评价提醒设置">
                   <el-checkbox v-model="query.remindHeader" :true-label="1" :false-label="0">每周五（8:00）提醒班主任进行德育评价</el-checkbox> 
                </el-form-item>
                <el-form-item label="可输入分数">
                   <el-checkbox v-model="query.isInputScore" :true-label="2" :false-label="1">是否可输入分数</el-checkbox> 
                </el-form-item>
                <el-form-item label="每周推送设置">                        
                  <el-checkbox v-model="query.isSendParent" :true-label="2" :false-label="1">推送学生周报（周六 11:00）</el-checkbox>
                  <el-checkbox v-model="query.isSendTh" :true-label="2" :false-label="1">推送教师周报（周六 11:00）</el-checkbox>
                  <el-checkbox v-model="query.isSendManger" :true-label="2" :false-label="1">推送学校周报（周六 11:00）</el-checkbox> 
                  <el-checkbox v-model="query.isClassHeader" :true-label="2" :false-label="1">推送班主任周报（周六 11:00）</el-checkbox>                     
                </el-form-item>
                <el-form-item label="推送人员" v-if="query.isSendManger==2">
                    <address-book v-model="addressData" :config="configData"></address-book>
                </el-form-item>
            </el-form>
         
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
import {saveSchoolConductRemindInfo,getSchoolConductRemindInfo} from  '@/api/deyu';
import Uploader from '@/components/Uploader/WebUploader';
export default {
  data() {     
    return {
        query:{
            isSendManger:1,//	是否管理员周报，1不推送，2推送	number	2025-04-01
            isSendParent:1,//		是否家长周报，1不推送，2推送	number	2025-04-01
            isSendTh:1,//		是否老师周报，1不推送，2推送	number	2025-04-01
            remindHeader:0,//		是否每周五提醒班主任 1提醒 0不提醒	number	2025-04-01
            reportUserJson:{},//	管理员周报用户	string	2025-04-01
            sendParentAdd:1,//		表扬是否发送家长，1发送，2不发送	number	2025-04-01
            sendParentLess:1,//		批评是否发送家长，1发送，2不发送	number	
            isClassHeader:1,
            headerUrl:"",
            isInputScore:1
        },
        logoUrl:[],
         configData: {
                    title: "推送人",
                    depart: {target: "user", departType: "t", userTypes: "1"},
                    group: true
                },
                addressData: {
                }
              
       
    };
  },
  components: {
            AddressBook,Uploader
        },
  mixins: [mixin],
  created() {
      this.getSchoolConductRemindInfos();
  },
  methods: {
     getSchoolConductRemindInfos(){
        getSchoolConductRemindInfo().then(res => res.data).then(data => {
          if(data.data){
            this.query.remindHeader=data.data.remindHeader
            this.query.isInputScore=data.data.isInputScore||1        
            this.query.isSendParent=data.data.isSendParent
            this.query.isSendTh=data.data.isSendTh
            this.query.isSendManger=data.data.isSendManger
            this.query.sendParentAdd=data.data.sendParentAdd
            this.query.sendParentLess=data.data.sendParentLess
            this.query.isClassHeader=data.data.isClassHeader
            if(data.data.headerUrl){
                this.logoUrl = [{
                                fileUrl: data.data.headerUrl
                            }];

            }
         
            this.addressData = {
                        userJson: JSON.parse(data.data.reportUserJson||'[]')
                    };
          }else{
            this.addressData = {
                        userJson: []
                    };
          }          
        });
     },
     saveSchoolConductRemindInfos(){
       if(this.query.isSendManger==2){
         if(this.addressData.userJson&&this.addressData.userJson.length==0){
             this.$message({
                        type: "error",
                        message: "请选择推送人！"
                    });
                    return
         }else{
           this.query.reportUserJson=JSON.stringify(this.addressData.userJson)
         }
       }else{
         this.query.reportUserJson="[]"
       }
       if(this.logoUrl.length){
         this.query.headerUrl=this.logoUrl[0].fileUrl
       }
         saveSchoolConductRemindInfo(this.query).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '保存成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.back();
                }
            }).catch(() => {})    
     }
  }
};
</script>

<style lang="scss" scoped>
.deyuRemindersettings {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    width:810px;
    margin: 10px auto;
  }
}
</style>