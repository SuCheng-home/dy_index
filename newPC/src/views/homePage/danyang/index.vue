<template>
  <div class="danyang-home">
    <main class="main-container">
      <!-- Left Column: Personal & Schedule -->
      <div class="left-col">
        <!-- 3. Teacher Workbench -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-id-card-alt"></i> 个人工作台</div>
            <!-- <span class="card-extra"><i class="fas fa-cog"></i></span> -->
          </div>
          <div class="card-body">
            <div class="profile-section">
              <img :src="userInfo.avatar" class="profile-img">
              <div class="profile-info">
                <h3>{{ userInfo.name }}</h3>
                <div style="font-size: 12px; color: var(--text-sec);">
                  <i class="fas fa-book"></i> {{ userInfo.mainTeachCourse }} | <i class="fas fa-users"></i> {{ userDepartName }}
                </div>
              </div>
            </div>
            
            <Attendance />

            <TodoList />
          </div>
        </div>

        <!-- 4. Schedule (Split into two parts) -->
        <!-- Part 1: Today's Schedule -->
        <TodaySchedule />
      </div>

      <!-- Middle Column: Hub -->
      <div class="mid-col">
        <!-- 4. Banner (Preserved) -->
        <Banner />

        <!-- 2. Quick Apps Grid -->
        <AppList />

        <!-- 5. Civilized Class Evaluation Module -->
        <EvalList />
      </div>

      <!-- Right Column: Info -->
      <div class="right-col">
        <!-- 2. Notices (Moved) -->
        <NoticeList />
        <!-- 3. Visits Chart (Preserved) -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i class="fas fa-chart-area"></i> 平台访问次数</div>
          </div>
          <div class="card-body">
            <div ref="visitChart" style="height: 200px;"></div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapGetters } from 'vuex'
import AppList from './components/AppList'
import Banner from './components/Banner'
import TodoList from './components/TodoList'
import EvalList from './components/EvalList'
import Attendance from './components/Attendance'
import NoticeList from './components/NoticeList'
import TodaySchedule from './components/TodaySchedule'
import { getUserLoginCountByRole } from '@/api/homePage/danyang.js'

