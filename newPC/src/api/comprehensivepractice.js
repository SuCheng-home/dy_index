import fetch from '@/utils/fetch';

/*查询实践活动列表(分页)*/
export function getPracticeActivityPageList(args) {
  let params = new URLSearchParams();
  params.append("schoolTimeId", args.schoolTimeId);
  params.append("typeCode", args.typeCode == 0 ? "" : args.typeCode);
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("activityName", args.activityName);
  return fetch({
    url: 'structure/practiceActivity/getPracticeActivityPageList',
    method: 'post',
    data: params
  });
}

//获得学校下某个字典的字典值列表
export function findSchoolDicsByCode(dicCode) {
  let params = new URLSearchParams();
  params.append('dicCode', dicCode);
  return fetch({
    url: 'structure/schoolDictionary/findSchoolDicsByCode',
    method: 'post',
    data: params
  });
}

//查询学校所有学期列表
export function getSchoolTimeAllList() {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'GET',
    params
  })
}

/*查询学校点赞兑换设置信息*/
export function getSchoolPracticeActivityThumbExchange(id) {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/practiceActivity/getSchoolPracticeActivityThumbExchange',
    method: 'post',
    data: params
  })
}

/*保存学校点赞兑换设置信息*/
export function savePracticeActivityThumbExchange(args) {
  let params = new URLSearchParams();
  params.append("isOpen", args.isOpen);
  params.append("standardNum", args.standardNum);
  return fetch({
    url: 'structure/practiceActivity/savePracticeActivityThumbExchange',
    method: 'post',
    data: params
  })
}

/*提交实践活动审核*/
export function submitPracticeActivityToApprove(args) {
  let params = new URLSearchParams();
  params.append("id", args.id);
  return fetch({
    url: 'structure/practiceActivity/submitPracticeActivityToApprove',
    method: 'post',
    data: params
  })
}

/*撤回实践活动*/
export function revokePracticeActivity(args) {
  let params = new URLSearchParams();
  params.append("id", args.id);
  return fetch({
    url: 'structure/practiceActivity/revokePracticeActivity',
    method: 'post',
    data: params
  })
}

