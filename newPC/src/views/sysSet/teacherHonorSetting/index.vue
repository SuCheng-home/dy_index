<template>
  <div class="teacher-honor-setting">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="证书级别" name="certificateLevel">
        <CertificateLevel />
      </el-tab-pane>
      <el-tab-pane label="证书类型" name="certificateType">
        <CertificateType />
      </el-tab-pane>
      <el-tab-pane label="获奖等级" name="awardsLevel">
        <AwardsLevel />
      </el-tab-pane>
       <el-tab-pane label="审批设置" name="Approvalsettings">
        <Approvalsettings />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CertificateLevel from "./certificateLevel/index";
import CertificateType from "./certificateType/index";
import AwardsLevel from "./awardsLevel/index";
import Approvalsettings from "./Approvalsettings/index";
export default {
  name: "teacherHonorSettingIndex",
  components: {
    CertificateLevel,
    CertificateType,
    AwardsLevel,
    Approvalsettings
  },
  data() {
    return {
      // tab显示项
      activeName: "certificateLevel",
    };
  },
  created() {},
  methods: {
    //返回
    goBack() {
      this.$router.back();
    },
  },
};
</script>
<style lang="scss" scoped>
.teacher-honor-setting {
  padding:12px;
}
</style>
