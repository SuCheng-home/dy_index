import fetch from '@/utils/fetch';

/**
 * 统一处理请求参数
 * */
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    });
    return params;
}

// 获取学期
export function termlist() {

    return fetch({
        url: '/structure/schoolTime/getSchoolTimeAllList',
        method: 'get'
    });
}
export function querySchoolGrade() {
    return systemFetch({
        url: 'api/depart/querySchoolGrade',
        method: 'get',
        params
    })
}

// 所教年级和班级
export function queryClassGrade() {
    return fetch({
        url: 'teacherClass/queryClassGrade',
        method: 'get'
    });
}

//获取年级和班级
export function querySchoolGradeClass() {
    return fetch({
        url: 'depart/querySchoolGradeClass',
        method: 'get'
    });
}

// 获取书库列表
export function getReadIndependBookList(args) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('month', args.month);
    params.append('gradeId', args.gradeId);

    return fetch({
        url: '/structure/readIndepend/getReadIndependBookList',
        method: 'GET',
        params
    });
}

// 新增学校书库
export function addReadIndependBookList(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/addReadIndependBookList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 删除学校书库
export function delReadIndependBook(args) {
    let params = new URLSearchParams()
    params.append('schBookId', args.schBookId)

    return fetch({
        url: '/structure/readIndepend/delReadIndependBook',
        method: 'GET',
        params
    });
}

// 新增阅读方式
export function addReadIndependWay(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/addReadIndependWay',
        method: 'POST',
        data: JSON.stringify(args)
    });
}


// 获取阅读方式列表
export function getReadIndependWayList(args) {
    let params = new URLSearchParams()
    params.append('schoolTimeId', args.schoolTimeId)
    params.append('month', args.month)

    return fetch({
        url: '/structure/readIndepend/getReadIndependWayList',
        method: 'GET',
        params
    });
}

// 删除阅读方式
export function delReadIndependWay(args) {
    let params = new URLSearchParams()
    params.append('wayId', args.wayId)

    return fetch({
        url: '/structure/readIndepend/delReadIndependWay',
        method: 'GET',
        params
    });
}

// 新增编辑撤销密码
export function addReadIndependWord(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/addReadIndependWord',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 查询撤销密码
export function getReadIndependWord() {

    return fetch({
        url: '/structure/readIndepend/getReadIndependWord',
        method: 'GET',
    });
}

// 查询阅读统计
export function getReadIndependStuStatisticalList(args) {
    let params = new URLSearchParams()
    params.append('classId', args.classId)
    params.append('gradeId', args.gradeId)
    params.append('month', args.month)
    params.append('schoolTimeId', args.schoolTimeId)
    params.append('studentName', args.studentName)
    return fetch({
        url: '/structure/readIndepend/getReadIndependStuStatisticalList',
        method: 'GET',
        params
    });
}

// 查询学生总数下的所有书籍的阅读方式
export function getReadIndependStuRecordList(args) {
    let params = new URLSearchParams()
    params.append('pageSize', args.pageSize)
    params.append('pageNo', args.pageNo)
    params.append('month', args.month)
    params.append('schoolTimeId', args.schoolTimeId)
    params.append('studentId', args.studentId)
    params.append('bookName', args.bookName)
    return fetch({
        url: '/structure/readIndepend/getReadIndependStuRecordList',
        method: 'GET',
        params
    });
}

// 删除学生的阅读记录
export function delReadIndependStuRecord(args) {
    let params = new URLSearchParams()
    params.append('recordId', args.recordId)
    return fetch({
        url: '/common/readIndepend/delReadIndependStuRecord',
        method: 'GET',
        params
    });
}

// 查询学生总数下的所有书籍的阅读数量
export function getReadIndependStuBookTypeStatisticalList(args) {
    let params = new URLSearchParams()
    params.append('gradeId', args.gradeId)
    params.append('month', args.month)
    params.append('schoolTimeId', args.schoolTimeId)
    params.append('studentId', args.studentId)
    return fetch({
        url: '/structure/readIndepend/getReadIndependStuBookTypeStatisticalList',
        method: 'GET',
        params
    });
}

/**
 * 权限
 * */
export function possessRole() {
    let params = new URLSearchParams();
    params.append('roleConstantId', 20210608);
    return fetch({
        baseURL: global.BaseNewPath,
        url: 'api/user/role/possessRole',
        method: 'GET',
        params
    });
}

// 查询学期年级
export function queryGradeByTermIdAndUserId(args) {
    let params = new URLSearchParams();
    params.append('termId', args.termId);
    if(args.userId) {
        params.append('userId', args.userId);
    }

    return fetch({
        url: 'structure/termClass/queryGradeByTermIdAndUserId',
        method: 'GET',
        params
    });
}

// 查询学期班级
export function queryClassByTermIdAndUserId(args) {
    let params = new URLSearchParams();
    params.append('termId', args.termId);
    if(args.userId) {
        params.append('userId', args.userId);
    }

    return fetch({
        url: 'structure/termClass/queryClassByTermIdAndUserId',
        method: 'GET',
        params
    });
}
