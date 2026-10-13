import fetch from '@/utils/fetch';
import {wymsFetchNoProcess} from '@/utils/fetch';

//校园圈主题列表（分页）
export function getSchoolCircleTopicPageList() {
    let params = new URLSearchParams();
    params.append("state", 0);
    params.append("title", '');
    return fetch({
        url: 'structure/schoolCircle/getSchoolCircleTopicList',
        method: 'post',
        data:params
    });
  }
  //删除校园圈主题
export function deleteCircleTopic(topicIds) {
    let params = new URLSearchParams();
    params.append("topicIds", topicIds);
    return fetch({
        url: 'structure/schoolCircle/deleteCircleTopic',
        method: 'post',
        data:params
    });
  }
    //根据ID查询圈子主题信息
export function getSchoolCircleTopicInfoById(topicId) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    return fetch({
        url: 'structure/schoolCircle/getSchoolCircleTopicInfoById',
        method: 'post',
        data:params
    });
  }
    //根据主题ID发布校园圈
export function publishCircleTopicById(topicId) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    return fetch({
        url: 'structure/schoolCircle/publishCircleTopicById',
        method: 'post',
        data:params
    });
  }
     //获得校园类型列表
export function getTopicOptionList(topicId) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    return fetch({
        url: 'structure/schoolCircle/getTopicOptionList',
        method: 'post',
        data:params
    });
  }
  
   //根据ID删除主题分类类型
export function deleteTopicOptionById(optionId) {
    let params = new URLSearchParams();
    params.append("optionId", optionId);
    return fetch({
        url: 'structure/schoolCircle/deleteTopicOptionById',
        method: 'post',
        data:params
    });
  }
   //新增主题分类类型
export function addTopicOption(listQuery) {
    let params = new URLSearchParams();
    params.append("optionName", listQuery.optionName);
    params.append("optionOrder", listQuery.optionOrder);
    params.append("topicId", listQuery.topicId);
    return fetch({
        url: 'structure/schoolCircle/addTopicOption',
        method: 'post',
        data:params
    });
  }
   //获得主题分组列表
export function getCircleTopicGroupListByTopicId(topicId) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    return fetch({
        url: 'structure/schoolCircle/getCircleTopicGroupListByTopicId',
        method: 'post',
        data:params
    });
  }
   //删除分组
export function deleteTopicGroup(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/schoolCircle/deleteTopicGroup',
        method: 'post',
        data:params
    });
  }
//新增校园圈主题
export function addCircleTopic(listQuery) {
    let params = new URLSearchParams();
    params.append("content", listQuery.content);
    params.append("departJson", listQuery.departJson);
    params.append("logoCode", listQuery.logoCode);
    params.append("logoUrl", listQuery.logoUrl);
    params.append("offDate", listQuery.offDate);
    params.append("state", listQuery.state);
    params.append("title", listQuery.title);
    params.append("topicLogo", listQuery.topicLogo);
    params.append("needApprove", listQuery.needApprove?1:0);
    return fetch({
        url: 'structure/schoolCircle/addCircleTopic',
        method: 'post',
        data:params
    });
  }
//字典值列表
export function listValue() {
    let params = new URLSearchParams();
    params.append('key', "schoolCircleTopicLogo");
    return wymsFetchNoProcess({
        url: 'sysDic/listValue?pageSize=500',
        method: 'get',
        params
    });
}
//编辑校园圈主题
 export function editCircleTopic(listQuery) {
    let params = new URLSearchParams();
    params.append("content", listQuery.content);
    params.append("departJson", listQuery.departJson);
    params.append("logoCode", listQuery.logoCode);
    params.append("logoUrl", listQuery.logoUrl);
    params.append("offDate", listQuery.offDate);
    params.append("state", listQuery.state);
    params.append("title", listQuery.title);
    params.append("id", listQuery.id);
    params.append("topicLogo", listQuery.topicLogo);
    params.append("needApprove", listQuery.needApprove?1:0);
    return fetch({
        url: 'structure/schoolCircle/editCircleTopic',
        method: 'post',
        data:params
    });
  }

