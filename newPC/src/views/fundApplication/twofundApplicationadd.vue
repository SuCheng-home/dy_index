<template>
    <div class="doc_flow_add_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click="addFundApply(1)">保存草稿</el-button>
            <el-button type="primary" size="medium" @click="addFundApply(2)">提交复核</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                    <el-row :gutter="50">
                        <el-col>
                            <el-form-item label="资金用途" prop="useInfo">
                                <el-input v-model.trim="ruleForm.useInfo" :maxlength="50"  size="medium" placeholder="请输入资金用途" ></el-input>
                            </el-form-item>
                            <el-form-item label="申请金额" prop="amount" >
                                <el-input-number v-model.trim="ruleForm.amount" size="medium" placeholder="请输入金额" :precision="2"  :min="0.01" :max="999999999" :step="1"></el-input-number> 元
                            </el-form-item>
                            <el-form-item label="申请理由">
                                <el-input v-model.trim="ruleForm.remark" :maxlength="500"   type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入申请理由"></el-input>
                            </el-form-item>
                            <el-form-item label="附件">
                                <uploader  pathPrefix="zijinshenqing" module="zijinshenqing" moduleCode="20230829" :multiple="true" :extList="allFileTypeList"  v-model="ruleForm.fileJson"></uploader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import Uploader from '@/components/Uploader/WebUploader';
    // import FileList from '@/components/FileList/FileList.vue';
    import {addFundApply} from '@/api/fundApplication';
    export default {
        name: "documentFlowAdd",
        components: {
            Uploader
        },
        data() {
            return {
                ruleForm: {
                    amount:undefined,//	金额（分）	number	
                    applyState:1,//	1 草稿 2 待复核	number	
                    fileJson:[],//	附件	string
                    remark:"",//	申请理由	string	
                    useInfo:"",//	资金用途	string
                },
                rules: {
                    useInfo: [
                        {required: true, message: '请输入资金用途！', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入申请理由！', trigger: 'blur'}
                    ],
                    amount: [
                        { required: true, message: "请输入金额", trigger: "blur" }
                    ]
                },
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar']
            }
        },
        mixins: [mixins],
        created() {
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            addFundApply(applyState) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            amount: this.ruleForm.amount*100,
                            fileJson: this.ruleForm.fileJson,
                            remark: this.ruleForm.remark,
                            useInfo: this.ruleForm.useInfo,
                            applyState: applyState,
                            type:3
                        };
                       this.addDocumentFlow(query);
                    }
                });
            },
            addDocumentFlow(query) {
                addFundApply(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: query.applyState==1?'保存草稿成功':'提交复核成功',
                            type: 'success'
                        });
                        this.$router.back();
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
