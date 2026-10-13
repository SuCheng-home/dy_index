<template>
  <div class="school-board">
    <!-- 顶部 -->
    <div class="page-top">
      <div class="title-wrap">
        <div class="title">学校看板</div>
        <div class="sub">查看全校今日数据与评价趋势分析</div>
      </div>
      <!-- <el-select size="medium" v-model="currentTermId" @change="onTermChange" placeholder="请选择学期">
        <el-option v-for="item in termList" :key="item.id" :label="item.schoolTimeName" :value="item.id"></el-option>
      </el-select> -->
    </div>

    <!-- 第一行：4个统计卡片 -->
    <div class="stat-row stat-row-1">
      <div class="stat-card">
        <div class="ico-box ico-blue">📅</div>
        <div class="stat-info">
          <div class="stat-num blue">{{ todayData.sectionNoTotalCount || 0 }}</div>
          <div class="stat-label">今日课节次</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="ico-box ico-green">👩‍🏫</div>
        <div class="stat-info">
          <div class="stat-num green">{{ todayData.thTotalCount || 0 }}</div>
          <div class="stat-label">上课老师</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="ico-box ico-orange">📖</div>
        <div class="stat-info">
          <div class="stat-num orange">{{ todayData.sectionNoCount || 0 }}</div>
          <div class="stat-label">互动课节次</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="ico-box ico-purple">%</div>
        <div class="stat-info">
          <div class="stat-num purple">{{ ratioPercent }}<span class="unit">%</span></div>
          <div class="stat-label">互动比例</div>
        </div>
      </div>
    </div>

    <!-- 第二行：根据 typeList 动态展示各评价项今日总分（各年级 totalScore 累加） -->
    <div class="stat-row stat-row-2" v-if="todayData.typeList && todayData.typeList.length">
      <div class="stat-card" v-for="item in todayData.typeList" :key="'beh-' + item.behTypeId">
        <div class="ico-box"
          :style="{ background: hexToRgba(getTypeColor(item.behTypeName), 0.15) }">
          <img v-if="item.cover && item.cover.indexOf('http') === 0" :src="item.cover" class="ico-img" />
          <span v-else>{{ getTypeIcon(item.behTypeName) }}</span>
        </div>
        <div class="stat-info">
          <div class="stat-num" :style="{ color: getTypeColor(item.behTypeName) }">{{ item.totalScore }}</div>
          <div class="stat-label">{{ item.behTypeName }}</div>
        </div>
      </div>
    </div>

    <!-- 双栏图表 -->
    <div class="chart-row">
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <div class="chart-title">近一周互动情况</div>
            <div class="chart-sub">互动次数趋势分析</div>
          </div>
          <div class="filter-btns">
            <button class="filter-btn" :class="{ active: currentBehTypeId == 0 }"
              @click="onBehTypeChange(0)">
              <span class="ico">📊</span>全部
            </button>
            <button class="filter-btn" v-for="item in todayData.typeList" :key="'wk-' + item.behTypeId"
              :class="{ active: currentBehTypeId == item.behTypeId }"
              @click="onBehTypeChange(item.behTypeId)">
              <img v-if="item.cover && item.cover.indexOf('http') === 0" :src="item.cover" class="ico-img" style="width: 20px;"/>
              <span v-else>{{ getTypeIcon(item.behTypeName) }}</span>{{ item.behTypeName }}
            </button>
          </div>
        </div>
        <div id="weekTrendChart" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <div class="chart-title">近一周互动比例</div>
            <div class="chart-sub">有互动课节次 / 当天课节次总计</div>
          </div>
        </div>
        <div id="weekRatioChart" class="chart-box"></div>
      </div>
    </div>

    <!-- 底部双栏 -->
    <div class="chart-row">
      <!-- 各年级互动分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <div class="chart-title">各年级互动分布</div>
            <div class="chart-sub">各年级发言、提问、赞同占比（发言+提问+共识=100%）</div>
          </div>
        </div>
        <div v-if="!todayData.typeList.length" class="empty">暂无年级数据</div>
        <template v-else>
          <div id="gradeDistChart" class="chart-box big"></div>
          <!-- <div class="legend-row">
            <span class="legend-item" v-for="item in todayData.typeList" :key="'lg-' + item.behTypeId">
              <span class="dot" :style="{ background: getTypeColor(item.behTypeName) }"></span>{{ item.behTypeName }}
            </span>
          </div> -->
        </template>
      </div>

      <!-- 课节互动排行 TOP10 -->
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <div class="chart-title">课节互动排行 TOP10</div>
            <div class="chart-sub">按互动人次排序</div>
          </div>
        </div>
        <div v-if="!todayData.thList.length" class="empty">暂无排行数据</div>
        <div v-else class="rank-grid">
          <div class="rank-item" v-for="(item, idx) in topThList" :key="'rk-' + idx">
            <div class="rank-no" :class="getRankClass(idx)">{{ idx + 1 }}</div>
            <div class="rank-info">
              <div class="rank-teacher">{{ item.createUserName }}<span class="role">老师</span></div>
              <div class="rank-meta">{{ item.morningName || '' }}</div>
            </div>
            <div class="rank-score">{{ item.totalScore || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSchoolTimeAllList } from '@/api/deyu';
import { getHshSchoolBehaviorPortraitSch } from '@/api/hshBehaviorMan';

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const shortDate = (s) => {
  if (!s) return '';
  const arr = s.split('-');
  if (arr.length >= 3) {
    const m = String(arr[1]).padStart(2, '0');
    const d = String(arr[2]).padStart(2, '0');
    return `${m}月${d}日`;
  }
  return s;
};

// 评价项调色板：后台返回的 typeList 按顺序循环分配，确保每个评价项颜色不同
const TYPE_PALETTE = [
  '#3b82f6', // 蓝
  '#f97316', // 橙
  '#22c55e', // 绿
  '#a855f7', // 紫
  '#ec4899', // 粉
  '#06b6d4', // 青
  '#f59e0b', // 黄
  '#ef4444', // 红
  '#14b8a6', // 蓝绿
  '#8b5cf6'  // 紫罗兰
];

export default {
  name: 'schoolBoard',
  data() {
    return {
      termList: [],
      currentTermId: null,
      startDate: '',
      endDate: '',
      todayData: {
        sectionNoCount: 0,
        sectionNoTotalCount: 0,
        thCount: 0,
        thTotalCount: 0,
        thList: [],
        typeList: []
      },
      weekData: {
        dateList: [],
        dateListSectionNo: []
      },
      currentBehTypeId: 0,
      weekChart: null,
      ratioChart: null,
      gradeChart: null,
      timer: null
    };
  },
  computed: {
    ratioPercent() {
      const total = Number(this.todayData.sectionNoTotalCount) || 0;
      const cur = Number(this.todayData.sectionNoCount) || 0;
      if (!total) return 0;
      return Math.round((cur / total) * 100);
    },
    topThList() {
      const list = this.todayData.thList ? this.todayData.thList.slice() : [];
      list.sort((a, b) => (Number(b.totalScore) || 0) - (Number(a.totalScore) || 0));
      return list.slice(0, 10);
    }
  },
  created() {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    this.endDate = formatDate(today);
    this.startDate = formatDate(weekAgo);

    getSchoolTimeAllList()
      .then(res => res.data)
      .then(data => {
        this.termList = data.data || [];
        if (this.termList.length) {
          const cur = this.termList.find(i => i.isCurrent === 1);
          this.currentTermId = cur ? cur.id : this.termList[0].id;
          this.getDetail();
        }
      });
  },
  mounted() {
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    if (this.weekChart) this.weekChart.dispose();
    if (this.ratioChart) this.ratioChart.dispose();
    if (this.gradeChart) this.gradeChart.dispose();
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    onTermChange() {
      this.getDetail();
    },
    onBehTypeChange(behTypeId) {
      if (this.currentBehTypeId === behTypeId) return;
      this.currentBehTypeId = behTypeId;
      if (!this.currentTermId) return;
      const params = {
        schoolTimeId: this.currentTermId,
        startDate: this.startDate,
        endDate: this.endDate,
        behTypeId: behTypeId
      };
      getHshSchoolBehaviorPortraitSch(params).then(res => {
        const data = res.data;
        if (data && data.code === 200 && data.data) {
          // 仅更新折线图所需的 dateList，其余数据保持不变
          this.$set(this.weekData, 'dateList', data.data.dateList || []);
          this.$nextTick(() => {
            this.renderWeekChart();
          });
        }
      });
    },
    getDetail() {
      if (!this.currentTermId) return;
      const params = {
        schoolTimeId: this.currentTermId,
        startDate: this.startDate,
        endDate: this.endDate,
        behTypeId: 0
      };
      getHshSchoolBehaviorPortraitSch(params).then(res => {
        const data = res.data;
        if (data && data.code === 200 && data.data) {
          const d = data.data;
          this.todayData = {
            sectionNoCount: d.sectionNoCount || 0,
            sectionNoTotalCount: d.sectionNoTotalCount || 0,
            thCount: d.thCount || 0,
            thTotalCount: d.thTotalCount || 0,
            thList: d.thList || [],
            typeList: d.typeList || []
          };
          this.weekData = {
            dateList: d.dateList || [],
            dateListSectionNo: d.dateListSectionNo || []
          };
          this.$nextTick(() => {
            this.timer = setTimeout(() => {
              this.renderWeekChart();
              this.renderRatioChart();
              this.renderGradeChart();
            }, 100);
          });
        } else {
          this.todayData = { sectionNoCount: 0, sectionNoTotalCount: 0, thCount: 0, thTotalCount: 0, thList: [], typeList: [] };
          this.weekData = { dateList: [], dateListSectionNo: [] };
        }
      });
    },
    getBehTypeTotal(keyword) {
      if (!this.todayData.typeList || !this.todayData.typeList.length) return 0;
      const item = this.todayData.typeList.find(i => i.behTypeName && i.behTypeName.indexOf(keyword) !== -1);
      if (!item || !item.gradeList) return 0;
      return item.gradeList.reduce((sum, g) => sum + (Number(g.totalScore) || 0), 0);
    },
    // 单个评价项各年级总分累加（gradeList 中各 grade 的 totalScore 求和）
    getTypeTotalScore(item) {
      if (!item) return 0;
      if (item.gradeList && item.gradeList.length) {
        return item.gradeList.reduce((sum, g) => sum + (Number(g.totalScore) || 0), 0);
      }
      return Number(item.totalScore) || 0;
    },
    getTypeIcon(name) {
      if (!name) return '📌';
      if (name.indexOf('发言') !== -1) return '💬';
      if (name.indexOf('提问') !== -1) return '❓';
      if (name.indexOf('共识') !== -1 || name.indexOf('赞同') !== -1) return '👍';
      if (name.indexOf('回答') !== -1) return '🙋';
      if (name.indexOf('讨论') !== -1) return '💡';
      return '📌';
    },
    getTypeColor(name) {
      if (!name) return '#94a3b8';
      // 优先按 behTypeName 在 typeList 中的顺序在调色板取颜色，保证后台每个评价项都有独立颜色
      const list = this.todayData.typeList || [];
      const idx = list.findIndex(t => t.behTypeName === name);
      if (idx >= 0) return TYPE_PALETTE[idx % TYPE_PALETTE.length];
      // 回退：常见关键字预设色
      if (name.indexOf('发言') !== -1) return '#3b82f6';
      if (name.indexOf('提问') !== -1) return '#f97316';
      if (name.indexOf('共识') !== -1 || name.indexOf('赞同') !== -1) return '#22c55e';
      if (name.indexOf('回答') !== -1) return '#a855f7';
      return TYPE_PALETTE[0];
    },
    getRankClass(idx) {
      if (idx === 0) return 'gold';
      if (idx === 1) return 'silver';
      if (idx === 2) return 'bronze';
      return '';
    },
    resizeCharts() {
      if (this.weekChart) this.weekChart.resize();
      if (this.ratioChart) this.ratioChart.resize();
      if (this.gradeChart) this.gradeChart.resize();
    },
    // 生成过去7天的日期列表（YYYY-MM-DD），用于补齐缺失日期
    buildLast7Days() {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(formatDate(d));
      }
      return days;
    },
    renderWeekChart() {
      const dom = document.getElementById('weekTrendChart');
      if (!dom) return;
      if (!this.weekChart) {
        this.weekChart = echarts.init(dom);
      }
      // 默认展示过去7天，接口未返回的日期数据填充为 0
      const last7Days = this.buildLast7Days();
      const valueMap = {};
      (this.weekData.dateList || []).forEach(i => {
        if (i && i.behDate) valueMap[i.behDate] = Number(i.totalScore) || 0;
      });
      const xData = last7Days.map(d => shortDate(d));
      const seriesData = last7Days.map(d => valueMap[d] || 0);
      let color = '#f97316';
      let seriesName = '互动总数';
      if (this.currentBehTypeId !== 0) {
        const type = (this.todayData.typeList || []).find(i => i.behTypeId === this.currentBehTypeId);
        if (type) {
          color = this.getTypeColor(type.behTypeName);
          seriesName = type.behTypeName;
        }
      }
      this.weekChart.setOption({
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#e5e7eb', textStyle: { color: '#1f2937' } },
        grid: { left: '3%', right: '4%', bottom: '6%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisTick: { show: false },
          axisLabel: { color: '#94a3b8', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
          axisLabel: { color: '#94a3b8', fontSize: 12 }
        },
        series: [{
          name: seriesName,
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color },
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: this.hexToRgba(color, 0.35) },
                { offset: 1, color: this.hexToRgba(color, 0.0) }
              ]
            }
          },
          data: seriesData
        }]
      }, true);
    },
    renderRatioChart() {
      const dom = document.getElementById('weekRatioChart');
      if (!dom) return;
      if (!this.ratioChart) {
        this.ratioChart = echarts.init(dom);
      }
      // 默认展示过去7天，接口未返回的日期数据填充为 0
      const last7Days = this.buildLast7Days();
      const sectionMap = {};
      (this.weekData.dateListSectionNo || []).forEach(i => {
        if (i && i.behDate) sectionMap[i.behDate] = i;
      });
      const sectionList = last7Days.map(d => sectionMap[d] || { behDate: d, sectionNoCount: 0, sectionNoTotalCount: 0 });
      const xData = sectionList.map(i => shortDate(i.behDate));
      const ratios = sectionList.map(i => {
        const total = Number(i.sectionNoTotalCount) || 0;
        const cur = Number(i.sectionNoCount) || 0;
        if (!total) return 0;
        return Math.round((cur / total) * 100);
      });
      this.ratioChart.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#e5e7eb',
          textStyle: { color: '#1f2937' },
          formatter: (params) => {
            const p = params[0];
            const item = sectionList[p.dataIndex];
            return `${p.axisValue}<br/>互动比例：${p.value}%${item ? `<br/>互动节次：${item.sectionNoCount}/${item.sectionNoTotalCount}` : ''}`;
          }
        },
        grid: { left: '3%', right: '4%', bottom: '6%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisTick: { show: false },
          axisLabel: { color: '#94a3b8', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
          axisLabel: { color: '#94a3b8', fontSize: 12 }
        },
        series: [{
          type: 'bar',
          barWidth: 26,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: '#f97316'
          },
          emphasis: {
            itemStyle: { color: '#ea580c' }
          },
          data: ratios
        }]
      }, true);
    },
    renderGradeChart() {
      const dom = document.getElementById('gradeDistChart');
      if (!dom || !this.todayData.typeList.length) return;
      if (!this.gradeChart) {
        this.gradeChart = echarts.init(dom);
      }
      // 收集所有年级
      const gradeMap = {};
      const orderArr = [];
      this.todayData.typeList.forEach(t => {
        (t.gradeList || []).forEach(g => {
          if (!gradeMap[g.gradeId]) {
            gradeMap[g.gradeId] = g.gradeName;
            orderArr.push(g.gradeId);
          }
        });
      });
      const gradeIds = orderArr;
      const gradeNames = gradeIds.map(id => gradeMap[id]);

      // 计算每个年级的总数（用于百分比）
      const gradeTotals = gradeIds.map(id => {
        let total = 0;
        this.todayData.typeList.forEach(t => {
          const g = (t.gradeList || []).find(x => String(x.gradeId) === String(id));
          total += Number(g && g.totalScore) || 0;
        });
        return total;
      });

      const series = this.todayData.typeList.map(t => {
        const data = gradeIds.map((id, idx) => {
          const g = (t.gradeList || []).find(x => String(x.gradeId) === String(id));
          const val = Number(g && g.totalScore) || 0;
          const total = gradeTotals[idx];
          return total ? Math.round((val / total) * 100) : 0;
        });
        return {
          name: t.behTypeName,
          type: 'bar',
          stack: 'total',
          barWidth: 36,
          itemStyle: { color: this.getTypeColor(t.behTypeName) },
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            formatter(p) { return p.value > 6 ? p.value + '%' : ''; }
          },
          data
        };
      });

      this.gradeChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#e5e7eb',
          textStyle: { color: '#1f2937' },
          formatter: (params) => {
            let s = params[0].axisValue + '<br/>';
            params.forEach(p => { s += `${p.marker}${p.seriesName}：${p.value}%<br/>`; });
            return s;
          }
        },
        legend: {
          show: true,
          bottom: 0,
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: { color: '#4b5563', fontSize: 13 }
        },
        grid: { left: '3%', right: '4%', bottom: '14%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category',
          data: gradeNames,
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisTick: { show: false },
          axisLabel: { color: '#4b5563', fontSize: 13 }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
          axisLabel: { color: '#94a3b8', fontSize: 12, formatter: '{value}%' }
        },
        series
      }, true);
    },
    hexToRgba(hex, alpha) {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
};
</script>

