<template>
    <div class="doc_flow_add_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" v-if="ruleForm.applyState==1" @click="confirmationofFeefundsEidt()">编辑</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">  
                <el-steps :active="active" align-center>
                        <el-step title="资金确认申请"  icon="el-icon-edit" :description="active>0?(ruleForm.createUserName+ruleForm.createTime.slice(0,19)):''"></el-step>
                        <el-step title="教育局审批"  icon="el-icon-s-check" :description="active>1?(ruleForm.eduBatchUserName+ruleForm.eduBatchTime.slice(0,19)):''"></el-step>
                </el-steps>         
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                    <div>
                        <el-form-item label="收费主题" >
                                {{ruleForm.title}}
                            </el-form-item>
                             <el-form-item label="收费账户"  >
                              {{ruleForm.accountNum}}（{{ruleForm.accountName}}）
                            </el-form-item>
                              <el-form-item label="关联收费批次">
                                <div v-for="item in ruleForm.chargeJson" :key="item.cid">
                                    {{item.chargeName}}：{{item.amount/100}}元
                                </div>
                            </el-form-item>                            
                            <el-form-item label="收费总金额" >
                                {{ruleForm.amount/100}} 元
                            </el-form-item>  
                            <el-form-item label="确认单" v-if="ruleForm.fileJson.length!==0">
                                <file-list :fileList="ruleForm.fileJson"></file-list>
                            </el-form-item>
                         <el-form-item  label="申请状态" >
                                <el-tag  size="mini" type="info" v-if="ruleForm.applyState==1">草稿</el-tag>
                                <el-tag  size="mini" type="warning" v-else-if="ruleForm.applyState==2">待审核</el-tag>
                                <el-tag  size="mini" type="danger"  v-else-if="ruleForm.applyState==4">驳回</el-tag>
                                <el-tag  size="mini" type="success"  v-else>同意</el-tag>
                            </el-form-item>
                          <el-form-item  label="审核备注" v-if="ruleForm.eduBatchContent">
                               {{ruleForm.eduBatchContent}}
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
    import {getFundChargeApply} from '@/api/fundApplication';
    export default {
        name: "documentFlowAdd",
        components: {
            Uploader,FileList
        },
        data() {
            return {
                ruleForm: {
                   
                },
            }
        },
        mixins: [mixins],
        created() {
            this.getFundChargeApply();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
              confirmationofFeefundsEidt(){
                this.$router.push({
                path: "confirmationofFeefundsEidt",
                query: {id:this.$route.query.id}
            });
            },
            getFundChargeApply() {
                getFundChargeApply(this.$route.query.id).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data) {
                        data.fileJson = data.fileJson ? JSON.parse(data.fileJson) : [];
                        data.chargeJson = data.chargeJson ? JSON.parse(data.chargeJson) : [];
                        this.ruleForm = data;
                        // 1 草稿 2 待复核 3 学校审批退回 4 学校审核同意 5 教育局退回 6 教育局审核同意 7 财务退回 8 财务同意
                        if(data.applyState==1){
                            this.active=0
                        }
                        if(data.applyState>1){
                            this.active=1
                        }
                        if(data.applyState>2){
                            this.active=2
                        }
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
