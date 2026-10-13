import fetch from '@/utils/fetch';

//获得学校下某个字典的字典值列表
export function findSchoolDicsByCode(args) {
  let params = new URLSearchParams();
  params.append('dicCode', args.dicCode);
  return fetch({
      url: 'structure/schoolDictionary/findSchoolDicsByCode',
      method: 'post',
      data: params
  });
}
//获得用户所在部门列表
export function queryDepartByUserId(args) {
  let params = new URLSearchParams();
  params.append('userId', args.userId);
  params.append('depType', args.depType);
  return fetch({
      baseURL: global.BaseNewPath,
      url: 'api/user/depart/queryDepartByUserId',
      method: 'get',
      params
  });
}

//检查反馈列表(分页)
export function findCheckFeedbackListByPage(args) {
  let params = new URLSearchParams();
  params.append('checkTypeCode', args.checkTypeCode);
  params.append('feedbackTypeCode', args.feedbackTypeCode);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('teacherName', args.teacherName);
  return fetch({
      url: 'structure/checkFeedback/findCheckFeedbackListByPage',
      method: 'get',
      params
  });
}

//新增检查反馈
export function addCheckFeedback(args) {
  return fetch({
      url: 'structure/checkFeedback/addCheckFeedback',
      headers: {
        'content-type': 'application/json'
      },
      method: 'post',
      data: JSON.stringify(args)
  });
}

// 删除单个检查反馈
export function deleteCheckFeedback(args) {
  let params = new URLSearchParams();
  params.append('id', args.id);
  return fetch({
      url: 'structure/checkFeedback/deleteCheckFeedback',
      method: 'post',
      data:params
  });
}

//单个检查反馈信息
export function getCheckFeedback(args) {
  let params = new URLSearchParams();
  params.append('id', args.id);
  return fetch({
      url: 'structure/checkFeedback/getCheckFeedback',
      method: 'get',
      params
  });
}

//每个老师,每个检查类型下所有的反馈类型的统计
export function statisticEveryTeacherList(args) {
  let params = new URLSearchParams();
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('teacherName', args.teacherName);
  return fetch({
      url: 'structure/checkFeedback/statisticEveryTeacherList',
      method: 'get',
      params
  });
}

//单个老师在某段时间内的检查反馈(分页)
export function findOneTeacherListByPage(args) {
  let params = new URLSearchParams();
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('startDate', args.startDate);
  params.append('endDate', args.endDate);
  params.append('teacherId', args.teacherId);
  return fetch({
      url: 'structure/checkFeedback/findOneTeacherCheckFeedbackListByPage',
      method: 'get',
      params
  });
}