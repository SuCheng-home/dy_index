<template>
  <div class="import_file_box">
    <el-button type="primary" size="medium" @click="dialogImportVisible = true">{{baseConf.btnName}}</el-button>
    <el-dialog :title="baseConf.title" :visible.sync="dialogImportVisible" :close-on-press-escape='false'
               :close-on-click-modal='false' :modal-append-to-body='false' @open="dialogOpen">
      <div class="bs-callout bs-callout-danger">
        <div class="title">说明：</div>
        <div class="info-title">1.请先下载模板，严格根据模板的格式来录入数据；</div>
        <div class="info-title">2.选择导入文件后，导入结束后点击确定，可查看导入结果。</div>
      </div>
      <div class="sns-btn-div">
        <div v-if="baseConf.templateUrl">
          <a target="_blank" :href="templatePath" download="导入模版下载">
            <el-button type="text">模版下载</el-button>
          </a>
        </div>
        <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :name="baseConf.name"
                   :show-file-list='false' accept=".xls" :before-upload="beforeAvatarUpload"
                   :on-success="handleAvatarSuccess" :on-error="handleAvatarErr" :disabled="importLoading">
          <el-button size="medium" :loading="importLoading">{{importLoading ? '导入中' : '选择导入文件'}}</el-button>
        </el-upload>
      </div>

      <div v-show="resultShow" class="bs-callout bs-callout-warning">
        <div class="title">导入结果：</div>
        <div class="info-title">本次共导入：{{totalCount}}</div>
        <div class="info-title">成功导入：{{successUserCount}}</div>
        <div class="info-title">导入失败：{{errorCount}}
          <el-button type="text" v-if="errorCount > 0 && baseConf.errUrl" @click="downErr">下载失败名单</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeImportDialog" :loading="importLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      config: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        dialogImportVisible: false,
        importLoading: false,
        baseConf: {},
        initConf: {
          title: '导入',
          btnName: '导入',
          templateUrl: '',
          templateArgs: {},
          uploadUrl: '',
          uploadArgs: {},
          errUrl: '',
          lingjie:0,
          name:'guideManagerFile'
        },
        templatePath: '',
        uploadPath: '',
        uploadData: {},

        resultShow: false,
        errorCount: 0,
        totalCount: 0,
        successUserCount: 0,
        errorMsgStr: ''
      };
    },
    watch: {
      config: {
        handler() {
          this.baseConf = {...this.initConf, ...this.config};
          if(this.baseConf.lingjie){
            this.templatePath = this.baseConf.templateUrl
          }else{
            this.templatePath = global.BasePath + this.baseConf.templateUrl + "?token=" + this.$store.getters.token;
            for(let i in this.baseConf.templateArgs){
              this.templatePath+= `&${i}=${this.baseConf.templateArgs[i]}`;
            }
          }      
          this.uploadPath = global.BasePath + this.baseConf.uploadUrl;
          this.uploadData = {...this.baseConf.uploadArgs, token: this.$store.getters.token};
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      dialogOpen() {
        this.resultShow = false;
      },
      beforeAvatarUpload(file) {
        let suffix = file.name.split(".")[file.name.split(".").length - 1];
        if (suffix !== "xls") {
          this.$message.error("请上传模版文件!");
        } else {
          this.importLoading = true;
          this.resultShow = false;
        }
      },
      handleAvatarSuccess(res, file) {
        if (res.code === 200 && res.data) {
          this.$emit('success');
          this.resultShow = true;
          this.errorCount = res.data.errorCount;
          this.totalCount = res.data.totalCount;
          this.successUserCount = res.data.totalCount - res.data.errorCount;
          this.errorMsgStr = res.data.errorMsgStr;
          this.importLoading = false;
        } else {
          this.importLoading = false;
          this.$alert(res.msg, '提示', {
            dangerouslyUseHTMLString: true
          });
        }
      },
      downErr() {
        let url = `${global.BasePath}${this.baseConf.errUrl}`;
        let params = {
          token: this.$store.getters.token,
          errorInfoStr: this.errorMsgStr,
        };
        if(this.baseConf.uploadArgs.watchType){
           params.watchType=this.baseConf.uploadArgs.watchType
        }
        let form = document.createElement("form");
        form.style.display = "none";
        form.action = url;
        form.method = "post";
        document.body.appendChild(form);
        // 动态创建input并给value赋值
        for (let key in params) {
          let input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = params[key];
          form.appendChild(input);
        }
        form.submit();
        form.remove();
      },
      handleAvatarErr(err, file, fileList) {
      },
      closeImportDialog() {
        this.dialogImportVisible = false;
        this.resultShow = false;
        this.$emit('confirm', '');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .import_file_box{
    display: inline-block;
    .title {
      font-size: 18px;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
    }

    .bs-callout {
      padding: 20px;
      /*margin-bottom: 20px;*/
      border: 1px solid #eee;
      border-left-width: 5px;
      border-radius: 3px;
    }

    .bs-callout-danger {
      margin-bottom: 10px;
      border-left-color: #ce4844;
    }

    .info-title {
      line-height: 30px;
    }

    .bs-callout-warning {
      margin-top: 15px;
      border-left-color: #aa6708;
    }
  }
</style>
