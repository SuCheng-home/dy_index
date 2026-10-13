<template>
  <div class="check_in_statistics_wrap">
    <div class="header">
      <el-button @click="$router.back()"  size="medium">返回</el-button>
      <el-radio-group v-model="tabType" size="medium">
        <el-radio-button :label="1">按月按宿舍统计</el-radio-button>
        <el-radio-button :label="2">按学期周按宿舍统计</el-radio-button>
        <el-radio-button :label="3">按月按学生统计</el-radio-button>
        <el-radio-button :label="4">按学期周按学生统计</el-radio-button>
      </el-radio-group>
    </div>

    <StatisticByMonthByDorm v-if="tabType === 1" />
    <StatisticByWeekByDorm v-else-if="tabType === 2" />
    <StatisticByMonthByBed v-else-if="tabType === 3" />
    <StatisticByWeekByBed v-else-if="tabType === 4" />
  </div>
</template>

<script>
import StatisticByWeekByBed from './components/statisticByWeekByBed'
import StatisticByMonthByBed from './components/statisticByMonthByBed'
import StatisticByWeekByDorm from './components/statisticByWeekByDorm'
import StatisticByMonthByDorm from './components/statisticByMonthByDorm'
export default {
  name: "statisticByWeekOrMonth",
  components: {
    StatisticByWeekByBed,
    StatisticByMonthByBed,
    StatisticByWeekByDorm,
    StatisticByMonthByDorm
  },
  data() {
    return {
      tabType: 1
    };
  }
};
</script>

<style scoped>
</style>
<style lang="scss" scoped>
.check_in_statistics_wrap {
  padding: 12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
}
</style>
