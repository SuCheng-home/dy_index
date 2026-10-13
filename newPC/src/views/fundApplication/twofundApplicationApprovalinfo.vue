<template>
    <div class="doc_flow_add_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" v-if="ruleForm.applyState==2" @click="schBatchFundApply(4)">复核同意</el-button>
            <el-button type="primary" size="medium" v-if="ruleForm.applyState==2" @click="schBatchFundApply(3)">复核退回</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">  
                <el-steps :active="active" align-center>
                        <el-step title="资金支出申请"  icon="el-icon-edit"></el-step>
                        <el-step title="学校复核"  icon="el-icon-s-custom"></el-step>
                        <!-- <el-step title="教育局审批"  icon="el-icon-s-check"></el-step> -->
                        <el-step title="银行出账"   icon="el-icon-thumb"></el-step>
                </el-steps>         
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                    <div>
                        <div  class="title">申请信息</div>
                        <el-form-item label="申请编号" >
                                {{ruleForm.orderNum}}
                            </el-form-item>
                        <el-form-item label="资金用途" >
                                {{ruleForm.useInfo}}
                            </el-form-item>
                            <el-form-item label="申请金额" >
                                {{ruleForm.amount/100}} 元
                            </el-form-item>
                            <el-form-item label="申请理由" v-if="ruleForm.remark">
                                {{ruleForm.remark}}
                            </el-form-item>
                             <el-form-item label="创建人" >
                                {{ruleForm.createUserName}}
                            </el-form-item>
                            <el-form-item label="创建时间">
                                {{ruleForm.createTime?ruleForm.createTime.slice(0,19):"----"}}
                            </el-form-item>
                            <el-form-item label="附件" v-if="ruleForm.fileJson.length!==0">
                                <file-list :fileList="ruleForm.fileJson"></file-list>
                            </el-form-item>
                    </div>  
                    <div v-if="ruleForm.applyState==2">
                        <div  class="title">复核信息</div>
                            <el-form-item label="复核备注" prop="schBatchContent" style=" margin-bottom: 20px;">
                                <el-input v-model.trim="ruleForm.schBatchContent" :maxlength="500"   type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入复核备注"></el-input>
                            </el-form-item>
                    </div>                            
                     <div v-if="ruleForm.applyState>2">
                        <div  class="title">复核信息</div>
                        <el-form-item label="复核人" >
                                {{ruleForm.schBatchUserName}}
                            </el-form-item>
                            <el-form-item label="复核时间">
                                {{ruleForm.schBatchTime?ruleForm.schBatchTime.slice(0,19):"----"}}
                            </el-form-item>
                            <el-form-item label="复核状态" >
                                <el-tag  size="mini" type="danger"  v-if="ruleForm.applyState==3">退回</el-tag>
                                <el-tag  size="mini" type="success"  v-else>同意</el-tag>
                            </el-form-item>
                            <el-form-item label="复核备注">
                                {{ruleForm.schBatchContent}}
                            </el-form-item>
                    </div>   
                    <!-- <div v-if="ruleForm.applyState>4">
                        <div  class="title">教育局审批信息</div>
                        <el-form-item label="审批人" >
                                {{ruleForm.eduBatchUserName}}
                            </el-form-item>
                            <el-form-item label="审批时间">
                                {{ruleForm.eduBatchTime?ruleForm.eduBatchTime.slice(0,19):"----"}}
                            </el-form-item>
                            <el-form-item label="审批状态" >
                                <el-tag  size="mini" type="danger"  v-if="ruleForm.applyState==5">退回</el-tag>
                                <el-tag  size="mini" type="success"  v-else>同意</el-tag>
                            </el-form-item>
                            <el-form-item label="审批备注">
                                {{ruleForm.eduBatchContent}}
                            </el-form-item>
                    </div>      -->
                    <div v-if="ruleForm.applyState>6">
                        <div  class="title">银行出账信息</div>
                        <el-form-item label="出账人" >
                                {{ruleForm.financeBatchUserName}}
                            </el-form-item>
                            <el-form-item label="出账时间">
                                {{ruleForm.financeBatchTime?ruleForm.financeBatchTime.slice(0,19):"----"}}
                            </el-form-item>
                            <el-form-item label="出账状态" >
                                <el-tag  size="mini" type="danger"  v-if="ruleForm.applyState==7">退回</el-tag>
                                <el-tag  size="mini" type="success"  v-else>已出账</el-tag>
                            </el-form-item>
                            <el-form-item label="出账备注">
                                {{ruleForm.financeBatchContent}}
                            </el-form-item>
                    </div>           
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import Uploader from '@/components/Uploader/WebUploader';
    import FileList from '@/components/FileList/FileList.vue';
    import {getFundApply,schBatchFundApply} from '@/api/fundApplication';
    export default {
        name: "documentFlowAdd",
        components: {
            Uploader,FileList
        },
        data() {
            return {
                ruleForm: {
                   schBatchContent:""
                },
                  rules: {
                    schBatchContent: [
                        {required: true, message: '请输入复核备注！', trigger: 'blur'}
                    ],
                },
            }
        },
        mixins: [mixins],
        created() {
            this.getFundApply();
        },
        methods: {
             schBatchFundApply(applyState) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            id: this.$route.query.id,
                            schBatchContent: this.ruleForm.schBatchContent,
                            applyState: applyState
                        };
                          this.$confirm('是否'+(applyState==4?'复核同意':'复核退回'), '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    schBatchFundApply(query).then(res => {
                                        this.$message({
                                            type: 'success',
                                            message: '审核成功!'
                                        });
                                         this.$router.back();
                                    }).catch();

                                }).catch(() => {
                                });
                    }
                });
            },
            goBack() {
                this.$router.back();
            },
            getFundApply() {
                getFundApply(this.$route.query.id).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data) {
                        data.fileJson = data.fileJson ? JSON.parse(data.fileJson) : [];
                        this.ruleForm = data;
                        if(data.applyState==1){
                            this.active=0
                        }
                        if(data.applyState>1){
                            this.active=1
                        }
                        if(data.applyState>2){
                            this.active=2
                        }
                        if(data.applyState>4){
                            this.active=3
                        }
                        // if(data.applyState>6){
                        //     this.active=4
                        // }
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
            overflow:hidden;
        }
        .title {
            font-size: 16px;
            line-height: 18px;
            border-left: 3px solid #409EFF;
            color: #606266;
            padding-left: 10px;
            margin: 20px;
        }
        .el-form-item {
            margin-bottom: 0px;
        }
    }
</style>