<style scoped lang="scss">
.school-board {
  padding: 24px;
  box-sizing: border-box;
  background: #f8fafc;
  min-height: 100%;
  font-size: 14px;
  color: #1f2937;

  .page-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;

    .title-wrap {
      .title {
        font-size: 26px;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.2;
      }

      .sub {
        margin-top: 6px;
        font-size: 14px;
        color: #64748b;
      }
    }

    .el-select {
      width: 220px;
    }
  }

  .stat-row {
    display: grid;
    gap: 16px;
    margin-bottom: 16px;

    &.stat-row-1 {
      grid-template-columns: repeat(4, 1fr);
    }

    &.stat-row-2 {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .stat-card {
      background: #fff;
      border-radius: 20px;
      padding: 22px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04);
      transition: all 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      }

      .ico-box {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        flex-shrink: 0;
        overflow: hidden;

        .ico-img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          display: block;
        }

        &.ico-blue {
          background: #dbeafe;
        }

        &.ico-green {
          background: #dcfce7;
        }

        &.ico-orange {
          background: #ffedd5;
        }

        &.ico-purple {
          background: #f3e8ff;
          color: #a855f7;
          font-weight: 700;
        }

        &.ico-light-blue {
          background: #f1f5f9;
        }

        &.ico-light-orange {
          background: #fff7ed;
        }

        &.ico-light-green {
          background: #f0fdf4;
        }
      }

      .stat-info {
        flex: 1;
        min-width: 0;

        .stat-num {
          font-size: 26px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 6px;

          .unit {
            font-size: 18px;
            margin-left: 1px;
          }

          &.blue {
            color: #1e3a8a;
          }

          &.green {
            color: #16a34a;
          }

          &.orange {
            color: #f97316;
          }

          &.purple {
            color: #a855f7;
          }
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
        }
      }
    }
  }

  .chart-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .chart-card {
    background: #fff;
    border-radius: 20px;
    padding: 22px 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;

      .chart-title-wrap {
        .chart-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .chart-sub {
          margin-top: 4px;
          font-size: 12px;
          color: #94a3b8;
        }
      }

      .filter-btns {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .filter-btn {
          height: 30px;
          padding: 0 14px;
          border-radius: 999px;
          border: none;
          background: #f1f5f9;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          font-weight: 500;

          .ico {
            font-size: 14px;
          }

          &:hover {
            background: #e2e8f0;
          }

          &.active {
            background: linear-gradient(135deg, #fb923c 0%, #ef4444 100%);
            color: #fff;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
          }
        }
      }
    }

    .chart-box {
      width: 100%;
      height: 280px;

      &.big {
        height: 320px;
      }
    }

    .empty {
      text-align: center;
      color: #94a3b8;
      padding: 100px 0;
    }

    .legend-row {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 8px;
      flex-wrap: wrap;

      .legend-item {
        font-size: 13px;
        color: #4b5563;
        display: inline-flex;
        align-items: center;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
          display: inline-block;
        }
      }
    }
  }

  .rank-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 18px;

    .rank-item {
      display: flex;
      align-items: center;
      padding: 10px 4px;
      gap: 12px;

      .rank-no {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        background: #f1f5f9;
        color: #64748b;
        flex-shrink: 0;

        &.gold {
          background: #fbbf24;
          color: #fff;
          box-shadow: 0 2px 6px rgba(251, 191, 36, 0.4);
        }

        &.silver {
          background: #cbd5e1;
          color: #fff;
        }

        &.bronze {
          background: #fb923c;
          color: #fff;
        }
      }

      .rank-info {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;

        .rank-teacher {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;

          .role {
            font-size: 13px;
            color: #64748b;
            font-weight: 400;
            margin-left: 2px;
          }
        }

        .rank-meta {
          font-size: 13px;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .rank-score {
        font-size: 16px;
        font-weight: 700;
        color: #ef4444;
        flex-shrink: 0;
      }
    }
  }
}
</style>
