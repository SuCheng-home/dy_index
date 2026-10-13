<template>
  <div class="study-subject-index">
    <el-tabs type="border-card" v-model="activeName" @tab-click="saveTab">
      <el-tab-pane label="自主听课" name="autonomy">
        <Autonomy />
      </el-tab-pane>
      <el-tab-pane label="组织听课" name="organization">
        <Organization />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* utils & mixins & ... */
import { isShowByPermission } from "@/utils";

/* components */
import Autonomy from "./autonomy/index";
import Organization from "./organization/index";

/* api */

export default {
  mixins: [],
  components: { Autonomy, Organization },
  computed: {},
  data() {
    return {
      isShowByPermission,
      // tab选中项 { String }
      activeName: "",
    };
  },
  created() {
    this.setActiveName();
  },
  methods: {
    setActiveName() {
      let activeName = sessionStorage.getItem("studySubjectActiveName");
      if (activeName) {
        this.activeName = activeName;
      } else {
        this.activeName = "autonomy";
      }
    },
    // 记录当前 tab
    saveTab(tab) {
      sessionStorage.setItem("studySubjectActiveName", tab.name);
    },
  },
};
</script>
<style lang="scss" scoped>
.study-subject-index {
  padding: 12px;
}
</style>
