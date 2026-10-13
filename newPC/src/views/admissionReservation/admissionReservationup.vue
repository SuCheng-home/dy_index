<template>
  <div class="admissionReservationup">
    <div class="header">
      <el-button size="medium" @click="goBack" v-if="myis">返回</el-button>
      <el-button type="primary" size="medium" @click="addupdateSocialReserInit">保存设置</el-button>
    </div>
    <div class="school_mate_apply_set_box" :style="`height: ${nobottommaxH}px;`">
      <div class="school_mate_inner_box">       
        
         <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
              <div class="code_title">
                 <span>预约限制</span>
              </div>
              <el-form-item label="上午限制人数" >
                <el-input-number v-model.trim="ruleForm.morningCount" step-strictly controls-position="right" :min="0" :max="3000" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="下午限制人数" >
                <el-input-number v-model.trim="ruleForm.afternoonCount" step-strictly controls-position="right" :min="0" :max="3000" :step="1"></el-input-number>
              </el-form-item>        
                <el-form-item label="预约限制" >
                    <el-checkbox :true-label="2" :false-label="1" v-model="ruleForm.isAdvance" >提前预约</el-checkbox>
                </el-form-item>
                <el-form-item label="提前时长（天）"  v-if="ruleForm.isAdvance==2">
                <el-input-number v-model.trim="ruleForm.advanceDayCount" step-strictly controls-position="right" :min="0" :max="90" :step="1"></el-input-number>
              </el-form-item>
                <div class="code_title">
                <span>预约须知</span>
              </div>
                <el-form-item>
                    <ueditor class="rich-editor" style="width: 740px;position: relative;right: 70px;" ref="ueditor"
                             :defaultMes="ruleForm.reserNotice" @editModel="richTextEditHandler"></ueditor>
                </el-form-item>
              <div class="code_title">
              <span>注意事项</span>
            </div>
             <el-form-item>
                  <el-input
                  style="width: 740px;position: relative;right: 70px;"
                  type="textarea"
                  placeholder="请输入注意事项"
                  v-model="ruleForm.matterContent"
                  maxlength="300"
                  :autosize="{ minRows: 6, maxRows: 10}"
                  show-word-limit
                >
                </el-input>
                </el-form-item>
            </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import Ueditor from "@/components/Ueditor";
  import {getSocialReserInit,addupdateSocialReserInit} from '@/api/admissionReservation';  
  export default {
    name: "schoolMateApplySet",
    components: {
      Ueditor
    },
    data() {
      return {
        ruleForm:{
           advanceDayCount:0,//	提前天数	number	
            afternoonCount:0,//	下午数量	number	
            isAdvance:1,//	是否提前 1 不提前 2 提前	number	
            matterContent:"",//	注意事项	string	
            morningCount:0,//	上午数量	number	
            reserNotice:"",//	预约须知	string	
        },
        myis:0
      }
    },
    mixins: [mixins],
    created() {
      this.getSocialReserInit()
    },
    methods: {
       getSocialReserInit() {
        getSocialReserInit().then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
             if(data){
                 this.ruleForm=data;
                 this.$refs.ueditor.setContent(data.reserNotice);
                 this.myis=1
             }
              
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      },
      goBack() {
        this.$router.back();
      },
      richTextEditHandler(content) {
                this.ruleForm.reserNotice = content;
      },
      addupdateSocialReserInit(){
        if (this.ruleForm.reserNotice == '') {
                    this.$message({
                        type: "error",
                        message: "请输入预约须知！"
                    });
                    return false;
                }
          this.ruleForm.reserNotice = this.$refs.ueditor.getContent();
         addupdateSocialReserInit(this.ruleForm).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('保存成功');
                        this.goBack();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .admissionReservationup {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .school_mate_apply_set_box {
      overflow-x: hidden;
      overflow-y: auto;

      .school_mate_inner_box{
        width: 810px;
        margin: 20px auto;

        .code_title {
          height: 20px;
          line-height: 20px;
          margin: 10px 0;
          padding-left: 8px;
          border-left: 4px solid #409eff;
          color: #333;
        }
      }
    }
  }
</style>
