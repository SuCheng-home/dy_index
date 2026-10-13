import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
//根据id获取失物申报详情 
export function lostDeclareDetails() {
    return fetch({
        url: 'structure/scoreBook/getClassByRole',
        method: 'POST'
    });
}
//获取年级下设置的科目
export function getScoreBookSetByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return fetch({
        url: 'structure/scoreBook/getScoreBookSetByGradeId',
        method: 'get',
        params
    });
}
//获取班级记分册
export function queryScoreBookByClassId(classId) {
    let params = new URLSearchParams();
    params.append('classId', classId);
    return fetch({
        url: 'structure/scoreBook/queryScoreBookByClassId',
        method: 'get',
        params
    });
}
//获取记分册成绩
export function getScoreBookRecord(scoreBookId) {
    let params = new URLSearchParams();
    params.append('scoreBookId', scoreBookId);
    return fetch({
        url: 'structure/scoreBook/getScoreBookRecord',
        method: 'get',
        params
    });
}
//获取记分册科目成绩
export function getCurrScoreBookRecord(scoreBookId, currId) {
    let params = new URLSearchParams();
    params.append('scoreBookId', scoreBookId);
    params.append('currId', currId);
    return fetch({
        url: 'structure/scoreBook/getCurrScoreBookRecord',
        method: 'get',
        params
    });
}
//新增记分册科目成绩
export function insertCurrScoreBookRecord(id, score, scoreType) {
    let params = new URLSearchParams();
    params.append('id', id);
    params.append('score', score);
    params.append('scoreType', scoreType);
    return fetch({
        url: 'structure/scoreBook/insertCurrScoreBookRecord',
        method: 'get',
        params
    });
}
//提醒任课教师录分
export function remindRecord(scoreBookId) {
    let params = new URLSearchParams();
    params.append('scoreBookId', scoreBookId);
    return fetch({
        url: 'structure/scoreBook/remindRecord',
        method: 'get',
        params
    });
}
//打开记分册
export function openScoreBook(scoreBookId) {
    let params = new URLSearchParams();
    params.append('scoreBookId', scoreBookId);
    return fetch({
        url: 'structure/scoreBook/openScoreBook',
        method: 'get',
        params
    });
}
//关闭记分册
export function closeScoreBook(scoreBookId) {
    let params = new URLSearchParams();
    params.append('scoreBookId', scoreBookId);
    return fetch({
        url: 'structure/scoreBook/closeScoreBook',
        method: 'get',
        params
    });
}
//创建班级记分册
export function insertClassScoreBook(query) {
    let params = new URLSearchParams();
    params.append('classId', query.classId);
    params.append('className', query.className);
    params.append('currJSon', query.currJSon);
    params.append('gradeId', query.gradeId);
    params.append('gradeName', query.gradeName);
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('schoolTimeName', query.schoolTimeName);
    return fetch({
        url: 'structure/scoreBook/insertClassScoreBook',
        method: 'get',
        params
    });
}
//删除班级记分册
export function deleteClassScoreBook(scoreBookId) {
    let params = new URLSearchParams();
    params.append('scoreBookId', scoreBookId);
    return fetch({
        url: 'structure/scoreBook/deleteClassScoreBook',
        method: 'get',
        params
    });
}
//查询学校所有学期列表
export function getSchoolTimeAllList(){
    let params=new URLSearchParams();
    return fetch({
      url:'structure/schoolTime/getSchoolTimeAllList',
      method:'GET',
      params
    })
  }
