<template>
  <div class="visitorReservationinfo">
    <div class="visitorReservationinfo-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
           
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <div class="title">预约信息</div>
              <el-form-item label="访客姓名" >{{ruleForm.name}}</el-form-item>  
              <el-form-item label="被访人" >{{ruleForm.visitUserName}}</el-form-item>
              <el-form-item label="手机号">{{ruleForm.mobile}}</el-form-item>  
              <el-form-item label="身份证" >{{ruleForm.cardId}}</el-form-item>  
              <el-form-item label="来访时间" >{{ruleForm.visitTime.slice(0,16)}}</el-form-item>  
              <el-form-item label="事由" >{{ruleForm.reason}}</el-form-item>  
              <el-form-item v-if="ruleForm.peerUser" label="同行人员" >{{ruleForm.peerUser}}</el-form-item>  
              <el-form-item v-if="ruleForm.carNo" label="车牌号" >{{ruleForm.carNo}}</el-form-item>  
              <el-form-item v-if="ruleForm.unit" label="单位" >{{ruleForm.unit}}</el-form-item> 
            </el-form>
             <div class="stepsbox" style="height: 500px;">
                 <div class="title">访客流程</div>
            <el-steps :active="5" align-center direction="vertical" >
            <el-step title="访客申请">
                    <template slot="description" >
                        <span>{{ruleForm.name}}<br/>{{ruleForm.createTime.slice(0,19)}}</span>
                    </template>
            </el-step>
            <el-step title="访客审批"  v-if="ruleForm.status>1">
                <template slot="description" >
                        <span>{{ruleForm.visitUserName}}<br/>{{ruleForm.batchTime.slice(0,19)}}</span>
                    </template>
            </el-step>
            <el-step title="访客加审" v-if="ruleForm.isBatchTw==2&&ruleForm.status>3">
                <template slot="description" >
                        <span>{{ruleForm.batchTwUserName}}<br/>{{ruleForm.batchTwTime.slice(0,19)}}</span>
                    </template>
            </el-step>
            <el-step title="访客到访" v-if="ruleForm.status==6">
                <template slot="description" >
                        <span>{{ruleForm.name}}<br/>{{ruleForm.intSchTime.slice(0,19)}}</span>
                    </template>
            </el-step>
            </el-steps>
            </div>
        </div>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {getVisitRecord} from "@/api/visitorReservation";
  export default {
    data() {     
      return { 
         ruleForm: {
            name:"",//	姓名	string	
            mobile:"",//	手机号	string	
            cardId:"",//	身份证	string
            visitDate:"",//	来访日期	string	
            visitTime:"",//	来访时间	string	    
            reason:"",//	事由	string	
           	peerUser:"",//	同行人员	string
            carNo:"",//	车牌号	string	   
            unit:"",//	单位	string	
            visitUserId:"",//	拜访人id	number	
            visitUserName:"",//	拜访人姓名	string	
            schoolId:"",//	学校Id	number
            status:""
        },
      }
    },
    mixins: [mixin],
    created() {
        this.getVisitRecord()
    },
    methods: {  
        //获取批次详情
        getVisitRecord(){
            getVisitRecord( this.$route.query.recordId).then(res => res.data).then(data => {
                            if(data.code==200) {                           
                               this.ruleForm=data.data;
                             }
                        })
        },       
       
    }
  };
</script>

<style lang="scss" scoped>
.visitorReservationinfo{
    padding:12px;
    .visitorReservationinfo-top{
       padding-bottom: 10px;
       border-bottom: 1px solid #e7eaec;
    }
     .title{
       font-size: 18px;
      line-height: 20px;
      color: #606266;
      padding-left: 15px;
      border-left: 3px solid #409EFF;
          margin: 10px 5px;
    }
    .el-form-item{
        float: left;
        width:49%;
    }
    .subject{
        overflow: auto;
        .body{
            width: 1000px;
            margin: 20px auto;
            .demo-ruleForm{
                width:680px;
                 float: left;
            }
            .stepsbox{
                 width:300px;
                 float: right;
            }
            .el-form-item {
                margin-bottom: 0px;
            }
            .img{
                height: 40px;
            }
        }
    }
}
</style>