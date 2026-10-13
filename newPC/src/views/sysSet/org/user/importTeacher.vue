<template>
  <span>
       <el-button type="primary" size="mini" @click="dialogImportTeacherVisible = true">导入</el-button>
        <el-dialog title="用户导入" :visible.sync="dialogImportTeacherVisible" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' @open="synDailogOpen">
            <!-- <div class="info">
                <div class="title">说明：</div>

            </div> -->
            <div class="bs-callout bs-callout-danger">
              <div class="title">导入说明：</div>
              <div class="info-title">1.请先下载模板，严格根据模板的格式来录入数据；</div>
              <div class="info-title">2.在执行批量导入操作后，会跳转到结果页面。如有失败用户，可下载之后修改再次导入。</div>
            </div>
           <div class="sns-btn-div">
               <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false'
                          accept=".csv" :before-upload="file => beforeAvatarUpload(file, 1)" :on-success="newhandleAvatarSuccess"
                          :on-error="handleAvatarErr">
                   <el-button type="primary" :loading="importAvatarLoading">{{btnText}}</el-button>
               </el-upload>
               <a :href="downloadUrl" target="_blank" download="老师导入模版下载">
                <el-button type="text">模版下载</el-button>
               </a>
           </div>
           <div v-show="resultShow" class="bs-callout bs-callout-warning" id="callout-glyphicons-dont-mix">
              <div class="title">导入结果：</div>
              <div class="info-title">本次共导入：{{totalUserCount}}人</div>
              <div class="info-title">成功导入：{{successUserCount}}人</div>
              <div class="info-title">导入失败：{{errorUserCount}}人
                 <a v-if="errorUserCount>0" target="_blank" :href="downloadErrorUrl" download="下载失败名单">
                    <el-button type="text">下载失败名单</el-button>
                  </a>
              </div>
            </div>

            <div class="bs-callout bs-callout-danger">
              <div class="title">修改说明：</div>
              <div class="info-title">1.请先下载模板，严格根据模板的格式来录入数据；</div>
              <div class="info-title">2.姓名与手机号至少填写一个，用来标识唯一用户；</div>
              <!-- <div class="info-title">3.身份证、用户名、部门至少填写一个，将以表格信息为准修改标识匹配到的用户信息；</div>
              <div class="info-title">4.新部门（非必填，多个以英文逗号分隔，填写部门名称或编码）。</div> -->
            </div>
            <div class="sns-btn-div">
              <el-upload class="upload-import" :action="uploadUpdatePath" :data="uploadUpdateData"
                         :show-file-list='false' accept=".csv" :before-upload="beforeAvatarUpload"
                         :on-success="handleAvatarSuccess" :on-error="handleAvatarErr">
               <el-button type="primary" :loading="importLoading">{{newbtnText}}</el-button>
              </el-upload>
               <a :href="downloadUpdateUrl" target="_blank" download="老师导入模版下载">
                <el-button type="text">模版下载</el-button>
               </a>
           </div>
            <div v-show="updateResultShow" class="bs-callout bs-callout-warning">
              <div class="title">导入结果：</div>
              <div class="info-title">本次共导入：{{updateTotalUserCount}}人</div>
              <div class="info-title">成功导入：{{updateSuccessUserCount}}人</div>
              <div class="info-title">导入失败：{{updateErrorUserCount}}人
                 <a v-if="updateErrorUserCount>0" target="_blank" :href="downloadUpdateErrorUrl" download="下载失败名单">
                    <el-button type="text">下载失败名单</el-button>
                  </a>
              </div>
            </div>

           <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeImportDialog">确 定</el-button>
          </span>
        </el-dialog>
  </span>
