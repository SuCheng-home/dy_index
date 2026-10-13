<template>
  <div class="mental-education-publicity-form">
    <el-col :span="24">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="save">保存</el-button>
      <el-button type="primary" size="medium" v-if="showRelease" @click="release">发布</el-button>
    </el-col>

    <div class="form-wrapper" :style="{ width: '100%', height: nobottommaxH + 'px' }">
      <el-form label-width="150px" ref="form" :model="form" :rules="rules">
        <el-form-item label="主题" prop="title">
          <el-input placeholder="1-30个字符" maxlength="30" show-word-limit v-model.trim="form.title"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="logoUrl">
          <uploader pathPrefix="publicity" showMode="cover" showResult="image" :multiple="false" :showModeCover="true"
            :extList="logoExtList" v-model="form.logoUrl"></uploader>
        </el-form-item>

        <el-form-item label="附件">
          <uploader pathPrefix="publicity" :multiple="true" :extList="allFileTypeList" v-model="form.fileList">
          </uploader>
        </el-form-item>
        <el-form-item label="内容" prop="noticeContent">
          <br />
          <ueditor class="rich-editor" style="width: 750px; position: relative; right: 88px" ref="ueditor"
            :defaultMes="form.noticeContent" @editModel="richTextEditHandler"></ueditor>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
/* utils */
import mixin from "@/mixins/windowResize";

/* components */
import Uploader from "@/components/Uploader/WebUploader";
import Ueditor from "@/components/Ueditor";
import ChoseCover from "@/components/ChoseCover";

/* api */
import { getHeartEduNoticeById } from "@/api/homeSchool/mentalEducation/popularization/detail";
import {
  addHeartEduNotice,
  updateHeartEduNotice,
} from "@/api/homeSchool/mentalEducation/popularization/form";

export default {
  mixins: [mixin],
  components: { Uploader, Ueditor, ChoseCover },
  computed: {},
  data() {
    return {
      // 新增 / 编辑
      type: "add",
      // 保存成功后提示语
      messsage: "保存成功",
      // 发布按钮是否显示
      showRelease: true,
      // 封面可上传类型
      logoExtList: ["jpeg", "jpg", "bmp", "png"],
      // 附件可上传类型
      allFileTypeList: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "png", "jpg", "jpeg", "bmp"],
      // 请求表单
      form: {
        // 通知id
        noticeId: "",
        // 状态 1(未发布) | 2(已发布)
        state: 1,
        // 主题
        title: "",
        // 封面
        logoUrl: [
          {
            fileUrl:
              "https://cdnfile-10043692.file.myqcloud.com/admin/images/mentalDducation/xinyukepu.png",
          },
        ],
        /* 上传文件列表
            {
                fileName: '',
                fileUrl: '',
                id: ''
            }
        */
        fileList: [],
        // 富文本编辑器内容
        noticeContent: "",
      },
      rules: {
        title: [{ required: true, message: "主题不能为空", trigger: "blur" }],
        logoUrl: [
          { required: true, message: "封面不能为空", trigger: "change" },
        ],
        noticeContent: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    let noticeId = this.$route.query.noticeId;
    if (noticeId) {
      this.type = "edit";
      this.form.noticeId = noticeId;
      this.getHeartEduNoticeById();
    } else this.type = "add";
  },
  methods: {
    richTextEditHandler(content) {
      this.form.noticeContent = content;
    },
    // 根据id查询科普通知
    getHeartEduNoticeById() {
      getHeartEduNoticeById({
        noticeId: this.form.noticeId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.form.state = data.state;
          this.form.title = data.title;
          this.form.logoUrl[0].fileUrl = data.logoUrl || "https://cdnfile-10043692.file.myqcloud.com/admin/images/mentalDducation/xinyukepu.png";
          this.form.fileList = data.fileJson ? JSON.parse(data.fileJson) : [];
          this.form.noticeContent = data.content;
          this.$refs.ueditor.setContent(data.content);
          if (this.form.state == 2) this.showRelease = false;
          else this.showRelease = true;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 保存
    save() {
      if (this.form.state == 2) this.form.state = 0;
      this.messsage = "保存成功";
      this.submitForm();
    },
    // 发布
    release() {
      this.form.state = 2;
      this.messsage = "发布成功";
      this.submitForm();
    },
    // 提交
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            state: this.form.state,
            title: this.form.title,
            logoUrl: this.form.logoUrl[0].fileUrl,
            fileJson: JSON.stringify(this.form.fileList),
            content: this.$refs.ueditor.getContent(),
          };
          if (this.type == "add") {
            this.addHeartEduNotice(form);
          } else {
            form.id = this.form.noticeId;
            this.updateHeartEduNotice(form);
          }
        } else {
          return false;
        }
      });
    },
    // 新增心育科普通知
    addHeartEduNotice(form) {
      addHeartEduNotice(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: this.messsage,
            type: "success",
          });
          this.$router.back();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改心育科普通知
    updateHeartEduNotice(form) {
      updateHeartEduNotice(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: this.messsage,
            type: "success",
          });
          this.$router.back();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-publicity-form {
  padding: 12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .form-wrapper {
    overflow-y: auto;
  }

  .el-form {
    width: 810px;
    margin: 0 auto;

    /deep/ .upload-file-item {
      width: 200px !important;

      img {
        width: 100% !important;
        min-height: 110px;
        margin: 0;
        border: 1px dashed #409eff;
        box-sizing: border-box;
        margin: 0 !important;
      }

      .file-name {
        display: none;
      }
    }
  }
}
</style>