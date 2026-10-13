<template>
  <div class="readPunchClockStatisticsWeekPlan">
      <div class="header">
          <el-select v-model="selectTeam"  size="medium" placeholder="请选择学期">
              <el-option v-for="item in teamList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
          </el-select>
          <el-select v-model="selectWeek"  size="medium" placeholder="请选择周次">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
          </el-select>
          <el-select v-model="selectGrade"  size="medium" placeholder="请选择年级">
              <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
          </el-select>
      </div>

      <div id="classWeekPlanChart" :style="`width: 98%;height: ${maxH-40}px;margin: 10px auto;`"></div>

  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize';
  import echarts from 'echarts';
  import {getSchoolTimeAllList, getSeveralWeekList, getGradeStuWeekPlan, getSchoolGradeClass} from "@/api/readPunchClock";

  const blockHtml1 = '<span style="display: inline-block;width: 10px; height: 10px;margin-right: 5px;background: #20A0FF;border-radius: 50%;"></span>';
  const blockHtml2 = '<span style="display: inline-block;width: 10px; height: 10px;margin-right: 5px;background: #F56C6C;border-radius: 50%;"></span>';
  const blockHtml3 = '<span style="display: inline-block;width: 10px; height: 10px;margin-right: 5px;background: #99A9BF;border-radius: 50%;"></span>';

  export default {
    name: 'readPunchClockStatisticsWeekPlan',
    data() {
      return {
        teamList: [],
        selectTeam: 0,
        weekList: [],
        selectWeek: 0,
        gradeList: [],
        selectGrade: 0,
        weekPlanList: [],
        classWeekPlanChart: null,
        activeName:'one'
      }
    },
    mixins: [mixin],
    watch: {
      selectTeam(teamVal) {
        this.getGradeStuWeekPlan();
      },
      selectWeek(weekVal) {
        this.getGradeStuWeekPlan();
      },
      selectGrade(gradeVal) {
        this.getGradeStuWeekPlan();
      }
    },
    created() {
      this.getSchoolTimeAllList();
      this.getSeveralWeekList();
      this.getSchoolGradeClass();
    },
    methods: {
      tabsfun(){
        if(this.activeName=='two'){
          this.$router.push({path: 'punchClockIndex'});
        }
        if(this.activeName=='three'){
          this.$router.push({path: 'ReadBookIndex'});
        }
      },
      getSchoolTimeAllList() {
        getSchoolTimeAllList().then((res) => {
          if (res.data.code === 200) {
            res.data.data.forEach((item) => {
              this.teamList.push({
                value: item.id,
                label: item.schoolTimeName
              });
              if (item.isCurrent === 1) {
                this.selectTeam = item.id;
              }
            });
            if (!this.selectTeam) {
              this.selectTeam = this.teamList[0].value;
            }
          }
        }).catch(() => {});
      },
      getSeveralWeekList() {
        getSeveralWeekList().then((res) => {
          const data= res.data.data;
          if (res.data.code === 200) {
            data.forEach((item) => {
              this.weekList.push({
                value: item.week,
                label: '第'+ item.week + '周'
              });
              if (item.nowWeek === 1) {
                this.selectWeek = item.week;
              }
            });
            if (!this.selectWeek) {
              this.selectWeek = this.weekList[0].value;
            }
          }
        }).catch(() => {});
      },
      getSchoolGradeClass() {
        getSchoolGradeClass().then((res) => {
          const data= res.data.data;
          if (res.data.code === 200) {
            data.forEach((item) => {
              this.gradeList.push({
                label: item.name,
                value: item.id
              });
            });
            if (this.gradeList.length) {
              this.selectGrade = this.gradeList[0].value;
            }
          }
        }).catch(() => {});
      },
      getGradeStuWeekPlan() {
        if (!this.selectTeam || !this.selectWeek || !this.selectGrade) {
          return;
        }
        let query = {
          gradeId: this.selectGrade,
          schoolTimeId: this.selectTeam,
          week: this.selectWeek
        };
        getGradeStuWeekPlan(query).then((res) => {
          const data= res.data.data;

          let xArray = [];
          let noPlanArray = [];
          let finishedArray = [];
          let unfinishedArray = [];
          if (res.data.code === 200) {
            this.weekPlanList = data;
            data.forEach((item) => {
              xArray.push(item.className);
              noPlanArray.push(item.noWeekPlanCount);
              finishedArray.push(item.finishedCount);
              unfinishedArray.push(item.unfinishedCount);
            });
          }
          this.classWeekPlanChart = echarts.init(document.getElementById('classWeekPlanChart'));
          this.drawClassWeekPlanChart(xArray, noPlanArray, finishedArray, unfinishedArray);
        }).catch(() => {});
      },
      // 柱状图列表
      drawClassWeekPlanChart(xArray, noPlanArray, finishedArray, unfinishedArray) {
        const chartOption = {
          tooltip : {
            trigger: 'axis',
            axisPointer : {
              type : 'shadow'
            },
            formatter: '<b>{b}</b><br>'+ blockHtml1 +'{a2}：{c2}人<br>'+ blockHtml2 +'{a1}：{c1}人<br>'+ blockHtml3 +'{a0}：{c0}人'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis:  {
            type: 'value'
          },
          xAxis: {
            type: 'category',
            data: xArray
          },
          series: [
            {
              name: '未计划',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: "#99A9BF" //图标颜色
                }
              },
              data: noPlanArray
            },
            {
              name: '计划未完成',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: "#F56C6C" //图标颜色
                }
              },
              data: unfinishedArray
            },
            {
              name: '计划已完成',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: "#20A0FF" //图标颜色
                }
              },
              data: finishedArray // 下面 已完成
            }
          ]
        };
        this.classWeekPlanChart.setOption(chartOption);
        this.classWeekPlanChart.on("click", this.eConsole);
      },
      eConsole(param){
        let classId = this.weekPlanList[param.dataIndex].classId;
        this.$router.push({
          path: 'classWeekPlan',
          query: {classId: classId, teamId: this.selectTeam, week: this.selectWeek}
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
.readPunchClockStatisticsWeekPlan{
  padding: 12px;
}
  .header {
     border-bottom: 1px solid #e7eaec;
     padding-bottom:10px;
    .statistics_title{
      display: flex;
      margin: 10px 0;
      .btn_group{
        flex: 1;
        text-align: center;
        .btn{
          height: 40px;
          line-height: 40px;
          border: 1px solid #ccc;
          border-left-width: 0;
          color: #333;
          cursor: pointer;
        }
        .btn_selected{
          color: #fff;
          background: #409EFF;
          border: 1px solid #409EFF;
        }
      }
      .btn_group:first-child{
        .btn{
          border-radius: 4px 0 0 4px;
          border-left-width: 1px;
        }
      }
      .btn_group:last-child{
        .btn{
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
  .search_line_wrap{
    padding: 10px 50px;
  }
</style>
