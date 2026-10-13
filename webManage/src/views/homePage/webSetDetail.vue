<template>
  <div class="webSetDetails">
    <div class="webSetDetail">
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
              @click="websetEditBtn()"
            >编辑
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div
        class="addService-wrap custom—scrollbar"
        id="addService-wrap"
        :style="`height:${addServiceHeight}px`"
        :SchoolServiceList="SchoolServiceList"
      >
        <el-form
          ref="addServiceForm"
          label-width="150px"
          class="service-ruleForm custom—scrollbar"
        >
          <el-form-item label="网站Logo">
            <el-col :span="24">
              <img
                :src="SchoolServiceList.logoUrl"
                class="logo"
              >
            </el-col>
          </el-form-item>
          <el-form-item label="网站名称">
            <span>{{SchoolServiceList.webName}}</span>
          </el-form-item>
          <el-form-item label="网站域名">
            <span>{{SchoolServiceList.domainName}}</span>
          </el-form-item>
          <el-form-item label="备用域名">
            <span>{{SchoolServiceList.domainNameTw}}</span>
          </el-form-item>
          <el-form-item label="原网站">
            <span>{{SchoolServiceList.oldDomainName}}</span>
          </el-form-item>
          <el-form-item label="关键词">
            <span>{{SchoolServiceList.keyWord}}</span>
          </el-form-item>
          <el-form-item label="网站介绍">
            <span>{{SchoolServiceList.description}}</span>
          </el-form-item>
          <el-form-item label="版权信息">
            <span>{{SchoolServiceList.copyRight}}</span>
          </el-form-item>
          <el-form-item label="备案信息">
            <span>{{SchoolServiceList.recodation}}</span>
          </el-form-item>
          <el-form-item label="公安备案号">
            <span>{{SchoolServiceList.postRecodation}}</span>
          </el-form-item>
          <el-form-item label="联系方式">
            <span>{{SchoolServiceList.address}}</span>
          </el-form-item>
          <el-form-item label="事业单位链接" v-if="SchoolServiceList.isInstitute==2&&SchoolServiceList.institution">
            <span>{{SchoolServiceList.institution}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/windowResize";
import { getSchoolWebSettingById } from "@/api/webService";
export default {
  data() {
    return {
      SchoolServiceList: {},
      webId: this.$route.query.webId ? this.$route.query.webId : "",
    };
  },
  mixins: [mixins],
  mounted() {
    this.getSchoolWebSettingByIdFunc();
  },
  methods: {
    getSchoolWebSettingByIdFunc() {
      this.SchoolServiceList = {};
      getSchoolWebSettingById({
        webId: this.webId,
      })
        .then((res) => res.data)
        .then((data) => {
          this.SchoolServiceList = data.data;
        })
        .catch(() => {
          this.$message.error("error");
        });
    },
    goBack() {
      this.$router.push({
        path: "/main/homePage",
      });
    },
    websetEditBtn() {
      this.$router.push({
        path: "/main/webSetEdit",
        query: {
          webId: this.webId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.webSetDetails {
  margin: 0 10px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 3px;
}
.webSetDetail {
  padding: 20px;
  width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
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
}
</style>
<style>
.webSetDetail .el-form-item__label {
  font-weight: bold;
  color: #666;
  line-height: 40px;
  font-size: 14px;
  position: relative;
  padding-right: 20px;
}
</style>