export default {
  name: 'DanyangHome',
  components: {
    AppList,
    Banner,
    TodoList,
    EvalList,
    Attendance,
    NoticeList,
    TodaySchedule
  },
  data() {
    return {
      // 图表实例
      charts: {
        visitChart: null,
        leaderChart1: null,
        leaderChart2: null,
        leaderChart3: null,
        leaderChart4: null
      }
    };
  },
  computed: {
    ...mapGetters([
      'departs',
      "userInfo",
      "schoolInfo",
    ]),
    userDepartName() {
      return this.departs.length ? this.departs[0].name : ''
    },
    dayPartText() {
      return {
          "": "",
          morning: "上午",
          noon: "中午",
          afternoon: "下午",
          night: "晚上",
      }[this.dateInfo.dayPart];
    },
  },
  mounted() {
    this.initVisitChart();
  },
  beforeUnmount() {
    // 销毁图表实例
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.dispose();
      }
    })
  },
  methods: {
    // 初始化访问量图表
    async initVisitChart() {
      try {
        const res = await getUserLoginCountByRole({
          days: -8
        })
        this.charts.visitChart = echarts.init(this.$refs.visitChart);
        this.charts.visitChart.setOption({
          tooltip: { trigger: 'axis' },
          grid: { top: 10, left: 0, right: 15, bottom: 0, containLabel: true },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: (() => {
              const arr = [];
              const today = new Date();
              // 获取近7天，不含今天
              for (let i = 1; i <= 7; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                arr.unshift(`${mm}.${dd}`);
              }
              return arr;
            })(),
            axisLine: { show: false }
          },
          yAxis: { type: 'value', splitLine: { show: false } },
          series: [
            {
              name: '教师',
              type: 'line',
              smooth: true,
              showSymbol: false,
              data: res.data.data.map(i => i.teacherLoginTotal),
              itemStyle: { color: '#1890ff' },
              areaStyle: { opacity: 0.1 }
            },
            {
              name: '学生',
              type: 'line',
              smooth: true,
              showSymbol: false,
              data: res.data.data.map(i => i.parentLoginTotal),
              itemStyle: { color: '#fa8c16' },
              areaStyle: { opacity: 0.1 }
            }
          ]
        });
        
        window.addEventListener('resize', () => {
          if (this.charts.visitChart) {
            this.charts.visitChart.resize();
          }
        });
      } catch(err) {
        console.log(err)
      }
    },
    
    // 切换角色
    switchRole(role) {
      this.activeRole = role;
      if (role === 'leader') {
        this.$nextTick(() => {
          this.initLeaderCharts();
        });
      }
    },
    
    // 初始化领导视图图表
    initLeaderCharts() {
      // 销毁旧图表
      ['leaderChart1', 'leaderChart2', 'leaderChart3', 'leaderChart4'].forEach(key => {
        if (this.charts[key]) {
          this.charts[key].dispose();
          this.charts[key] = null;
        }
      });
      
      // Chart 1: Class Eval (Bar)
      if (this.$refs.leaderChart1) {
        this.charts.leaderChart1 = echarts.init(this.$refs.leaderChart1);
        this.charts.leaderChart1.setOption({
          grid: { top: 30, bottom: 20, left: 30, right: 10, containLabel: true },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: ['高一', '高二', '高三'], axisTick: { show: false } },
          yAxis: { type: 'value', min: 90, splitLine: { lineStyle: { type: 'dashed' } } },
          series: [{ 
            type: 'bar', 
            data: [96.5, 95.8, 97.2], 
            itemStyle: { color: '#1890ff', borderRadius: [4, 4, 0, 0] }, 
            barWidth: '30%',
            label: { show: true, position: 'top' }
          }]
        });
      }

      // Chart 2: Student Eval (Pie)
      if (this.$refs.leaderChart2) {
        this.charts.leaderChart2 = echarts.init(this.$refs.leaderChart2);
        this.charts.leaderChart2.setOption({
          tooltip: { trigger: 'item' },
          legend: { bottom: 0, left: 'center', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 10 } },
          series: [{
            type: 'pie', 
            radius: ['35%', '60%'],
            center: ['50%', '45%'],
            data: [
              { value: 1048, name: '品德优秀' },
              { value: 735, name: '学业进步' },
              { value: 580, name: '身心健康' },
              { value: 484, name: '艺术素养' },
              { value: 300, name: '社会实践' }
            ],
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false }
          }]
        });
      }

      // Chart 3: Dorm Eval (Line)
      if (this.$refs.leaderChart3) {
        this.charts.leaderChart3 = echarts.init(this.$refs.leaderChart3);
        this.charts.leaderChart3.setOption({
          grid: { top: 30, bottom: 20, left: 30, right: 10, containLabel: true },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: ['第一周', '第二周', '第三周', '第四周'], axisTick: { show: false } },
          yAxis: { type: 'value', min: 80, splitLine: { lineStyle: { type: 'dashed' } } },
          series: [{ 
            type: 'line', 
            smooth: true, 
            data: [92, 94, 93, 95], 
            itemStyle: { color: '#fa8c16' }, 
            areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(250, 140, 22, 0.5)'}, {offset: 1, color: 'rgba(250, 140, 22, 0.0)'}]) },
            symbol: 'circle',
            symbolSize: 6
          }]
        });
      }
      
      // Chart 4: Patrol (Bar)
      if (this.$refs.leaderChart4) {
        this.charts.leaderChart4 = echarts.init(this.$refs.leaderChart4);
        this.charts.leaderChart4.setOption({
          grid: { top: 30, bottom: 20, left: 30, right: 10, containLabel: true },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'], axisTick: { show: false } },
          yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
          series: [{ 
            type: 'bar', 
            data: [2, 5, 1, 3, 2], 
            itemStyle: { color: '#f5222d', borderRadius: [4, 4, 0, 0] }, 
            barWidth: '30%',
            label: { show: true, position: 'top' }
          }]
        });
      }
      
      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        Object.values(this.charts).forEach(chart => {
          if (chart) {
            chart.resize();
          }
        });
      });
    },
    
    // 导出报表
    exportReport() {
      alert('导出全校报表');
    },
    async fetchAttendance() {
      try {
        // const response = await this.$api.getAttendance();
        // this.attendance = response.data;
        console.log('获取考勤数据');
      } catch (error) {
        console.error('获取考勤数据失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.danyang-home {
  --bg-body: #f0f2f5;
  --bg-card: #ffffff;
  --primary: #1890ff;
  --primary-hover: #40a9ff;
  --text-main: #262626;
  --text-sec: #595959;
  --text-light: #8c8c8c;
  --border: #e8e8e8;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  --radius: 8px;
  --header-bg: #001529;
  --header-text: rgba(255, 255, 255, 0.85);
  --header-height: 64px;
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  min-height: 100vh;
  padding: 20px 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Layout */
.main-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 320px 1fr 340px;
  gap: 20px;
  align-items: start;
}

/* Left Column: Teacher Workbench */
.profile-section {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.profile-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary);
  padding: 2px;
}

.profile-info h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.profile-tag {
  font-size: 12px;
  background: #e6f7ff;
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}


/* Schedule Tabs */
.tab-header {
  display: flex;
  border-bottom: 1px solid var(--border);
  margin: -5px -20px 10px -20px;
  background: #fafafa;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-sec);
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-item.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  background: #fff;
  font-weight: 600;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

/* Mini Table for Weekly Schedule */
.mini-table {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  text-align: center;
}

.mini-table th {
  background: #f5f5f5;
  padding: 6px;
  color: var(--text-sec);
}

.mini-table td {
  border: 1px solid #f0f0f0;
  padding: 8px 4px;
}
</style>
<style>
/* .danyang-home  * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
} */
/* Card Styles */
.danyang-home .card {
  background: var(--bg-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s;
}

.danyang-home .card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.danyang-home .card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.danyang-home .card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.danyang-home .card-title i {
  color: var(--primary);
}

.danyang-home .card-extra {
  font-size: 13px;
  color: var(--text-light);
  font-weight: normal;
  cursor: pointer;
}

.danyang-home .card-extra:hover {
  color: var(--primary);
}

.danyang-home .card-btn {
  background: var(--primary);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.danyang-home .card-btn:hover {
  background: var(--primary-hover);
  color: white;
}

.danyang-home .card-body {
  padding: 20px;
}
/* Responsive */
@media (max-width: 1366px) {
  .main-container {
    grid-template-columns: 280px 1fr 300px;
  }
  .app-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr 1fr;
  }
  .main-container > div:nth-child(2) {
    grid-column: 1 / -1;
    order: -1;
  }
}
</style>
