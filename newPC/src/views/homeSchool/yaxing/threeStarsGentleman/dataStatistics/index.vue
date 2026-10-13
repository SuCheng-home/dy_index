<template>
  <div class="data-statistics">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="按评价星统计" name="byStar">
        <ByStar />
      </el-tab-pane>
      <el-tab-pane label="按学生统计" name="byStudent">
        <ByStudent />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ByStar from "./byStar/index";
import ByStudent from "./byStudent/index";

export default {
  name: "dataStatistics",
  components: {
    ByStar,
    ByStudent,
  },
  data() {
    return {
      // tab显示项
      activeName: "byStar",
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.data-statistics {
  padding:12px;
}
</style>
