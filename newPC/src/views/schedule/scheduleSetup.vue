<template>
    <div class="scheduleSetup">
        <div class="header">
            <el-button @click="goBack"  size="medium">返回</el-button>
            <el-button type="primary"  size="medium" @click="saveAdviceType">保存</el-button>
        </div>
        <div class="scheduleSetup-box">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="日程中展示请假">
                   <el-checkbox v-model="showAskLeave">展示请假</el-checkbox>
                </el-form-item>
                 <el-form-item label="外出日程设置">
                   <el-checkbox v-model="needApprove">外出日程需要审核</el-checkbox>
                   <el-checkbox v-model="outAskLeave">是否关联请假</el-checkbox>
                   <el-checkbox v-model="isRemindOut">需要额外提醒</el-checkbox>
                </el-form-item>
                 <el-form-item label="审核人设置" prop="typeManagerDatatwo" v-if="needApprove">
                    <address-book v-model="ruleForm.typeManagerDatatwo" :config="managerConfigDatatwo" mode="organization"></address-book>
                </el-form-item>  
                <el-form-item label="请假类型"  class="is-required" v-if="outAskLeave">
                   <el-select v-model="leaveType"  size="medium">
                        <el-option :label="typeEntry.leaveTypeName"   v-for="( typeEntry, index ) in leaveTypeList"
                            :key="index" :value="typeEntry.leaveTypeId"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="额外提醒人员" prop="typeManagerData" v-if="isRemindOut">
                    <address-book v-model="ruleForm.typeManagerData" :config="managerConfigData" mode="organization"></address-book>
                </el-form-item>
                <el-form-item label="日程确认设置">
                   <el-checkbox v-model="isAffirm">日程需要确认</el-checkbox>
                </el-form-item>
            </el-form>
             
        </div>
    </div>
</template>

