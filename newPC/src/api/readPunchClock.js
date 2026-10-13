import fetch from '@/utils/fetch';

/** ------  common ------- **/
/**
 * 查询学校所有学期列表
 * **/
export function getSchoolTimeAllList() {
  let params = new URLSearchParams();

  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'get',
    params
  });
}

/**
 * 查询周次列表
 * **/
export function getSeveralWeekList() {
  let params = new URLSearchParams();

  return fetch({
    url: 'structure/schoolTime/getSeveralWeekList',
    method: 'get',
    params
  });
}

/**
 * 获得所教班级
 **/
export function getTeacherClasses() {
  let params = new URLSearchParams();

  return fetch({
    url: 'teacherClass/queryClass',
    method: 'get',
    params
  });
}

/**
 * 获得所教年级班级
 **/
export function getTeacherGrade() {
  let params = new URLSearchParams();

  return fetch({
    url: 'teacherClass/queryClassGrade',
    method: 'get',
    params
  });
}

// -----------------------------------------------------------

/**
 * 获得年级和班级列表
 **/
export function getSchoolGradeClass() {
  let params = new URLSearchParams();

  return fetch({
        url: 'depart/querySchoolGradeClass',
    method: 'get',
    params
  });
}

// -----------------------------------------------------------

// page 1  阅读计划完成情况
/**
 * 周计划统计
 **/
export function getGradeStuWeekPlan(query) {
  let params = new URLSearchParams();
  params.append('gradeId', query.gradeId);
  params.append('schoolTimeId', query.schoolTimeId);
  params.append('week', query.week);

  return fetch({
    url: 'structure/readClockIn/analysisWeekPlanByGradeIdAndWeek',
    method: 'get',
    params
  });
}

/**
 * 某学期某个班级的某周打卡情况
 **/
export function getClassStuWeekPlan(query) {
  let params = new URLSearchParams();
  params.append('classId', query.classId);
  params.append('schoolTimeId', query.schoolTimeId);
  params.append('week', query.week);

  return fetch({
    url: 'structure/readClockIn/analysisWeekDayClockByClassIdAndWeek',
    method: 'get',
    params
  });
}

/**
 * 某学期某个班级的某周的周计划以及打卡情况
 **/
export function getClassStuCondition(query) {
  let params = new URLSearchParams();
  params.append('classId', query.classId);
  params.append('schoolTimeId', query.schoolTimeId);
  params.append('week', query.week);

  return fetch({
    url: 'structure/readClockIn/classStuWeekClockByClassIdAndWeek',
    method: 'get',
    params
  });
}

/**
 * 根据学期id,学生id,周次获取周计划详情以及打卡情况
 **/
export function getStuWeekPlanInfo(query) {
  let params = new URLSearchParams();
  params.append('stuId', query.stuId);
  params.append('schoolTimeId', query.schoolTimeId);
  params.append('week', query.week);

  return fetch({
    url: 'structure/readClockIn/getStuWeekPlanClockInfoBySchoolTimeIdAndStuIdAndWeek',
    method: 'get',
    params
  });
}

// page 2  打卡情况统计
/**
 * 根据日期和年级id统计各班级打卡完成情况
 **/
export function getGradePunchClockList(query) {
  let params = new URLSearchParams();
  params.append('date', query.date);
  params.append('gradeId', query.gradeId);

  return fetch({
    url: 'structure/readClockIn/analysisGradeStuClockByGradeIdAndDate',
    method: 'get',
    params
  });
}

/**
 * 根据日期和班级id获取班级学生打卡完成情况,type=0代表全部，type=1代表打卡，type=2
 **/
export function getStuPunchClockCondition(query) {
  let params = new URLSearchParams();
  params.append('date', query.date);
  params.append('classId', query.classId);
  params.append('type', query.type);

  return fetch({
    url: 'structure/readClockIn/listClassStuClockByClassIdAndDateAndType',
    method: 'get',
    params
  });
}

// page3 查询书本
/**
 * 根据schoolTimeId获取学期的周次
 **/
export function getSeveralWeekListBySchoolTImeId(schoolTimeId) {
  let params = new URLSearchParams();
  params.append('schoolTimeId', schoolTimeId);

  return fetch({
    url: 'structure/schoolTime/getSeveralWeekListBySchoolTImeId',
    method: 'get',
    params
  });
}

/**
 * 根据学期id,周次：全部时为0，时间范围可为空,年级id,班级id:全部时为0获取学生读的书
 **/
export function getStuReadBooks(query) {
  let params = new URLSearchParams();
  params.append('classId', query.classId);
  params.append('endDate', query.endDate);
  params.append('gradeId', query.gradeId);
  params.append('schoolTimeId', query.schoolTimeId);
  params.append('searchName', query.searchName);
  params.append('startDate', query.startDate);
  params.append('week', query.week);

  return fetch({
    url: 'structure/readClockIn/listReadBookBySchoolTimeIdAndWeekAndDateRangeAndGradeIdAndClassId',
    method: 'get',
    params
  });
}
