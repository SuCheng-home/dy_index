<template>
<div class="ruleadd"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
        <el-button type="primary" size="medium"  @click="addThAskleaveFourRule()">保存</el-button>       
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="form" ref="form" label-width="140px" class="demo-ruleForm">
                 <el-form-item  label="限制方式" class="is-required" >
                     <el-radio-group v-model="form.limitType" :disabled="id">
                            <el-radio :label="1">时间</el-radio>
                            <el-radio :label="2">频率</el-radio>
                            <el-radio :label="3">调课</el-radio>
                            <el-radio :label="4">性别</el-radio>
                        </el-radio-group>
                 </el-form-item>
                 <el-form-item  label="适用请假类型" class="is-required" >
                       <el-checkbox-group v-model="form.leaveTypeIds">
                            <el-checkbox :label="leaveTypeItem.leaveTypeId+''" v-for="(leaveTypeItem,indexa) in leaveTypeList" :key="indexa">{{leaveTypeItem.leaveTypeName}}</el-checkbox>
                        </el-checkbox-group>
                 </el-form-item>
                 <el-form-item  label="限制内容" class="is-required"  v-if="form.limitType!=3" >
                      <div v-if="form.limitType==1">
                          >=&nbsp;&nbsp;<el-input-number  size="small" v-model.trim="form.dayCount" step-strictly :min="0" :max="100" :step="1"></el-input-number>&nbsp;&nbsp;小时（提前几小时请假）
                      </div>
                      <div v-if="form.limitType==2">
                        '<'=&nbsp;&nbsp;<el-input-number  size="small" v-model.trim="form.askCount" step-strictly :min="1" :max="100" :step="1"></el-input-number>&nbsp;&nbsp;次 （每月最多请假几次）
                      </div>
                      <div v-if="form.limitType==4">
                        <el-radio-group v-model="form.sex">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                      </div>
                 </el-form-item>
            </el-form>        
        </div>        
    </div>    
</div> 
</template>
<script>
import {updateThAskleaveFourRule,addThAskleaveFourRule,getThAskleaveFourRule,getThAskLeaveFourInit} from '@/api/systemSet/teacherLeave4Setting';
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
        form:{
            askCount:1,//	次数	number	
            dayCount:1,//	天数	number	
            leaveTypeIds:[],//	请假类型id 逗号分割	string	
            leaveTypeNames:'',//	请假类型名称 逗号分割	string	
            limitType:1,//	限制方式 1 时间 2 频率 3 调课 4 性别	number	
            sex:1,//性别 1男 2女	number	
        },
        leaveTypeList:[],
        id:this.$route.query.id
    };
  },
  mixins: [mixin],
  created() {
       getThAskLeaveFourInit()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.leaveTypeList = pageData.leaveTypeList
                });

        if(this.id){
            getThAskleaveFourRule(this.id).then(res => {
                    const data = res.data.data;
                        this.form.askCount = data.askCount;
                        this.form.dayCount = data.dayCount;
                        this.form.limitType = data.limitType;
                        this.form.sex = data.sex;
                        this.form.leaveTypeIds = data.leaveTypeIds.split(',');
                        console.log(this.form.leaveTypeIds)
                }).catch(() => {});
        }
  },
  methods: {
    addThAskleaveFourRule() {
        if(!this.form.leaveTypeIds.length){
           this.$message({message: '请选择适用请假类型',type: 'warn'});
            return
        }
        let myobj={
            askCount:0,//	次数	number	
            dayCount:0,//	天数	number	
            leaveTypeIds:this.form.leaveTypeIds.join(','),//	请假类型id 逗号分割	string	
            leaveTypeNames:'',//	请假类型名称 逗号分割	string	
            limitType:this.form.limitType,//	限制方式 1 时间 2 频率 3 调课 4 性别	number	
            sex:0,//性别 1男 2女	number	
        }
        if(this.form.limitType==1){
           myobj.dayCount=this.form.dayCount
        }
         if(this.form.limitType==2){
            myobj.askCount=this.form.askCount
        }
        if(this.form.limitType==4){
            myobj.sex=this.form.sex
        }
        let namelist=[]
        for(let i=0;i<this.leaveTypeList.length;i++){
            for(let j=0;j<this.form.leaveTypeIds.length;j++){
                if(this.leaveTypeList[i].leaveTypeId==this.form.leaveTypeIds[j]){
                    namelist.push(this.leaveTypeList[i].leaveTypeName)
                }
            }

        }
      myobj.leaveTypeNames=namelist.join(',')
      if(this.id){
          myobj.id=this.id
           updateThAskleaveFourRule(myobj)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "编辑成功！",
              type: "success",
              duration: 1000
            });
            this.$router.back();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {});

      }else{
           addThAskleaveFourRule(myobj)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "添加成功！",
              type: "success",
              duration: 1000
            });
            this.$router.back();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {});

      }
    
    }
  }
};
</script>
<style lang="scss" scoped>
.ruleadd {
  padding:12px;
  * {
    word-break: break-all;
    word-wrap: break-word;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      padding-top: 20px;
    }
  }
}
</style>