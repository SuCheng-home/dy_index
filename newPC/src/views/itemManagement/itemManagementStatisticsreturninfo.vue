<template>
  <div class="itemManagementStatisticsreturninfo">
    <div class="header">
        <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>
    <div class="body" :style="{'height':nobottommaxH+'px'}">
      <el-form  ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <div class="title">申请信息</div>
        <el-form-item label="申请人">{{form.createUserName}}</el-form-item>
        <el-form-item label="申请时间">{{form.createDate?form.createDate.slice(0,19):''}}</el-form-item>        
        <el-form-item label="申请物品">{{form.goodName}}</el-form-item>
        <el-form-item label="申请数量">{{form.orderCount}}{{form.unitName}}</el-form-item>
        <el-form-item label="申请理由">{{form.content}}</el-form-item>
        <div class="title" v-if="form.examineUserName">审批信息</div>
        <el-form-item label="审批人" v-if="form.examineUserName">{{form.examineUserName}}</el-form-item>
        <el-form-item label="审批时间" v-if="form.examineUserName">{{form.examineDate?form.examineDate.slice(0,19):''}}</el-form-item>        
        <el-form-item label="审批意见" v-if="form.examineUserName">{{form.examineReply}}</el-form-item>
        <div class="title" v-if="form.manageUserName">发放信息</div>
        <el-form-item label="发放人" v-if="form.manageUserName">{{form.manageUserName}}</el-form-item>
        <el-form-item label="发放时间" v-if="form.manageUserName">{{form.manageDate?form.manageDate.slice(0,19):''}}</el-form-item>  
        <div class="title" v-if="mylist.length">归还信息</div>
        <div v-for="item in mylist" :key="item.id">
             <el-form-item label="归还数量">{{item.giveCount}}{{form.unitName}}</el-form-item>
             <el-form-item label="归还时间">{{item.createTime.slice(0,19)}}</el-form-item>  
        </div>
      </el-form>
    </div>
</div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
import {getExamineDetails,getGoodGiveBackList} from "@/api/itemManagement";
export default {
  data() {
    return { 
        form:{
          createUserName:"",
          createDate:"",
          goodName:"",
          orderCount:"",
          unitName:"",
          content:"",
          manageUserName:"",
          manageDate:"",
          examineReply:"",
          examineUserName:"",
          examineDate:"",
        },
        mylist:[]
    };
  },
  created() {
      getExamineDetails(this.$route.query.id)
                    .then(res => res.data)
                    .then(data => {
                        this.form = data.data
                    })
      getGoodGiveBackList(this.$route.query.id)
                    .then(res => res.data)
                    .then(data => {
                        this.mylist = data.data
                    })
  },
  mixins: [mixin,baseMixin],
  methods: { 
   
  },
};
</script>
<style lang="scss" scoped>
.itemManagementStatisticsreturninfo {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 10px;
        overflow: hidden;
         border-bottom: 1px solid #e7eaec;
  }
  .title{
    line-height: 20px;
    font-size: 15px;
    border-left: 3px solid #409eff;
    padding-left: 10px;
    margin: 10px 0;
    color:#606266;
    font-weight: 700;
  }
  .body{
      overflow:auto;
  }
  .demo-ruleForm{
      width:810px;
      box-sizing: border-box;
      margin:0 auto;
  } 
  .el-form-item {
    margin-bottom: 0px;
    display: inline-block;
    width: 48%;
}
}
</style>
 