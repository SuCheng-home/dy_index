import fetch from '@/utils/fetch';
import {homeworkfetch} from '@/utils/fetch';

// 查询节次列表
export function getsectionNoList() {
  return fetch({
    url: 'structure/schoolBehavior/getsectionNoList',
    method: 'get',
  });
}

// 根据老师ID获得所教班级和所带班级
export function queryAllClassCourse() {
  return fetch({
    url: 'teacherClass/listClassCourse',
    method: 'get',
  });
}

// 根据学校id查询学校行为配置
export function getSchoolBehaviorInstallNew() {
  return fetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorInstallNew',
    method: 'get',
  });
}

// 判断当前学校 是否安装了 "班级评价" 模块
export function isSetupClassRatingModule() {
  return fetch({
    url: 'structure/classRating/isSetupClassRatingModule',
    method: 'get',
  });
}

/**
 * 按学号查询学生列表
 */
export function getSchoolBehaviorStuListOrderStuNo(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  return homeworkfetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorStuListOrderStuNo',
    method: 'get',
    params
  });
}
export function getClassroomInitGroupListByTh(args) {
    let params = new URLSearchParams();
    params.append('setId', 0);
    params.append('classId', args.classId);
    params.append('behGroupType', args.behGroupType);
    return homeworkfetch({
        url: 'structure/classroom/getClassroomInitGroupListByTh',
        method: 'get',
        params
    });
}

/**
 * 按座位查询学生本学期的分数
 */
export function getSchoolBehaviorStuList(args) {
  let params = new URLSearchParams();
  params.append('classId', args.classId);
  return homeworkfetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorStuList',
    method: 'get',
    params
  });
}

/**
 * 根据schoolId,科目id及类型查询课堂行为科目类型列表
 */
export function getSchoolBehaviorTypeCurrListBySchoolId(args) {
  let params = new URLSearchParams();
  params.append('type', args.type);
  params.append('curriculumId', args.curriculumId);


  return fetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorTypeCurrListBySchoolId',
    method: 'get',
    params
  });
}

/**
 * 根据类型查询学校考核项
 */
export function getSchoolBehaviorTypeListBySchoolId(args) {
  let params = new URLSearchParams();
  params.append('type', args.type);

  return fetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorTypeListBySchoolId',
    method: 'get',
    params
  });
}

// 批量新增课堂评价
export function batchAddSchoolBehaviorStuList(args) {
  return homeworkfetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/schoolBehavior/batchAddSchoolBehaviorStuList',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

// 新增课堂评价
export function addSchoolBehaviorStu(args) {
  return homeworkfetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/schoolBehavior/addSchoolBehaviorStu',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

// 根据老师的Id，开始日期结束日期查询所教班级及所教课程及统计--归
export function classListTw(args) {
  let params = new URLSearchParams();
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);

  return homeworkfetch({
    url: 'structure/schoolBehavior/classListTw',
    method: 'GET',
    params
  });
}

// 汇总
export function getSchoolBehaviorStuListByDate(args) {
  let params = new URLSearchParams();
  params.append('curriculumId', args.curriculumId);
  params.append('classId', args.classId);

  return homeworkfetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorStuListByDate',
    method: 'GET',
    params
  });
}

// 按条件查询学生课堂考勤列表--归
export function getSchoolBehaviorStuCallList(args) {
  let params = new URLSearchParams();
  params.append('curriculumId', args.curriculumId);
  params.append('classId', args.classId);
  params.append('isMorning', args.isMorning);
  params.append('sectionNo', args.sectionNo);

  return homeworkfetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorStuCallList',
    method: 'GET',
    params
  });
}

// 考勤按座位统计
export function getSchoolBehaviorStuCallListBySeat(args) {
  let params = new URLSearchParams();
  params.append('curriculumId', args.curriculumId);
  params.append('classId', args.classId);
  params.append('isMorning', args.isMorning);
  params.append('sectionNo', args.sectionNo);

  return homeworkfetch({
    url: 'structure/schoolBehavior/getSchoolBehaviorStuCallListBySeat',
    method: 'GET',
    params
  });
}

// 批量新增考勤记录--归
export function batchAddAndUpdateSchoolBehaviorStuCallList(args) {

  return homeworkfetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/schoolBehavior/batchAddAndUpdateSchoolBehaviorStuCallList',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

// 根据查询老师当日课后服务班级
export function getAfterBehaviorClassList() {
  return fetch({
    url: 'structure/afterBehavior/getAfterBehaviorClassList',
    method: 'get',
  });
}

// 根据班级id,阶段查询当日课后服务学生列表
export function getAfterBehaviorStuList(args) {
  let params = new URLSearchParams();
  params.append('afterClassId', args.afterClassId);
  params.append('stage', args.stage);

  return fetch({
    url: 'structure/afterBehavior/getAfterBehaviorStuList',
    method: 'GET',
    params
  });
}

// 根据schoolId及类型查询类型列表
export function getAfterBehaviorTypeListBySchoolId(args) {
  let params = new URLSearchParams();
  params.append('title', args.title || '');
  params.append('type', args.type);

  return fetch({
    url: 'structure/afterBehavior/getAfterBehaviorTypeListBySchoolId',
    method: 'GET',
    params
  });
}

// 批量新增评价列表
export function addAfterBehaviorStuList(args) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/afterBehavior/addAfterBehaviorStuList',
    method: 'POST',
    data: JSON.stringify(args)
  });
}
