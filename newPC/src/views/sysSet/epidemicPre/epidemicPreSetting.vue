<template>
  <div class="app-container calendar-list-container">
    <backtool>
      <el-button type="primary" size="medium" @click="updateSyncSchoolHandler">同步学校</el-button>
      <el-button type="primary" size="medium" @click="updateSyncStudentBatchHandler">同步学生</el-button>
    </backtool>
    <div class="precautions">
      <p>注意事项:</p>
      <div class="items">
        <p>1、同步学校只在开通时候同步一次</p>
        <p>2、后期用户变更只用点击同步学生即可</p>
        <p>3、学生及老师的信息在对方平台进行维护，不通过我们平台同步过去</p>
      </div>
    </div>
  </div>
</template>
<script>
import Backtool from '@/components/BackTool';
import { covidAbcfyUpdateSyncSchool, covidAbcfyUpdateSyncStudentBatch } from '@/api/epidemicPreSetting';
export default {
  components: {
    Backtool
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    updateSyncSchoolHandler() {
      covidAbcfyUpdateSyncSchool().then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.$message({
            message: '同步成功!',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    updateSyncStudentBatchHandler() {
      covidAbcfyUpdateSyncStudentBatch().then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: '同步成功!',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.precautions {
  font-weight: bold;

  .items {
    margin-left: 30px;
  }
}
</style>
