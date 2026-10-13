import fetch, { homeworkfetch } from '@/utils/fetch';

// 慧思堂 - 课堂回顾 - 根据老师id,班级id,日期查询课程列表
/**
 * 传参：
 * searchDate  日期        string  YYYY-MM-DD
 * teacherId   老师id      number  0为全部
 * classId     班级id      number  0为全部
 */
export function getScheduleCurrWeekScheduleTimeByTh2(args) {
  return fetch({
    url: 'structure/classSchedule/getScheduleCurrWeekScheduleTimeByTh2',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 课堂回顾 - 查询老师自定义课程列表
/**
 * 传参：
 * watchDate   日期        string  YYYY-MM-DD
 * teacherId   老师id      number  0为全部
 * classId     班级id      number  0为全部
 */
export function getClassScheduleTimeThList(args) {
  return fetch({
    url: 'structure/classSchedule/getClassScheduleTimeThList',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 课堂回顾 - 查询老师公共分组评价信息列表
/**
 * 传参：
 * behDate     评价日期      string  YYYY-MM-DD
 * classId     班级id          number
 * isMorning   时段            number
 * nodeNumber  节次            number
 * sectionNo   排课节次        number
 */
export function getTeacherCommonGroupBehByTh(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getTeacherCommonGroupBehByTh',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 课堂回顾 - 根据分组id查询分组学生评价列表
/**
 * 传参：
 * behDate     评价日期      string  YYYY-MM-DD
 * classId     班级id          number
 * groupId     分组id          number
 * isMorning   时段            number
 * nodeNumber  节次            number
 * sectionNo   排课节次        number
 */
export function getGroupStuBehByGroupId(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getGroupStuBehByGroupId',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}


// 统一处理请求参数
function filterURLSearchParams(args = {}) {
  const params = new URLSearchParams();
  Object.keys(args).forEach(key => {
    if (args[key] !== '' && args[key] !== null && args[key] !== undefined) {
      params.append(key, args[key]);
    }
  });
  return params;
}

// 慧思堂 - 个人画像 - 学生行为积分列表
/**
 * 传参：
 * classId       班级id      number  可不传
 * gradeId       年级id      number  可不传
 * pageNo        页码        number
 * pageSize      分页数      number
 * schoolTimeId  学期Id      number
 * studentName   学生姓名     string  可不传
 */
export function getHshSchoolBehaviorScoreList(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getHshSchoolBehaviorScoreList',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 个人画像 - 学生行为画像详情
/**
 * 传参：
 * behTypeId      课堂行为类型id number  0全部
 * classId        班级id        number
 * groupId        分组Id        number
 * schoolTimeId   学期Id        number
 * studentId      学生id        number
 */
export function getHshSchoolBehaviorPortraitSt(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getHshSchoolBehaviorPortraitSt',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 根据学生id查询分组列表 2026-05-07
export function getClassroomGroupListByStuId(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getClassroomGroupListByStuId',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 小组画像 - 班级小组画像列表
/**
 * 传参：
 * behTypeId     课堂行为类型id number  0全部
 * classId       班级id        number
 * schoolTimeId  学期Id         number
 */
export function getHshSchoolBehaviorPortraitGroupList(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getHshSchoolBehaviorPortraitGroupList',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 小组画像 - 小组画像详情
/**
 * 传参：
 * behTypeId     课堂行为类型id number  0全部
 * classId       班级id         number
 * endDate       结束日期        string
 * groupId       分组Id          number
 * schoolTimeId  学期Id          number
 * startDate     开始日期        string
 */
export function getHshSchoolBehaviorPortraitGroup(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getHshSchoolBehaviorPortraitGroup',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 课堂回顾 - 查询课堂补充列表（精选问题等）
export function getSchoolBehaviorBehcontentList(args) {
  return fetch({
    url: '/structure/classSchedule/getSchoolBehaviorBehcontentList',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}

// 慧思堂 - 学校看板 - 学校行为画像
/**
 * 传参：
 * endDate       结束日期    string
 * schoolTimeId  学期Id      number
 * startDate     开始日期    string
 */
export function getHshSchoolBehaviorPortraitSch(args) {
  return homeworkfetch({
    url: 'structure/schoolBehavior/getHshSchoolBehaviorPortraitSch',
    method: 'get',
    params: filterURLSearchParams(args)
  });
}
