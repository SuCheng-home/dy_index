<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title"><i class="far fa-clock"></i> 今日课表</div>
    </div>
    <div class="card-body">
      <el-radio-group v-model="currentDayIndex" @change="handleChange">
        <el-radio-button v-for="item in weekDayList" :key="item.date" :label="item.weekDayNum" size="mini">
          <!-- <el-badge value="今" class="item"> -->
            {{ item.weekDay }}
          <!-- </el-badge> -->
        </el-radio-button>
      </el-radio-group>
      <div class="schedule-timeline">
        <div v-for="(item, index) in todaySchedule" :key="index" class="timeline-item" :class="[getPeriodClass(item.type), { active: item.active }]">
          <!-- <div class="timeline-time">{{ item.timeRange }}</div> -->
          <div class="timeline-content">
            <span class="period-label">{{ item.type }}</span>
            <span>{{ item.timeRange }}</span>
          </div>
          <div class="timeline-desc">
            <div class="class-list">
              <span v-for="(lesson, lessonIndex) in item.lessons" :key="lessonIndex" class="class-tag">
                {{ lesson.className }}{{ lesson.currName  }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listTemplateBySchoolId } from '@/api/timeline';
import { getSchoolTimeAllList,getSeveralWeekListBySchoolTImeId,userClassScheduleDetailsWeek} from "@/api/classScheduleCard";
export default {
  name: 'TodaySchedule',
  data() {
    return {
      weekDayList: [],
      currentDayIndex: 0,
      // 今日课表
      classSchedule: '',
      timeList: []
    }
  },
  computed: {
    ...mapGetters([
      "userInfo"
    ]),
    currentDayTime() {
      const obj = this.timeList.find(i => i.weeks.includes(this.currentDayIndex + 1)) || {}
      return obj.timeList || []
    },
    todaySchedule() {
      const morningScheduleCurrListList = this.classSchedule.morningScheduleCurrListList || []
      const forenoonScheduleCurrListList = this.classSchedule.forenoonScheduleCurrListList || []
      const noonScheduleCurrListList = this.classSchedule.noonScheduleCurrListList || []
      const afternoonScheduleCurrListList = this.classSchedule.afternoonScheduleCurrListList || []
      const nightScheduleCurrListList = this.classSchedule.nightScheduleCurrListList || []
      const list = []
      morningScheduleCurrListList.forEach(item => {
        if (item[this.currentDayIndex] && item[this.currentDayIndex].length) {
          const time = this.currentDayTime.find(i => i.nodeNumber === 1)
          list.push({
            type: '早自习',
            timeRange: time ? `${time.startTime}-${time.endTime}` : '',
            lessons: item[this.currentDayIndex]
          })
        }
      })
      forenoonScheduleCurrListList.forEach((item, index) => {
        if (item[this.currentDayIndex] && item[this.currentDayIndex].length) {
          const time = this.currentDayTime.find(i => i.nodeNumber === index + 2)
          list.push({
            type: `上午第${index + 1}节课`,
            timeRange: time ? `${time.startTime}-${time.endTime}` : '',
            lessons: item[this.currentDayIndex]
          })
        }
      })
      noonScheduleCurrListList.forEach(item => {
        if (item[this.currentDayIndex] && item[this.currentDayIndex].length) {
          const time = this.currentDayTime.find(i => i.nodeNumber === 6)
          list.push({
            type: '午自习',
            timeRange: time ? `${time.startTime}-${time.endTime}` : '',
            lessons: item[this.currentDayIndex]
          })
        }
      })
      afternoonScheduleCurrListList.forEach((item, index) => {
        if (item[this.currentDayIndex] && item[this.currentDayIndex].length) {
          const time = this.currentDayTime.find(i => i.nodeNumber === index + 7)
          list.push({
            type: `下午第${index + 1}节课`,
            timeRange: time ? `${time.startTime}-${time.endTime}` : '',
            lessons: item[this.currentDayIndex]
          })
        }
      })
      nightScheduleCurrListList.forEach(item => {
        if (item[this.currentDayIndex] && item[this.currentDayIndex].length) {
          const time = this.currentDayTime.find(i => i.nodeNumber === 10)
          list.push({
            type: '晚自习',
            timeRange: time ? `${time.startTime}-${time.endTime}` : '',
            lessons: item[this.currentDayIndex]
          })
        }
      })
      console.log(list)
      return list
    }
  },
  mounted() {
    this.userClassScheduleDetailsWeek()
    this.listTemplateBySchoolIdFunc();
  },
  methods: {
    handleChange() {
      console.log(this.currentDayIndex, this.todaySchedule)
    },
    listTemplateBySchoolIdFunc() {
      return listTemplateBySchoolId()
        .then(res => res.data)
        .then(data => {
          this.timeList = data.data
          console.log(this.timeList)
        })
    },
    async userClassScheduleDetailsWeek() {
      try {
        const res = await getSchoolTimeAllList()
        const currentTime = res.data.data.find(i => i.isCurrent === 1)
        if (!currentTime) return
        const res1 = await getSeveralWeekListBySchoolTImeId(currentTime.id)
        const data = res1.data.data;
        let weekObj = null
        if (data.map(item => item.nowWeek).indexOf(1) > -1) {
          weekObj = data[data.map(item => item.nowWeek).indexOf(1)]
        } else {
          weekObj = data[0]
        }
        const selectWeek = weekObj.week
        // 获取本周日期列表
        this.weekDayList = this.getWeekDays(weekObj.monday);
        this.currentDayIndex = Math.max(0, this.weekDayList.findIndex(item => item.isToday));
        const res2 = await userClassScheduleDetailsWeek(this.userInfo.id, selectWeek)
        const data2 = res2.data.data;
        this.classSchedule = data2.classSchedule || {}
      } catch (err) {
        console.log(err)
      }
    },
    // 根据开始时间获取一周的日期列表
    getWeekDays(startDate) {
      const weekDays = [];
      const start = new Date(startDate);
      console.log(start, startDate)
      const weekDaysNames = ['周一', '周二', '周三', '周四', '周五'];
      
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(start.getDate() + i);
        
        weekDays.push({
          date: date,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          weekDay: weekDaysNames[date.getDay() - 1],
          weekDayNum: date.getDay() - 1,
          dateStr: this.formatDate(date),
          isToday: this.isToday(date)
        });
      }
      
      return weekDays;
    },
    // 格式化日期为 YYYY-MM-DD
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    // 判断是否为今天
    isToday(date) {
      const today = new Date();
      return date.getFullYear() === today.getFullYear() &&
             date.getMonth() === today.getMonth() &&
             date.getDate() === today.getDate();
    },
    
    // 根据课程类型获取时间段样式类
    getPeriodClass(type) {
      if (type.includes('早自习')) {
        return 'period-morning';
      } else if (type.includes('上午')) {
        return 'period-forenoon';
      } else if (type.includes('午自习')) {
        return 'period-noon';
      } else if (type.includes('下午')) {
        return 'period-afternoon';
      } else if (type.includes('晚自习')) {
        return 'period-night';
      }
      return '';
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  margin-bottom: 20px;
}
/deep/ .el-radio-button .el-radio-button__inner {
  padding: 8px 12px;
}
.schedule-timeline {
  position: relative;
  padding-left: 16px;
}

.timeline-item {
  padding-bottom: 16px;
  padding-left: 20px;
  position: relative;
  border-left: 2px solid #e8e8e8;
}

.timeline-item:last-child {
  border-left-color: transparent;
}

.timeline-item::before {
  content: "";
  position: absolute;
  left: -6px;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--primary);
}

