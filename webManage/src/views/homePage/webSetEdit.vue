<template>
  <div class="webSetEdits">
    <div class="webSetEdit">
      <el-row>
        <el-col :span="24">
          <div class="nemu-tools">
            <el-button
              size="medium"
              class="filter-item"
              @click="goBack()"
            >返回
            </el-button>
            <el-button
              size="medium"
              class="filter-item"
              type="primary"
              @click="handleEditService()"
            >保存
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div
        class="addService-wrap custom—scrollbar"
        id="addService-wrap"
        :style="`height:${addServiceHeight}px`"
      >
        <el-form
          :model="ruleForm"
          ref="addServiceForm"
          label-width="150px"
          class="service-ruleForm custom—scrollbar"
        >
          <el-form-item
            label="网站Logo"
            class="required"
          >
            <el-col :span="24">
              <uploader
                pathPrefix="webSetEdit"
                multiple
                v-model="files"
                :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                showMode="imageBtn"
                showResult="image"
                showModeText="点击上传logo"
                showModeNum="one"
              ></uploader>
              <!-- <img v-if="ruleForm.logoUrl" :src="ruleForm.logoUrl" class="logo">
              <el-upload
              class="logo-uploader"
              :action="UploadPath"
              :before-upload="handleBeforeLogo"
              :show-file-list="false"
              :on-success="handleLogo"
              accept=".image,.jpg,.jpeg,.image,.bmp,.image,.gif,.png">
                <el-button class="logo_update">点击上传logo</el-button>
              </el-upload> -->
            </el-col>
          </el-form-item>
          <el-form-item
            label="网站名称"
            class="required"
          >
            <el-input
              v-model.trim="ruleForm.webName"
              :maxlength="20"
              placeholder="网站名称（1-20个字符）"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="网站域名"
            class="required"
          >
            <el-input
              v-model.trim="ruleForm.domainName"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="备用域名">
            <el-input
              v-model.trim="ruleForm.domainNameTw"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="原网站">
            <el-input
              v-model.trim="ruleForm.oldDomainName"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input
              v-model.trim="ruleForm.keyWord"
              :maxlength="100"
              placeholder="网站关键词（1-100个字符）"
            ></el-input>
          </el-form-item>
          <el-form-item label="网站介绍">
            <el-input
              type="textarea"
              class="description"
              v-model.trim="ruleForm.description"
              :maxlength="500"
              placeholder="网站介绍（1-500个字符）"
            ></el-input>
          </el-form-item>
          <el-form-item label="版权信息">
            <el-input
              v-model.trim="ruleForm.copyRight"
              :maxlength="200"
            ></el-input>
          </el-form-item>
          <el-form-item label="备案信息">
            <el-input
              v-model.trim="ruleForm.recodation"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="公安备案号">
            <el-input
              v-model.trim="ruleForm.postRecodation"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input
              v-model.trim="ruleForm.address"
              :maxlength="100"
            ></el-input>
          </el-form-item>
           <el-form-item label="事业单位标记" >
            <el-checkbox :true-label="2" :false-label="1" v-model="ruleForm.isInstitute">增加标记</el-checkbox>
          </el-form-item>
           <el-form-item
            label="事业单位链接"
            class="required"
            v-if="ruleForm.isInstitute==2"
          >
            <el-input
              v-model.trim="ruleForm.institution"
              :maxlength="1000"
              placeholder="事业单位链接"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import {
  getSchoolWebSettingById,
  updateSchoolWebSetting,
} from "@/api/webService";
export default {
  components: {
    Uploader,
  },
  data() {
    return {
      UploadPath: global.BasePath + "common/addImageUp", ////图片上传路径
      ruleForm: {
        logoUrl: "", //上传logo
        webName: "",
        domainName: "",
        oldDomainName: "",
        keyWord: "",
        description: "",
        copyRight: "",
        recodation: "",
        postRecodation: "",
        address: "",
        webId: "",
        domainNameTw: "",
        isInstitute:1,
        institution:''
      },
      webId: this.$route.query.webId ? this.$route.query.webId : "",
      files: [],
    };
  },
  mounted() {
    this.getSchoolWebSettingByIdFunc();
  },
  mixins: [mixins],
  methods: {
    //处理图片名
    fileNameUse(file) {
      return file.indexOf("?") !== -1 ? file.slice(0, file.indexOf("?")) : file;
    },

    handleBeforeLogo(file) {
      if (
        ["image/jpeg", "image/bmp", "image/gif", "image/png"].indexOf(
          file.type
        ) === -1
      ) {
        this.$message.error(
          "上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！"
        );
        return false;
      }
      if (file.size / 1024 / 1024 >= 2) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },
    getSchoolWebSettingByIdFunc() {
      getSchoolWebSettingById({
        webId: this.webId,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200) {
            const serviceData = data.data;
            if (serviceData.logoUrl) {
              let fileName = this.fileNameUse(serviceData.logoUrl).replace(
                /.+\//,
                ""
              );
              this.files.push({
                fileName: fileName,
                fileUrl: serviceData.logoUrl,
              });
            }
            this.ruleForm.webName = serviceData.webName;
            this.ruleForm.domainName = serviceData.domainName;
            this.ruleForm.oldDomainName = serviceData.oldDomainName;
            this.ruleForm.keyWord = serviceData.keyWord;
            this.ruleForm.description = serviceData.description;
            this.ruleForm.copyRight = serviceData.copyRight;
            this.ruleForm.recodation = serviceData.recodation;
            this.ruleForm.postRecodation = serviceData.postRecodation;
            this.ruleForm.address = serviceData.address;
            this.ruleForm.webId = serviceData.id;
            this.ruleForm.domainNameTw = serviceData.domainNameTw;
            this.ruleForm.isInstitute = serviceData.isInstitute? serviceData.isInstitute:1;
            this.ruleForm.institution = serviceData.institution;
          }
        })
        .catch(() => {
          this.$message.error("error");
        });
    },
    goBack() {
      this.$router.push({
        path: "/main/webSetDetail",
        query: {
          webId: this.webId,
        },
      });
    },
    handleLogo(res) {
      this.ruleForm.logoUrl = res.data.url;
    },
    handleEditService() {
      let flag = true;
      if (this.files && this.files.length == 0) {
        this.$alert("请选择Logo!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (this.ruleForm.webName === "") {
        this.$alert("请填写网站名称!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (this.ruleForm.domainName === "") {
        this.$alert("请填写域名!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      var domainreg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,49}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,49})+\.?/;
      if (
        this.ruleForm.domainName != "" &&
        !domainreg.test(this.ruleForm.domainName)
      ) {
        this.$alert("域名格式不正确", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      var urlreg = /^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      if (
        this.ruleForm.oldDomainName != null &&
        this.ruleForm.oldDomainName != "" &&
        !urlreg.test(this.ruleForm.oldDomainName)
      ) {
        this.$alert("原网站url格式不正确!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (this.ruleForm.domainName == this.ruleForm.domainNameTw) {
        this.$alert("网站域名和备用域名重复!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
       if (!this.ruleForm.institution&&this.ruleForm.isInstitute==2) {
        this.$alert("请填写事业单位网址!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (flag) {
        //走接口
        this.ruleForm.logoUrl = this.files
          .map((item) => item.fileUrl)
          .toString();
        updateSchoolWebSetting({
          logoUrl: this.ruleForm.logoUrl,
          webName: this.ruleForm.webName,
          domainName: this.ruleForm.domainName,
          oldDomainName: this.ruleForm.oldDomainName,
          keyWord: this.ruleForm.keyWord,
          description: this.ruleForm.description,
          copyRight: this.ruleForm.copyRight,
          recodation: this.ruleForm.recodation,
          postRecodation: this.ruleForm.postRecodation,
          address: this.ruleForm.address,
          id: this.ruleForm.webId,
          domainNameTw: this.ruleForm.domainNameTw,
          institution: this.ruleForm.institution,
          isInstitute: this.ruleForm.isInstitute,
        })
          .then((res) => res.data)
          .then((data) => {
            if (data.code === 200) {
              let webServiceData = data.data;
              this.webId = webServiceData.id;
              this.$router.push({
                path: "/main/webSetDetail",
                query: {
                  webId: this.webId,
                },
              });
            } else {
              this.$message({
                type: "error",
                message: data.msg,
              });
            }
          })
          .catch(() => {
            this.$message.error("error");
          });
      }
      //保存
    },
  },
};
</script>

<style lang="scss" scoped>
.webSetEdits {
  margin: 0 10px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 3px;
}
.webSetEdit {
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}
.addService-wrap {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
.service-ruleForm {
  width: 82%;
  height: auto;
  padding: 0 15px 0 15px;
  box-sizing: border-box;
  .logo {
    float: left;
    display: block;
    height: 100px;
    max-width: 550px;
  }
  .logo-uploader {
    float: left;
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
    margin-left: 30px;
  }
}
</style>
<style lang="scss">
.webSetEdits {
  .upload-file-item {
    height: 100px !important;
    width: auto !important;
    max-width: 550px !important;
    img {
      display: block;
      width: auto !important;
      max-width: 100% !important;
      height: 100px !important;
    }
  }
  .file-name {
    display: none;
  }
  .icon--block-del {
    display: none !important;
  }
}
</style>
