<template>
    <div class="dic_import_wrap">
        <div class="header_btn_box">
            <el-button size="medium" @click.native="goBack">返回</el-button>
        </div>
        <div class="dic_import_box">
            <div class="import_explain_box">
                <div class="title">导入说明：</div>
                <div class="info_title">1.请先下载模板，严格根据模板的格式来录入数据；</div>
                <div class="info_title">2.在执行批量导入操作后，会跳转到结果页面。如有失败数据，可下载之后修改再次导入。</div>
            </div>
            <div class="template_file_box" v-show="!resultShow">
                <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false'
                           accept=".csv" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess"
                           :on-error="handleAvatarErr" name="dicfile">
                    <el-button type="primary" :loading="importLoading">选择导入文件</el-button>
                </el-upload>
                <a :href="downLoadTemplateUrl" target="_blank" download="导入模版下载">
                    <el-button type="text">模版下载</el-button>
                </a>
            </div>
            <div class="import_explain_box" v-show="resultShow">
                <div class="title">导入结果：</div>
                <div class="info_title">本次导入共计：{{resultInfo.totalCount}}</div>
                <div class="info_title">成功导入：{{resultInfo.totalCount - resultInfo.errorCount}}</div>
                <div class="info_title">导入失败：{{resultInfo.errorCount}}&nbsp;&nbsp;&nbsp;
                    <a :href="downloadErrorUrl" target="_blank" download="导入失败名单下载" v-if="!!resultInfo.errorCount">
                        <el-button type="text">下载失败名单</el-button>
                    </a>
                </div>
            </div>
            <div class="continue_btn" v-show="resultShow">
                <el-button type="primary" size="medium" @click.native="toShowImport">继续导入</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "schoolDictionaryImport",
        data() {
            return {
                importLoading: false,
                downloadErrorUrl: '',
                downLoadTemplateUrl: '',
                uploadPath: '',
                uploadData: {},
                resultShow: false,
                resultInfo: {
                    errorCount: 0,
                    errorMsgStr: '',
                    totalCount: 0
                }
            }
        },
        created() {
            this.downLoadTemplateUrl = global.BasePath + "structure/schoolDictionary/downLoadTemplate?token=" + this.$store.getters.token;
            this.uploadPath = global.BasePath + "structure/schoolDictionary/importSchoolDic";
            this.uploadData = {dictionaryCode: this.$route.query.dictionaryCode, token: this.$store.getters.token};
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            toShowImport() {
                this.resultShow = false;
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix !== "csv") {
                    this.$message.error("请上传模版文件!");
                } else {
                    this.importLoading = true;
                }
            },
            handleAvatarSuccess(res, file) {
                if (res.code === 200) {
                    this.downloadErrorUrl = global.BasePath + 'structure/schoolDictionary/downloadResultXls?errorMsgStr=' + res.data.errorMsgStr + '&token=' + this.$store.getters.token;
                    let self = this;
                    this.$message({
                        message: "模版导入完成！",
                        type: "success",
                        duration: 1000,
                        onClose: function () {
                            self.importLoading = false;
                        }
                    });
                    this.resultInfo = res.data;
                    this.resultShow = true;
                } else {
                    this.importLoading = false;
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            },
            handleAvatarErr(err, file, fileList) {
            },
        }
    }
</script>

<style lang="scss" scoped>
    .dic_import_wrap{
        .header_btn_box{
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .dic_import_box{
            .import_explain_box{
                padding: 20px;
                margin: 20px 0;
                border: 1px solid #eee;
                border-left: 5px solid #409eff;
                border-radius: 3px;
                .title{
                    font-size: 18px;
                    font-weight: 700;
                    height: 40px;
                    line-height: 40px;
                }
                .info_title{
                    line-height: 30px;
                }
            }
            .template_file_box{
                padding: 10px 20px;
                .upload-import{
                    display: inline-block;
                    margin-right: 10px;
                }
            }
            .continue_btn{
                padding: 20px;
            }
        }
    }
</style>
