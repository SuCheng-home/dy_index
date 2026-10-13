import fetch from '@/utils/fetch';
import {systemFetch,xjlyuanFetch} from '@/utils/fetch';
//根据字典code获得字典数据
export function findDicsByCode() {
    let params = new URLSearchParams();
    params.append("dicCode", 'archivesActivityType');
    return fetch({
      url: 'structure/sysDictionary/findDicsByCode',
      method: 'post',
      data:params
    });
  }
//获得学校下某个字典的字典值列表
export function findSchoolDicsByCode() {
    let params = new URLSearchParams();
    params.append("dicCode", 'archivesActivityKey');
    return fetch({
      url: 'structure/schoolDictionary/findSchoolDicsByCode',
      method: 'post',
      data:params
    });
  }
//查询学校所有学期列表
export function getSchoolTimeAllList(){
    return fetch({
      url:'structure/schoolTime/getSchoolTimeAllList',
      method:'GET'
    })
  }
  //查询学校成长类型字典
  export function getSchoolGrowthTypeDicList() {
    let params = new URLSearchParams();
    params.append("useType", '1');
	return xjlyuanFetch({
		url: 'structure/growthArchives/getSchoolGrowthTypeDicList',
		method: 'post',
		data:params
	});
}
//保存学校成长类型字典
export function saveSchoolGrowthTypeDics(args) {   
    return xjlyuanFetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/growthArchives/saveSchoolGrowthTypeDics',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//不同角色获得成长档案活动分页列表（老师）
export function getGrowthArchivesActivityPageList(args) {
    let params = new URLSearchParams();
    params.append('activityKeys', args.activityKeys);
    params.append('activityTypeCode', args.activityTypeCode==0?'':args.activityTypeCode);
    params.append('classId', args.classId);
    params.append('gradeId', args.gradeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('searchTitle', args.searchTitle);
    params.append('type', args.type);
    return xjlyuanFetch({
      url: 'structure/growthArchives/getGrowthArchivesActivityPageList',
      method: 'post',
      data: params
    });
  }
  //新增成长档案活动
export function addGrowthArchiveActivity(args) {
  let params = new URLSearchParams();
  params.append('activityName', args.activityName);
  params.append('classIds', args.classIds);
  params.append('classNames', args.classNames);
  params.append('createType', args.createType);
  params.append('keyCodes', args.keyCodes);
  params.append('keyNames', args.keyNames);
  params.append('stuId', args.stuId);
  params.append('typeCode', args.typeCode);
  params.append('typeName', args.typeName);
  params.append('schoolTimeId', args.schoolTimeId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/addGrowthArchiveActivity',
    method: 'post',
    data: params
  });
}
 //编辑成长档案活动
 export function editGrowthArchiveActivity(args) {
  let params = new URLSearchParams();
  params.append('activityName', args.activityName);
  params.append('classIds', args.classIds);
  params.append('classNames', args.classNames);
  params.append('createType', args.createType);
  params.append('keyCodes', args.keyCodes);
  params.append('keyNames', args.keyNames);
  params.append('stuId', args.stuId);
  params.append('typeCode', args.typeCode);
  params.append('typeName', args.typeName);
  params.append('id', args.id);
  return xjlyuanFetch({
    url: 'structure/growthArchives/editGrowthArchiveActivity',
    method: 'post',
    data: params
  });
}
//获得活动详细信息
export function getGrowthArchivesActivityModelById(activityId) {
  let params = new URLSearchParams();
  params.append('activityId', activityId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/getGrowthArchivesActivityModelById',
    method: 'post',
    data: params
  });
}
 //查询用户对应的班级列表
 export function getTeacherClassList() {
return xjlyuanFetch({
  url: 'structure/growthArchives/getTeacherClassList',
  method: 'post'
});
}
//根据ID删除成长档案活动
export function deleteGrowthArchivesActivityById(id) {
  let params = new URLSearchParams();
  params.append('id', id);
  return xjlyuanFetch({
    url: 'structure/growthArchives/deleteGrowthArchivesActivityById',
    method: 'post',
    data: params
  });
}
//查询活动详情（包含附件及关联学生）
export function getGrowthArchivesActivityInfo(activityId) {
  let params = new URLSearchParams();
  params.append('activityId', activityId);
  params.append('stuId', 0);
  return xjlyuanFetch({
    url: 'structure/growthArchives/getGrowthArchivesActivityInfo',
    method: 'post',
    data: params
  });
}
//batchAddActivityFiles
export function batchAddActivityFiles(args) {   
  return xjlyuanFetch({
      headers: {
          'content-type': 'application/json'
      },
      url: 'structure/growthArchives/batchAddActivityFiles',
      method: 'post',
      data: JSON.stringify(args)
  });
}

 //新增活动附件
 export function addActivityFile(args) {
  let params = new URLSearchParams();
  params.append('activityId', args.activityId);
  params.append('fileType', args.fileType);
  params.append('fileUrl', args.fileUrl);
  params.append('photoAxis', args.photoAxis);
  params.append('photoDetails', args.photoDetails);
  params.append('stuId', args.stuId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/addActivityFile',
    method: 'post',
    data: params
  });
}
//根据班级ID集合获取学生列表
export function queryStudentsByClassIds(classIds) {
  let params = new URLSearchParams();
  params.append('classIds', classIds);
  params.append('isOrderByName', true);
  return systemFetch({
    url: 'api/user/depart/queryStudentsByClassIds',
    method: 'get',
    params
  });
}
//新增活动附件
export function addActivityFileStu(activityId,fileId,stuId) {
  let params = new URLSearchParams();
  params.append('activityId', activityId);
  params.append('fileId', fileId);
  params.append('stuId', stuId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/addActivityFileStu',
    method: 'post',
    data: params
  });
}
//删除附件学生
export function deleteActivityFileStu(fileId,stuId) {
  let params = new URLSearchParams();
  params.append('fileId', fileId);
  params.append('stuId', stuId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/deleteActivityFileStu',
    method: 'post',
    data: params
  });
}
//全选--取消全选附件关联学生
export function batchAddOrCancelFileStu(activityId,fileId,fromType) {
  let params = new URLSearchParams();
  params.append('fileId', fileId);
  params.append('activityId', activityId);
  params.append('fromType', fromType);
  return xjlyuanFetch({
    url: 'structure/growthArchives/batchAddOrCancelFileStu',
    method: 'post',
    data: params
  });
}
//附件加星/取消加星
export function starOrCancelStarActivityFile(fileId,starStatus) {
  let params = new URLSearchParams();
  params.append('fileId', fileId);
  params.append('starStatus', starStatus);
  return xjlyuanFetch({
    url: 'structure/growthArchives/starOrCancelStarActivityFile',
    method: 'post',
    data: params
  });
}
//根据ID删除活动附件
export function deleteActivityFileById(id) {
  let params = new URLSearchParams();
  params.append('id', id);
  return xjlyuanFetch({
    url: 'structure/growthArchives/deleteActivityFileById',
    method: 'post',
    data: params
  });
}
 //新增活动附件
 export function addActivityFileStuComment(args) {
  let params = new URLSearchParams();
  params.append('activityId', args.activityId);
  params.append('comment', args.comment);
  params.append('commentNum', args.comment.length);
  params.append('fileId', args.fileId);
  params.append('isComment', args.comment?1:0);
  params.append('stuId', args.stuId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/addActivityFileStuComment',
    method: 'post',
    data: params
  });
}
//批量新增评语  
export function batchAddActivityFileStuComment(args) {
  let params = new URLSearchParams();
  params.append('activityId', args.activityId);
  params.append('comment', args.comment);
  params.append('commentNum', args.comment.length);
  params.append('fileId', args.fileId);
  params.append('isComment', args.comment?1:0);
  return xjlyuanFetch({
    url: 'structure/growthArchives/batchAddActivityFileStuComment',
    method: 'post',
    data: params
  });
}
//查询是否可直接发布成长档案活动
export function isCanPublishActivity(activityId) {
  let params = new URLSearchParams();
  params.append('activityId', activityId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/isCanPublishActivity',
    method: 'post',
    data: params
  });
}
//发布成长档案活动
export function publishGrowthArchivesActivity(activityId) {
  let params = new URLSearchParams();
  params.append('activityId', activityId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/publishGrowthArchivesActivity',
    method: 'post',
    data: params
  });
}
//活动学生数据统计
export function getActivityStuStaticsDataList(activityId) {
  let params = new URLSearchParams();
  params.append('activityId', activityId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/getActivityStuStaticsDataList',
    method: 'post',
    data: params
  });
}
//新增留言
export function addActivityFileStuMessage(args) {
  let params = new URLSearchParams();
  params.append('activityId', args.activityId);
  params.append('message', args.message);
  params.append('fileId', args.fileId);
  params.append('isMessage', args.message?1:0);
  params.append('stuId', args.stuId);
  params.append('fromType', 1);
  return xjlyuanFetch({
    url: 'structure/growthArchives/addActivityFileStuMessage',
    method: 'post',
    data: params
  });
}
//删除留言
export function deleteActivityFileStuMessage(fileId,stuId) {
  let params = new URLSearchParams();
  params.append('fileId', fileId);
  params.append('stuId', stuId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/deleteActivityFileStuMessage',
    method: 'post',
    data: params
  });
}
//查询附件对应的留言列表
export function getFileMessageList(fileId) {
  let params = new URLSearchParams();
  params.append('fileId', fileId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/getFileMessageList',
    method: 'post',
    data: params
  });
}
//判断用户是否具备某角色
export function possessRole(roleConstantId) {
  let params = new URLSearchParams();
  params.append('roleConstantId', roleConstantId);
  return systemFetch({
      url: 'api/user/role/possessRole',
      method: 'GET',
      params
  });
}
//根据学校id和学期id获取年级列表
export function getGradeByTermId(schoolId,termId) {
  let params = new URLSearchParams();
  params.append('schoolId', schoolId);
  params.append('termId', termId);
  return fetch({
    url: 'structure/termClass/getGradeByTermId',
    method: 'get',
    params
  });
}

