<template>
  <div class="portrait-detail">
    <!-- 顶部 -->
    <div class="page-top">
      <el-button class="back-btn" size="medium" @click="$router.back()">
        <i class="el-icon-arrow-left"></i> 返回学生列表
      </el-button>
    </div>

    <!-- 学生信息卡片 -->
    <div class="student-card">
      <div class="student-info">
        <div class="avatar">
          <img :src="avatar" alt="Avatar" v-if="avatar" style="width: 100%;">
          <div class="initials" v-else>{{ studentLastChar }}</div>
        </div>
        <div class="info">
          <div class="name-line">
            <span class="name">{{ studentName || '-' }}</span>
            <span class="group-tag" v-if="groupName">{{ groupName }}</span>
          </div>
          <div class="meta">
            <span class="meta-item">
              <i class="el-icon-postcard meta-icon"></i>
              <span class="meta-label">学号</span>
              <span class="meta-value">{{ studentNo || '-' }}</span>
            </span>
            <span class="meta-item">
              <i class="el-icon-school meta-icon"></i>
              <span class="meta-value">{{ gradeName || '-' }}</span>
            </span>
            <span class="meta-item">
              <i class="el-icon-collection-tag meta-icon"></i>
              <span class="meta-value">{{ className || '-' }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="active-score">
        <div class="score">{{ allTotalScore }}</div>
        <div class="label">活跃度</div>
      </div>
    </div>

    <!-- 双栏图表 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrap">
              <div class="chart-title">学科画像</div>
              <div class="chart-sub">各学科表现评估</div>
            </div>
            <div class="filter-btns">
              <button class="filter-btn" :class="{ active: currentBehTypeId == 0 }"
                @click="onSelectType({ behTypeId: 0, behTypeName: '全部' })">
                <span class="ico">📊</span>全部
              </button>
              <button class="filter-btn" v-for="item in typeList" :key="'rad-' + item.behTypeId"
                :class="{ active: currentBehTypeId == item.behTypeId }" @click="onSelectType(item)">
                <span class="ico" v-if="item.cover"><img :src="item.cover" class="type-cover" /></span>
                <span class="ico" v-else>{{ getTypeIcon(item.behTypeName) }}</span>{{ item.behTypeName }}
              </button>
            </div>
          </div>
          <div v-if="!currList.length" class="empty">暂无学科数据</div>
          <div v-else id="radarChart" class="chart-box"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrap">
              <div class="chart-title">本周趋势</div>
              <div class="chart-sub">积分变化</div>
            </div>
            <div class="filter-btns">
              <button class="filter-btn" :class="{ active: currentBehTypeId == 0 }"
                @click="onSelectType({ behTypeId: 0, behTypeName: '全部' })">
                <span class="ico">📊</span>全部
              </button>
              <button class="filter-btn" v-for="item in typeList" :key="'wk-' + item.behTypeId"
                :class="{ active: currentBehTypeId == item.behTypeId }" @click="onSelectType(item)">
                <span class="ico" v-if="item.cover"><img :src="item.cover" class="type-cover" /></span>
                <span class="ico" v-else>{{ getTypeIcon(item.behTypeName) }}</span>{{ item.behTypeName }}
              </button>
            </div>
          </div>
          <div v-if="!weekList.length" class="empty">暂无周次数据</div>
          <div v-else id="weekChart" class="chart-box"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 评价项分布对比 -->
    <div class="distribution-card" v-if="typeList.length">
      <div class="card-title-line">
        <span class="card-title">评价项分布</span>
        <span class="card-sub">个人、小组平均、班级平均对比</span>
      </div>

      <div class="distribution-grid">
        <div class="distribution-item" v-for="item in typeList" :key="'dist-' + item.behTypeId">
          <div class="dist-name">
            <span class="ico" v-if="item.cover"><img :src="item.cover" class="type-cover" style="width: 30px; height: 30px;" /></span>
            <span class="ico" v-else>{{ getTypeIcon(item.behTypeName) }}</span>{{ item.behTypeName }}
          </div>
          <div class="dist-bars">
            <div class="bar-row">
              <div class="bar-label">学生本人</div>
              <div class="bar-value self">{{ item.totalScore || 0 }}</div>
              <div class="bar-track">
                <div class="bar bar-self" :style="{ width: getBarWidth(item.totalScore) }"></div>
              </div>
            </div>
            <div class="bar-row">
              <div class="bar-label">小组平均</div>
              <div class="bar-value group">{{ item.avgScoreGroup || 0 }}</div>
              <div class="bar-track">
                <div class="bar bar-group" :style="{ width: getBarWidth(item.avgScoreGroup) }"></div>
              </div>
            </div>
            <div class="bar-row">
              <div class="bar-label">班级平均</div>
              <div class="bar-value class">{{ item.avgScoreClass || 0 }}</div>
              <div class="bar-track">
                <div class="bar bar-class" :style="{ width: getBarWidth(item.avgScoreClass) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能评语 -->
    <div class="comment-card">
      <div class="card-title-line">
        <span class="card-title">📝 智能评语</span>
        <span class="card-sub">基于课堂互动数据自动生成的个性化评语</span>
      </div>
      <div class="overall">
        <div class="overall-title">整体评价</div>
        <div class="overall-content">{{ aiComment }}</div>
      </div>
      <div class="tag-row">
        <div class="tag-block tag-good">
          <div class="tag-title">✨ 表现突出</div>
          <div class="tag-content">
            <div class="tag-item" v-for="(g, i) in goodPoints" :key="'g-' + i">
              <span class="check">✓</span>{{ g }}
            </div>
          </div>
        </div>
        <div class="tag-block tag-improve">
          <div class="tag-title">📈 需要加强</div>
          <div class="tag-content">
            <div class="tag-item" v-for="(t, i) in improvePoints" :key="'t-' + i">
              <span class="arrow">→</span>{{ t }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHshSchoolBehaviorPortraitSt, getClassroomGroupListByStuId } from '@/api/hshBehaviorMan';

export default {
  name: 'personalPortraitDetail',
  data() {
    return {
      avatar: '',
      studentId: '',
      studentName: '',
      studentNo: '',
      gradeName: '',
      className: '',
      groupName: '',
      schoolTimeId: '',
      classId: '',
      groupId: '',
      titleName: '',
      currentBehTypeId: 0,
      typeList: [],
      currList: [],
      weekList: [],
      radarChart: null,
      weekChart: null,
      groupList: []
    };
  },
  computed: {
    studentLastChar() {
      if (!this.studentName) return '';
      return this.studentName.charAt(this.studentName.length - 1);
    },
    allTotalScore() {
      return this.typeList.reduce((sum, item) => sum + (Number(item.totalScore) || 0), 0);
    },
    aiComment() {
      const name = this.studentName || '该学生';
      const total = this.allTotalScore;
      return `${name}同学在本学期的课堂互动中表现活跃，总互动积分达到 ${total} 分，展现出良好的学习积极性和参与热情，整体互动状态保持稳定。`;
    },
    maxBarValue() {
      let max = 0;
      this.typeList.forEach(item => {
        max = Math.max(
          max,
          Number(item.totalScore) || 0,
          Number(item.avgScoreClass) || 0,
          Number(item.avgScoreGroup) || 0
        );
      });
      return max || 1;
    },
    goodPoints() {
      const list = [];
      (this.typeList || []).forEach(item => {
        const self = Number(item.totalScore) || 0;
        const cls = Number(item.avgScoreClass) || 0;
        if (self > cls) {
          list.push(this.getGoodDesc(item.behTypeName));
        }
      });
      if (!list.length) {
        list.push('善于参与课堂互动，展现良好的学习热情');
      }
      return list;
    },
    improvePoints() {
      const list = [];
      (this.typeList || []).forEach(item => {
        const self = Number(item.totalScore) || 0;
        const cls = Number(item.avgScoreClass) || 0;
        if (self < cls) {
          list.push(`${item.behTypeName}互动低于班级平均，建议加强参与`);
        }
      });
      if (!list.length) {
        list.push('继续保持良好的课堂互动状态');
      }
      return list;
    }
  },
  async created() {
    const q = this.$route.query || {};
    this.studentId = q.studentId || '';
    this.studentName = q.studentName || '';
    this.studentNo = q.studentNo || '';
    this.gradeName = q.gradeName || '';
    this.className = q.className || '';
    this.groupName = q.groupName || '';
    this.schoolTimeId = q.schoolTimeId || '';
    this.classId = q.classId || '';
    this.groupId = q.groupId || '';
    this.titleName = q.titleName || '';
    this.avatar = q.avatar || '';
    this.currentBehTypeId = q.behTypeId !== undefined ? Number(q.behTypeId) : 0;
    await this.getClassroomGroupListByStuId();
    await this.getDetail();
  },
  beforeDestroy() {
    if (this.radarChart) this.radarChart.dispose();
    if (this.weekChart) this.weekChart.dispose();
  },
  methods: {
    async getClassroomGroupListByStuId() {
      const { data } = await getClassroomGroupListByStuId({ studentId: this.studentId });
      if (data && data.code === 200 && data.data) {
        this.groupList = data.data.filter(i => i.behGroupType === 1)[0] || {};
      }
      console.log(this.groupList);
    },

    getTypeIcon(name) {
      if (!name) return '📌';
      if (name.indexOf('发言') !== -1) return '💬';
      if (name.indexOf('提问') !== -1) return '❓';
      if (name.indexOf('共识') !== -1) return '🤝';
      if (name.indexOf('回答') !== -1) return '🙋';
      if (name.indexOf('讨论') !== -1) return '💡';
      return '📌';
    },
    getGoodDesc(name) {
      if (!name) return '课堂参与积极，表现突出';
      if (name.indexOf('提问') !== -1) return `善于${name}，喜欢深入思考和探究问题`;
      if (name.indexOf('发言') !== -1) return `善于${name}，能积极表达自己的观点`;
      if (name.indexOf('共识') !== -1) return `善于达成${name}，团队协作能力强`;
      if (name.indexOf('回答') !== -1) return `善于${name}问题，思维敏捷反应迅速`;
      if (name.indexOf('讨论') !== -1) return `积极参与${name}，乐于交流分享`;
      return `${name}表现突出，展现良好的学习热情`;
    },
    getBarWidth(val) {
      const v = Number(val) || 0;
      const pct = (v / this.maxBarValue) * 100;
      return Math.max(pct, 2) + '%';
    },
    onSelectType(item) {
      if (this.currentBehTypeId === item.behTypeId) return;
      this.currentBehTypeId = item.behTypeId;
      this.titleName = item.behTypeName || '';
      this.getDetail();
    },
    async getDetail() {
      const params = {
        behTypeId: this.currentBehTypeId || 0,
        schoolTimeId: this.schoolTimeId,
        studentId: this.studentId,
        groupId: this.groupList.id || ''
      };
      if (this.classId) params.classId = this.classId;
      if (this.groupId) params.groupId = this.groupId;
      const { data } = await getHshSchoolBehaviorPortraitSt(params);
      if (data && data.code === 200 && data.data) {
        this.typeList = data.data.typeList || [];
        this.currList = data.data.currList || [];
        this.weekList = data.data.weekList || [];
        // 数据为空时销毁旧实例，避免 v-else 移除 DOM 后图表残留
        if (!this.currList.length && this.radarChart) {
          this.radarChart.dispose();
          this.radarChart = null;
        }
        if (!this.weekList.length && this.weekChart) {
          this.weekChart.dispose();
          this.weekChart = null;
        }
        this.$nextTick(() => {
          this.renderRadarChart();
          this.renderWeekChart();
        });
      } else {
        this.typeList = [];
        this.currList = [];
        this.weekList = [];
        if (this.radarChart) {
          this.radarChart.dispose();
          this.radarChart = null;
        }
        if (this.weekChart) {
          this.weekChart.dispose();
          this.weekChart = null;
        }
      }
    },
    renderRadarChart() {
      const dom = document.getElementById('radarChart');
      if (!dom || !this.currList.length) return;
      if (!this.radarChart) {
        this.radarChart = echarts.init(dom);
      }
      const max = Math.max(...this.currList.map(i => Number(i.totalScore) || 0), 100);
      this.radarChart.setOption({
        tooltip: { trigger: 'item' },
        radar: {
          indicator: this.currList.map(i => ({ name: i.curriculumName, max })),
          radius: '65%',
          splitNumber: 4,
          axisName: { color: '#606266', fontSize: 12 },
          splitArea: { areaStyle: { color: ['#fff', '#fafafa'] } },
          splitLine: { lineStyle: { color: '#e4e7ed' } },
          axisLine: { lineStyle: { color: '#e4e7ed' } }
        },
        series: [{
          type: 'radar',
          symbol: 'circle',
          symbolSize: 6,
          areaStyle: { color: 'rgba(245, 158, 11, 0.3)' },
          lineStyle: { color: '#f59e0b', width: 2 },
          itemStyle: { color: '#f59e0b' },
          data: [{
            value: this.currList.map(i => Number(i.totalScore) || 0),
            name: '学科得分'
          }]
        }]
      });
    },
    renderWeekChart() {
      const dom = document.getElementById('weekChart');
      if (!dom || !this.weekList.length) return;
      if (!this.weekChart) {
        this.weekChart = echarts.init(dom);
      }
      this.weekChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.weekList.map(i => '第' + i.severalWeek + '周'),
          axisLine: { lineStyle: { color: '#e4e7ed' } },
          axisLabel: { color: '#909399' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5' } },
          axisLabel: { color: '#909399' }
        },
        series: [{
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#3b82f6' },
          lineStyle: { color: '#3b82f6', width: 3 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.02)' }
              ]
            }
          },
          data: this.weekList.map(i => Number(i.totalScore) || 0)
        }]
      });
    }
  }
}
</script>

