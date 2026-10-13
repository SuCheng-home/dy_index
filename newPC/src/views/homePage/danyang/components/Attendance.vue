<template>
  <div style="margin-bottom: 20px;">
    <div style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">本月考勤</div>
    <div style="display: flex; gap: 8px;">
      <div style="flex: 1; background: #f6ffed; border: 1px solid #b7eb8f; padding: 8px; border-radius: 4px; text-align: center;">
        <div style="font-size: 16px; font-weight: bold; color: #52c41a;">{{ attendance.normal }}</div>
        <div style="font-size: 12px; color: #52c41a;">正常</div>
      </div>
      <div style="flex: 1; background: #fff1f0; border: 1px solid #ffa39e; padding: 8px; border-radius: 4px; text-align: center;">
        <div style="font-size: 16px; font-weight: bold; color: #f5222d;">{{ attendance.leave }}</div>
        <div style="font-size: 12px; color: #f5222d;">请假</div>
      </div>
      <div style="flex: 1; background: #e6f7ff; border: 1px solid #91d5ff; padding: 8px; border-radius: 4px; text-align: center;">
        <div style="font-size: 16px; font-weight: bold; color: #1890ff;">{{ attendance.out }}</div>
        <div style="font-size: 12px; color: #1890ff;">外出</div>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from 'moment';
import { mapGetters } from 'vuex'
import { getCalendarOutCount, attendanceAnalysis, getThAskleaveFourCountByTeacherId } from '@/api/homePage/danyang.js'
export default {
  name: 'attendance',
  data() {
    return {
      // 考勤数据
      attendance: {
        normal: 0,
        leave: 0,
        out: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      "userInfo"
    ])
  },
  created() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const startDate = Moment(new Date(year, month, 1)).format('YYYY-MM-DD')
    const endDate = Moment(new Date(year, month + 1, 0)).format('YYYY-MM-DD')
    getCalendarOutCount({
      startDate,
      endDate,
      userId: this.userInfo.id
    })
      .then(res => res.data)
      .then(res => {
        if (res.code === 200) {
          this.attendance.out = res.data || 0
        }
      })
    attendanceAnalysis({
      startDate,
      endDate,
      userId: this.userInfo.id
    })
      .then(res => res.data)
      .then(res => {
        if (res.code === 200) {
          this.attendance.normal = res.data.attendDay || 0
        }
      })
    getThAskleaveFourCountByTeacherId({
      startDate,
      endDate,
      teacherId: this.userInfo.id
    })
      .then(res => res.data)
      .then(res => {
        if (res.code === 200) {
          this.attendance.leave = res.data || 0
        }
      })
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