//根据学校id，学期id，年级id获取班级列表
export function getClassByGradeId(schoolId,termId,gradeId) {
  let params = new URLSearchParams();
  params.append('schoolId', schoolId);
  params.append('termId', termId);
  params.append('gradeId', gradeId);
  return fetch({
    url: 'structure/termClass/getClassByGradeId',
    method: 'get',
    params
  });
}
//根据学期id, 用户id查询历史班主任
export function queryClassManagerListByTermIdAndUid(termId) {
  let params = new URLSearchParams();
  params.append('termId', termId);
  params.append('other', true);
  params.append('grade', true);
  return fetch({
    url: 'structure/termClass/queryClassManagerListByTermIdAndUid',
    method: 'get',
    params
  });
}
//查询用户所负责的部门和其他负责部门
export function getManageAndOtherDepart() {
  let params = new URLSearchParams();
  params.append('type', 4);
  return systemFetch({
      baseURL: global.BaseNewPath,
      url: 'api/depart/getManageAndOtherDepart',
      method: 'post',
      data: params
  });
}

//移动活动资料
export function moveActivityFiles(fileIds,sourceId,targetId) {
  let params = new URLSearchParams();
  params.append('fileIds', fileIds);
  params.append('sourceId', sourceId);
  params.append('targetId', targetId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/moveActivityFiles',
    method: 'get',
    params
  });
}
//移动活动资料
export function copyActivityFiles(fileIds,sourceId,targetId) {
  let params = new URLSearchParams();
  params.append('fileIds', fileIds);
  params.append('sourceId', sourceId);
  params.append('targetId', targetId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/copyActivityFiles',
    method: 'get',
    params
  });
}
//移动活动资料
export function getCanOperateActivityListByActivityId(activityId) {
  let params = new URLSearchParams();
  params.append('activityId', activityId);
  return xjlyuanFetch({
    url: 'structure/growthArchives/getCanOperateActivityListByActivityId',
    method: 'get',
    params
  });
}