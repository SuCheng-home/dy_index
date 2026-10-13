<template>
  <div class="readPunchClockStatisticsCardCondition">
      <div class="header">
          <el-date-picker v-model="punchClockDate" size="medium" type="date" placeholder="选择日期" :clearable="false" :picker-options="pickerDate"></el-date-picker>
         <el-select v-model="selectGrade" size="medium" placeholder="请选择年级">
              <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
          </el-select>
      </div>
      <div id="classPunchClockChart" :style="`width: 98%;height: ${maxH-40}px;margin: 10px auto;`"></div>
    
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize';
  import echarts from 'echarts';
  import {getGradePunchClockList, getSchoolGradeClass} from "@/api/readPunchClock";

  const blockHtml1 = '<span style="display: inline-block;width: 10px; height: 10px;margin-right: 5px;background: #20A0FF;border-radius: 50%;"></span>';
  const blockHtml2 = '<span style="display: inline-block;width: 10px; height: 10px;margin-right: 5px;background: #F56C6C;border-radius: 50%;"></span>';
  const blockHtml3 = '<span style="display: inline-block;width: 10px; height: 10px;margin-right: 5px;background: #99A9BF;border-radius: 50%;"></span>';

  export default {
    name: 'readPunchClockStatisticsCardCondition',
    data() {
      return {
        punchClockDate: '',
        formatDate: '',
        pickerDate: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        gradeList: [],
        selectGrade: 0,
        punchClockList: [],
        classPunchClockChart: null,
        activeName:'two'
      }
    },
    mixins: [mixin],
    watch: {
      punchClockDate(date) {
        this.formatDate = this.dateFormat(date);
        this.getGradePunchClockList();
      },
      selectGrade(gradeVal) {
        this.getGradePunchClockList();
      }
    },
    created() {
      this.punchClockDate = this.dateFormat(new Date());
      this.getSchoolGradeClass();
    },
    methods: {
       tabsfun(){
        if(this.activeName=='one'){
          this.$router.push({path: 'weekPlanIndex'});
        }
        if(this.activeName=='three'){
          this.$router.push({path: 'ReadBookIndex'});
        }
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
      getGradePunchClockList() {
        if (!this.formatDate || !this.selectGrade) {
          return;
        }
        let query = {
          date: this.formatDate,
          gradeId: this.selectGrade
        };
        getGradePunchClockList(query).then((res) => {
          const data= res.data.data;

          let xArray = [];
          let noClockInArray = [];
          let finishedArray = [];
          let unfinishedArray = [];
          if (res.data.code === 200) {
            this.punchClockList = data;
            data.forEach((item) => {
              xArray.push(item.className);
              noClockInArray.push(item.noClockInCount);
              finishedArray.push(item.finishedCount);
              unfinishedArray.push(item.unfinishedCount);
            });
          }
          this.classPunchClockChart = echarts.init(document.getElementById('classPunchClockChart'));
          this.drawClassPunchClockChart(xArray, noClockInArray, finishedArray, unfinishedArray);
        }).catch(() => {});
      },
      // 柱状图列表
      drawClassPunchClockChart(xArray, noClockInArray, finishedArray, unfinishedArray) {
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
              name: '未打卡',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: "#99A9BF" //图标颜色
                }
              },
              data: noClockInArray
            },
            {
              name: '打卡未完成',
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
              name: '打卡已完成',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: "#20A0FF" //图标颜色
                }
              },
              data: finishedArray
            }
          ]
        };
        this.classPunchClockChart.setOption(chartOption);
        this.classPunchClockChart.on("click", this.eConsole);
      },
      eConsole(param){
        let classId = this.punchClockList[param.dataIndex].classId;
        let className = this.punchClockList[param.dataIndex].className;
        this.$router.push({
          path: 'studentCardCondition',
          query: {classId: classId, date: this.formatDate, className: className}
        });
      },
      fillZero(n) {
        return n < 10 ? '0' + n : n;
      },
      dateFormat(n) {
        let data = new Date(n);
        data.setTime(data.getTime());
        let dateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
        return dateStr;
      },
    }
  }
</script>

<style lang="scss" scoped>
.readPunchClockStatisticsCardCondition{
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
