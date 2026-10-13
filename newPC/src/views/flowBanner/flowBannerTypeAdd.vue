<template>
    <div class="flow_type_wrap">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="saveAdviceType">保存</el-button>
        </div>
        <div class="flow_type_add_msg_box">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="流动红旗图标" prop="logo">
                    <uploader module="liudonghongqi" pathPrefix="liudonghongqi" moduleCode="20210204" useSysBucket :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image"
                              showMode="cover" v-model="logo" :multiple="true"></uploader>
                </el-form-item>
                <el-form-item label="流动红旗名称" prop="name">
                    <el-input v-model.trim="ruleForm.name" :maxlength="5" placeholder="请输入名称(1-5个字符)"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="orderNo">
                    <el-input-number v-model="ruleForm.orderNo" controls-position="right" :precision="0" :min="1"
                                     :max="99999" :step="1"></el-input-number>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Uploader from "@/components/Uploader/WebUploader";
    import {insertFlowBannerType} from '@/api/flowBanner';

    export default {
        name: "flowBannerTypeAdd",
        components: {
            Uploader
        },
        data() {
            const validateLogo = (rule, value, callback) => {
                if (this.logo.length === 0) {
                    callback(new Error('请上传logo'));
                } else {
                    callback();
                }
            };
            return {
                adviceTypeId: 0,
                isShowPhoneNumber: false,
                logo: [{
                    fileUrl: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/others/flow_banner.png'
                }],
                ruleForm: {
                    logo: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/others/flow_banner.png',
                    name: '',
                    orderNo: 1
                },
                rules: {
                    logo: [
                        {required: true, validator: validateLogo}
                    ],
                    name: [
                        {required: true, message: '请输入流动红旗名称！', trigger: 'blur'},
                        {min: 1, max: 5, message: '长度在 1 到 5 个字符！', trigger: 'blur'}
                    ],
                    orderNo: [
                        {required: true, message: '请输入排序号！', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            saveAdviceType() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            logo: this.logo[0].fileUrl,
                            name: this.ruleForm.name,
                            orderNo: this.ruleForm.orderNo
                        };

                        this.insertFlowBannerType(query);
                    }
                });
            },
            insertFlowBannerType(query) {
                insertFlowBannerType(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .flow_type_wrap {
        padding: 12px;

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .demo-ruleForm {
            width: 810px;
            margin: 0 auto;
        }

        .flow_type_add_msg_box {
            padding-top: 20px;
        }
    }
</style>
