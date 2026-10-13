<template>
  <div class="mental-education-consulting-dataStatistics-index">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="基本统计" name="base">
        <Base
          :heartEduInit="heartEduInit"
          v-if="activeName == 'base' && heartEduInitLoaded"
        />
      </el-tab-pane>
      <el-tab-pane label="家长维度" name="parent">
        <Parent v-if="activeName == 'parent'" />
      </el-tab-pane>
      <el-tab-pane label="学生维度" name="student">
        <Student v-if="activeName == 'student'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* utils & minx & vux */
import { isShowByPermission } from "@/utils";

/* components */
import Base from "./base";
import Parent from "./parent";
import Student from "./student";

/* api */
import { getHeartEduInit } from "@/api/homeSchool/mentalEducation/consulting/otherSettings/form";

export default {
  name: "mentalEducationIndex",
  mixins: [],
  components: { Base, Parent, Student },
  computed: {},
  data() {
    return {
      // heartEduInit 加载完成
      heartEduInitLoaded: false,
      isShowByPermission,
      // tab选中项 { String }
      activeName: "base",
      // 心育咨询初始化对象
      heartEduInit: {},
    };
  },
  created() {
    this.getHeartEduInit();
  },
  methods: {
    getHeartEduInit() {
      getHeartEduInit()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.heartEduInit = data;
          this.heartEduInitLoaded = true;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-dataStatistics-index {
  padding:12px;
}
</style>
