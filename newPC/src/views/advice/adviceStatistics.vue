<template>
  <div class="advice-statistics">
   <div class="header">
      <el-select size="medium"
        v-model="schoolTimeId"
        placeholder="请选择学期"
        @change="initTermWeekList"
      >
        <el-option
          v-for="item in schoolYearList"
          :key="item.id"
          :label="item.schoolTimeName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select size="medium"
        v-model="severalWeek"
        placeholder="请选择学期周"
        @change="getAdviceSchTimeStatic"
      >
        <el-option
          v-for="item in weekList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="body"  :style="`height: ${nobottommaxH}px;`">
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card blue">
        <div class="stat-number">{{ statistics.total }}</div>
        <div class="stat-label">建议总数</div>
      </div>
      <div class="stat-card green">
        <div class="stat-number">{{ statistics.processed }}</div>
        <div class="stat-label">已处理建议</div>
      </div>
      <div class="stat-card yellow">
        <div class="stat-number">{{ statistics.pending }}</div>
        <div class="stat-label">待处理建议</div>
      </div>
      <div class="stat-card cyan">
        <div class="stat-number">{{ statistics.completionRate }}</div>
        <div class="stat-label">处理完成率</div>
      </div>
      <div class="stat-card pink">
        <div class="stat-number">{{ statistics.weeklyNew }}</div>
        <div class="stat-label">本周新增建议</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container">
      <!-- 建议类型分布 -->
      <div class="chart-item">
        <h3>建议类型分布</h3>
        <div ref="typeDistributionChart" class="chart"></div>
      </div>

      <!-- 建议月次数 -->
      <div class="chart-item">
        <h3>建议月次数</h3>
        <div ref="monthlyChart" class="chart"></div>
      </div>

      <!-- 建议按类型处理情况 -->
      <div class="chart-item full-width">
        <h3>建议按类型处理情况</h3>
        <div ref="processingChart"></div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import {getAdviceSchTimeStatic} from '@/api/advice';