//新增记分册设置
export function insertScoreBookSet(query) {
    let params = new URLSearchParams();
    params.append('currId', query.currId);
    params.append('currLogo', query.currLogo);
    params.append('currName', query.currName);
    params.append('examTypeJSon', query.examTypeJSon);
    params.append('level', query.level);
    params.append('levelName', query.levelName);
    params.append('questionTypeJSon', query.questionTypeJSon);
    return fetch({
        url: 'structure/scoreBook/insertScoreBookSet',
        method: 'get',
        params
    });
}
//编辑记分册设置
export function updateScoreBookSet(query) {
    let params = new URLSearchParams();
    params.append('currId', query.currId);
    params.append('currLogo', query.currLogo);
    params.append('currName', query.currName);
    params.append('examTypeJSon', query.examTypeJSon);
    params.append('level', query.level);
    params.append('levelName', query.levelName);
    params.append('questionTypeJSon', query.questionTypeJSon);
    params.append('id', query.id);
    return fetch({
        url: 'structure/scoreBook/updateScoreBookSet',
        method: 'get',
        params
    });
}
//获取记分册设置(分页)
export function queryScoreBookSet(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('schoolId', query.schoolId);
    params.append('searchName', query.searchName);
    return fetch({
        url: 'structure/scoreBook/queryScoreBookSet',
        method: 'get',
        params
    });
}
//删除记分册设置
export function deleteScoreBookSetByIds(ids) {
    let params = new URLSearchParams();
    params.append('ids', ids);
    return fetch({
        url: 'structure/scoreBook/deleteScoreBookSetByIds',
        method: 'get',
        params
    });
}
//根据id获取记分册设置详情
export function getScoreBookSetInfo(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/scoreBook/getScoreBookSetInfo',
        method: 'get',
        params
    });
}
//获取可查看该记分册的科目
export function getCanLookCurr(scoreBookId) {
    let params = new URLSearchParams();
    params.append('scoreBookId', scoreBookId);
    return fetch({
        url: 'structure/scoreBook/getCanLookCurr',
        method: 'get',
        params
    });
}
// 获得字典项下的字典列表
export function getDicDetailValuePageList(pageNo,pageSize,dictionaryCode) {
    let params = new URLSearchParams();
    params.append('dictionaryCode', dictionaryCode);
    params.append('pageNo', pageNo);
    params.append('pageSize', pageSize);
    return fetch({
        url: 'structure/schoolDictionary/getDicDetailValuePageList',
        method: 'POST',
        data:params
    });
}
// 保存字典信息
export function saveDicValue(query) {
    let params = new URLSearchParams();
    params.append('code', query.code);
    params.append('dictionaryCode', query.dictionaryCode);
    params.append('id', query.id);
    params.append('remark', query.remark);
    params.append('sort', query.sort);
    params.append('value', query.value);
    return fetch({
        url: 'structure/schoolDictionary/saveDicValue',
        method: 'POST',
        data:params
    });
}
// 根据字典id获得字典详细信息
export function getDicValueInfoById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/schoolDictionary/getDicValueInfoById',
        method: 'POST',
        data:params
    });
}
// 根据ID删除字典信息
export function deleteDicValueById(valueId) {
    let params = new URLSearchParams();
    params.append('valueId', valueId);
    return fetch({
        url: 'structure/schoolDictionary/deleteDicValueById',
        method: 'POST',
        data:params
    });
}
// 获得字典类型信息
export function getDicDetailInfoByCode(code) {
    let params = new URLSearchParams();
    params.append('code', code);
    return fetch({
        url: 'structure/schoolDictionary/getDicDetailInfoByCode',
        method: 'POST',
        data:params
    });
}
export function getSchoolDicTypeInfoByCode(code) {
    let params = new URLSearchParams();
    params.append('code', code);
    return fetch({
        url: 'structure/schoolDictionary/getSchoolDicTypeInfoByCode',
        method: 'POST',
        data:params
    });
}
//保存学校字典类型
export function saveSchoolDicType() {
    let params = new URLSearchParams();
    params.append('code', 'scoreBook');
    params.append('id', '0');
    params.append('name', '记分册');
    params.append('remark', '');
    return fetch({
        url: 'structure/schoolDictionary/saveSchoolDicType',
        method: 'POST',
        data:params
    });
}
//保存字典项
export function saveDicDetail(code,name) {
    let params = new URLSearchParams();
    params.append('code', code);
    params.append('id', '0');
    params.append('name', name);
    params.append('remark', '');
    params.append('typeCode', 'scoreBook');
    return fetch({
        url: 'structure/schoolDictionary/saveDicDetail',
        method: 'POST',
        data:params
    });
}
//获得学校所有的课程列表
export function querySchoolAllCourse() {
    return systemFetch({
        url: 'api/teacherClass/querySchoolAllCourse',
        method: 'get',
    });
}
//获得年级列表   
export function querySchoolGrade() {
    let params = new URLSearchParams();
    params.append('isFilterNewGrade', true);
    return systemFetch({
        url: 'api/depart/querySchoolGrade',
        method: 'get',
        params
    });
}
// 获得字典项下的字典列表
export function findSchoolDicsByCode(dicCode) {
    let params = new URLSearchParams();
    params.append('dicCode', dicCode);
    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'POST',
        data:params
    });
}
// 根据班级ID获得课程
export function queryCoursesByClassId(classId) {
    let params = new URLSearchParams();
    params.append('classId', classId);
    return systemFetch({
        url: 'api/teacherClass/queryCoursesByClassId',
        method: 'POST',
        params
    });
}