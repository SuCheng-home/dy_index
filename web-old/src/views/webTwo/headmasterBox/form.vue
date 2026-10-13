<template>
  <div class="search-container">
    <div class="search-wrap">
      <div class="search-content">
        <div class="menu-tools">
          <el-button @click="$router.go(-1)" size="medium">返回</el-button>
        </div>
        <div class="search-main">
          <div class="title">校长信箱</div>
          <div class="mainBox">
            <el-form
              :model="ruleForm"
              ref="addServiceForm"
              label-width="120px"
              class="column-ruleForm custom—scrollbar"
            >
              <el-form-item label="标题" class="required">
                <el-input v-model.trim="ruleForm.title" :maxlength="8" placeholder="标题(1-8个字符)"></el-input>
              </el-form-item>
              <el-form-item label="内容" class="required">
                <ueditor
                  class="rich-editor"
                  ref="ueditor"
                  :defaultMes="ruleForm.content"
                  @editModel="richTextEditHandler"
                ></ueditor>
              </el-form-item>
              <el-form-item label="联系方式" class="required">
                <el-input v-model.trim="ruleForm.email" placeholder="请输入联系电话或邮箱地址"></el-input>
              </el-form-item>
              <el-form-item label=" ">
                <a class="submit-btn" href="javascript:;" @click="submitBtn">提交</a>
              </el-form-item>
            </el-form>
          </div>
          <!---->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Ueditor from "@/components/Ueditor";
import {
  getSchoolWebSearch,
  getSchoolWebModuleMessageById,
  addSchoolWebLetterBox,
} from "@/api/webTwo/headmasterBox/form";
export default {
  components: {
    Ueditor,
  },
  data() {
    return {
      detailContentOne: "",
      query: "",
      ruleForm: {
        title: "",
        content: "",
        email: "",
      },
    };
  },
  created() {},
  mounted() {
    this.query = this.$route.query;
    if (this.query.id && this.query.onlyDetail) {
      this.getSchoolWebModuleMessageByIdOneFunc(this.query.id);
    }
  },
  computed: {
    ...mapGetters(["id"]),
  },
  methods: {
    submitBtn() {
      let flag = true;
      if (this.ruleForm.title === "") {
        this.$message({
          message: "标题不能为空!",
          type: "error",
        });
        return false;
      }
      var content = this.$refs.ueditor.getContent();
      if (content.replace(/^(\s|\u00A0)+/, "").length == 0) {
        this.$message({
          message: "内容不能为空!",
          type: "error",
        });
        return false;
      }
      if (this.ruleForm.email === "") {
        this.$message({
          message: "联系方式不能为空!",
          type: "error",
        });
        return false;
      }
      var emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      var phoneReg = /^0?1[3456789][0-9]\d{8}$/;
      if (
        !emailReg.test(this.ruleForm.email) &&
        !phoneReg.test(this.ruleForm.email)
      ) {
        this.$message({
          message: "联系方式格式不正确!",
          type: "error",
        });
        return false;
      }
      this.ruleForm.content = this.$refs.ueditor.getContent();
      if (flag) {
        addSchoolWebLetterBox({
          webId: this.id,
          title: this.ruleForm.title,
          content: this.ruleForm.content,
          email: this.ruleForm.email,
          contactType: emailReg.test(this.ruleForm.email) ? 1 : 2,
        })
          .then((res) => res.data)
          .then((data) => {
            if (data.code === 200) {
              this.$message({
                type: "success",
                message: "留言添加成功!",
              });
              this.$router.replace({
                  path: '/webTwo/main/headmaster/index'
              });
            }
          });
      }
    },
    richTextEditHandler(content) {
      this.ruleForm.content = content;
    },
    getSchoolWebModuleMessageByIdOneFunc(id) {
      getSchoolWebModuleMessageById({
        messageId: id,
      }).then((res) => {
        //console.log("wss",res.data.data);
        this.detailContentOne = res.data.data.content;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.search-container {
  width: 100%;
  min-width: 1200px;
  min-height: 313px;
  padding: 16px 0 18px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #ececec;
  .search-wrap {
    width: 1200px;
    min-height: 313px;
    height: auto;
    margin: 0 auto;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    .search-content {
      width: 100%;
      padding: 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
.search-box {
  width: 80%;
  margin: 0 auto;
  border: 1px solid #529d9d;
  height: 36px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  .search-input {
    float: left;
    width: 88%;
    background: none;
    border: 0;
    padding: 0 15px;
    height: 34px;
    box-sizing: border-box;
    outline: none;
    color: #148d7f;
  }
  .search-input::-webkit-input-placeholder {
    color: #148d7f;
  }
  .search-icon {
    float: right;
    width: 95px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    background: #529d9d;
    cursor: pointer;
    i {
      font-size: 20px;
      color: #fff;
    }
  }
}
.search-main {
  width: 100%;
  padding: 10px;
  height: auto;
  min-height: 469px;
  padding-bottom: 66px;
  position: relative;
  box-sizing: border-box;
  .title {
    width: 100%;
    text-align: center;
    font-size: 24px;
    color: #333;
  }
  .mainBox {
    width: 80%;
    padding-top: 30px;
    margin: 0 auto;
    .ueditor-wrapper {
      width: 100%;
      padding-left: 16px;
      box-sizing: border-box;
      .rich-editor {
        width: 100%;
        position: relative;
        z-index: 1;
      }
    }
  }

  .submit-btn {
    display: block;
    width: 400px;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    overflow: hidden;
    background: #128b64;
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin: 0 auto;
  }
}
.menu-tools {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
</style>
<style>
.search-main .el-form-item__content {
  line-height: 24px !important;
}
.search-main .edui-editor {
  transform: scale(1);
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
.search-main .rich-editor {
  width: 100%;
  position: relative;
  z-index: 1;
}
</style>