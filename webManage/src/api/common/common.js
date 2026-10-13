import fetch from '@/utils/fetchNew';
import clientFetch from '@/utils/fetch';

export function getUpload() {
  let params = new URLSearchParams();
  return fetch({
    baseURL: global.BasePath,
    url: 'common/getWxCosFile',
    method: 'post',
    data: params
  });
}

// 根据字典code获得字典数据
export function findDicsByCode(args) {
  let params = new URLSearchParams();
  params.append('dicCode', args.dicCode);

  return fetch({
    baseURL: global.BasePath,
    url: 'structure/sysDictionary/findDicsByCode',
    method: 'post',
    data: params
  });
}

// 获得某个字典项的子字典项列表
export function getSchoolDicDetailsByTypeCode(args) {
  let params = new URLSearchParams();
  params.append('typeCode', args.typeCode);

  return fetch({
    baseURL: global.BasePath,
    url: 'structure/schoolDictionary/getSchoolDicDetailsByTypeCode',
    method: 'post',
    data: params
  });
}

// 学生ID查询信息
export function getStuInfo(idsStr) {
  let params = new URLSearchParams();
  params.append('idsStr', idsStr);

  return fetch({
    url: 'api/user/student/info',
    method: 'post',
    data: params
  });
}

/*ppt解析*/
export function loadppt(query) {
  let params = new URLSearchParams();
  params.append('attachURL', query.attachURL);
  return fetch({
    baseURL: global.BasePath,
    url: 'common/attachShow',
    method: 'get',
    params
  })
}

/* 获取课程 */
export function getCourse() {
  let params = new URLSearchParams();
  return fetch({
    url: 'sys/teacherClass/toAddPop',
    method: 'get',
    params
  })
}


/* 获得所教班级 */
export function queryClass() {
  let params = new URLSearchParams();
  return fetch({
    url: 'api/teacherClass/queryClass',
    method: 'get',
    params
  })
}

/* 获得所教班级和年级 */
export function queryClassGrade() {
  let params = new URLSearchParams();
  return fetch({
    url: 'api/teacherClass/queryClassGrade',
    method: 'get',
    params
  })
}

// 获取点播的secretId和secretKey
export function getSecretKey(args) {
  let params = new URLSearchParams();

  return fetch({
    baseURL: global.BasePath,
    url: 'common/getSecretKey',
    method: 'post',
  });
}

// 获取视频详情
export function getVodInfo(args) {
  let params = new URLSearchParams();
  params.append('fileId', args.fileId);

  return fetch({
    baseURL: global.BasePath,
    url: 'common/getVodInfo',
    method: 'post',
    data: params
  });
}

// 删除视频
export function deleteVod(args) {
  let params = new URLSearchParams();
  params.append('fileId', args.fileId);

  return fetch({
    baseURL: global.BasePath,
    url: 'common/deleteVod',
    method: 'post',
    data: params
  });
}

// 根据老师ID获得所教班级和班主任的班级
export function queryAllClassCourse(args) {
  let params = new URLSearchParams();
  params.append('teacherId', args.teacherId);

  return fetch({
    url: 'api/teacherClass/queryAllClassCourse',
    method: 'post',
    data: params
  });
}

export function queryByGradeBySchoolType(args) {
  let params = new URLSearchParams();
  params.append('schoolType', args.schoolType);

  return fetch({
    url: 'common/school/queryByGradeBySchoolType',
    method: 'GET',
    params
  });
}

// 获取微研当前学期信息
export function getSchoolTermWeek() {
  return fetch({
    url: `edu/schoolTime/getSchoolTermWeek`,
    method: 'GET'
  });
}

//获取签名
export function getWxCosFileSign(args = {sysBucket: 1}) {
  let params = new URLSearchParams();
  params.append('sysBucket', args.sysBucket)
  return fetch({
    baseURL: global.BasePath,
    url: 'common/getWxCosFileSign',
    method: 'get',
    params
  });
}
// 查询区域
export function addWxfileInfo(args) {

  return clientFetch({
    headers: {
      'content-type': 'application/json'
    },
    url: `common/wxfileInfo/addWxfileInfo`,
    method: 'POST',
    data: JSON.stringify(args)
  })
}
// 查询区域
export function delWxfileInfo(args) {
  let params = new URLSearchParams();
  params.append('fileUrl', args.fileUrl);
  return clientFetch({
    url: `common/wxfileInfo/delWxfileInfo`,
    method: 'GET',
    params
  })
}
