import fetch from '@/utils/fetch';

/**
 * 成绩设置列表
 */
export function examSetList() {
    return fetch({
        url: 'structure/exam/examSetList',
        method: 'post'
    });
}
/**
 * 获取老师所教课程
 * @param {*} setId 
 */
export function queryCourses(Id) {
    let params = new URLSearchParams();
    params.append('teacherId',Id);
    return fetch({
        url: 'teacherClass/queryCourses',
        method: 'post',
        params
    });
}
/**
 * 删除设置
 * @param {*} setId 
 */
export function deleteExamSet(setId) {
    let params = new URLSearchParams();
    params.append('setId', setId);
    return fetch({
        url: 'structure/exam/deleteExamSet',
        method: 'post',
        params
    });
}
/**
 * 获取班级某个学期某个班级考试的科目
 * @param {*}
 */
export function getclassCurrBySchoolTimeId(query) {
    let params = new URLSearchParams();
    params.append('classId', query.classId);//班级Id
    params.append('schoolTimeId', query.schoolTimeId);//学期Id
    return fetch({
        url: 'structure/exam/getclassCurrBySchoolTimeId',
        method: 'post',
        params
    });
}

/**
 * 添加设置
 * @param {*} query 
 */
export function insertExamSet(query) {
    let params = new URLSearchParams();
    params.append('gradeId', query.gradeId);
    params.append('gradeName', query.gradeName);
    params.append('levelAName', query.levelAName);
    params.append('levelAVal', query.levelAVal);
    params.append('levelBName', query.levelBName);
    params.append('levelBVal', query.levelBVal);
    params.append('levelCName', query.levelCName);
    params.append('levelCVal', query.levelCVal);
    params.append('levelDName', query.levelDName);
    params.append('levelDVal', query.levelDVal);
    params.append('levelEName', query.levelEName);
    params.append('levelEVal', query.levelEVal);
    params.append('parentDisplayRank', query.parentDisplayRank);
    params.append('currJson', query.currJson);
    params.append('parentDisplayAvg', query.parentDisplayAvg);
    return fetch({
        url: 'structure/exam/insertExamSet',
        method: 'post',
        params
    });
}

/**
 * 获取设置详情
 * @param {*} setId 
 */
export function examSetDetails(setId) {
    let params = new URLSearchParams();
    params.append('setId', setId);
    return fetch({
        url: 'structure/exam/examSetDetails',
        method: 'post',
        params
    });
}

/**
 * 编辑设置
 * @param {*} query 
 */
export function editExamSet(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('gradeId', query.gradeId);
    params.append('gradeName', query.gradeName);
    params.append('levelAName', query.levelAName);
    params.append('levelAVal', query.levelAVal);
    params.append('levelBName', query.levelBName);
    params.append('levelBVal', query.levelBVal);
    params.append('levelCName', query.levelCName);
    params.append('levelCVal', query.levelCVal);
    params.append('levelDName', query.levelDName);
    params.append('levelDVal', query.levelDVal);
    params.append('levelEName', query.levelEName);
    params.append('levelEVal', query.levelEVal);
    params.append('parentDisplayRank', query.parentDisplayRank);
    params.append('currJson', query.currJson);
    params.append('parentDisplayAvg', query.parentDisplayAvg);
    return fetch({
        url: 'structure/exam/editExamSet',
        method: 'post',
        params
    });
}
/**
 * 教师获取考试列表
 * @param {*} query 
 */
export function examList(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('examName', query.examName);
    return fetch({
        url: 'structure/exam/examList',
        method: 'post',
        params
    });
}

/**
 * 添加考试
 * @param {*} query 
 */
