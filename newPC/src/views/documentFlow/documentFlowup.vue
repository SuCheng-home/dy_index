<template>
    <div class="doc_flow_add_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click="addAndUpdateDocumentFlowInit()" >
              保存
            </el-button>
        </div>
        <div class="body">
            <div class="flow_add_box">
                <el-form ref="ruleForm"  :rules="rules" label-width="140px" class="demo-ruleForm">
                  <el-form-item>
                         <el-checkbox :true-label="2" :false-label="1" v-model="ruleForm.isRemind" >是否提醒</el-checkbox>
                  </el-form-item>
                   <el-form-item v-if="ruleForm.isRemind==2">                        
                     <el-checkbox-group v-model="ruleForm.remindTime">
                        <el-checkbox  label="08:00">08:00</el-checkbox>
                        <el-checkbox  label="09:00">09:00</el-checkbox>
                        <el-checkbox  label="17:00">17:00</el-checkbox>
                        <el-checkbox  label="18:00">18:00</el-checkbox>
                     </el-checkbox-group>
                  </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>   
    import {addAndUpdateDocumentFlowInit,getDocumentFlowInit} from '@/api/teachingStudy/documentFlow';

    export default {
        name: "documentFlowup",
        data() {
            return {                
                ruleForm: {
                    isRemind: 1,
                    remindTime: [],
                },
               
            }
        },
        created() {
          getDocumentFlowInit().then(res => {
                    const data = res.data.data;
                    if (data) {
                       this.ruleForm.isRemind=data.isRemind-0
                       if(data.isRemind==2){
                          this.ruleForm.remindTime=data.remindTime?data.remindTime.split(","):[]
                       }
                    } 
                }).catch();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            addAndUpdateDocumentFlowInit() {
                if(this.ruleForm.isRemind==2&&this.ruleForm.remindTime.length==0){
                    this.$message.error("请选择提醒时间！");
                    return
                }
                addAndUpdateDocumentFlowInit({
                    isRemind:this.ruleForm.isRemind,
                    remindTime:this.ruleForm.isRemind==1?"":this.ruleForm.remindTime.join(",")
                }).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        });
                        this.goBack()
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .doc_flow_add_wrap {
        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .body {
            overflow: auto;
            padding-top: 20px;
        }

        .flow_add_box {
            width: 810px;
            margin: 0 auto;
        }
    }
</style>
