<template>
  <div class="group-portrait-detail">
    <!-- 顶部返回 -->
    <div class="page-top">
      <div class="page-title-wrap">
        <div class="back-link" @click="$router.back()">
          <i class="el-icon-arrow-left"></i> 返回小组列表
        </div>
      </div>
    </div>

    <!-- 小组信息卡片 -->
    <div class="group-card">
      <div class="left">
        <div class="avatar">{{ groupName ? groupName.toString().charAt(0) : '组' }}</div>
        <div class="info">
          <div class="name">{{ groupName || '-' }}</div>
          <div class="meta">
            <span class="meta-item"><i class="el-icon-school"></i>{{ gradeName || '' }}{{ className || '-' }}</span>
            <span class="meta-item rank"><i class="el-icon-trophy"></i>第{{ rank || '-' }}名</span>
            <span class="meta-item"><i class="el-icon-user"></i>{{ memberCount }}人</span>
          </div>
        </div>
      </div>
      <div class="active-score">
        <div class="score">{{ totalScore }}</div>
        <div class="label">活跃度</div>
      </div>
    </div>

    <!-- 成员活跃度（筛选项） -->
    <div class="block-card">
      <div class="block-title">
        <span class="ico">👨‍👩</span>
        <span>成员活跃度</span>
      </div>
      <div class="filter-btns">
        <button class="filter-btn" :class="{ active: currentBehTypeId === 0 }"
          @click="onSelectType({ id: 0, title: '全部' })">全部</button>
        <button class="filter-btn" v-for="item in behTypeList" :key="item.id"
          :class="{ active: currentBehTypeId === item.id }" @click="onSelectType(item)">{{ item.title }}</button>
      </div>
      <div class="member-rank-list" v-if="memberCards.length">
        <div class="rank-card" v-for="(card, idx) in memberCards" :key="card.studentId || idx">
          <div class="rank-badge">{{ idx + 1 }}</div>
          <div class="rank-name">{{ card.name }}</div>
          <div class="rank-score">{{ card.score }}</div>
          <div class="rank-tags">
            <span class="rank-tag" v-for="(t, ti) in card.topBehaviors" :key="ti"
              :style="{ color: behTagColors[ti % behTagColors.length] }">{{ t.abbr }}{{ t.score }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty">暂无成员数据</div>
    </div>

    <!-- 近一周表现 -->
    <div class="block-card">
      <div class="block-title-wrap">
        <div class="block-title">
          <span class="ico">📅</span>
          <span>近一周表现</span>
        </div>
        <div class="block-sub">柱状图展示（周六周日休息）</div>
      </div>
      <div v-if="!hasWeekData" class="empty">暂无近一周数据</div>
      <div v-show="hasWeekData" id="gpdWeekChart" class="chart-box"></div>
    </div>

    <!-- 班级小组对比 -->
    <div class="block-card">
      <div class="block-title-wrap">
        <div class="block-title">
          <span class="ico">📊</span>
          <span>班级小组对比</span>
        </div>
        <div class="block-sub">{{ className || '当前班级' }}各小组活跃度对比</div>
      </div>
      <div v-if="!classGroupList.length" class="empty">暂无班级小组数据</div>
      <div v-show="classGroupList.length" id="gpdClassChart" class="chart-box"></div>
      <div class="legend" v-if="classGroupList.length">
        <span class="legend-item"><i class="dot dot-cur"></i>{{ groupName }}</span>
        <span class="legend-item"><i class="dot dot-other"></i>其他小组</span>
      </div>
    </div>

    <!-- 学科表现对比 -->
    <div class="block-card">
      <div class="block-title-wrap">
        <div class="block-title">
          <span class="ico">📚</span>
          <span>学科表现对比</span>
        </div>
        <div class="block-sub">各学科活跃度分布</div>
      </div>
      <div class="filter-btns mb">
        <button class="filter-btn" :class="{ active: currentBehTypeId === 0 }"
          @click="onSelectType({ id: 0, title: '全部' })">全部</button>
        <button class="filter-btn" v-for="item in behTypeList" :key="'s-' + item.id"
          :class="{ active: currentBehTypeId === item.id }" @click="onSelectType(item)">{{ item.title }}</button>
      </div>
      <div v-if="!currList.length" class="empty">暂无学科数据</div>
      <div v-show="currList.length" id="gpdSubjectChart" class="chart-box"></div>
    </div>

    <!-- 智能评语 -->
    <div class="comment-card">
      <div class="block-title-wrap">
        <div class="block-title">
          <span class="ico">📝</span>
          <span>智能评语</span>
        </div>
        <div class="block-sub">基于小组课堂互动数据自动生成</div>
      </div>

      <div class="overall">
        <div class="overall-title">整体评价</div>
        <div class="overall-content">{{ overallComment }}</div>
      </div>

      <div class="tag-row">
        <div class="tag-block tag-good">
          <div class="tag-title">✨ 表现突出</div>
          <div class="tag-list">
            <div class="tag-item" v-for="(g, i) in goodPoints" :key="'g' + i">
              <span class="check">✓</span>{{ g }}
            </div>
          </div>
        </div>
        <div class="tag-block tag-improve">
          <div class="tag-title">📈 需要加强</div>
          <div class="tag-list">
            <div class="tag-item" v-for="(t, i) in improvePoints" :key="'t' + i">
              <span class="arrow">→</span>{{ t }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getHshSchoolBehaviorPortraitGroup,
  getHshSchoolBehaviorPortraitGroupList,
  getGroupStuBehByGroupId
} from '@/api/hshBehaviorMan';
import { getSchoolBehaviorTypeListBySchoolId } from '@/api/ketang';

export default {
  name: 'groupPortraitDetail',
  data() {
    return {
      groupId: '',
      groupName: '',
      gradeId: '',
      gradeName: '',
      classId: '',
      className: '',
      schoolTimeId: '',
      currentBehTypeId: 0,
      behTypeList: [],
      currList: [],
      dateList: [],
      classGroupList: [],
      groupStuList: [],
      memberCount: 0,
      behTagColors: ['#22C55E', '#3B82F6', '#F59E0B', '#A855F7', '#EC4899', '#06B6D4', '#EF4444', '#14B8A6', '#8B5CF6'],
      rank: '-',
      totalScore: 0,
      weekChart: null,
      classChart: null,
      subjectChart: null,
      otherColors: ['#EF4444', '#22C55E', '#A855F7', '#EC4899', '#06B6D4', '#0EA5E9', '#14B8A6', '#F59E0B']
    };
  },
  computed: {
    hasWeekData() {
      return this.dateList && this.dateList.length > 0;
    },
    memberCards() {
      if (!this.groupStuList || !this.groupStuList.length) return [];
      const behId = this.currentBehTypeId || 0;
      const cards = this.groupStuList.map(s => {
        const behaviors = s.behaviorTypeJSONArray || [];
        let score = 0;
        if (behId === 0) {
          score = Number(s.totalScore || 0);
          if (!score) {
            score = behaviors.reduce((sum, b) => sum + Number(b.totalScore || 0), 0);
          }
        } else {
          const hit = behaviors.find(b => String(b.behTypeId) === String(behId));
          score = hit ? Number(hit.totalScore || 0) : 0;
        }
        const topBehaviors = [...behaviors]
          .map(b => ({
            abbr: (b.behTypeName || '').charAt(0),
            score: Number(b.totalScore || 0),
            behTypeId: b.behTypeId
          }))
          .filter(b => b.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        return {
          studentId: s.studentId,
          name: s.studentName || s.name || '',
          score,
          topBehaviors
        };
      });
      cards.sort((a, b) => b.score - a.score);
      return cards;
    },
    overallComment() {
      const name = this.groupName || '本小组';
      const total = this.totalScore || 0;
      const cnt = this.memberCount || 0;
      const avg = cnt > 0 ? Math.round((total / cnt) * 10) / 10 : total;
      return `${name}在本学期表现非常活跃，小组总活跃度达${total}次，人均${avg}次，展现出强大的团队协作能力和学习热情。`;
    },
    classGroupAvg() {
      if (!this.classGroupList.length) return 0;
      const sum = this.classGroupList.reduce((s, i) => s + (Number(i.totalScore) || 0), 0);
      return sum / this.classGroupList.length;
    },
    currAvgScore() {
      if (!this.currList.length) return 0;
      const sum = this.currList.reduce((s, i) => s + (Number(i.totalScore) || 0), 0);
      return sum / this.currList.length;
    },
    goodPoints() {
      const list = [];
      // 1) 小组整体活跃度高于班级各小组平均
      if (this.classGroupAvg > 0 && this.totalScore > this.classGroupAvg) {
        list.push('小组整体活跃度高于班级平均，团队协作意识突出');
      }
      // 2) 各学科得分高于学科平均
      if (this.currList.length) {
        const avg = this.currAvgScore;
        this.currList.forEach(item => {
          if ((Number(item.totalScore) || 0) > avg && item.curriculumName) {
            list.push(this.getGoodDesc(item.curriculumName));
          }
        });
      }
      if (!list.length) {
        list.push('善于参与课堂互动，团队整体表现稳定');
      }
      return list;
    },
    improvePoints() {
      const list = [];
      // 1) 小组整体活跃度低于班级各小组平均
      if (this.classGroupAvg > 0 && this.totalScore < this.classGroupAvg) {
        list.push('小组活跃度低于班级平均，建议加强课堂参与');
      }
      // 2) 各学科得分低于学科平均
      if (this.currList.length) {
        const avg = this.currAvgScore;
        this.currList.forEach(item => {
          if ((Number(item.totalScore) || 0) < avg && item.curriculumName) {
            list.push(`${item.curriculumName}学科互动偏少，建议加强参与`);
          }
        });
      }
      if (!list.length) {
        list.push('继续保持良好的团队互动状态');
      }
      return list;
    }
  },
  created() {
    const q = this.$route.query || {};
    this.groupId = q.groupId || '';
    this.groupName = q.groupName || '';
    this.gradeId = q.gradeId || '';
    this.gradeName = q.gradeName || '';
    this.classId = q.classId || '';
    this.className = q.className || '';
    this.schoolTimeId = q.schoolTimeId || '';
    this.fetchAll();
  },
  beforeDestroy() {
    if (this.weekChart) this.weekChart.dispose();
    if (this.classChart) this.classChart.dispose();
    if (this.subjectChart) this.subjectChart.dispose();
  },
  methods: {
    getGoodDesc(name) {
      if (!name) return '学科表现突出，展现良好的学习热情';
      const map = [
        { key: '语文', text: `${name}学科互动积极，展现良好的语言表达能力` },
        { key: '数学', text: `${name}学科思维活跃，逻辑推理能力强` },
        { key: '英语', text: `${name}学科参与热情高，乐于交流分享` },
        { key: '科学', text: `${name}学科探究欲强，喜欢深入思考和探索问题` },
        { key: '物理', text: `${name}学科分析能力强，善于解决实际问题` },
        { key: '化学', text: `${name}学科观察细致，善于实验探究` },
        { key: '生物', text: `${name}学科兴趣浓厚，善于观察与归纳` },
        { key: '历史', text: `${name}学科表现突出，知识积累扎实` },
        { key: '地理', text: `${name}学科表现突出，空间思维能力强` },
        { key: '政治', text: `${name}学科见解独到，善于思辨表达` },
        { key: '道德', text: `${name}学科参与积极，价值观念正向` },
        { key: '体育', text: `${name}学科活跃度高，团队协作精神强` },
        { key: '音乐', text: `${name}学科表现优异，富有艺术表现力` },
        { key: '美术', text: `${name}学科创造力强，善于表达创意` },
        { key: '信息', text: `${name}学科兴趣浓厚，动手实践能力强` },
        { key: '综合', text: `${name}学科参与积极，综合素养突出` }
      ];
      for (const m of map) {
        if (name.indexOf(m.key) !== -1) return m.text;
      }
      return `${name}学科表现突出，展现良好的学习兴趣`;
    },
    async fetchAll() {
      await Promise.all([
        this.fetchBehTypeList(),
        this.fetchClassGroupList(),
        this.fetchDetail(),
        this.fetchGroupStuList()
      ]);
    },
    fetchBehTypeList() {
      return getSchoolBehaviorTypeListBySchoolId(2)
        .then(res => res.data)
        .then(data => {
          this.behTypeList = (data && data.data) || [];
        });
    },
    fetchClassGroupList() {
      const params = {
        behTypeId: this.currentBehTypeId || 0,
        classId: this.classId,
        schoolTimeId: this.schoolTimeId
      };
      return getHshSchoolBehaviorPortraitGroupList(params).then(res => {
        const data = res.data;
        if (data && data.code === 200 && data.data) {
          const list = data.data || [];
          this.classGroupList = list;
          const cur = list.find(i => String(i.id) === String(this.groupId));
          if (cur) {
            this.totalScore = Number(cur.totalScore) || 0;
            this.memberCount = (cur.groupTeahcerStuList || []).length;
          }
          const sorted = [...list].sort((a, b) =>
            (Number(b.totalScore) || 0) - (Number(a.totalScore) || 0));
          const idx = sorted.findIndex(i => String(i.id) === String(this.groupId));
          this.rank = idx >= 0 ? idx + 1 : '-';
          this.$nextTick(() => this.renderClassChart());
        } else {
          this.classGroupList = [];
        }
      });
    },
    fetchDetail() {
      const range = this.getWeekRange();
      const params = {
        behTypeId: this.currentBehTypeId || 0,
        classId: this.classId,
        groupId: this.groupId,
        schoolTimeId: this.schoolTimeId,
        startDate: range.startDate,
        endDate: range.endDate
      };
      return getHshSchoolBehaviorPortraitGroup(params).then(res => {
        const data = res.data;
        if (data && data.code === 200 && data.data) {
          this.currList = data.data.currList || [];
          this.dateList = this.fillWeekDates(data.data.dateList || [], range);
          this.$nextTick(() => {
            this.renderWeekChart();
            this.renderSubjectChart();
          });
        } else {
          this.currList = [];
          this.dateList = [];
        }
      });
    },
    // 成员活跃度：按当前 behTypeId 查询小组学生评价列表
    fetchGroupStuList() {
      if (!this.classId || !this.groupId) {
        this.groupStuList = [];
        this.memberTags = [];
        return Promise.resolve();
      }

      const params = {
        
        classId: this.classId,
        groupId: this.groupId,
        isMorning: 0,
        nodeNumber: 0,
        sectionNo: 0
      };
      return getGroupStuBehByGroupId(params).then(res => {
        const data = (res && res.data && res.data.data) || {};
        this.groupStuList = data.stuList || [];
      }).catch(() => {
        this.groupStuList = [];
      });
    },
    onSelectType(item) {
      const id = item.id || 0;
      if (this.currentBehTypeId === id) return;
      this.currentBehTypeId = id;
      this.fetchDetail();
    },
    getWeekRange() {
      const fmt = d =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return { startDate: fmt(start), endDate: fmt(end) };
    },
    fillWeekDates(list, range) {
      const map = {};
      (list || []).forEach(item => {
        const k = (item.behDate || '').slice(0, 10);
        map[k] = Number(item.totalScore) || 0;
      });
      const out = [];
      const start = new Date(range.startDate);
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const wkLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        out.push({
          behDate: key,
          weekLabel: wkLabels[d.getDay()],
          totalScore: map[key] || 0
        });
      }
      return out;
    },
    renderWeekChart() {
      const dom = document.getElementById('gpdWeekChart');
      if (!dom || !this.dateList.length) return;
      if (!this.weekChart) {
        this.weekChart = window.echarts.init(dom);
      }
      this.weekChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '8%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category',
          data: this.dateList.map(i => i.weekLabel),
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } },
          axisLabel: { color: '#9ca3af', fontSize: 12 }
        },
        series: [{
          type: 'bar',
          barWidth: '38%',
          data: this.dateList.map(i => Number(i.totalScore) || 0),
          itemStyle: {
            color: '#FF8833',
            borderRadius: [6, 6, 0, 0]
          }
        }]
      });
      this.weekChart.resize();
    },
    renderClassChart() {
      const dom = document.getElementById('gpdClassChart');
      if (!dom || !this.classGroupList.length) return;
      if (!this.classChart) {
        this.classChart = window.echarts.init(dom);
      }
      const xData = this.classGroupList.map(i => i.title);
      let otherIdx = 0;
      const data = this.classGroupList.map(i => {
        const isCur = String(i.id) === String(this.groupId);
        const color = isCur ? '#FF8833' : this.otherColors[(otherIdx++) % this.otherColors.length];
        return {
          value: Number(i.totalScore) || 0,
          itemStyle: { color, borderRadius: [6, 6, 0, 0] }
        };
      });
      this.classChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '10%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280', fontSize: 12, interval: 0 }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } },
          axisLabel: { color: '#9ca3af', fontSize: 12 }
        },
        series: [{ type: 'bar', barWidth: '42%', data }]
      });
      this.classChart.resize();
    },
    renderSubjectChart() {
      const dom = document.getElementById('gpdSubjectChart');
      if (!dom || !this.currList.length) return;
      if (!this.subjectChart) {
        this.subjectChart = window.echarts.init(dom);
      }
      this.subjectChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '10%', top: '8%', containLabel: true },
        xAxis: {
          type: 'category',
          data: this.currList.map(i => i.curriculumName),
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280', fontSize: 12, interval: 0 }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } },
          axisLabel: { color: '#9ca3af', fontSize: 12 }
        },
        series: [{
          type: 'bar',
          barWidth: '42%',
          data: this.currList.map(i => Number(i.totalScore) || 0),
          itemStyle: { color: '#FF8833', borderRadius: [6, 6, 0, 0] }
        }]
      });
      this.subjectChart.resize();
    }
  }
};
</script>