export function insertExam(query) {
    let params = new URLSearchParams();
    params.append('currArr', query.currArr);//科目集合
    params.append('departId', query.departId);//部门id
    params.append('departName', query.departName);//考试班级
    params.append('examDate', query.examDate);//考试时间
    params.append('examType', query.examType);//考试类型,1测验考试,2专项考试,3期中考试,4期末考试
    params.append('gradeId', query.gradeId);//年级Id
    params.append('gradeName', query.gradeName);//年级名称
    params.append('name', query.name);//考试名称
    // params.append('sendScore', query.sendScore);//是否已发布成绩，0代表未发布，1代表已发布
    // params.append('state', query.state);//是否关闭考试，打开为“1”，关闭为“0”
    params.append('classType', query.classType);//0代表班级，1代表走班1 因为没有走班接口写死
    return fetch({
        url: 'structure/exam/insertExam',
        method: 'post',
        params
    });
}
/**
 * 编辑考试
 * @param {*} query 
 */
export function editExam(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('name', query.name);
    params.append('examDate', query.examDate);
    params.append('departId', query.departId);
    params.append('departName', query.departName);
    params.append('gradeId', query.gradeId);
    params.append('gradeName', query.gradeName);
    params.append('examType', query.examType);//考试类型,1测验考试,2专项考试,3期中考试,4期末考试
    params.append('classType',query.classType);//0代表班级，1代表走班1
    params.append('currArr', query.currArr);//科目集合  
    // params.append('score', query.score);
    // params.append('sendScore', query.sendScore);
    // params.append('state', query.state);
    return fetch({
        url: 'structure/exam/editExam',
        method: 'post',
        params
    });
}
/**
 * 删除考试
 * @param {*} examId 
 */
export function deleteExam(examId) {
    let params = new URLSearchParams();
    params.append('examIds', examId);
    return fetch({
        url: 'structure/exam/deleteExam',
        method: 'post',
        params
    });
}

/**
 * 根据考试id获取考试基本详情
 * @param {*} examId 
 */
export function examDetails(examId) {
    let params = new URLSearchParams();
    params.append('examId', examId);
    return fetch({
        url: 'structure/exam/examDetails',
        method: 'post',
        params
    });
}
/**
 * 成绩维护里的学生成绩数据
 * @param {*} examId 
 */
export function examScoreMaintain(examId) {
    let params = new URLSearchParams();
    params.append('examId', examId);
    return fetch({
        url: 'structure/exam/examScoreMaintain',
        method: 'post',
        params
    });
}

/**
 * 写入学生成绩
 * @param {*} query 
 */
export function writeScore(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);//考试id
    params.append('schoolTimeId', query.schoolTimeId);//学期id
    params.append('gradeId', query.gradeId);//年级Id
    params.append('gradeName', query.gradeName);//年级名称
    params.append('departId', query.departId);//部门id
    params.append('departName', query.departName);//考试班级
    params.append('curriculumId', query.curriculumId);//科目Id
    params.append('curriculumName', query.curriculumName);//科目
    params.append('stuId', query.stuId);//学生id
    params.append('classType',query.classType);//0班级，1走班 因为没有走班接口写死
    params.append('score', query.score);//成绩
    return fetch({
        url: 'structure/exam/writeScore',
        method: 'post',
        params
    });
}

/**
 * 成绩分析数据
 * @param {*} examId 
 */
export function examScoreAnalysis(examId,currId) {
    let params = new URLSearchParams();
    params.append('currId', currId);
    params.append('examId', examId);
    return fetch({
        url: 'structure/exam/examScoreAnalysis',
        method: 'post',
        params
    });
}

/**
 * 获取一个学期某个班级某个科目的学生成绩
 * @param {*} query 
 */
export function getStuScoreBySchoolTimeIdAndCurrId(query) {
    let params = new URLSearchParams();
    params.append('classType', query.classType);
    params.append('classId', query.classId);
    params.append('currId', query.currId);
    params.append('schoolTimeId', query.schoolTimeId);
    return fetch({
        url: 'structure/exam/getStuScoreBySchoolTimeIdAndCurrId',
        method: 'post',
        params
    });
}

/**
 * 分析一个学期的某个学生某个科目的成绩分析图
 * @param {*} query 
 */
