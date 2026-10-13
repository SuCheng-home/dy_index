import systemFetch from '@/utils/fetchNew'
import fetch from '@/utils/fetch'
import client1Fetch from '@/utils/fetch'
export function getUpload() {
    let params = new URLSearchParams()
    return systemFetch({
        baseURL: global.BasePath,
        url: 'common/getWxCosFile',
        method: 'post',
        data: params
    })
}
// 获得学校下某个字典的字典值列表
export function findSchoolDicsByCodeStructure(args) {
    let params = new URLSearchParams()
    params.append('dicCode', args.dicCode)

    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'post',
        data: params
    })
}
// 根据字典code获得字典数据
export function findDicsByCode(args) {
    let params = new URLSearchParams()
    params.append('dicCode', args.dicCode)

    return systemFetch({
        baseURL: global.BasePath,
        url: 'structure/sysDictionary/findDicsByCode',
        method: 'post',
        data: params
    })
}

// 获得学校下某个字典的字典值列表(非鉴权)

export function findCommonSchoolDicsByCode(args) {
    let params = new URLSearchParams()
    params.append('dicCode', args.dicCode)
    return fetch({
        url: 'common/sysDictionary/findDicsByCode',
        method: 'post',
        data: params
    })
}
// 获得学校下某个字典的字典值列表(非鉴权)
export function getSchoolDicDetailsByTypeCode2(args) {
    let params = new URLSearchParams()
    params.append('typeCode', args.typeCode)
    params.append('schoolId', args.schoolId)
    return fetch({
        url: 'common/schoolDictionary/getSchoolDicDetailsByTypeCode',
        method: 'post',
        params
    })
}

// 获得学校下某个字典的字典值列表
export function findSchoolDicsByCode(args) {
    let params = new URLSearchParams()
    params.append('dicCode', args.dicCode)

    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'post',
        data: params
    })
}

// 获得某个字典项的子字典项列表
export function getSchoolDicDetailsByTypeCode(args) {
    let params = new URLSearchParams()
    params.append('typeCode', args.typeCode)

    return systemFetch({
        baseURL: global.BasePath,
        url: 'structure/schoolDictionary/getSchoolDicDetailsByTypeCode',
        method: 'post',
        data: params
    })
}

// 学生ID查询信息
export function getStuInfo(idsStr) {
    let params = new URLSearchParams()
    params.append('idsStr', idsStr)

    return systemFetch({
        url: 'api/user/student/info',
        method: 'post',
        data: params
    })
}

/*ppt解析*/
export function loadppt(query) {
    let params = new URLSearchParams()
    params.append('attachURL', query.attachURL)
    return systemFetch({
        baseURL: global.BasePath,
        url: 'common/attachShow',
        method: 'get',
        params
    })
}

/* 获取课程 */
export function getCourse() {
    let params = new URLSearchParams()
    return systemFetch({
        url: 'sys/teacherClass/toAddPop',
        method: 'get',
        params
    })
}

/* 获取课程 */
export function querySchoolAllCourse(args = {}) {
    let params = new URLSearchParams()
    if (args.isMain) {
        params.append('isMain', args.isMain)
    }
    return systemFetch({
        url: 'api/teacherClass/querySchoolAllCourse',
        method: 'get',
        params
    })
}

/* 获得所教班级 */
export function queryClass() {
    let params = new URLSearchParams()
    return systemFetch({
        url: 'api/teacherClass/queryClass',
        method: 'get',
        params
    })
}

/* 获得所教班级和年级 */
export function queryClassGrade() {
    let params = new URLSearchParams()
    return systemFetch({
        url: 'api/teacherClass/queryClassGrade',
        method: 'get',
        params
    })
}

// 获取点播的secretId和secretKey
export function getSecretKey(args) {
    let params = new URLSearchParams()

    return systemFetch({
        baseURL: global.BasePath,
        url: 'common/getSecretKey',
        method: 'post'
    })
}

// 获取视频详情
export function getVodInfo(args) {
    let params = new URLSearchParams()
    params.append('fileId', args.fileId)

    return systemFetch({
        baseURL: global.BasePath,
        url: 'common/getVodInfo',
        method: 'post',
        data: params
    })
}

// 删除视频
export function deleteVod(args) {
    let params = new URLSearchParams()
    params.append('fileId', args.fileId)

    return systemFetch({
        baseURL: global.BasePath,
        url: 'common/deleteVod',
        method: 'post',
        data: params
    })
}

// 根据老师ID获得所教班级和班主任的班级
export function queryAllClassCourse(args) {
    let params = new URLSearchParams()
    params.append('teacherId', args.teacherId)

    return systemFetch({
        url: 'api/teacherClass/queryAllClassCourse',
        method: 'post',
        data: params
    })
}

//判断用户是否具备某角色
export function possessRole(roleConstantId) {
    let params = new URLSearchParams()
    params.append('roleConstantId', roleConstantId)
    return systemFetch({
        url: 'api/user/role/possessRole',
        method: 'GET',
        params
    })
}

/**
 * 获得年级和班级列表
 **/