<style scoped lang="scss">
.portrait-detail {
  padding: 20px;
  box-sizing: border-box;

  .type-cover {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    vertical-align: middle;
    display: inline-block;
  }

  background: linear-gradient(180deg, #f3eef7 0%, #f7f8fa 240px, #f7f8fa 100%);
  min-height: 100%;
  font-size: 14px;
  color: #1f2937;

  .page-top {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .back-btn {
      border-radius: 999px;
      padding: 8px 18px;
      background: rgba(255, 255, 255, 0.85);
      border-color: rgba(99, 102, 241, 0.2);
      color: #4b5563;
      transition: all 0.25s;

      &:hover {
        color: #6366f1;
        border-color: #6366f1;
        transform: translateX(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
      }
    }
  }

  .student-card {
    position: relative;
    background: linear-gradient(135deg, #f3e7ff 0%, #ffd6f5 100%);
    border: 1px solid #ede9fe;
    border-radius: 20px;
    padding: 24px 28px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.12);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      right: -50px;
      top: -50px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.5), transparent 70%);
      pointer-events: none;
    }

    .student-info {
      display: flex;
      align-items: center;
      gap: 18px;
      position: relative;
      z-index: 1;

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: #fff;
        font-size: 28px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35),
          inset 0 -2px 6px rgba(0, 0, 0, 0.08);
      }

      .info {
        .name-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;

          .name {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
            letter-spacing: 0.3px;
          }

          .group-tag {
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            color: #fff;
            font-size: 12px;
            padding: 3px 12px;
            border-radius: 999px;
            box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
          }
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 13px;

          .meta-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 12px;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 999px;
            backdrop-filter: blur(4px);
            transition: all 0.25s;
            box-shadow: 0 1px 3px rgba(99, 102, 241, 0.06);

            &:hover {
              background: rgba(255, 255, 255, 0.9);
              transform: translateY(-1px);
              box-shadow: 0 3px 8px rgba(99, 102, 241, 0.12);
            }

            .meta-icon {
              font-size: 13px;
              color: #8b5cf6;
            }

            .meta-label {
              color: #9ca3af;
              font-size: 12px;
            }

            .meta-value {
              color: #4b5563;
              font-weight: 600;
              letter-spacing: 0.2px;
            }
          }

          .dot {
            margin: 0 6px;
            color: #d1d5db;
          }
        }
      }
    }

    .active-score {
      text-align: center;
      position: relative;
      z-index: 1;
      padding: 6px 16px;

      .score {
        font-size: 38px;
        font-weight: 800;
        background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        letter-spacing: 0.5px;
      }

      .label {
        margin-top: 8px;
        color: #6b7280;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 1px;
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;
  }

  .chart-card {
    background: #fff;
    border: 1px solid #eef0f3;
    border-radius: 16px;
    padding: 20px;
    height: 100%;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    transition: box-shadow 0.25s;

    &:hover {
      box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
    }

    .chart-header {
      margin-bottom: 12px;

      .chart-title-wrap {
        margin-bottom: 12px;

        .chart-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          position: relative;
          padding-left: 12px;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 14px;
            border-radius: 2px;
            background: linear-gradient(180deg, #f97316, #ef4444);
          }
        }

        .chart-sub {
          margin-top: 4px;
          margin-left: 12px;
          font-size: 12px;
          color: #9ca3af;
        }
      }

      .filter-btns {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .filter-btn {
          height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          background: #fff;
          font-size: 12px;
          color: #4b5563;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;

          .ico {
            font-size: 13px;
          }

          &:hover {
            border-color: #f97316;
            color: #f97316;
            transform: translateY(-1px);
          }

          &.active {
            background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
            color: #fff;
            border-color: transparent;
            box-shadow: 0 4px 10px rgba(249, 115, 22, 0.35);
          }
        }
      }
    }

    .chart-box {
      width: 100%;
      height: 280px;
    }

    .empty {
      text-align: center;
      color: #9ca3af;
      padding: 80px 0;
    }
  }

  .distribution-card {
    background: linear-gradient(135deg, #faf6ee 0%, #f5efe2 100%);
    border: 1px solid #ede4d0;
    border-radius: 16px;
    padding: 22px 22px 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(146, 109, 39, 0.05);

    .card-title-line {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 18px;
      padding-left: 4px;

      .card-title {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
      }

      .card-sub {
        font-size: 12px;
        color: #9ca3af;
      }
    }
  }

  .distribution-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .distribution-item {
      background: #fdfaf2;
      border-radius: 14px;
      padding: 22px 28px 26px;
      border: 1px solid rgba(0, 0, 0, 0.04);
      box-shadow: 0 2px 6px rgba(146, 109, 39, 0.04);
      transition: transform 0.25s, box-shadow 0.25s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(146, 109, 39, 0.1);
      }

      .dist-name {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 18px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        .ico {
          font-size: 18px;
        }
      }

      .dist-bars {
        .bar-row {
          margin-bottom: 16px;
          text-align: center;

          &:last-child {
            margin-bottom: 0;
          }

          .bar-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
            font-weight: 500;
          }

          .bar-value {
            font-size: 22px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 8px;
            letter-spacing: 0.5px;

            &.self {
              color: #ea580c;
            }

            &.group {
              color: #2563eb;
            }

            &.class {
              color: #8b5cf6;
            }
          }

          .bar-track {
            width: 100%;
            height: 6px;
            background: #ece5d4;
            border-radius: 999px;
            overflow: hidden;

            .bar {
              height: 100%;
              border-radius: 999px;
              transition: width 0.6s ease;
            }

            .bar-self {
              background: linear-gradient(90deg, #fb923c 0%, #ea580c 100%);
            }

            .bar-group {
              background: linear-gradient(90deg, #60a5fa 0%, #2563eb 100%);
            }

            .bar-class {
              background: linear-gradient(90deg, #c4b5fd 0%, #8b5cf6 100%);
            }
          }
        }
      }
    }
  }

  .comment-card {
    background: linear-gradient(135deg, #fff7e6 0%, #fef0d6 100%);
    border: 1px solid #fde9c8;
    border-radius: 16px;
    padding: 22px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.06);

    .card-title-line {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 16px;

      .card-title {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
      }

      .card-sub {
        font-size: 12px;
        color: #9ca3af;
      }
    }

    .overall {
      background: #fff;
      border-left: 4px solid #f97316;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 16px;
      box-shadow: 0 2px 6px rgba(249, 115, 22, 0.08);

      .overall-title {
        font-size: 13px;
        font-weight: 700;
        color: #c2410c;
        margin-bottom: 6px;
        display: inline-flex;
        align-items: center;
        gap: 6px;

        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
        }
      }

      .overall-content {
        font-size: 13px;
        color: #78350f;
        line-height: 1.85;
      }
    }
  }

  .tag-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 0;

    .tag-block {
      border-radius: 12px;
      padding: 16px 18px;
      transition: transform 0.25s, box-shadow 0.25s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
      }

      .tag-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 1px dashed currentColor;
      }

      .tag-content {
        .tag-item {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.9;
          display: flex;
          align-items: flex-start;

          .check {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #10b981;
            color: #fff;
            font-size: 11px;
            font-weight: bold;
            margin: 5px 8px 0 0;
          }

          .arrow {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #f97316;
            color: #fff;
            font-size: 11px;
            font-weight: bold;
            margin: 5px 8px 0 0;
          }
        }
      }

      &.tag-good {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        border: 1px solid #a7f3d0;

        .tag-title {
          color: #065f46;
          border-bottom-color: rgba(6, 95, 70, 0.2);
        }
      }

      &.tag-improve {
        background: linear-gradient(135deg, #fff7ed 0%, #ffe6d3 100%);
        border: 1px solid #fed7aa;

        .tag-title {
          color: #9a3412;
          border-bottom-color: rgba(154, 52, 18, 0.2);
        }
      }
    }
  }
}
</style>
