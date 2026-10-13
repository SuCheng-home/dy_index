import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 用户登录数据统计信息（老师和家长分开统计）
export const getUserLoginCountByRole = (args) =>
  systemFetch({
      url: '/sys/statistics/school/getUserLoginCountByRole',
      method: 'get',
      params: filterURLSearchParams(args)
  })

// 根据班级查询检查记录 2026-03-13
export const getCheckItemAndScoreByPage = (args) =>
  fetch({
      url: '/structure/composite/getCheckItemAndScoreByPage',
      method: 'get',
      params: filterURLSearchParams(args)
  })

// 根据时间段查询外出日程数量 2026-03-13
export const getCalendarOutCount = (args) =>
  fetch({
      url: '/structure/calendar/getCalendarOutCount',
      method: 'get',
      params: filterURLSearchParams(args)
  })

// 一个时间段的学校考勤总统计
export const attendanceAnalysis = (args) =>
  fetch({
      url: '/structure/attendance/attendanceAnalysis',
      method: 'get',
      params: filterURLSearchParams(args)
  })

// 根据开始日期结束日期查询老师请假次数 2026-03-16
export const getThAskleaveFourCountByTeacherId = (args) =>
  fetch({
      url: '/structure/thAskLeaveFourNew/getThAskleaveFourCountByTeacherId',
      method: 'get',
      params: filterURLSearchParams(args)
  })
