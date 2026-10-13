import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
//根据老师ID获得所教班级和班主任的班级
export function queryAllClassCourse(args){
  const params=new URLSearchParams();
  params.append("teacherId",args.teacherId);
  return systemFetch({
    url:'api/teacherClass/queryAllClassCourse',
    method:'POST',
    data:params
  })
}
/**
 * 获得所教班级
 */
export function queryClass() {
  return fetch({
      url: 'teacherClass/queryClass',
      method: 'get',
  });
}
//新增任务
export function addTask(args){
  const params=new URLSearchParams();
  params.append("content",args.content);
  params.append("departId",args.departId);
  params.append("departJson",args.departJson);
  params.append("departName",args.departName);
  params.append("filesJson",args.filesJson);
  params.append("groupJson",args.groupJson);
  params.append("taskState",args.taskState);
  params.append("taskType",args.taskType);
  params.append("title",args.title);
  params.append("type",args.type);
  params.append("userJson",args.userJson);
  return fetch({
    url:'structure/task/addTask',
    method:'POST',
    data:params
  })
}

//编辑任务
export function editTask(args){
  const params=new URLSearchParams();
  params.append("content",args.content);
  params.append("departId",args.departId);
  params.append("departJson",args.departJson);
  params.append("departName",args.departName);
  params.append("filesJson",args.filesJson);
  params.append("picsJson",args.picsJson);
  params.append("groupJson",args.groupJson);
  params.append("id",args.id);
  params.append("taskState",args.taskState);
  params.append("taskType",args.taskType);
  params.append("title",args.title);
  params.append("type",args.type);
  params.append("userJson",args.userJson);
  return fetch({
    url:'structure/task/editTask',
    method:'POST',
    data:params
  })
}
//获得教师创建的任务列表（分页）
export function getCreateTaskPageList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("searchName",args.searchName);
  params.append("taskState",args.taskState);
  return fetch({
    url:'structure/task/getCreateTaskPageList',
    method:'POST',
    data:params
  })
}

//获得教师任务列表（分页）
export function getTeacherTaskPageList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("searchName",args.searchName);
  return fetch({
    url:'structure/task/getTeacherTaskPageList',
    method:'POST',
    data:params
  })
}

//删除任务
export function deleteTask(args){
  const params=new URLSearchParams();
  params.append("taskIds",args.taskIds);
  return fetch({
    url:'structure/task/deleteTask',
    method:'POST',
    data:params
  })
}

//获得任务详细信息
export function getTaskDetailInfoById(args){
  const params=new URLSearchParams();
  params.append("taskId",args.taskId);
  return fetch({
    url:'structure/task/getTaskDetailInfoById',
    method:'POST',
    data:params
  })
}

//获得提交任务详细信息
export function getUserSubmitTaskInfo(args){
  const params=new URLSearchParams();
  params.append("taskId",args.taskId);
  params.append("userId",args.userId);
  return fetch({
    url:'structure/task/getUserSubmitTaskInfo',
    method:'POST',
    data:params
  })
}

//教师提交任务
export function thSubmitTask(args){
  const params=new URLSearchParams();
  params.append("content",args.content);
  params.append("filesJson",args.filesJson);
  params.append("picsJson",args.picsJson);
  params.append("taskId",args.taskId);
  params.append("submitStatus",args.submitStatus);
  params.append("videosJson",args.videosJson);
  return fetch({
    url:'structure/task/thSubmitTask',
    method:'POST',
    data:params
  })
}

//获得任务完成情况
export function getTaskFinishPageList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("searchName",args.searchName);
  params.append("submitStatus",args.submitStatus);
  params.append("taskId",args.taskId);
  return fetch({
    url:'structure/task/getTaskFinishPageList',
    method:'POST',
    data:params
  })
}

////任务提交提醒
export function remindUserSubmitTask(args){
  const params=new URLSearchParams();
  params.append("taskId",args.taskId);
  return fetch({
    url:'structure/task/remindUserSubmitTask',
    method:'POST',
    data:params
  })
}