<script>
import AddressBook from "@/components/AddressBook/indexExpand";
import {getCalendarSet,addSetInfo} from "@/api/schedule";
import {getTeacherAskleaveInitInfo} from '@/api/systemSet/TeacherLeave3Set';
export default {
  name: "scheduleSetup",
  components: {AddressBook},
  data() {
    return {
      managerConfigData: {
        title: "请选择提醒人",
        depart: { target: "all", departType: "t", userTypes: "1" },
        group: false
      },
       managerConfigDatatwo: {
        title: "审核人",
        depart: { target: "user", departType: "t", userTypes: "1" },
        group: false
      },
      ruleForm: {
        typeManagerData: {
        },
        typeManagerDatatwo: {
        }
      },
      needApprove:false,
      rules: { 
        typeManagerData: [{ required: true }],
        typeManagerDatatwo: [{ required: true }]
       },
      showAskLeave:false,
      outAskLeave:false,
      leaveType:'',
      leaveTypeList:[],
      isAffirm:false,
      isRemindOut:false
    };
  },
  created() {
     getTeacherAskleaveInitInfo().then(res => {
                const data = res.data.data;  
                if (res.data.code === 200) {
                    this.leaveTypeList= data.leaveTypeList;
                }
            }).catch();
      this.getCalendarSets();
  },
  methods: {
    //返回
    goBack() {
      this.$router.back();
    },
    //获取详情
    getCalendarSets(){
      getCalendarSet().then(res=>res.data)
            .then(data=>{
                if(data.code===200&&data.data&&(data.data!={})&&data.data.calendarSet){
                    let detailObject=data.data; 
                    this.outAskLeave=(detailObject.calendarSet.outAskLeave==1);
                    if(this.outAskLeave){
                      this.leaveType=detailObject.calendarSet.leaveType
                    }
                    this.isRemindOut=detailObject.calendarSet.isRemindOut==1
                    this.isAffirm=detailObject.calendarSet.isAffirm==1
                    this.needApprove=(detailObject.calendarSet.needApprove==1);
                    this.showAskLeave=(detailObject.calendarSet.showAskLeave==1);
                    if(detailObject.deptList){                         
                        this.$set(this.ruleForm.typeManagerData, "departJson",detailObject.deptList);                                       
                    }else{
                      this.$set(this.ruleForm.typeManagerData, "departJson",[]); 
                    };
                    if(detailObject.userList){
                       this.$set(this.ruleForm.typeManagerData, "userJson",detailObject.userList); 
                    }else{
                      this.$set(this.ruleForm.typeManagerData, "userJson",[]); 
                    };
                     if(detailObject.approveUserList){
                       this.$set(this.ruleForm.typeManagerDatatwo, "userJson",detailObject.approveUserList); 
                    }else{
                      this.$set(this.ruleForm.typeManagerDatatwo, "userJson",[]); 
                    };
                }else{
                   this.$set(this.ruleForm.typeManagerData, "departJson",[]); 
                    this.$set(this.ruleForm.typeManagerData, "userJson",[]); 
                    this.$set(this.ruleForm.typeManagerDatatwo, "userJson",[]); 
                }
      }).catch(()=>{})
    },
    //保存
    saveAdviceType() {
       if((this.ruleForm.typeManagerData.departJson.length==0)&&(this.ruleForm.typeManagerData.userJson.length==0)&&this.isRemindOut){
          this.$message({message: '提醒人不能为空！',type: 'error'});
          return false;
        };
        if((this.ruleForm.typeManagerDatatwo.userJson.length==0)&&this.needApprove){
          this.$message({message: '审核人不能为空！',type: 'error'});
          return false;
        };
        if(this.outAskLeave){
          if( !this.leaveType){
            this.$message({message: '请选择关联的请假！',type: 'error'});
            return false;
          }
         
        }
        let deptIdStr='';
        let userIdStr='';
        let approveUserIdStr="";
        let needApprove=0;
        let showAskLeave=0;
        if(this.needApprove){
          needApprove=1;
            for(let i=0;i<this.ruleForm.typeManagerDatatwo.userJson.length;i++){
           if(i<this.ruleForm.typeManagerDatatwo.userJson.length-1){
              approveUserIdStr=approveUserIdStr+this.ruleForm.typeManagerDatatwo.userJson[i].id+',';
           }else{
              approveUserIdStr=approveUserIdStr+this.ruleForm.typeManagerDatatwo.userJson[i].id;
           }
        };
        }
        if(this.showAskLeave){
          showAskLeave=1
        }
       if(this.isRemindOut){
           for(let i=0;i<this.ruleForm.typeManagerData.departJson.length;i++){
           if(i<this.ruleForm.typeManagerData.departJson.length-1){
              deptIdStr=deptIdStr+this.ruleForm.typeManagerData.departJson[i].id+',';
           }else{
              deptIdStr=deptIdStr+this.ruleForm.typeManagerData.departJson[i].id;
           }
        };
        for(let i=0;i<this.ruleForm.typeManagerData.userJson.length;i++){
           if(i<this.ruleForm.typeManagerData.userJson.length-1){
              userIdStr=userIdStr+this.ruleForm.typeManagerData.userJson[i].id+',';
           }else{
              userIdStr=userIdStr+this.ruleForm.typeManagerData.userJson[i].id;
           }
        };

       }
      
        let leaveTypeName=''
        for(let i=0;i<this.leaveTypeList.length;i++){
          if(this.leaveType==this.leaveTypeList[i].leaveTypeId){
                leaveTypeName=this.leaveTypeList[i].leaveTypeName
          }          
        };
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {       
        addSetInfo(deptIdStr,userIdStr,needApprove,approveUserIdStr,showAskLeave,this.outAskLeave-0,this.leaveType,leaveTypeName,this.isAffirm-0,this.isRemindOut-0)
            .then(res => {
              const data = res.data;
              if (res.data.code === 200) {               
                this.$message({message: "保存成功！",type: "success",duration: 1000});
                this.$router.back();
              } else {
                this.$message({message: data.msg,type: "warning"});
              }}).catch();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.scheduleSetup {
  padding:12px;
  .header{
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .demo-ruleForm{
    width: 810px;
    margin: 20px auto;
  }
}
</style>
