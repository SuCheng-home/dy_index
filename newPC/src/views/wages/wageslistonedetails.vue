<template>
  <div class="wageslistonedetails">
    <div class="wageslistonedetails-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <!-- <el-button type="primary"  size="medium" @click="sendUserPayrolls()">发布</el-button> -->
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
            <el-form :model="ruleForm" ref="ruleForm" label-width="240px" class="demo-ruleForm">
              <el-form-item label="姓名" >{{ruleForm.userName}}</el-form-item>  
              <el-form-item label="身份证">{{ruleForm.userIdNumber|hideInfo}}</el-form-item>              
              <el-form-item :label="item.title" v-for="(item,index) in ruleForm.dataStrlist" :key="index" >
                <span v-if="item.dataVal">{{item.dataVal}}</span>
                <span v-else>----</span>
              </el-form-item>
            </el-form>
        </div>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {payrollDetails,sendUserPayroll} from "@/api/wages";
  export default {
    data() {     
      return {
         ruleForm: {
            payrollId: this.$route.query.payrollId,//	批次Id	number
            dataStrlist: [],	           	
            userIdNumber: '',//	用户身份证号码	string	
            userName: '',//	用户名字	string
        },
      }
    },
    mixins: [mixin],
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
        this.payrollDetailss()
    },
    methods: {  
        //获取批次详情
        payrollDetailss(){
            payrollDetails(this.ruleForm.payrollId).then(res => res.data).then(data => {
                            if(data.code==200) {                           
                               this.ruleForm.userName=data.data.userName;
                               this.ruleForm.userIdNumber=data.data.userIdNumber;
                               let list=data.data.dataList;
                               for(let i=2;i<list.length;i++){
                                   this.ruleForm.dataStrlist.push({dataVal:list[i].dataVal,title:list[i].title})
                               }
                             }
                        })
        },
        //个人发布
        sendUserPayrolls() {
                this.$confirm('是否发布', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sendUserPayroll(this.ruleForm.payrollId).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '发布成功!' });
                                  this.queryPayrolls();
                           }
                        })
                });
            },
       
    }
  };
</script>

<style lang="scss" scoped>
.wageslistonedetails{
    padding:12px;
    .wageslistonedetails-top{
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
        }
    }
}
</style>