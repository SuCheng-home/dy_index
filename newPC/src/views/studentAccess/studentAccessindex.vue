<template>
  <div class="student-access-page">
    <h1 class="page-title">南师附中栋梁学校学生进出数据平台</h1>
    <div class="main-content">
      <!-- 左侧区域 -->
      <div class="left-area">
        <!-- 各班人员进出统计 -->
        <div class="panel class-stats-panel">
          <div class="panel-header">
            <i class="el-icon-s-home icon"></i>
            <span class="panel-title">各班人员进出统计</span>
          </div>
          <div class="class-cards-wrapper" ref="classCardsRef" @mouseenter="pauseAutoScroll('classCards')" @mouseleave="resumeAutoScroll('classCards')">
            <div class="class-cards">
              <div class="class-card" v-for="item in classStats" :key="item.className">
                <div class="class-name">{{ item.className }}</div>
                <div class="stat-row">
                  <span class="label">总人数:</span>
                  <span class="value white">{{ item.total }}</span>
                </div>
                <div class="stat-row">
                  <span class="label">进校:</span>
                  <span class="value green">{{ item.entered }}</span>
                </div>
                <div class="stat-row">
                  <span class="label">离校:</span>
                  <span class="value red">{{ item.left }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 实时进出抓拍动态 -->
        <div class="panel capture-panel">
          <div class="panel-header">
            <i class="el-icon-camera icon"></i>
            <span class="panel-title">实时进出抓拍动态</span>
          </div>
          <div class="capture-wrapper" ref="captureRef" @mouseenter="pauseAutoScroll('capture')" @mouseleave="resumeAutoScroll('capture')">
            <div class="capture-list">
               <image-previewer tag="richtext">
                   <div class="capture-item" v-for="(item,index) in captureList" :key="index">
                      <el-image
                        :src="item.img"
                        class="capture-img"
                        fit="cover"
                      ></el-image>
                      <div class="capture-name">{{ item.name }}</div>
                      <div class="capture-time">{{ item.time }}</div>
                    </div>
                  
                </image-previewer>
            
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧区域 -->
      <div class="right-area">
        <!-- 最新进校记录 -->
        <div class="panel record-panel">
          <div class="panel-header">
            <i class="el-icon-download icon green-icon"></i>
            <span class="panel-title green-title">最新进校记录</span>
          </div>
          <div class="record-list-wrapper" ref="enterListRef" @mouseenter="pauseAutoScroll('enter')" @mouseleave="resumeAutoScroll('enter')">
              <div class="record-item" v-for="(item, index) in enterRecords" :key="'enter-' + index">
                <span class="record-class">{{ item.className }}</span>
                <span class="record-name">{{ item.name }}</span>
                <span class="record-time">{{ item.time }}</span>
              </div>
          </div>
        </div>
        <!-- 最新离校记录 -->
        <div class="panel record-panel">
          <div class="panel-header">
            <i class="el-icon-upload2 icon red-icon"></i>
            <span class="panel-title red-title">最新离校记录</span>
          </div>
          <div class="record-list-wrapper" ref="leaveListRef" @mouseenter="pauseAutoScroll('leave')" @mouseleave="resumeAutoScroll('leave')">
              <div class="record-item" v-for="(item, index) in leaveRecords" :key="'leave-' + index">
                <span class="record-class">{{ item.className }}</span>
                <span class="record-name">{{ item.name }}</span>
                <span class="record-time">{{ item.time }}</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGateInfoCountByDate } from '@/api/studentAccess';
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import aesEncryptor from '@/utils/aesEncryptor'
export default {
  name: 'StudentAccessIndex',
  computed: {
    captureImgList() {
      return this.captureList.map(item => item.img);
    }
  },
  components: { ImagePreviewer },
  data() {
    return {
      classStats: [],
      captureList: [],
      enterRecords: [],
      leaveRecords: [],
      enterScrollTimer: null,
      leaveScrollTimer: null,
      classCardsScrollTimer: null,
      captureScrollTimer: null,
      refreshTimer: null
    }
  },
  mounted() {
    this.fetchData();
    // 每10分钟自动刷新数据
    this.refreshTimer = setInterval(() => {
      this.stopAutoScroll();
      this.fetchData();
    }, 10 * 60 * 1000);
  },
  beforeDestroy() {
    this.stopAutoScroll();
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  },
  methods: {
    getToday() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    formatTime(timeStamp) {
      if (!timeStamp) return '';
      // timeStamp 可能是 "2024-05-26 07:39:29" 格式或纯时间戳
      const dateObj = new Date(timeStamp);
      if (!isNaN(dateObj.getTime())) {
        const h = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');
        const s = String(dateObj.getSeconds()).padStart(2, '0');
        return `${h}:${min}:${s}`;
      }
      return timeStamp;
    },
    async fetchData() {
      try {
        const schoolId = global.command === 'production' ? 7373 : 672;
        const res = await getGateInfoCountByDate(this.getToday(),  aesEncryptor.encrypt(schoolId));
        const data = res.data.data;
        // 班级统计
        if (data.classList && data.classList.length) {
          this.classStats = data.classList.map(item => ({
            className: item.className,
            total: item.userCount,
            entered: item.inUserCount,
            left: item.outUserCount
          }));
        }
        // 进校记录
        if (data.listIn && data.listIn.length) {
          this.enterRecords = data.listIn.map(item => ({
            className: item.className || item.gradeName,
            name: item.userName,
            time: this.formatTime(item.timeStamp)
          }));
        }
        // 离校记录
        if (data.listOut && data.listOut.length) {
          this.leaveRecords = data.listOut.map(item => ({
            className: item.className || item.gradeName,
            name: item.userName,
            time: this.formatTime(item.timeStamp)
          }));
        }
        // 抓拍照片
        if (data.listPhotoAll && data.listPhotoAll.length) {
          this.captureList = data.listPhotoAll.map((item, index) => ({
            id: item.id || index,
            name: item.userName,
            time: this.formatTime(item.timeStamp),
            img: item.picture
          }));
        }
        this.$nextTick(() => {
          this.startAutoScroll(this.$refs.classCardsRef);
          this.startAutoScroll(this.$refs.captureRef);
          this.startAutoScroll(this.$refs.enterListRef);
          this.startAutoScroll(this.$refs.leaveListRef);
        });
      } catch (e) {
        console.error('获取进出数据失败', e);
      }
    },
    startAutoScroll(el) {
      if (!el) return;
      // 内容不超出则不滚动
      if (el.scrollHeight <= el.clientHeight) return;
      const timer = setInterval(() => {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += 1;
        }
      }, 50);
      if (el === this.$refs.enterListRef) {
        this.enterScrollTimer = timer;
      } else if (el === this.$refs.leaveListRef) {
        this.leaveScrollTimer = timer;
      } else if (el === this.$refs.classCardsRef) {
        this.classCardsScrollTimer = timer;
      } else if (el === this.$refs.captureRef) {
        this.captureScrollTimer = timer;
      }
    },
    stopAutoScroll() {
      if (this.enterScrollTimer) clearInterval(this.enterScrollTimer);
      if (this.leaveScrollTimer) clearInterval(this.leaveScrollTimer);
      if (this.classCardsScrollTimer) clearInterval(this.classCardsScrollTimer);
      if (this.captureScrollTimer) clearInterval(this.captureScrollTimer);
    },
    pauseAutoScroll(type) {
      if (type === 'enter' && this.enterScrollTimer) {
        clearInterval(this.enterScrollTimer);
        this.enterScrollTimer = null;
      } else if (type === 'leave' && this.leaveScrollTimer) {
        clearInterval(this.leaveScrollTimer);
        this.leaveScrollTimer = null;
      } else if (type === 'classCards' && this.classCardsScrollTimer) {
        clearInterval(this.classCardsScrollTimer);
        this.classCardsScrollTimer = null;
      } else if (type === 'capture' && this.captureScrollTimer) {
        clearInterval(this.captureScrollTimer);
        this.captureScrollTimer = null;
      }
    },
    resumeAutoScroll(type) {
      if (type === 'enter') {
        this.startAutoScroll(this.$refs.enterListRef);
      } else if (type === 'leave') {
        this.startAutoScroll(this.$refs.leaveListRef);
      } else if (type === 'classCards') {
        this.startAutoScroll(this.$refs.classCardsRef);
      } else if (type === 'capture') {
        this.startAutoScroll(this.$refs.captureRef);
      }
    }
  }
}
</script>

