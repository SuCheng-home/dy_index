<template>
  <div class="certificate-level-add">
    <div class="filter-wrapper">
      <el-button @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium">保存</el-button>
    </div>
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="级别名称">
        <el-input v-model.trim="form.name" placeholder="级别名称（1-10个字符）"></el-input>
      </el-form-item>
      <el-form-item label="权重">
        <el-input v-model.trim="form.name" placeholder="权重（1-100个数字）"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";

export default {
  name: "certificateLevelAdd",
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 请求表单
      form: {},
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.certificate-level-add {
  padding: 12px;
  .filter-wrapper {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .el-form {
    width: 810px;
    margin: 0 auto;
  }
}
</style>