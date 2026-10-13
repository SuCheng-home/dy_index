<template>
  <div class="readPunchClockClassWeekPlan">
    <div class="top">
      <el-row style="padding-bottom: 10px">
        <el-col :span="20">
          <el-button @click="goBack" size="medium">返回</el-button>
          <el-button type="primary" v-if="tableList.length" size="medium" @click="exportExcel('#outTable', `第${week}周周计划完成情况.xlsx`)" >导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div id="punchClockLineChart" style="width: 98%;height: 300px;margin: 10px auto;"></div>
    <div>
      <el-table stripe :data="tableList" border  :height="maxH-280" id="outTable">
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span class="link-type" @click="toStudentInfo(scope.row)">{{scope.row.stuName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column label="计划制定情况">
          <template slot-scope="scope">
            <span v-if="scope.row.id">已制定</span>
            <span v-else>未制定</span>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="打卡天数" sortable></el-table-column>
        <el-table-column label="阅读执行情况">
          <template slot-scope="scope">
            <span v-if="scope.row.finished === 1 || (!scope.row.id && scope.row.count)">已完成</span>
            <span v-else>未完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="readPage" label="总阅读页数" sortable></el-table-column>
        <el-table-column prop="readTime" label="阅读时长(分)" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import { getClassStuWeekPlan, getClassStuCondition } from '@/api/readPunchClock';
  import baseMixin from '@/mixins/baseMixin';
  import mixin from '@/mixins/windowResize';
  export default {
    name: 'readPunchClockClassWeekPlan',
    data() {
      return {
        weekDayNames: ['一', '二', '三', '四', '五', '六', '日'],
        punchClockLineChart: null,
        teamId: 0,
        week: 0,
        tableList: []
      }
    },
    mixins: [baseMixin,mixin],
    created() {
      this.teamId = parseInt(this.$route.query.teamId);
      this.week = parseInt(this.$route.query.week);
      let query = {
        classId: parseInt(this.$route.query.classId),
        schoolTimeId: this.teamId,
        week: this.week
      };
      this.getClassStuWeekPlan(query);
      this.getClassStuCondition(query);
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      toStudentInfo(stuItem) {
        this.$router.push({
          path: 'studentWeekPlan',
          query: {stuId: stuItem.stuId, teamId: this.teamId, week: this.week, stuName: stuItem.stuName, className: stuItem.className}
        });
      },
      getClassStuWeekPlan(query) {
        getClassStuWeekPlan(query).then((res) => {
          const data= res.data.data;
          let chartTimeArray = [];
          let punchArray = [];
          let noPunchArray = [];
          if (res.data.code === 200) {
            data.forEach((item) => {
              if (item.weekDay > 0) {
                chartTimeArray.push('周' + this.weekDayNames[item.weekDay - 1]);
                punchArray.push(item.finishedCount);
                noPunchArray.push(item.unfinishedCount);
              }
            });
            this.punchClockLineChart = echarts.init(document.getElementById('punchClockLineChart'));
            this.drawPunchClockLineChart(chartTimeArray, punchArray, noPunchArray);
          }
        }).catch(() => {});
      },
      getClassStuCondition(query) {
        getClassStuCondition(query).then((res) => {
          const data= res.data.data;
          if (res.data.code === 200) {
            this.tableList = data;
          }
        }).catch(() => {});
      },
      // 绘制曲线
      drawPunchClockLineChart(timeArray, punchArray, noPunchArray) {
        const chartOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top: "top",
            data: ['已打卡', '未打卡'],
            left: '5%',
            y2: '2%',//到底部的距离
            textStyle: {
              color: "#a3a3a3",
              fontSize: 16
            },
            itemWidth: 10,
            itemHeight: 10,
            orient: 'horizontal'
          },
          grid: {
            top: '15%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          calculable: true,
          xAxis: {
            show: true,
            position: "bottom",
            type: 'category',
            data: timeArray,
            axisTick: {
              alignWithLabel: true,
              show: true
            },
            axisLine: {
              onZero: true,
              lineStyle: {
                color: "#a3a3a3"
              }
            },
          },
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              },
              axisTick: { //y轴的坐标样式
                show: false
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#a3a3a3"
                }
              }
            }
          ],
          series: [
            {
              name: '已打卡',
              type: 'line',
              data: punchArray,
              itemStyle: {
                normal: {
                  color: "#d14a61" //图标颜色
                }
              },
              label: {
                normal: {
                  show: true,
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return '';
                    }
                  }
                }
              }
            },
            {
              name: '未打卡',
              type: 'line',
              data: noPunchArray,
              itemStyle: {
                normal: {
                  color: "#5793f3" //图标颜色
                }
              },
              label: {
                normal: {
                  show: true,
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return '';
                    }
                  }
                }
              }
            }
          ]
        };
        this.punchClockLineChart.setOption(chartOption);
      },
    }
  }
</script>

<style scoped>
  .top{
    border-bottom: 1px solid #e7eaec;
  }
  .readPunchClockClassWeekPlan{
    padding:12px;
  }
</style>