<style scoped>
.student-access-page {
  width: 100vw;
  height: 100vh;
  background: #0a1929;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

.page-title {
  text-align: center;
  color: #4fc3f7;
  font-size: 2vw;
  margin: 0 0 16px 0;
  letter-spacing: 4px;
  font-weight: bold;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 12px;
  min-height: 0;
}

.left-area {
  width: 70.5%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.right-area {
  width: 29%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.panel {
  border: 1px solid #1e3a5f;
  border-radius: 6px;
  background: #0d2137;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.panel-title {
  color: #4fc3f7;
  font-size: 1rem;
  font-weight: bold;
}

.green-title {
  color: #66bb6a;
}

.red-title {
  color: #ef5350;
}

.icon {
  font-size: 1.1rem;
  color: #4fc3f7;
}

.green-icon {
  color: #66bb6a;
}

.red-icon {
  color: #ef5350;
}

/* 各班进出统计 */
.class-stats-panel {
  flex: 1;
}

.class-cards-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
  min-height: 0;
}

.class-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.class-card {
  width: calc(20% - 10px);
  min-width: 130px;
  flex-shrink: 0;
  border: 1px solid #1e3a5f;
  border-radius: 6px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: #0a1929;
}

.class-name {
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
}

.stat-row .label {
  color: #90a4ae;
}

.stat-row .value.white {
  color: #ffffff;
  font-weight: bold;
}

.stat-row .value.green {
  color: #66bb6a;
  font-weight: bold;
}

.stat-row .value.red {
  color: #ef5350;
  font-weight: bold;
}

/* 实时抓拍 */
.capture-panel {
  flex: 1;
}

.capture-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
  min-height: 0;
}

.capture-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.capture-item {
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  float: left;
  margin: 5px;
}

.capture-img {
  width: 100px;
  height: 130px;
  object-fit: cover;
  border-radius: 4px;
}

.capture-name {
  color: #ffffff;
  font-size: 0.85rem;
}

.capture-time {
  color: #90a4ae;
  font-size: 0.8rem;
}

/* 进校/离校记录 */
.record-panel {
  flex: 1;
  min-height: 0;
}

.record-list-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #1a2f45;
}

.record-class {
  flex: 1;
  color: #b0bec5;
  font-size: 0.85rem;
}

.record-name {
  flex: 1;
  text-align: center;
  color: #ffffff;
  font-size: 0.85rem;
}

.record-time {
  flex: 1;
  text-align: right;
  color: #4fc3f7;
  font-size: 0.85rem;
}

/* 滚动条样式 */
.class-cards-wrapper::-webkit-scrollbar,
.capture-wrapper::-webkit-scrollbar,
.record-list-wrapper::-webkit-scrollbar {
  width: 4px;
}

.class-cards-wrapper::-webkit-scrollbar-track,
.capture-wrapper::-webkit-scrollbar-track,
.record-list-wrapper::-webkit-scrollbar-track {
  background: #0a1929;
}

.class-cards-wrapper::-webkit-scrollbar-thumb,
.capture-wrapper::-webkit-scrollbar-thumb,
.record-list-wrapper::-webkit-scrollbar-thumb {
  background: #1e3a5f;
  border-radius: 2px;
}
</style>
