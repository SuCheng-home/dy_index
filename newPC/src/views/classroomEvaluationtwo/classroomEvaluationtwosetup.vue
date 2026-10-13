<template>
  <div class="classroomEvaluationtwosetup" >
    <div class="header">
          <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium"   @click="addAndUpdateSchoolBehInits()">保存</el-button>
          <el-button type="primary" size="medium"   @click="sendMessageToParents()">发送本学期评价报告给家长</el-button>
    </div>
    <div class="schoolWrap scrollStyle" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
              <el-checkbox v-model="isSendWeek">按周推送（每周六上午10点）</el-checkbox>
              <el-checkbox v-model="isSendMonth">按月推送（每月最后一天18点）</el-checkbox>
        </div>   
       
    </div>
  </div>
</template>
<script>
import {getSchoolBehInit,addAndUpdateSchoolBehInit,sendMessageToParent,getSchoolTimeAllList} from '@/api/classroomEvaluationtwo';
export default {
  data(){
    return{
        isSendMonth:false,
        isSendWeek:false,
        schoolTimeId:""
    }
  },
  created(){ 
      this.getSchoolBehInits();
       //学期列表
      getSchoolTimeAllList().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
         data.data.forEach(item=>{
            if(item.isCurrent==1){
              this.schoolTimeId=item.id;
            }
          })
        }
      })
  },
  methods:{ 
    getSchoolBehInits(){
        getSchoolBehInit().then(res=>res.data)
      .then(data=>{
          let mydata=data.data;
          this.isSendMonth=mydata.isSendMonth==1;
          this.isSendWeek=mydata.isSendWeek==1;
      })
    },
    //删除评论
            sendMessageToParents() {
                this.$confirm("是否发送本学期评价报告给家长？", "发送", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    sendMessageToParent().then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                             this.$message({
                                            message: '发送成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                        }
                    });
                });
            },
    addAndUpdateSchoolBehInits(){
         addAndUpdateSchoolBehInit({isSendMonth:this.isSendMonth?1:2,isSendWeek:this.isSendWeek?1:2}).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '保存成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                }
            }).catch(() => {})    
     }
  }
}
</script>
<style lang="scss" scoped>
.classroomEvaluationtwosetup{
  padding:12px;
  box-sizing: border-box;
  font-size:14px;  
  .header{
    padding-bottom:10px;
    border-bottom:1px solid  #e7eaec;   
  }
  .body{
      width: 810px;
      margin: 20px auto;
  }
}
</style>