.timeline-item.active::before {
  background: var(--primary);
  box-shadow: 0 0 0 3px rgba(24,144,255,0.2);
}

.timeline-time {
  font-size: 12px;
  color: var(--text-sec);
  margin-bottom: 4px;
}

.timeline-content {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--text-light);
}

.timeline-desc {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  margin-top: 2px;
}
.lesson-item {
  span+span {
    margin-left: 5px;
  }
}
.timeline-item:hover .timeline-content {
  color: var(--primary);
}

/* 时间段样式 */
.period-label {
  display: inline-block;
  width: 6em;
  margin-right: 20px;
  font-weight: 500;
}

/* 早自习 */
.period-morning .timeline-item::before {
  border-color: #52c41a;
}

.period-morning .timeline-item.active::before {
  background: #52c41a;
  box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.2);
}

.period-morning .period-label {
  color: #52c41a;
}

/* 上午 */
.period-forenoon .timeline-item::before {
  border-color: #1890ff;
}

.period-forenoon .timeline-item.active::before {
  background: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
}

.period-forenoon .period-label {
  color: #1890ff;
}

/* 午自习 */
.period-noon .timeline-item::before {
  border-color: #faad14;
}

.period-noon .timeline-item.active::before {
  background: #faad14;
  box-shadow: 0 0 0 3px rgba(250, 173, 20, 0.2);
}

.period-noon .period-label {
  color: #faad14;
}

/* 下午 */
.period-afternoon .timeline-item::before {
  border-color: #722ed1;
}

.period-afternoon .timeline-item.active::before {
  background: #722ed1;
  box-shadow: 0 0 0 3px rgba(114, 46, 209, 0.2);
}

.period-afternoon .period-label {
  color: #722ed1;
}

/* 晚自习 */
.period-night .timeline-item::before {
  border-color: #eb2f96;
}

.period-night .timeline-item.active::before {
  background: #eb2f96;
  box-shadow: 0 0 0 3px rgba(235, 47, 150, 0.2);
}

.period-night .period-label {
  color: #eb2f96;
}

/* 班级列表样式 */
.class-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.class-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #f0f2f5;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-sec);
  transition: all 0.2s;
}

.class-tag:hover {
  background: #e6f7ff;
  border-color: var(--primary);
  color: var(--primary);
}

/* 课程名称样式 */
.course-name {
  font-weight: 500;
  color: var(--text-main);
}

/* 时间样式 */
.timeline-time {
  font-size: 12px;
  color: var(--text-sec);
  margin-bottom: 4px;
}
</style>
