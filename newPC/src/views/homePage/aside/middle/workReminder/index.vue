<template>
  <div class="work-reminder-index">
    <el-tabs type="border-card" v-model="activeName" @tab-click="saveTab">
      <el-tab-pane label="工作日程" name="workPlan">
        <WorkPlan v-if="activeName == 'workPlan'" />
      </el-tab-pane>
      <el-tab-pane label="待办" name="suspended">
        <Suspended v-if="activeName == 'suspended'" />
      </el-tab-pane>
      <el-tab-pane label="已办" name="completed">
        <Completed v-if="activeName == 'completed'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* utils */
import { isShowByPermission } from "@/utils";

/* components */
import WorkPlan from "./workPlan";
import Suspended from "./suspended";
import Completed from "./completed";

/* api */

export default {
  name: "workReminderIndex",
  mixins: [],
  components: { WorkPlan, Suspended, Completed },
  computed: {},
  data() {
    return {
      isShowByPermission,
      // tab选中项 { String }
      activeName: "workPlan",
    };
  },
  created() {
    this.setActiveName();
  },
  methods: {
    setActiveName() {
      let workReminderTabActiveName = sessionStorage.getItem(
        "workReminderTabActiveName"
      );
      if (workReminderTabActiveName)
        this.activeName = workReminderTabActiveName;
    },
    // 记录当前 tab
    saveTab(tab) {
      sessionStorage.setItem("workReminderTabActiveName", tab.name);
    },
  },
};
</script>
<style lang="scss" scoped>
.work-reminder-index {
  padding:12px;
}
</style>
