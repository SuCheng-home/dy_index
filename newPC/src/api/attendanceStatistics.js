import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
import {xjlyuanFetch} from '@/utils/fetch';
const sign = 'cc9034c3f31364af8bafdfd552c8cab8';
//根据区code,日期查询请假统计
export function getLearnStatgeListByDate(args) {
  let params = new URLSearchParams();
  params.append("leaveDate", args.leaveDate);
  params.append("postcode", args.postcode);
  params.append("sign", sign);

  return fetch({
    url: 'edu/askLeave/getLearnStatgeListByDate',
    method: 'GET',
    params
  });
}
//根据区code,日期查询老师统计
export function getSchoolListThByDate(args) {
  let params = new URLSearchParams();
  params.append("leaveDate", args.leaveDate);
  params.append("postcode", args.postcode);
  params.append("sign", sign);

  return fetch({
    url: 'edu/askLeave/getSchoolListThByDate',
    method: 'GET',
    params
  });
}

//根据区code,日期,学段查询学生统计
export function getSchoolListStByDate(args) {
  let params = new URLSearchParams();
  params.append("learningStages", args.learningStages);
  params.append("leaveDate", args.leaveDate);
  params.append("postcode", args.postcode);
  params.append("sign", sign);

  return fetch({
    url: 'edu/askLeave/getSchoolListStByDate',
    method: 'GET',
    params
  });
}
// 获取微研当前学期某天日期
export function getSchoolTimeDate(date) {
  let params = new URLSearchParams();
  params.append("date", date);
  params.append("sign", sign);

  return fetch({
    url: 'edu/schoolTime/getSchoolTimeDate',
    method: 'GET',
    params
  });
}
//幼儿园
export function getLearnStatgeListByDateOther(args) {
  let params = new URLSearchParams();
  params.append("leaveDate", args.leaveDate);
  params.append("postcode", args.postcode);
  params.append("sign", sign);

  return xjlyuanFetch({
    url: 'edu/askLeave/getLearnStatgeListByDate',
    method: 'GET',
    params
  });
}

//根据区code,日期查询老师统计
export function getSchoolListThByDateOther(args) {
  let params = new URLSearchParams();
  params.append("leaveDate", args.leaveDate);
  params.append("postcode", args.postcode);
  params.append("sign", sign);

  return xjlyuanFetch({
    url: 'edu/askLeave/getSchoolListThByDate',
    method: 'GET',
    params
  });
}

//根据区code,日期,学段查询学生统计
export function getSchoolListStByDateOther(args) {
  let params = new URLSearchParams();
  params.append("learningStages", args.learningStages);
  params.append("leaveDate", args.leaveDate);
  params.append("postcode", args.postcode);
  params.append("sign", sign);

  return xjlyuanFetch({
    url: 'edu/askLeave/getSchoolListStByDate',
    method: 'GET',
    params
  });
}
