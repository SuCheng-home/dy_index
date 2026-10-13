import fetch from '@/utils/fetch';

/**
 * 学校id,日期查询学校上报详情
 * */
export function getDiseaseReportSchool(createDate) {
  let params = new URLSearchParams();
  params.append("createDate", createDate);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportSchool',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id，日期查询回执单
 * */
export function getDiseaseReportReceipts(createDate) {
  let params = new URLSearchParams();
  params.append("createDate", createDate);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportReceipts',
    method: 'GET',
    params
  });
}

/**
 * 根据学校,班级id，用户类型查询去国外人员
 * */
export function getGoGuoWaiUserList(args) {
  let params = new URLSearchParams();
  params.append("createDate", args.createDate);
  params.append("userType", args.userType);

  return fetch({
    url: 'structure/diseaseReport/getGoGuoWaiUserList',
    method: 'GET',
    params
  });
}

/**
 * 根据学校,班级id，用户类型查询上报明细
 * */
export function getDiseaseReportClassThDetail(createDate) {
  let params = new URLSearchParams();
  params.append("createDate", createDate);
  params.append("userType", 1);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportClassThDetail',
    method: 'GET',
    params
  });
}

/**
 * 根据学校,班级id，用户类型查询上报明细
 * */
export function getDiseaseReportClassStuDetail(args) {
  let params = new URLSearchParams();
  params.append("gradeId", args.gradeId);
  params.append("classId", args.classId);
  params.append("createDate", args.createDate);
  params.append("userType", 2);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportClassThDetail',
    method: 'GET',
    timeout: 300000,
    params
  });
}

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

/**
 * 按省平台规则查询上报用户
 * */
export function getExportUserListByCode(createDate) {
  let params = new URLSearchParams();
  params.append("createDate", createDate);

  return fetch({
    url: 'structure/diseaseReport/getExportUserListByCode',
    timeout: 60000,
    method: 'GET',
    params
  });
}

/**
 * 重置学校上报
 * */
export function retDiseaseSchoolReport(createDate) {
  let params = new URLSearchParams();
  params.append("createDate", createDate);

  return fetch({
    url: 'structure/diseaseReport/retDiseaseSchoolReport',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id,查询学校每天统计列表
 * */
export function getDiseaseReprtSchoolDateList(schoolId) {
  let params = new URLSearchParams();
  params.append("schoolId", schoolId);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReprtSchoolDateList',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id,日期查询流动人口明细
 * */
export function getDiseaseSchoolReportList(createDate) {
  let params = new URLSearchParams();
  params.append("createDate", createDate);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseSchoolReportList',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id,日期查询流动人口明细
 * */
export function getNotReportUserList(args) {
  let params = new URLSearchParams();
  params.append("createDate", args.createDate);
  params.append("userType", args.userType);

  return fetch({
    url: 'structure/diseaseReport/getNotReportUserList',
    method: 'GET',
    timeout: 60000,
    params
  });
}

// 区code列表
export function getCodeList() {
  let params = new URLSearchParams();
  params.append('dicCode', 'postCode');
  return fetch({
    baseURL: global.BasePath,
    url: 'common/sysDictionary/findDicsByCode',
    method: 'POST',
    data: params
  });
}

/**
 * 根据学校id，日期查询健康统计
 * */
export function getSchoolDiseaseReportHealByDate(createDate) {
  let params = new URLSearchParams();
  params.append("createDate", createDate);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportHealByDate',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id,日期，用户类型，学段查询人在境外明细
 * */
export function getSchoolDiseaseReportHaiWaiList(args) {
  let params = new URLSearchParams();
  params.append("createDate", args.createDate);
  params.append("learningStages", args.learningStages);
  params.append("userType", args.userType);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportHaiWaiList',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id,日期查询风险统计
 * */
export function getDiseaseReportRiskByDateSchool(args) {
  let params = new URLSearchParams();
  params.append("createDate", args.createDate);
  params.append("userType", args.userType);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportRiskByDate',
    method: 'GET',
    params
  });
}

/**
 * 根据学校id,日期，疫情区，类型查询风险用戶列表
 * */
export function getDiseaseReportRiskUserListByDateSchool(args) {
  let params = new URLSearchParams();
  params.append("createDate", args.createDate);
  params.append("searchType", args.searchType);
  params.append("userType", args.userType);
  params.append("yiqingAddress", args.yiqingAddress);

  return fetch({
    url: 'structure/diseaseReport/getDiseaseReportRiskUserListByDate',
    method: 'GET',
    params
  });
}