</template>
<script>
    import {queryDepartById, syncDepartAndUser, importSchedulefun, downloadResultXls} from "@/api/systemSet/org.js";

    export default {
        props: {
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
                importAvatarLoading: false,
                errInfo: "",
                downloadUrl: '',
                uploadPath: "",
                uploadData: {},
                downloadErrorUrl: '',
                errorUserCount: 0,
                totalUserCount: 0,
                successUserCount: 0,
                resultShow: false,
                downloadUpdateUrl: '',
                uploadUpdatePath: '',
                uploadUpdateData: {},
                downloadUpdateErrorUrl: '',
                updateErrorUserCount: 0,
                updateTotalUserCount: 0,
                updateSuccessUserCount: 0,
                updateResultShow: false,
                btnText: '选择导入文件',
                newbtnText: '选择导入文件',
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
            this.downloadUrl = global.BaseNewPath + "sys/user/import/common/downLoadTemplate?departType=1&token=" + this.$store.getters.token;
            this.uploadPath = global.BaseNewPath + "sys/user/import/teacher/upload";
            this.uploadData = {departId: this.departId, token: this.$store.getters.token};

            this.downloadUpdateUrl = global.BaseNewPath + "sys/user/import/common/downLoadTemplate?departType=12&token=" + this.$store.getters.token;
            this.uploadUpdatePath = global.BaseNewPath + "sys/user/import/teacher/updateUser";
            this.uploadUpdateData = {token: this.$store.getters.token};
        },
        methods: {
            synDailogOpen() {
                queryDepartById(this.departId)
                    .then(res => {
                        this.wxDepartId = res.data.data.wxDepartId;
                    })
                    .catch();
                this.resultShow = false;
            },
            beforeAvatarUpload(file, flag) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "csv") {
                    this.$message.error("请上传模版文件!");
                } else {
                  if (flag) {
                    this.importAvatarLoading = true;
                  } else {
                    this.importLoading = true;
                  }
                }
            },
            handleAvatarSuccess(res) {
              if (res.code === 200) {
                  this.totalUserCount = res.data.totalCount;
                  this.topNum = 0;
                  this.handleAvatarSchedule(res.data.importMarkId,1);
              } else {
                  this.importAvatarLoading = false;
                  this.$alert(res.msg, '提示', {
                      confirmButtonText: '确定'
                  });
              }
            },
            newhandleAvatarSuccess(res) {
              if (res.code === 200) {
                  this.totalUserCount = res.data.totalCount;
                  this.topNum = 0;
                  this.handleAvatarSchedule(res.data.importMarkId,2);
              } else {
                  this.importAvatarLoading = false;
                  this.$alert(res.msg, '提示', {
                      confirmButtonText: '确定'
                  });
              }
            },
            handleAvatarSchedule(importMarkId,num) {
              let self = this;
              importSchedulefun(importMarkId).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let currCount = data.data.currCount ? data.data.currCount : 0;
                        if (!data.data.allHandled) {
                            if(num==2){
                               this.btnText = '导入中（' + currCount + '/' + this.totalUserCount + '）';
                            }else{
                               this.newbtnText = '导入中（' + currCount + '/' + this.totalUserCount + '）';
                            }
                           
                            setTimeout(() => {
                                self.handleAvatarSchedule(importMarkId);
                            }, 2000);
                        } else {
                            this.btnText = '选择导入文件';
                            this.newbtnText = '选择导入文件';                            
                            this.errorUserCount = data.data.failCount;
                            this.successUserCount = data.data.succeedCount;
                            this.handleAvatarResult(importMarkId);
                             this.importLoading = false;
                             this.importAvatarLoading = false;
                             this.resultShow=true;
                        }
                    } else {
                        this.importAvatarLoading = false;
                    }
                }).catch(res => {
                    this.importAvatarLoading = false;
                });
            },
            handleAvatarResult(importMarkId) {
                 this.downloadErrorUrl = global.BaseNewPath + 'sys/user/import/common/downloadResultXls?importMarkId=' + importMarkId + '&token=' + this.$store.getters.token;
                        this.downloadUpdateErrorUrl = global.BaseNewPath + 'sys/user/import/common/downloadResultXls?importMarkId=' +importMarkId+ '&token=' + this.$store.getters.token;
                // downloadResultXls(importMarkId).then(({data}) => {
                //     this.topNum++;
                //     if (data.code == 200) {
                //         this.errorUserCount = data.data.errorUserCount;
                //         this.successUserCount = data.data.successUserCount;
                       
                //         let _this = this;
                //         this.$message({
                //             message: "模版导入成功！",
                //             type: "success",
                //             duration: 1000,
                //             onClose: function () {
                //                 _this.importAvatarLoading = false;
                //                 _this.resultShow = true;
                //             }
                //         });
                //     } else {
                //         this.importAvatarLoading = false;
                //     }
                // }).catch(res => {
                //     this.importAvatarLoading = false;
                // });
            },
            handleAvatarUpdateSuccess(res, file) {
                if (res.code == 200) {
                    this.updateErrorUserCount = res.data.errorUserCount;
                    this.updateTotalUserCount = res.data.totalUserCount;
                    this.updateSuccessUserCount = this.updateTotalUserCount - this.updateErrorUserCount;
                    this.downloadUpdateErrorUrl = global.BaseNewPath + 'sys/user/import/common/downloadResultXls?importMarkId=' + res.data.importMarkId + '&token=' + this.$store.getters.token;
                    let _this = this;
                    this.$message({
                        message: "模版导入成功！",
                        type: "success",
                        duration: 1000,
                        onClose: function () {
                            _this.importLoading = false;
                            _this.updateResultShow = true;
                        }
                    });
                } else {
                    this.importLoading = false;
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            },
            handleAvatarErr(err, file, fileList) {
            },
            closeImportDialog() {
                this.dialogImportTeacherVisible = false;
                this.resultShow = false;
                this.updateResultShow = false;
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