/*实践活动审核*/
export function approvePracticeActivity(args) {
  let params = new URLSearchParams();
  params.append("approveOption", args.approveOption);
  params.append("id", args.id);
  params.append("state", args.state);
  return fetch({
    url: 'structure/practiceActivity/approvePracticeActivity',
    method: 'post',
    data: params
  })
}
/*导出*/
export function exportActivityStageGroupStuWorkDatas(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  params.append("groupId", args.groupId);
  params.append("stageId", args.stageId);
  return fetch({
    url: 'structure/practiceActivity/exportActivityStageGroupStuWorkDatas',
    method: 'post',
    data: params
  })
}
/*一键满星*/
export function oneKeyFullStarToAllStusEval(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  return fetch({
    url: 'structure/practiceActivity/oneKeyFullStarToAllStusEval',
    method: 'post',
    data: params
  })
}
/*实践活动审核*/
export function addPracticeActivityGroupOpusList(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/practiceActivity/addPracticeActivityGroupOpusList',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/*删除实践活动详细信息*/
export function deletePracticeActivityById(id) {
  let params = new URLSearchParams();
  params.append("id", id);
  return fetch({
    url: 'structure/practiceActivity/deletePracticeActivityById',
    method: 'post',
    data: params
  })
}

/*删除实践活动详细信息*/
export function publishPracticeActivityById(id) {
  let params = new URLSearchParams();
  params.append("id", id);
  return fetch({
    url: 'structure/practiceActivity/publishPracticeActivityById',
    method: 'post',
    data: params
  })
}

//新增实践活动基础信息
export function addPracticeActivityBaseInfo(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/practiceActivity/addPracticeActivityBaseInfo',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

//编辑实践活动基础信息
export function updatePracticeActivityBaseInfo(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/practiceActivity/updatePracticeActivityBaseInfo',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

//发布后编辑
export function editPracticeActivityBaseInfoAfterPublish(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/practiceActivity/editPracticeActivityBaseInfoAfterPublish',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/*查询实践活动详细信息*/
export function getPracticeActivityInfoById(id) {
  let params = new URLSearchParams();
  params.append("id", id);
  return fetch({
    url: 'structure/practiceActivity/getPracticeActivityInfoById',
    method: 'post',
    data: params
  })
}

//编辑实践活动评价设置信息
export function updatePracticeActivityEvalInfo(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/practiceActivity/updatePracticeActivityEvalInfo',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/*查询实践活动详细信息*/
export function getActivityGroupInfoById(id) {
  let params = new URLSearchParams();
  params.append("id", id);
  return fetch({
    url: 'structure/practiceActivity/getActivityGroupInfoById',
    method: 'post',
    data: params
  })
}

/*查询实践活动分组列表*/
export function getActivityGroupListByActivityId(activityId) {
  let params = new URLSearchParams();
  params.append("activityId", activityId);
  params.append("groupName", "");
  return fetch({
    url: 'structure/practiceActivity/getActivityGroupListByActivityId',
    method: 'post',
    data: params
  })
}

/*根据分组ID删除活动分组*/
export function delActivityGroupByGroupId(groupId) {
  let params = new URLSearchParams();
  params.append("groupId", groupId);
  return fetch({
    url: 'structure/practiceActivity/delActivityGroupByGroupId',
    method: 'get',
    params
  })
}

/*新增实践活动分组*/
export function addActivityGroup(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  params.append("groupName", args.groupName);
  params.append("orderNo", args.orderNo);
  params.append("operateType", args.operateType);
  params.append("studentsJson", JSON.stringify(args.studentsJson));
  return fetch({
    url: 'structure/practiceActivity/addActivityGroup',
    method: 'post',
    data: params
  });
}

/*新增实践活动分组*/
export function editActivityGroup(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  params.append("groupName", args.groupName);
  params.append("orderNo", args.orderNo);
  params.append("operateType", args.operateType);
  params.append("id", args.id);
  params.append("studentsJson", JSON.stringify(args.studentsJson));
  return fetch({
    url: 'structure/practiceActivity/editActivityGroup',
    method: 'post',
    data: params
  });
}

/*实践活动统计数据(分页)*/
export function getActivityTeacherGroupDataPageList(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("teacherName", args.teacherName);
  return fetch({
    url: 'structure/practiceActivity/getActivityTeacherGroupDataPageList',
    method: 'post',
    data: params
  });
}

/*查询教师实践活动列表(分页)*/
export function getThPracticeActivityPageList(args) {
  let params = new URLSearchParams();
  params.append("schoolTimeId", args.schoolTimeId);
  params.append("typeCode", args.typeCode == 0 ? "" : args.typeCode);
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("activityName", args.activityName);
  return fetch({
    url: 'structure/practiceActivity/getThPracticeActivityPageList',
    method: 'post',
    data: params
  });
}

/*查询实践活动详细信息（指导教师-协助教师）*/
export function getPracticeActivityInfoByIdForTeacher(id) {
  let params = new URLSearchParams();
  params.append("activityId", id);
  return fetch({
    url: 'structure/practiceActivity/getPracticeActivityInfoByIdForTeacher',
    method: 'post',
    data: params
  })
}

/*保存实践活动协助教师*/
export function saveAssistTeacherList(args) {
  let params = new URLSearchParams();
  params.append("assistThJson", args.assistThJson);
  params.append("id", args.id);
  return fetch({
    url: 'structure/practiceActivity/saveAssistTeacherList',
    method: 'post',
    data: params
  });
}

/*新增阶段作业*/
export function addActivityStageWork(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  params.append("content", args.content);
  params.append("stageId", args.stageId);
  params.append("state", args.state);
  params.append("filesJson", JSON.stringify(args.filesJson));
  params.append("photoJson", JSON.stringify(args.photoJson));
  return fetch({
    url: 'structure/practiceActivity/addActivityStageWork',
    method: 'post',
    data: params
  });
}

/*编辑阶段作业*/
export function editActivityStageWork(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  params.append("content", args.content);
  params.append("stageId", args.stageId);
  params.append("state", args.state);
  params.append("id", args.id);
  params.append("filesJson", JSON.stringify(args.filesJson));
  params.append("photoJson", JSON.stringify(args.photoJson));
  return fetch({
    url: 'structure/practiceActivity/editActivityStageWork',
    method: 'post',
    data: params
  });
}

/*查询实践活动分组列表*/
export function getThActivityStageWorkInfoByStageId(activityId, stageId, teacherId) {
  let params = new URLSearchParams();
  params.append("activityId", activityId);
  params.append("stageId", stageId);
  params.append("teacherId", teacherId);
  return fetch({
    url: 'structure/practiceActivity/getThActivityStageWorkInfoByStageId',
    method: 'post',
    data: params
  })
}

export function getThActivityGroupList(activityId, teacherId, groupName='') {
  let params = new URLSearchParams();
  params.append("activityId", activityId);
  if (teacherId) {
    params.append("teacherId", teacherId);
  }
  params.append("groupName", groupName);
  return fetch({
    url: 'structure/practiceActivity/getThActivityGroupList',
    method: 'post',
    data: params
  });
}

//查询活动各分组学生作业统计列表(教师端)
export function getActivityGroupWorkStaticsDataListByTh(activityId, stageId, teacherId) {
  let params = new URLSearchParams();
  params.append("activityId", activityId);
  params.append("stageId", stageId);
  params.append("teacherId", teacherId);
  return fetch({
    url: 'structure/practiceActivity/getActivityGroupWorkStaticsDataListByTh',
    method: 'post',
    data: params
  });
}

//标记分组为加精组
export function finedActivityStageGroup(groupId, stageId, activityId) {
  let params = new URLSearchParams();
  params.append("groupId", groupId);
  params.append("stageId", stageId);
  params.append("activityId", activityId);
  return fetch({
    url: 'structure/practiceActivity/finedActivityStageGroup',
    method: 'post',
    data: params
  });
}

//取消分组为加精组
export function cancelFinedActivityStageGroup(groupId, stageId, activityId) {
  let params = new URLSearchParams();
  params.append("groupId", groupId);
  params.append("stageId", stageId);
  params.append("activityId", activityId);
  return fetch({
    url: 'structure/practiceActivity/cancelFinedActivityStageGroup',
    method: 'post',
    data: params
  });
}

/*查询实践活动列表(分页)*/
export function getActivityGroupStuWorkPageList(query) {
  let params = new URLSearchParams();
  params.append("activityId", query.activityId);
  params.append("groupId", query.groupId);
  params.append("stageId", query.stageId);
  params.append("pageNo", 1);
  params.append("pageSize", 1000);
  params.append("stuName", "");
  return fetch({
    url: 'structure/practiceActivity/getActivityGroupStuWorkPageList',
    method: 'post',
    data: params
  });
}

export function examActivityStuWork(query) {
  const params = new URLSearchParams();
  params.append('evalOption', query.evalOption);
  params.append('id', query.id);
  params.append('isFine', query.isFine);
  params.append('rank', query.rank);
  params.append('rankName', query.rankName);
  params.append('state', query.state);
  return fetch({
    url: 'structure/practiceActivity/examActivityStuWork',
    method: 'POST',
    data: params
  });
}

export function getStuSubmitActivityStageWorkInfo(stageId, stuId) {
  let params = new URLSearchParams();
  params.append("stageId", stageId);
  params.append("stuId", stuId);
  return fetch({
    url: 'structure/practiceActivity/getStuSubmitActivityStageWorkInfo',
    method: 'post',
    data: params
  });
}

/*根据学生ID查询活动评分信息列表*/
export function getActivityStuEvalPageListForStu(args) {
  let params = new URLSearchParams();
  params.append("activityId", args.activityId);
  params.append("teacherId", args.teacherId);
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("stuName", args.stuName);
  return fetch({
    url: 'structure/practiceActivity/getActivityStuEvalPageList',
    method: 'post',
    data: params
  });
}

export function getStuActivityEvalInfoList(activityId, stuId) {
  let params = new URLSearchParams();
  params.append("activityId", activityId);
  params.append("stuId", stuId);
  return fetch({
    url: 'structure/practiceActivity/getStuActivityEvalInfoList',
    method: 'post',
    data: params
  });
}

export function addActivityStuEval(activityId, stuId, args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/practiceActivity/addActivityStuEval?activityId=' + activityId + "&stuId=" + stuId,
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/*删除分组作品图片-视频*/
export function delGroupOpusById(opusId) {
  let params = new URLSearchParams();
  params.append("opusId", opusId);
  return fetch({
    url: 'structure/practiceActivity/delGroupOpusById',
    method: 'post',
    data: params
  });
}