export function getSchoolGradeClass(args = {
    isFilterNewGrade: true
}) {
    let params = new URLSearchParams();
    params.append('isFilterNewGrade', args.isFilterNewGrade);

    return systemFetch({
        url: 'api/depart/querySchoolGradeClass',
        method: 'get',
        params
    })
}

/**
 * 获得年级和班级列表
 **/
export function querySchoolClass(args = {
    isExcludNewClass: true
}) {
    let params = new URLSearchParams();
    params.append('isExcludNewClass', args.isExcludNewClass);

    return systemFetch({
        url: 'api/depart/querySchoolClass',
        method: 'get',
        params
    })
}

export function queryByGradeBySchoolType(args) {
    let params = new URLSearchParams()
    params.append('schoolType', args.schoolType)

    return systemFetch({
        url: 'common/school/queryByGradeBySchoolType',
        method: 'GET',
        params
    })
}
// 获取微研当前学期信息
export function getSchoolTermWeek() {
    return systemFetch({
        url: `edu/schoolTime/getSchoolTermWeek`,
        method: 'GET'
    })
}
//获取签名
export function getWxCosFileSign(args = {
    sysBucket: 1
}) {
    let params = new URLSearchParams()
    params.append('sysBucket', args.sysBucket)
    return systemFetch({
        baseURL: global.BasePath,
        url: 'common/getWxCosFileSign',
        method: 'get',
        params
    })
}
// 根据ID获得学校信息
export function queryById(args) {
    let params = new URLSearchParams()
    params.append('id', args.id)

    return systemFetch({
        url: `common/school/queryById`,
        method: 'post',
        data: params
    })
}

// 获取云点播签名
export function getSignature() {
    return fetch({
        url: 'common/getSignature',
        method: 'GET'
    })
}

// 关联学期部门
export function queryDepartListTerm(args) {
    return systemFetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'api/depart/queryDepartListTerm',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
/**
 * 根据班级ID获取负责人wxcepClient1/depart/queryManager
 * @param {*} classIdsStr
 */
export function queryManager(args) {
    let params = new URLSearchParams()
    params.append('departId', args.departId)
    return systemFetch({
        url: 'api/depart/queryManager',
        method: 'post',
        data: params
    })
}
// 根据学生id查家长信息
export function queryParent(args) {
    let params = new URLSearchParams()
    params.append('childId', args.childId)
    return systemFetch({
        url: 'api/user/queryParent',
        method: 'POST',
        data: params
    })
}
// 根据学生id查询学生信息
export function queryStudent(args) {
    let params = new URLSearchParams()
    params.append('idsStr', args.idsStr)
    return client1Fetch({
        url: 'user/student/info',
        method: 'POST',
        data: params
    })
}
// 根据学生id查询学生信息(查询带年龄的)
export function getUserById(args) {
    let params = new URLSearchParams()
    params.append('id', args.id)
    return systemFetch({
        url: 'api/user/getUserById',
        method: 'GET',
        params
    })
}
// 集成应用的跳转
export function listUserByUserIds(args) {
    let params = new URLSearchParams()
    params.append('userIds', args.userIds)

    return systemFetch({
        url: 'api/user/listUserByUserIds',
        method: 'post',
        data: params
    })
}
export function queryByClassId(args) {
    let params = new URLSearchParams()
    params.append('classId', args.classId)

    return systemFetch({
        url: 'common/student/queryByClassId',
        method: 'GET',
        params
    })
}
export function listAllStudentBySchoolId(args = {
    isFilterNewClass: true
}) {
    let params = new URLSearchParams();
    params.append('isFilterNewClass', args.isFilterNewClass);

    return systemFetch({
        url: 'api/user/listAllStudentBySchoolId',
        method: 'get',
        params
    })
}
// 查询区域
export function listAreaByParentCode(args) {
    let params = new URLSearchParams();
    params.append('parentCode', args.parentCode);

    return fetch({
        url: `school/listAreaByParentCode`,
        method: 'GET',
        params
    })
}
// 查询区域
export function addWxfileInfo(args) {

    return fetch({
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
    return fetch({
        url: `common/wxfileInfo/delWxfileInfo`,
        method: 'GET',
        params
    })
}
// 查询区域
export function getNoticeCountryListFromDatas(noticeId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);

    return fetch({
        url: `structure/enrollStudentInfo/getNoticeCountryListFromDatas`,
        method: 'GET',
        params
    })
}

export function getSchoolDicDetailsByCode(typeCode) {
    let params = new URLSearchParams();
    params.append("typeCode", typeCode);

    return fetch({
        url: "/structure/schoolDictionary/getSchoolDicDetailsByTypeCode",
        method: "GET",
        params,
    })
}

export function getClassAndGradeByManagerId(managerId) {
    let params = new URLSearchParams();
    params.append("managerId", managerId);

    return systemFetch({
        url: "/api/depart/getClassAndGradeByManagerId",
        method: "GET",
        params,
    })
}

// 查询用户所负责的部门列表
// 部门类型：1教职工，2学生，3年级，4班级，5学校；7部门，10校友，20校外，可选
export const getDepartListByUserId = type => {
  let params = new URLSearchParams();
  params.append('type', type);
  return systemFetch({
      url: '/api/depart/getDepartListByUserId',
      method: 'GET',
      params
  });
}
