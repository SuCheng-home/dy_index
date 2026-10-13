<template>
    <div class="schoolfoodbankadd ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="saveNoticeRepeatReminderByNoticeIds('ruleForm')">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
               <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                 <el-form-item label="提醒日期" prop="bigdate">
                      <el-date-picker v-model="ruleForm.bigdate" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>    
                   <el-form-item label="提醒时间" prop="tipTime">
                    <el-select v-model="ruleForm.tipTime" placeholder="请选择提醒时间">
                        <el-option  :label="index+'点钟'" :value="index" v-for="index of 24" :key="index"></el-option>
                    </el-select>
                  </el-form-item>                 
               </el-form>
             </div>  
     </div>
    </div>
</template>
<script>
import {saveNoticeRepeatReminderByNoticeId,getNoticeRepeatReminderByNoticeId} from "@/api/notice";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      ruleForm: {
        bigdate:[],
        endDate:"",//	截止日期 YYYY-MM-dd	string	
        isDelete:0,//	删除标志 0有效 1无效	number	用于删除重复提醒发送
        noticeId:this.$route.query.id,//	通知id	number	
        startDate:"",//	开始日期 YYYY-MM-dd	string	
        tipTime:8//	时间整点 1,2,3~24	string	
      },
       rules: {       
         bigdate: [
          { type: 'array', required: true, message: '请选择提醒日期', trigger: 'change' }
        ], 
         tipTime: [
          { required: true, message: "请选择商户号", trigger: "change" }
        ],   
      },
    };
  },
  computed: { ...mapGetters(["schoolInfo"]) },
  created() {
    getNoticeRepeatReminderByNoticeId(this.$route.query.id).then(res => {
                let data = res.data.data;
                if(data){
                    this.ruleForm.tipTime=data.tipTime-0;
                    this.ruleForm.bigdate=[data.startDate,data.endDate]
                }
                
                }).catch(err => {
                });
  },
  mixins: [mixin],
  methods: {
    //保存
    saveNoticeRepeatReminderByNoticeIds(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {            
             saveNoticeRepeatReminderByNoticeId({ 
                        isDelete: this.ruleForm.isDelete,
                        noticeId: this.ruleForm.noticeId,
                        tipTime: this.ruleForm.tipTime,
                        startDate:this.$moment(this.ruleForm.bigdate[0]).format("YYYY-MM-DD"),
                        endDate:this.$moment(this.ruleForm.bigdate[1]).format("YYYY-MM-DD"),
                    })
              .then(res => {
                if (res.data.result) {
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                  this.$router.back();
                }else{
                  this.$message({type: 'error', message:res.data.msg});
                  return;
                }             
              }).catch();
          };
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.schoolfoodbankadd {
  padding:12px;
  * {
    box-sizing: border-box;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 30px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      .el-range-editor.el-input__inner,.el-select{
          width: 500px;
      }
    } 
  }
}
</style>