import {
  getSchoolTimeAllList,
  getSeveralWeekListBySchoolTImeId,
} from "@/api/classScheduleCard";
import mixins from "@/mixins/windowResize";
export default {
  name: 'AdviceStatistics',
  data() {
    return {
      schoolYearList:[],
      weekList:[],
      schoolTimeId: '',
      severalWeek: 0,
      statistics: {
        total: 0,
        processed: 0,
        pending: 0,
        completionRate:"0%",
        weeklyNew: 0
      },
      typeDistributionData: [],
      monthlyData: {
        months: [],
        counts: []
      },
      processingData: [],
      charts: {}
    };
  },
  mixins: [mixins],
  mounted() {
    this.initTermList()
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.destroyCharts();
  },
  methods: {
    async initTermList() {
      const res = await getSchoolTimeAllList()
      this.schoolYearList = res.data.data;
      const currentTerm = this.schoolYearList.find(i => i.isCurrent === 1)
      this.schoolTimeId = currentTerm ? currentTerm.id : this.schoolYearList[0].id
      if (this.schoolTimeId) {
        await this.initTermWeekList()
      }
    },
    async initTermWeekList() {
      const res = await getSeveralWeekListBySchoolTImeId(this.schoolTimeId)
      const data = res.data.data;
      this.weekList = data.map((item) => {
        return {
          value: item.week,
          label: "第" + item.week + "周",
        };
      });
      if (data.map((item) => item.nowWeek).indexOf(1) > -1) {
        this.severalWeek =
          data[data.map((item) => item.nowWeek).indexOf(1)].week;
      } else {
        this.severalWeek = data[0].week;
      }
       this.getAdviceSchTimeStatic()
    },
    getAdviceSchTimeStatic(){
      getAdviceSchTimeStatic({
                        schoolTimeId: this.schoolTimeId,
                        severalWeek: this.severalWeek
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.code===200) { 
                                this.statistics={
                                  total: data.data.adviceStaticVOSchTime.totalCount,
                                  processed: data.data.adviceStaticVOSchTime.batchCount,
                                  pending: Math.floor(data.data.adviceStaticVOSchTime.notBatchCount+data.data.adviceStaticVOSchTime.turnToCount),
                                  completionRate: ( (((data.data.adviceStaticVOSchTime.batchCount*100)/data.data.adviceStaticVOSchTime.totalCount).toFixed(2)-0)||0)+"%",
                                  weeklyNew: data.data.adviceStaticVOSchWeek.totalCount
                                }
                                this.typeDistributionData=[]
                                this.processingData=[]
                                this.monthlyData.months=[]
                                this.monthlyData.counts=[]
                                for(let i=0;i<data.data.typeList.length;i++){
                                   this.typeDistributionData.push({
                                     name:data.data.typeList[i].typeName,
                                     value:data.data.typeList[i].totalCount,
                                   })
                                   this.processingData.push({
                                     name:data.data.typeList[i].typeName,
                                     processed:data.data.typeList[i].batchCount,
                                     pending:Math.floor(data.data.typeList[i].notBatchCount+data.data.typeList[i].turnToCount),
                                     ignored:data.data.typeList[i].ignoreCount,
                                   })
                                }
                                for(let i=0;i<data.data.monthList.length;i++){
                                   this.monthlyData.months.push(data.data.monthList[i].monthStr+'月')
                                   this.monthlyData.counts.push(data.data.monthList[i].totalCount)
                                }
                                
                                 this.initCharts()
                            }
                        });
    },
    initCharts() {
      this.initTypeDistributionChart();
      this.initMonthlyChart();
      this.initProcessingChart();
    },
    initTypeDistributionChart() {
      const chart = echarts.init(this.$refs.typeDistributionChart);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: this.typeDistributionData.map(item => item.name)
        },
        color:['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'],
        series: [
          {
            name: '建议类型',
            type: 'pie',
            radius: '60%',
            center: ['40%', '60%'],
            data: this.typeDistributionData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
          }
        ]
      };
      chart.setOption(option);
      this.charts.typeDistribution = chart;
    },
    initMonthlyChart() {
      const chart = echarts.init(this.$refs.monthlyChart);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '5%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.monthlyData.months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '建议次数',
            type: 'bar',
            data: this.monthlyData.counts,
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      };
      chart.setOption(option);
      this.charts.monthly = chart;
    },
    initProcessingChart() {
      const chartContainer = this.$refs.processingChart;
      const dataCount = this.processingData.length;
      const itemsPerRow = 6;
      const rows = Math.ceil(dataCount / itemsPerRow);
      
      // 根据饼图数量计算容器高度
      const baseHeight = 180;
      const rowHeight = 180;
      const chartHeight = Math.max(baseHeight, rows * rowHeight);
      
      // 设置容器高度
      chartContainer.style.height = `${Math.ceil(this.processingData.length/6)*180}px`;
      let chart =echarts.init(chartContainer);
       chart.dispose();
       chart =echarts.init(chartContainer);
      // 构建系列数据（饼图）和标题数据
      const series = [];
      const titles = [];
      
      this.processingData.forEach((item, index) => {
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;
        const rowHeightPercent = 100 / rows;
        
        // 添加饼图系列
        series.push({
          name: item.name,
          type: 'pie',
          radius: [30, 60], // 固定饼图大小，单位为像素
          center: [`${(100 / itemsPerRow) * (col + 0.5)}%`, `${rowHeightPercent * (row + 0.5)}%`],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          grid: {top: "5%",left: "2%",right: "4%",bottom: "6%",containLabel: true},
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: item.processed, name: '已处理' },
            { value: item.pending, name: '未处理' },
            { value: item.ignored, name: '忽略' }
          ],
          itemStyle: {
            color: function(params) {
              const colors = ['#409EFF', '#67C23A', '#909399'];
              return colors[params.dataIndex];
            }
          }
        });
        
        // 添加标题
        titles.push({
          text: item.name,
          left: `${(100 / itemsPerRow) * (col + 0.5)}%`,
          top: `${row*180+160 }px`,
          textAlign: 'center',
          textStyle: {
            fontSize: 12,
            color: '#303133'
          }
        });
      });      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },  
        legend: {
          right: 0,
          data: ['已处理', '未处理', '忽略']
        },
        title: titles,
        series: series
      };      
      chart.setOption(option,true);
      this.charts.processing = chart;
    },
    handleResize() {
      // 重新初始化处理情况图表，以适应新的窗口大小
      if (this.charts.processing) {
        this.destroyCharts();
        this.initCharts();
      } else {
        Object.values(this.charts).forEach(chart => {
          chart.resize();
        });
      }
    },
    updateCharts() {
      // 销毁旧图表
      this.destroyCharts();
      // 初始化新图表
      this.initCharts();
    },
    destroyCharts() {
      Object.values(this.charts).forEach(chart => {
        chart.dispose();
      });
      this.charts = {};
    }
  }
};
</script>

<style  lang="scss" scoped>
.body{
  overflow: auto;
  padding-top: 10px;
  border-top: 1px solid #ccc;
}
.header {
    padding-bottom: 10px;
  }
.advice-statistics {
  padding: 12px;
  background: #f5f7fa;
  min-height: 100vh;
}

.term-selector {
  margin-bottom: 20px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
  }

  .stat-number {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    color: #606266;
  }

  &.blue {
    border-left: 4px solid #409EFF;
    .stat-number {
      color: #409EFF;
    }
  }

  &.green {
    border-left: 4px solid #67C23A;
    .stat-number {
      color: #67C23A;
    }
  }

  &.yellow {
    border-left: 4px solid #E6A23C;
    .stat-number {
      color: #E6A23C;
    }
  }

  &.cyan {
    border-left: 4px solid #40E0D0;
    .stat-number {
      color: #40E0D0;
    }
  }

  &.pink {
    border-left: 4px solid #F56C6C;
    .stat-number {
      color: #F56C6C;
    }
  }
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(49%, 1fr));
  gap: 20px;
}

.chart-item {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-width: 50%;
    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #303133;
    }

    .chart {
      height: 300px;
    }

    &.full-width {
      grid-column: 1 / -1;

      .chart {
        min-height: 400px;
        height: auto;
      }
  }
}

@media screen and (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
  }

  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>