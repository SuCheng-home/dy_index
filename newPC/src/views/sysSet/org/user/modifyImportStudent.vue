<template>
  <span>
       <el-button type="primary" size="mini"   @click="dialogImportTeacherVisible = true">覆盖导入学生</el-button>
        <el-dialog title="覆盖导入学生" :visible.sync="dialogImportTeacherVisible" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' @open="synDailogOpen">
            <div class="bs-callout bs-callout-danger" id="callout-glyphicons-dont-mix">
              <div class="title">学生覆盖导入说明：</div>
              <div class="info-title">1.请先下载模板，严格根据模板的格式来录入数据；</div>
              <div class="info-title">2.原学号和原姓名必填一个（作为唯一匹配项），存在则以表格为准修改信息；</div>
              <div class="info-title">3.导入操作后，会跳转到结果页面。如有失败用户，可下载之后修改再次导入。</div>
            </div>
           <div class="sns-btn-div">
              <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false' accept=".csv" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :on-error="handleAvatarErr">
               <el-button type="primary" :loading="importLoading" >{{btnText}}</el-button>
              </el-upload>
               <a :href="downloadUrl" target= "_blank" download="覆盖导入学生模版">
                <el-button type="text">模版下载</el-button>
               </a>
           </div>
           <div v-show="resultShow" class="bs-callout bs-callout-warning" id="callout-glyphicons-dont-mix2">
              <div class="title">导入结果：</div>
              <div class="info-title">本次共导入：{{totalUserCount}}人</div>
              <div class="info-title">成功导入：{{sucessUserCount}}人</div>
              <div class="info-title">导入失败：{{errorUserCount}}人
                 <a v-if="errorUserCount>0" target= "_blank" :href="downloadErroUrl" download="下载失败名单">
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
import { importSchedulefun, downloadResultXls } from "@/api/systemSet/org.js";
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
      importLoading: false,
      errInfo: "",
      uploadPath: "",
      uploadData: {},
      errorUserCount:0,
      totalUserCount:0,
      sucessUserCount:0,
      downloadUrl:'',
      downloadErroUrl:'',
      resultShow:false,
        btnText: '选择导入文件',
        topNum: 0
    };
  },
  created() {
    this.downloadUrl =global.BaseNewPath +"sys/user/import/common/downLoadTemplate?departType=10&token=" +this.$store.getters.token;
    this.uploadPath = global.BaseNewPath + "sys/user/import/student/modify/upload";
    this.uploadData = { departId: this.departId,token: this.$store.getters.token };
  },
  methods: {
    synDailogOpen(){
      this.resultShow=false;
    },
    beforeAvatarUpload(file) {
      let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix != "csv") {
        this.$message.error("请上传模版文件!");
      } else {
         this.importLoading = true;
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
          this.totalUserCount = res.data.totalCount;
          this.topNum = 0;
          this.importSchedulefun(res.data.importMarkId);
      }else{
         this.importLoading = false;
         this.$alert(res.msg, '提示', {
          confirmButtonText: '确定'
        });
      }
    },
      importSchedulefun(importMarkId) {
        let self = this;
          importSchedulefun(importMarkId).then(res => {
              let data = res.data;
              if (data.code === 200) {
                  let currCount = data.data.currCount ? data.data.currCount : 0;
                  if (!data.data.allHandled) {
                      this.btnText = '导入中（' + currCount + '/' + this.totalUserCount + '）';
                      setTimeout(() => {
                          self.importSchedulefun(importMarkId);
                      }, 2000);
                  } else {
                      this.btnText = '选择导入文件';
                      this.errorUserCount = data.data.failCount;
                      this.sucessUserCount = data.data.succeedCount;
                      this.downloadResultXls(importMarkId);
                       this.importLoading = false;
                       this.resultShow=true;
                  }
              } else {
                  this.importLoading = false;
              }
          }).catch(res => {
              this.importLoading = false;
          });
      },
      downloadResultXls(importMarkId) {
          this.downloadErroUrl=global.BaseNewPath +'sys/user/import/common/downloadResultXls?importMarkId='+importMarkId+'&token=' +this.$store.getters.token;
          // let self = this;
          // downloadResultXls(importMarkId).then(res => {
          //     let data = res.data;
          //     this.topNum++;
          //     if (data.code === 200 && data.data) {
          //         this.errorUserCount=data.data.errorUserCount;
          //         this.sucessUserCount=data.data.successUserCount;
          //         this.downloadErroUrl=global.BaseNewPath +'sys/user/import/common/downloadResultXls?importMarkId='+data.data.importMarkId+'&token=' +this.$store.getters.token;
          //         let _this=this;
          //         this.$message({
          //             message: "模版导入成功！",
          //             type: "success",
          //             duration:1000,
          //             onClose: function() {
          //                 _this.importLoading = false;
          //                 _this.resultShow=true;
          //             }
          //         });
          //     } else if (data.code === 200) {
          //         if (this.topNum < 6) {
          //             setTimeout(() => {
          //                 self.downloadResultXls(importMarkId);
          //             }, 500);
          //         }
          //     } else {
          //         this.importLoading = false;
          //     }
          // }).catch(res => {
          //     this.importLoading = false;
          // });
      },
    handleAvatarErr(err, file, fileList) {
    },
    closeImportDialog(){
      this.dialogImportTeacherVisible=false;
      this.resultShow=false;
      this.$emit('loadPageFormChild','');
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
  height:30px;
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
.info-title{
  /* height:30px; */
  line-height:30px;
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
