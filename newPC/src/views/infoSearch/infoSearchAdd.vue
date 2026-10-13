<template>
    <div class="NotifySetting" :style="`height:${columnH}px`">
        <div class="second-header-wrap">
            <el-button size="medium" @click="$router.back()" type="default">返回</el-button>
            <el-button size="medium" @click="saveHandler" type="primary">保存</el-button>
        </div>
        <div>
            <div class="header">
            </div>
            <div class="content">
                <el-form
                    :model="formData"
                    label-width="150px"
                    :rules="formDataRules"
                    ref="form"
                >
                    <el-form-item label="查询批次名称" prop="batchName">
                        <div style="width: 500px;">
                            <el-input size="medium" maxlength="30" type="text" v-model.trim="formData.batchName" :readonly="!!batchId"
                                      placeholder="请输入查询批次名称"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="查询名单" prop="file">
                        <div style="width: 500px;">
                            <el-upload class="upload-import" :action="uploadPath" :data="uploadData"
                                       :show-file-list='false'
                                       accept=".csv,.xls" :before-upload="beforeAvatarUpload"
                                       :on-success="handleAvatarSuccess"
                                       :on-error="handleAvatarErr" name="rosterFile">
                                <el-button type="primary" size="medium" :loading="importLoading">导入</el-button>
                            </el-upload>
                            <a :href="templateHref" target="_blank"
                               download="模板">
                                <el-button type="text">模板下载</el-button>
                            </a>
                            <div v-if="isUped">导入成功。共{{totalCount}}个，导入成功{{successTotal}}个</div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="header" style="padding-left: 60px;">
                <i class="color-block"></i>
                说明
            </div>
            <div class="content" style="padding-left: 60px;">
                <div>1.请先下载模板，严格根据模板的格式来录入数据。</div>
                <div>2.第一列为用户查询的标识列，请确保导入信息正确。</div>
                <div>3.第二列及以后为查询结果列。</div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {
        addStaterunEnrolInfoBatch
    } from '@/api/infoSearch';

    export default {
        data() {
            const fileValidator = (rule, value, callback) => {
                if (!this.importRosterJson || this.importRosterJson.length === 0) {
                    callback(new Error('请上传查询名单！'));
                } else {
                    callback();
                }
            };
            return {
                batchId: this.$route.query.batchId,

                importLoading: false,
                uploadPath: '',
                uploadData: {},

                formData: {
                    batchName: this.$route.query.batchName,
                },
                formDataRules: {
                    batchName: [
                        {required: true, message: '请输入查询批次名称', trigger: 'blur'}
                    ],
                    file: [
                        {required: true, validator: fileValidator}
                    ]
                },
                importRosterJson: [],
                headerJson: [],
                successTotal: 0,
                totalCount: 0,
                isUped: false,
                templateHref: ''
            }
        },
        created() {
            this.templateHref = global.BasePath + `structure/staterunEnrol/downloadInfoSearchNullModule?token=${this.$store.getters.token}`;
            this.uploadData = {token: this.$store.getters.token};
            this.uploadPath = global.BasePath + "structure/staterunEnrol/dealImportEnrolInfoRosterData";
        },
        mixins: [mixins],
        filters: {
            filterTime(date) {
                return date == '' ? '' : date.slice(0, 16);
            }
        },
        methods: {
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "csv" && suffix != "xls") {
                    this.$message.error("请上传模版文件!");
                } else {
                    this.importLoading = true;
                }
            },
            handleAvatarSuccess(res, file) {
                if (res.result) {
                    this.headerJson = JSON.parse(res.data.headerJson);
                    this.importRosterJson = JSON.parse(res.data.importRosterJson);
                    this.successTotal = res.data.successCount;
                    this.totalCount = res.data.totalCount;
                    this.importLoading = false;
                    this.isUped = true;
                } else {
                    this.importLoading = false;
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            },
            handleAvatarErr(err, file, fileList) {
            },
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                        addStaterunEnrolInfoBatch({
                            batchName: this.formData.batchName,
                            headerJson: this.headerJson,
                            importRosterJson: this.importRosterJson
                        }).then(res => res.data)
                            .then(data => {
                                if (data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.$router.back();
                                }
                            })
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    // @import "../../../styles/mixin";

    // @include globalstyle;
    .NotifySetting{
        padding: 12px;
    }
    .second-header-wrap {
        border-bottom:1px #eee solid;
        // min-width: 1200px;
        background-color: #fff;
        z-index: 1000;
        padding-bottom:10px;
    }

    .header {      

        white-space: nowrap;
        padding: 0 0 10px 0;

        .addTime {
            font-size: 20px;
            cursor: pointer;
        }
    }

    .important-hint {
        color: #ff0000;

    }

    .textarea-container {
        width: 70%;
        padding-left: 24px;
    }

    .numberBox {
        .el-input {
            width: 44%;
        }
    }

    .dataWidth {
        width: 100%;

        .el-input {
            width: 44%;
        }
    }

    .ListBox {
        width: 100%;
        border-top: 1px solid #DDDDDD;
        margin: 0;
        padding-top: 16px;

        li {
            float: left;
            width: 100%;
            // @include clearfix;
            margin-bottom: 20px;

            div {
                display: block;
                width: 33.33%;
                float: left;
                text-align: center;
            }
        }

        .font-color {
            color: #409eff;
            cursor: pointer;
        }
    }
</style>
<style>
    input[type=number] {
        -moz-appearance: textfield;
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .errorBox .el-input__inner {
        border: 1px solid red;
    }

    .addTimeBox .required .el-form-item__label:before {
        content: "*";
        font-size: 17px;
        position: relative;
        top: 2px;
        display: inline-block;
        color: #f00;
        margin-right: 3px;
    }
</style>