<style scoped lang="scss">
.group-portrait-detail {
  padding: 20px 24px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #fff7ee 0%, #f5f7fb 220px, #f5f7fb 100%);
  min-height: 100%;
  font-size: 14px;
  color: #1f2937;

  .page-top {
    margin-bottom: 16px;

    .page-title-wrap {
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 6px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(6px);
        color: #4b5563;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid rgba(255, 136, 51, 0.15);
        transition: all 0.25s ease;

        i {
          font-size: 14px;
        }

        &:hover {
          color: #FF8833;
          background: #fff;
          border-color: rgba(255, 136, 51, 0.4);
          box-shadow: 0 4px 12px rgba(255, 136, 51, 0.15);
          transform: translateX(-2px);
        }
      }
    }
  }

  .group-card {
    position: relative;
    background: linear-gradient(135deg, #ffffff 0%, #fff8f0 100%);
    border: 1px solid rgba(255, 136, 51, 0.18);
    border-radius: 16px;
    padding: 22px 28px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 16px rgba(255, 136, 51, 0.08);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -40px;
      right: -40px;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 136, 51, 0.12), transparent 70%);
      pointer-events: none;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 18px;
      position: relative;
      z-index: 1;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FFB070 0%, #FF8833 60%, #F26B1F 100%);
        color: #fff;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 1px;
        box-shadow: 0 6px 16px rgba(255, 136, 51, 0.35),
          inset 0 -2px 6px rgba(0, 0, 0, 0.08);
      }

      .info {
        .name {
          font-size: 19px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;

          .meta-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 10px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 999px;
            line-height: 1.4;

            i {
              font-size: 12px;
              color: #FF8833;
            }

            &.rank {
              background: linear-gradient(135deg, #fff7ed, #ffe6d3);
              color: #c2410c;
              border-color: rgba(255, 136, 51, 0.25);
              font-weight: 600;

              i {
                color: #ea580c;
              }
            }
          }
        }
      }
    }

    .active-score {
      text-align: center;
      position: relative;
      z-index: 1;
      padding: 6px 18px;

      .score {
        font-size: 36px;
        font-weight: 800;
        background: linear-gradient(135deg, #FF8833 0%, #F26B1F 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        letter-spacing: 0.5px;
      }

      .label {
        margin-top: 6px;
        font-size: 12px;
        color: #9a3412;
        font-weight: 500;
        letter-spacing: 1px;
      }
    }
  }

  .block-card,
  .comment-card {
    position: relative;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    padding: 20px 22px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    transition: box-shadow 0.25s ease, transform 0.25s ease;

    &:hover {
      box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
    }
  }

  .block-card {
    &::before {
      content: '';
      position: absolute;
      left: 18px;
      top: 22px;
      width: 3px;
      height: 18px;
      border-radius: 2px;
      background: linear-gradient(180deg, #FF8833, #F26B1F);
    }
  }

  .block-title-wrap {
    margin-bottom: 16px;
    padding-left: 12px;
  }

  .block-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    padding-left: 12px;

    .ico {
      font-size: 17px;
      color: #FF8833;
    }
  }

  .block-card>.block-title {
    padding-left: 12px;
  }

  .block-title-wrap .block-title {
    padding-left: 0;
  }

  .block-sub {
    margin-top: 6px;
    margin-left: 26px;
    font-size: 12px;
    color: #9ca3af;
  }

  .filter-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-left: 12px;
    margin-top: 18px;

    &.mb {
      margin-bottom: 16px;
    }

    .filter-btn {
      height: 30px;
      padding: 0 16px;
      border-radius: 999px;
      border: 1px solid transparent;
      background: #f3f4f6;
      font-size: 12px;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.25s ease;
      font-weight: 500;

      &:hover {
        background: #ffe6d3;
        color: #FF8833;
        border-color: rgba(255, 136, 51, 0.25);
        transform: translateY(-1px);
      }

      &.active {
        background: linear-gradient(135deg, #FFB070, #FF8833);
        color: #fff;
        box-shadow: 0 4px 12px rgba(255, 136, 51, 0.4);
        border-color: transparent;
        transform: translateY(-1px);
      }
    }
  }

  .member-rank-list {
    display: flex;
    gap: 14px;
    margin-top: 18px;
    padding: 0 12px;
    overflow-x: auto;
    padding-bottom: 4px;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 136, 51, 0.2);
      border-radius: 4px;
    }

    .rank-card {
      flex-shrink: 0;
      min-width: 120px;
      background: linear-gradient(135deg, #fdf6f0 0%, #f5ede6 100%);
      border-radius: 14px;
      padding: 18px 16px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: transform 0.25s, box-shadow 0.25s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 18px rgba(255, 136, 51, 0.15);
      }
    }

    .rank-badge {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FFB070 0%, #FF8833 60%, #F26B1F 100%);
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(255, 136, 51, 0.35);
    }

    .rank-name {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin-top: 4px;
      white-space: nowrap;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rank-score {
      font-size: 28px;
      font-weight: 800;
      color: #1a1a1a;
      line-height: 1.1;
    }

    .rank-tags {
      display: flex;
      gap: 6px;
      margin-top: 4px;

      .rank-tag {
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
      }
    }
  }

  .chart-box {
    width: 100%;
    height: 280px;
    margin-left: 0;
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: 28px;
    margin-top: 12px;
    font-size: 12px;
    color: #6b7280;

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      .dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .dot-cur {
        background: linear-gradient(135deg, #FFB070, #FF8833);
        box-shadow: 0 0 0 3px rgba(255, 136, 51, 0.15);
      }

      .dot-other {
        background: #d1d5db;
      }
    }
  }

  .empty {
    text-align: center;
    color: #9ca3af;
    padding: 60px 0;
    font-size: 13px;
  }

  .comment-card {
    background: linear-gradient(135deg, #fffaf3 0%, #fff5e6 100%);
    border: 1px solid #fde9c8;

    &::before {
      display: none;
    }

    .block-title .ico {
      color: #FF8833;
    }

    .block-title-wrap .block-title {
      padding-left: 0;
    }

    .overall {
      position: relative;
      background: #fff;
      border-left: 4px solid #FF8833;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 16px;
      box-shadow: 0 2px 6px rgba(255, 136, 51, 0.08);

      .overall-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 700;
        color: #9a3412;
        margin-bottom: 8px;

        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF8833;
        }
      }

      .overall-content {
        font-size: 13px;
        color: #78350f;
        line-height: 1.8;
      }
    }

    .tag-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

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
          opacity: 1;
        }

        .tag-list {
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
              background: #22C55E;
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
              background: #FF8833;
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
}
</style>