//初始化校园圈分组
export function initTopicGroup(topicId,groupNum) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    params.append("groupNum", groupNum);
    return fetch({
        url: '/structure/schoolCircle/initTopicGroup',
        method: 'post',
        data:params
    });
  }

//新增校园圈主题分组
export function addTopicGroup(listQuery) {
    let params = new URLSearchParams();
    params.append("groupName", listQuery.groupName);
    params.append("orderNo", listQuery.orderNo);
    params.append("studentJson", listQuery.studentJson);
    params.append("teacherJson", listQuery.teacherJson);
    params.append("topicId", listQuery.topicId);
    return fetch({
        url: 'structure/schoolCircle/addTopicGroup',
        method: 'post',
        data:params
    });
  }
//新增校园圈主题分组
export function editTopicGroup(listQuery) {
    let params = new URLSearchParams();
    params.append("groupName", listQuery.groupName);
    params.append("orderNo", listQuery.orderNo);
    params.append("studentJson", listQuery.studentJson);
    params.append("teacherJson", listQuery.teacherJson);
    params.append("topicId", listQuery.topicId);
    params.append("id", listQuery.id);
    return fetch({
        url: 'structure/schoolCircle/editTopicGroup',
        method: 'post',
        data:params
    });
  }
//查询主题分组详细信息
export function getCircleTopicGroupInfoById(groupId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    return fetch({
        url: 'structure/schoolCircle/getCircleTopicGroupInfoById',
        method: 'post',
        data:params
    });
  }

//主题下校园圈分页列表（PC端）
export function getTopicSchoolCircleList(listQuery) {
    let params = new URLSearchParams();
    params.append("isDigest", listQuery.isDigest);
    params.append("pageNo", listQuery.pageNo);
    params.append("pageSize", listQuery.pageSize);
    params.append("topicId", listQuery.topicId);
    return fetch({
        url: 'structure/schoolCircle/getTopicSchoolCircleList',
        method: 'post',
        data:params
    });
  }

  //查询教师校园圈统计数据列表
export function getThSchoolCircleAnalysisDataList(topicId) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    return fetch({
        url: 'structure/schoolCircle/getThSchoolCircleAnalysisDataList',
        method: 'post',
        data:params
    });
  }
  //查询学生校园圈统计数据列表
export function getStuSchoolCircleAnalysisDataList(topicId) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    return fetch({
        url: 'structure/schoolCircle/getStuSchoolCircleAnalysisDataList',
        method: 'post',
        data:params
    });
  }
   //获得学校的校园圈统计数据
export function getSchoolCircleAnalysisData(topicId) {
    let params = new URLSearchParams();
    params.append("topicId", topicId);
    return fetch({
        url: 'structure/schoolCircle/getSchoolCircleAnalysisData',
        method: 'post',
        data:params
    });
  }
  //获得学校的校园圈统计数据
export function deleteTopicGroupStu(groupId,stuId) {
    let params = new URLSearchParams();
    params.append("groupId", groupId);
    params.append("stuId", stuId);
    return fetch({
        url: 'structure/schoolCircle/deleteTopicGroupStu',
        method: 'post',
        data:params
    });
  }
  //新增分组学生
export function addTopicGroupStu(listQuery) {
    let params = new URLSearchParams();
    params.append("groupId", listQuery.groupId);
    params.append("studentJson", listQuery.studentJson);
    params.append("topicId", listQuery.topicId);
    return fetch({
        url: 'structure/schoolCircle/addTopicGroupStu',
        method: 'post',
        data:params
    });
  }
//审批校园圈
export function approveSchoolCircle(id,isApprove) {
  let params = new URLSearchParams();
  params.append("id", id);
  params.append("isApprove", isApprove);
  return fetch({
      url: 'structure/schoolCircle/approveSchoolCircle',
      method: 'post',
      data:params
  });
}