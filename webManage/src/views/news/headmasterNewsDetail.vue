<template>
  <div class="columndetail-wrap" v-show="loaded">
    <el-row class="menu-row">
      <el-col :span="20">
        <div>
          <el-button size="small" class="filter-item" @click="goBack()">返回</el-button>
          <el-button
            size="small"
            class="filter-item"
            type="primary"
            :loading="btnLoading"
            v-if="status == 1 || editing"
            @click="submitForm"
          >保存</el-button>
          <el-button
            size="small"
            class="filter-item"
            type="primary"
            v-if="status == 2"
            @click="handleStatus3"
          >公开</el-button>
          <el-button
            size="small"
            class="filter-item"
            type="primary"
            v-if="status == 3"
            @click="handleStatus2"
          >撤回</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-form ref="form" class="column-ruleForm custom—scrollbar" :model="form" :rules="rules">
        <img
          class="icon-status"
          src="https://cdnfile-10043692.file.myqcloud.com/webManage/news/headmasterNewsList/icon-status.png"
          v-if="status == 3"
        />
        <div class="g-top-title">
          <h2>{{title}}</h2>
        </div>
        <div class="info-wrapper">
          <span class="contact">{{email || "--"}}</span>
          <span class="time">{{createTime|filterTime}}</span>
        </div>
        <div class="ueditor-wrapper">
          <image-previewer tag="richtext">
            <div class="columnedit-content" v-html="content"></div>
          </image-previewer>
        </div>
        <div class="form-bottom">
          <div class="detail-title">
            <span>答复内容</span>
            <img
              src="https://cdnfile-10043692.file.myqcloud.com/webManage/news/headmasterNewsList/icon-edit.png"
              v-if="status != 1 && !editing"
              @click="editing = true"
            />
          </div>
          <div class="form-content" v-if="status == 1 || editing">
            <el-form-item prop="replyContent">
              <el-input
                placeholder="1-500个字符"
                type="textarea"
                maxlength="500"
                show-word-limit
                :rows="5"
                v-model="form.replyContent"
              ></el-input>
            </el-form-item>
            <el-form-item label="落款" label-width="60px" prop="inscribe">
              <el-input
                placeholder="1-20个字符"
                maxlength="20"
                show-word-limit
                v-model.trim="form.inscribe"
              ></el-input>
            </el-form-item>
          </div>
          <div class="detail-content" v-else>
            <div class="detail-value">
              <pre v-html="form.replyContent || '--'"></pre>
            </div>
            <div class="detail-value inscribe">{{form.inscribe}}</div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {
  getSchoolWebLetterBoxById,
  updateSchoolWebLetterBox,
} from "@/api/news/headmasterNewsList/detail";
export default {
  mixins: [mixins],
  components: {
    ImagePreviewer,
  },
  computed: {
    ...mapGetters(["webId", "permission"]),
  },
  filters: {
    filterTime(dateTime) {
      return dateTime == undefined ? "" : dateTime.split(".")[0];
    },
  },
  watch: {
    $route(to, from) {
      if (to.query) {
        this.messageId = to.query.messageId;
        this.getSchoolWebLetterBoxById();
      }
    },
  },
  created() {
    this.getSchoolWebLetterBoxById();
  },
  data() {
    return {
      // 数据加载完成
      loaded: false,
      // 保存按钮 loading
      btnLoading: false,
      // 编辑状态
      editing: false,
      // 消息id
      id: this.$route.query.id,
      // 标题
      title: "",
      // 联系方式
      email: "",
      // 创建时间
      createTime: "",
      // 内容
      content: "",
      // 状态 1(未回复) | 2(已回复) | 3(已公开)
      status: 1,
      // 请求表单
      form: {
        // 回复内容
        replyContent: "",
        // 落款
        inscribe: "",
      },
      // 校验规则
      rules: {
        replyContent: [
          { required: true, message: "请输入答复内容", trigger: "blur" },
        ],
        inscribe: [{ required: true, message: "请输入落款", trigger: "blur" }],
      },
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "headmasterNewsList",
      });
    },
    // 根据消息id查询校长信箱
    getSchoolWebLetterBoxById() {
      getSchoolWebLetterBoxById({
        messageId: this.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.loaded = true;
          this.title = data.title;
          this.email = data.email;
          this.createTime = data.createTime;
          this.content = data.content;
          this.status = data.status;
          this.form.replyContent = data.replyContent || "";
          this.form.inscribe = data.inscribe;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改校长信箱
    updateSchoolWebLetterBox(form) {
      updateSchoolWebLetterBox(form)
        .then((res) => {
          this.btnLoading = false;
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.editing = false;
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.getSchoolWebLetterBoxById();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 提交
    submitForm() {
      this.form.replyContent = this.form.replyContent.trim();
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = {
            id: this.id,
            inscribe: this.form.inscribe,
            replyContent: this.form.replyContent,
            status: this.status == 3 ? 3 : 2,
            webId: this.webId,
          };
          this.btnLoading = true;
          this.updateSchoolWebLetterBox(form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击公开按钮
    handleStatus3() {
      this.$confirm("确认公开吗？", "提示", { type: "warning" })
        .then(() => {
          this.updateSchoolWebLetterBox({
            id: this.id,
            status: 3,
            webId: this.webId,
          });
        })
        .catch(() => {});
    },
    // 点击撤回按钮
    handleStatus2() {
      this.$confirm("确认撤回吗？", "提示", { type: "warning" })
        .then(() => {
          this.updateSchoolWebLetterBox({
            id: this.id,
            status: 2,
            webId: this.webId,
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.columndetail-wrap {
  .menu-row {
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom: 15px;
    padding-top: 15px;
  }
  .menu-row .el-button:first-child {
    margin-left: 15px;
  }
  .org-main {
    width: 100%;
    padding-bottom: 30px;
    box-sizing: border-box;
  }
  .column-ruleForm {
    width: 80%;
    padding-top: 22px;
    margin: 0 auto;
    .logo {
      float: left;
      display: block;
      height: 100px;
      max-width: 550px;
      margin-right: 30px;
    }
    .logo_update {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #c4c4c4;
      color: #1f2d3d;
      margin: 0;
      padding: 10px 15px;
      border-radius: 4px;
    }
  }
  .selectWidth {
    width: 100%;
  }
  .ueditor-wrapper {
    width: 100%;
  }
}
</style>
<style>
.column-ruleForm .el-form-item__label {
  font-weight: bold;
  color: #666;
  line-height: 40px;
  font-size: 14px;
  position: relative;
  padding-right: 20px;
}
.column-ruleForm .required .el-form-item__label:before {
  content: "*";
  font-size: 17px;
  position: relative;
  top: 2px;
  display: inline-block;
  color: #f00;
  margin-right: 3px;
}
.columndetail-wrap .el-dialog {
  top: 50px;
}
/* .columndetail-wrap .ueditor-wrapper{
  width:740px !important;
} */
</style>
<style lang="scss" scoped>
.columndetail-wrap {
  .el-form {
    position: relative;
    .icon-status {
      position: absolute;
      top: 50px;
      right: 0;
      z-index: 100;
    }
    .info-wrapper {
      width: 50%;
      line-height: 36px;
      margin: 0px auto 10px;
      color: #888;
      font-size: 14px;
      overflow: hidden;
      .time {
        float: right;
      }
    }
    .form-bottom {
      padding: 0 30px;
      margin-top: 100px;
      .detail-title {
        margin: 22px 0 14px;
        border-left: 4px solid #409eff;
        padding-left: 12px;
        height: 16px;
        line-height: 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        span {
          margin-right: 20px;
        }
        img {
          cursor: pointer;
        }
      }
      .detail-value {
        line-height: 38px;
        background-color: #f7fbfd;
        padding: 15px 30px;
        color: #777;
        box-sizing: border-box;
        &.inscribe {
          text-align: right;
        }
      }
    }
  }
  pre {
    margin: 0;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
      Microsoft YaHei, Arial, sans-serif;
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
}
</style>

