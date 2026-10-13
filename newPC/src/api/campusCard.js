import fetch from '@/utils/fetch';
import {newcard} from '@/utils/fetch';

//家长验证码（校园卡补卡使用）
export function card(listQuery) {
  let params = new URLSearchParams();
  params.append("mobile", listQuery.mobile);
  params.append("schoolId", listQuery.schoolId);
  params.append("stuName", listQuery.stuName);
  return fetch({
      url: 'common/authCode/wx/card',
      method: 'post',
      params
  });
}

//校验验证码是否正确
export function validate(listQuery) {
  let params = new URLSearchParams();
  params.append("authToken", listQuery.authToken);
  params.append("mobile", listQuery.mobile);
  params.append("msgCode", listQuery.msgCode);
  return fetch({
      url: 'common/authCode/validate',
      method: 'post',
      params
  });
}

//根据学生id获取学生信息以及校园卡信息
export function getStudentInfoAndCardById(listQuery) {
  let params = new URLSearchParams();
  params.append("studentId", listQuery.studentId);
  params.append("schoolId", listQuery.schoolId);
  return newcard({
      url: 'common/getStudentInfoAndCardById',
      method: 'post',
      params
  });
}

//增加校园卡管理
export function addCampusCard(listQuery) {
  let params = new URLSearchParams();
  params.append("classDepartId", listQuery.classDepartId);
  params.append("gradeId", listQuery.gradeId);
  params.append("schoolId",listQuery.schoolId);
  params.append("sid", listQuery.sid);
  params.append("userId", listQuery.userId);
  params.append("userName", listQuery.userName);
  params.append("loginname", listQuery.loginname);
  params.append("cardType", listQuery.cardType);
  // params.append("teacherId", listQuery.teacherId);
  // params.append("teacherName", listQuery.teacherName);
  return newcard({
      url: 'common/addCampusCard',
      method: 'post',
      params
  });
}

//删除校园卡管理
export function deleteCampusCard(listQuery) {
  let params = new URLSearchParams();
  params.append("schoolId",listQuery.schoolId);
  params.append("sid", listQuery.sid);
  params.append("userId", listQuery.userId);
  params.append("userName", listQuery.userName);
  return newcard({
      url: 'common/deleteCampusCard',
      method: 'post',
      params
  });
}

