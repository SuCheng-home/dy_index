<template>
  <div class="visitordetails">
    <div class="visitordetails-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
              <el-form-item label="流水号" >{{ruleForm.vid}}</el-form-item>  
              <el-form-item label="身份证">{{ruleForm.no|hideInfo}}</el-form-item>  
              <el-form-item label="访客姓名" >{{ruleForm.name?ruleForm.name:"----"}}</el-form-item>  
              <el-form-item label="手机号" >{{ruleForm.mobile?ruleForm.mobile:"----"}}</el-form-item>  
              <el-form-item label="到达时间" >{{ruleForm.arrive?ruleForm.arrive.substring(0, 19):"----"}}</el-form-item>  
              <el-form-item label="离开时间" >{{ruleForm.leaveTime?ruleForm.leaveTime.substring(0, 19):"----"}}</el-form-item>  
              <el-form-item label="被访部门" >{{ruleForm.toOrg?ruleForm.toOrg:"----"}}</el-form-item>  
              <el-form-item label="被访人员" >{{ruleForm.toName?ruleForm.toName:"----"}}</el-form-item>  
              <el-form-item label="联系电话" >{{ruleForm.phone?ruleForm.phone:"----"}}</el-form-item> 
              <el-form-item label="人数" >{{ruleForm.count?ruleForm.count:"----"}}</el-form-item>
              <el-form-item label="事由" >{{ruleForm.reason?ruleForm.reason:"----"}}</el-form-item> 
              <el-form-item label="图片" >
                  <image-previewer tag="richtext" >
                              <img class="img"  :src="ruleForm.photo1" v-if="ruleForm.photo1"> 
                              <span v-else>----</span>
                    </image-previewer>
              </el-form-item> 
            </el-form>
        </div>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {getVisitor} from "@/api/visitor";
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  export default {
    data() {     
      return { 
         ruleForm: {
            vid: "",
            no: "",
            name: "",
            mobile: "",
            arrive: "",
            leaveTime: "",
            photo1: "",
            toName: "",
            toOrg: "",
            phone: "",
            count: "",
            reason: "",
        },
      }
    },
    mixins: [mixin],
     components: {ImagePreviewer},
    //过滤器
filters:{
      hideInfo(val) {
        let str = [null,undefined,""];
        if (!str.includes(val) && val.length > 9) {
          let valLen = val.length;
          const  numt = 1;
          const  num = 2;
          let  numf = 2;
          if (valLen > 26) {
            numf=numf*2;
          }
          if (valLen % 2 == 0) {
            return val.substring(0,valLen/num-numf)+"******"+val.substring((valLen/num)+numf);
          }else {
            valLen += numt;
            return val.substring(0,(valLen/num)-numf-numt)+"******"+val.substring((valLen/num)+numf-numt);
          }
        }else {
          return val;
        }
     },
},
    created() {
        this.getVisitors()
    },
    methods: {  
        //获取批次详情
        getVisitors(){
            getVisitor( this.$route.query.vid).then(res => res.data).then(data => {
                            if(data.code==200) {                           
                               this.ruleForm=data.data;
                             }
                        })
        },       
       
    }
  };
</script>

<style lang="scss" scoped>
.visitordetails{
    padding:12px;
    .visitordetails-top{
       padding-bottom: 10px;
       border-bottom: 1px solid #e7eaec;
    }
    .subject{
        overflow: auto;
        .body{
            width: 810px;
            margin: 20px auto;
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