export function stuScoreAnalysisBySchoolTimeIdAndCurrId(query) {
    let params = new URLSearchParams();
    params.append('classType', 0);//因为没有走班接口写死
    params.append('classId', query.classId);
    params.append('currId', query.currId);
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('stuId', query.stuId);
    return fetch({
        url: 'structure/exam/stuScoreAnalysisBySchoolTimeIdAndCurrId',
        method: 'post',
        params
    });
}

/**
 * 发送成绩
 * @param {*} query 
 */
export function sendScore(query) {
    let params = new URLSearchParams();
    params.append('currIds', query.currIds);//科目Ids,以逗号分隔
    params.append('examId', query.examId);//考试id
    params.append('sendAvg', query.sendAvg);//是否发送平均分
    params.append('sendMax', query.sendMax);//是否发送最大分
    params.append('sendMin', query.sendMin);//是否发送最小分
    params.append('sendRank', query.sendRank);//是否发送排名	
    return fetch({
        url: 'structure/exam/sendScore',
        method: 'post',
        params
    });
}
/**
 * 发送成绩
 * @param {*} query 
 */
export function classStuScoreAnalysisBySchoolTimeId(query) {
    let params = new URLSearchParams();
    params.append('classId', query.classId);//班级id
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('searchName', query.searchName);//搜索
    params.append('schoolTimeId', query.schoolTimeId);//学期id
    return fetch({
        url: 'structure/exam/classStuScoreAnalysisBySchoolTimeId',
        method: 'post',
        params
    });
}
/**
 * 学生成绩
 * @param {*} query 
 */
export function stuScoreAnanlysisBySchoolTimeIdData(schoolTimeId,stuId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);//学期id
    params.append('stuId',stuId);//学生id
    return fetch({
        url: 'structure/exam/stuScoreAnanlysisBySchoolTimeIdData',
        method: 'post',
        params
    });
}
/**
 *评语
 * @param {*} query 
 */
export function saveStuComment(schoolTimeId,stuId,comment) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId);//班级id
    params.append('stuId',stuId);
    params.append('comment',comment);
    return fetch({
        url: 'structure/exam/saveStuComment',
        method: 'post',
        params
    });
}
/**
 *录入评语模板
 * @param {*} query 
 */
export function insertTeacherComment(content) {
    let params = new URLSearchParams();
    params.append('content', content);//班级id
    params.append('type',1);
    params.append('typeName',"成绩评语");
    return fetch({
        url: 'structure/teacherComment/insertTeacherComment',
        method: 'post',
        params
    });
}
/**
 *评语模板
 * @param {*} query 
 */
export function chooseComment() {
    let params = new URLSearchParams();
    params.append('type',1);
    return fetch({
        url: 'structure/teacherComment/chooseCommentByType',
        method: 'get',
        params
    });
}
/**
 *切换班级
 * @param {*} query 
 */
export function changeDepart(departId) {
    let params = new URLSearchParams();
    params.append('departId',departId);
    return fetch({
        url: 'structure/exam/changeDepart',
        method: 'post',
        params
    });
}
/**
 *获取当前学期
 * @param {*} query 
 */
export function getCurrentSchoolTimeBySchoolId(departId) {
    let params = new URLSearchParams();
    return fetch({
        url: '/structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'post',
        params
    });
}
/**
 *判断是否指定部门负责人
 * @param {*} query 
 */
export function possessRole(roleConstantId) {
    let params = new URLSearchParams();
    params.append('roleConstantId',roleConstantId);
    return fetch({
        baseURL: global.BaseNewPath,
        url: 'api/user/role/possessRole',
        method: 'post',
        params
    });
}
/**
 * 获取所任班主任班级以及所教班级
 */
export function getTeacherDepart() {
    return fetch({
        url: 'structure/exam/getTeacherDepart',
        method: 'get'
    });
}
/**
 * 接口名称获得教师所负责的走班班级列表
 * @param {*} examId 
 */
export function getThManageWalkClassList() {
    let params = new URLSearchParams();
    params.append('courseId', 0);
    params.append('curriculumId',0);
    return fetch({
        url: 'structure/walkClass/getThManageWalkClassList',
        method: 'post',
        data:params
    });
}