<template>
  <span>
       <el-button type="primary" size="mini" @click="dialogImportTeacherVisible = true">导入</el-button>
        <el-dialog title="用户导入" :visible.sync="dialogImportTeacherVisible" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' @open="synDailogOpen">
            <div class="bs-callout bs-callout-danger" id="callout-glyphicons-dont-mix">
              <div class="title">说明：</div>
              <div class="info-title">1.请先下载模板，严格根据模板的格式来录入数据；</div>
              <div class="info-title">2.选择导入文件后，导入成功后，即可查看导入结果。</div>
            </div>
           <div class="sns-btn-div">
               <el-upload class="upload-import" :action="uploadPath" :data="uploadData" name="file"  :show-file-list='false'
                          accept=".xls" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess"
                          :on-error="handleAvatarErr">
               <el-button type="primary" :loading="importLoading">{{btnText}}</el-button>
               </el-upload>
               <a target="_blank" :href="downloadUrl" download="学生导入模版下载">
                <el-button type="text">模版下载</el-button>
               </a>
           </div>
           <div v-show="resultShow" class="bs-callout bs-callout-warning" id="callout-glyphicons-dont-mix2">
              <div class="title">导入结果：</div>
              <div class="info-title">本次共导入：{{totalUserCount}}人</div>
              <div class="info-title">成功导入：{{sucessUserCount}}人</div>
              <div class="info-title">导入失败：{{errorUserCount}}人
                 <a target="_blank" v-if="errorUserCount>0" :href="downloadErroUrl" download="下载失败名单">
                    <el-button type="text">下载失败名单</el-button>
                  </a>
              </div>
            </div>
        </el-dialog>
  </span>
</template>
<script>
    import {importSchedule, importResult} from "@/api/systemSet/org.js";

    export default {
        props: {
            goodTypeId: {
              type: Number,
              default: ""
            },
            departName: {
                type: String,
                default: ""
            },
            departId: {
                type: Number,
                default: ""
            }
        },
        data() {
            return {
                dialogImportTeacherVisible: false,
                wxDepartId: "",
                importLoading: false,
                errInfo: "",
                uploadPath: "",
                uploadData: {},
                errorUserCount: 0,
                totalUserCount: 0,
                sucessUserCount: 0,
                downloadUrl: '',
                downloadErroUrl: '',
                resultShow: false,
                btnText: '选择导入文件',
                topNum: 0
            };
        },
        watch: {
            departId(val) {
                if (val) {
                    this.uploadData = {departId: val, token: this.$store.getters.token};
                }
            }
        },
        created() {
            this.downloadUrl = 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/物品单模板.xls';
            this.uploadPath = global.BasePath + "structure/good/uploadGood";
            this.uploadData = {goodTypeId: this.goodTypeId, token:this.$store.getters.token};
        },
        methods: {
            synDailogOpen() {
                this.resultShow = false;
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "xls") {
                    this.$message.error("请上传模版文件!");
                } else {
                    this.importLoading = true;
                }
            },
            handleAvatarSuccess(res, file) {
                console.log(res)
                if (res.code === 200) {
                     this.$message.success("导入成功!");
                     this.$emit('handSuccess')
                    //  this.resultShow = true;
                     this.importLoading = false;
                     this.dialogImportTeacherVisible = false
                } else {
                    this.importLoading = false;
                    // this.resultShow = true;
                    this.$emit('handSuccess')
                    this.$message.warning(res.msg, '提示', {
                        dangerouslyUseHTMLString: true
                      });
                }
            },
            importSchedule(importFlag) {
                let self = this;
                importSchedule(importFlag).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let currCount = data.data.currCount ? data.data.currCount : 0;
                        if (parseInt(currCount) < this.totalUserCount) {
                            this.btnText = '导入中（' + currCount + '/' + this.totalUserCount + '）';
                            setTimeout(() => {
                                self.importSchedule(importFlag);
                            }, 1000);
                        } else {
                            this.btnText = '选择导入文件';
                            this.importResult(importFlag);
                        }
                    } else {
                        this.importLoading = false;
                    }
                }).catch(res => {
                    this.importLoading = false;
                });
            },
            importResult(importFlag) {
                let self = this;
                importResult(importFlag).then(res => {
                    let data = res.data;
                    this.topNum++;
                    if (data.code === 200 && data.data) {
                        this.errorUserCount = data.data.errorUserCount;
                        this.sucessUserCount = data.data.successUserCount;
                        this.downloadErroUrl = global.BaseNewPath + 'sys/user/import/common/downloadResultXls?importMarkId=' + data.data.importMarkId + '&token=' + this.$store.getters.token;
                        let _this = this;
                        this.$message({
                            message: "模版导入成功！",
                            type: "success",
                            duration: 1000,
                            onClose: function () {
                                _this.importLoading = false;
                                _this.resultShow = true;
                            }
                        });
                    } else if (data.code === 200) {
                        if (this.topNum < 30) {
                            setTimeout(() => {
                                self.importResult(importFlag);
                            }, 200);
                        }
                    } else {
                        this.importLoading = false;
                    }
                }).catch(res => {
                    this.importLoading = false;
                });
            },
            handleAvatarErr(err, file, fileList) {
                console.log(err)
            },
            closeImportDialog() {
                this.dialogImportTeacherVisible = false;
                this.resultShow = false;
                this.$emit('loadPageFormChild', '');
            }
        }
    };
</script>
<style scoped>
    .sns-btn-div {
        height: 80px;
        padding-left: 20px;
        padding-top: 20px;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
    }

    .bs-callout {
        padding: 20px;
        margin: 20px 0;
        border: 1px solid #eee;
        border-left-width: 5px;
        border-radius: 3px;
    }

    .bs-callout-danger {
        border-left-color: #ce4844;
    }

    .info-title {
        /* height:30px; */
        line-height: 30px;
    }

    .bs-callout-warning {
        border-left-color: #aa6708;
    }
</style>
<style scoped>
    .upload-import {
        display: inline-block;
    }
</style>
