import fetch from '@/utils/fetch';

// 根据学校id查询学校书库列表
export function getReadIndependBookSchList() {

    return fetch({
        url: '/structure/readIndepend/getReadIndependBookSchList',
        method: 'get'
    });
}

// 新增学校书库
export function addReadIndependBookSch(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/addReadIndependBookSch',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 新增学校书库
export function updateReadIndependBookSch(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/updateReadIndependBookSch',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 删除学校书库
export function delReadIndependBookSch(args) {
    let params = new URLSearchParams()
    params.append('bookId', args.bookId)

    return fetch({
        url: '/structure/readIndepend/delReadIndependBookSch',
        method: 'GET',
        params
    });
}
// 删除学校书库
export function getReadIndependBatchListAll(classId) {
    let params = new URLSearchParams()
    params.append('classId', classId)
    return fetch({
        url: '/structure/readIndepend/getReadIndependBatchListAll',
        method: 'GET',
        params
    });
}
// 根据班级id查询班级书库列表
export function getReadIndependBookList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('batchId', args.batchId);
    params.append('type', args.type);

    return fetch({
        url: '/structure/readIndepend/getReadIndependBookList',
        method: 'GET',
        params
    });
}


// 查询学校书库 2023-11-07
export function getReadIndependBookSch(bookId) {
    let params = new URLSearchParams();
    params.append('bookId', bookId);

    return fetch({
        url: '/structure/readIndepend/getReadIndependBookSch',
        method: 'GET',
        params
    });
}


// 新增班级书库
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

//
export function delReadIndependBook(args) {
    let params = new URLSearchParams();
    params.append('classBookId', args.classBookId);

    return fetch({
        url: '/structure/readIndepend/delReadIndependBook',
        method: 'GET',
        params
    });
}

// 重置阅读记录
export function restReadIndependRecord(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);

    return fetch({
        url: '/structure/readIndepend/restReadIndependRecord',
        method: 'GET',
        params
    });
}

// 根据班级id查询撤销密码
export function getReadIndependWord(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);

    return fetch({
        url: '/structure/readIndepend/getReadIndependWord',
        method: 'GET',
        params
    });
}

// 新增撤销密码
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
export function updateReadIndependWay(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/updateReadIndependWay',
        method: 'POST',
        data: JSON.stringify(args)
    });
}


// 删除阅读方式
export function delReadIndependWay(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('wayTypeId', args.wayTypeId);

    return fetch({
        url: '/structure/readIndepend/delReadIndependWay',
        method: 'GET',
        params
    });
}

// 根据班级id查询阅读方式列表
export function getReadIndependWayList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);

    return fetch({
        url: '/structure/readIndepend/getReadIndependWayList',
        method: 'GET',
        params
    });
}

//
export function getReadIndependBookStatisticalList(args) {
    let params = new URLSearchParams();
    params.append('bookName', args.bookName);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);

    return fetch({
        url: '/structure/readIndepend/getReadIndependBookStatisticalList',
        method: 'GET',
        params
    });
}

export function getReadIndependStuStatisticalList(args) {
    let params = new URLSearchParams();
    params.append('studentName', args.studentName);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);

    return fetch({
        url: '/structure/readIndepend/getReadIndependStuStatisticalList',
        method: 'GET',
        params
    });
}

// 根据学校id,学期id,开始日期结束日期，年级id,班级id,学生id查询学生书本类型统计
export function getReadIndependStuBookTypeStatisticalList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);
    params.append('studentId', args.studentId);

    return fetch({
        url: '/structure/readIndepend/getReadIndependStuBookTypeStatisticalList',
        method: 'GET',
        params
    });
}

// 根据学校id,学期id,开始日期结束日期，年级id,班级id,学生id查询学生阅读类型统计
export function getReadIndependStuWayTypeStatisticalList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);
    params.append('studentId', args.studentId);

    return fetch({
        url: '/structure/readIndepend/getReadIndependStuWayTypeStatisticalList',
        method: 'GET',
        params
    });
}

//
export function getReadIndependStuRecordList(args) {
    let params = new URLSearchParams();
    params.append('bookName', args.bookName);
    params.append('endDate', args.endDate);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);
    params.append('studentId', args.studentId);

    return fetch({
        url: '/structure/readIndepend/getReadIndependStuRecordList',
        method: 'GET',
        params
    });
}

export function delReadIndependStuRecord(args) {
    let params = new URLSearchParams();
    params.append('recordId', args.recordId);

    return fetch({
        url: '/common/readIndepend/delReadIndependStuRecord',
        method: 'GET',
        params
    });
}

// 根据学校id,班级id查询学生读书情况
export function getStuListByClassId(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('schoolId', args.schoolId);
    params.append('batchId', args.batchId);
    return fetch({
        url: '/common/readIndepend/getStuListByClassId',
        method: 'GET',
        params
    });
}

// 根据学生id，班级id查询学生阅读统计
export function getBookCountListByStuId(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('studentId', args.studentId);
    params.append('batchId', args.batchId);
    return fetch({
        url: '/common/readIndepend/getBookCountListByStuId',
        method: 'GET',
        params
    });
}

// 根据学生id，班级id查询学生阅读方式统计
export function getStuWayListByStuId(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('studentId', args.studentId);
    params.append('batchId', args.batchId);
    return fetch({
        url: '/common/readIndepend/getStuWayListByStuId',
        method: 'GET',
        params
    });
}

// 根据书本id查询阅读统计
export function getStuCountListByBookId(args) {
    let params = new URLSearchParams();
    params.append('bookId', args.bookId);
    params.append('classId', args.classId || 0);
    params.append('batchId', args.batchId);
    return fetch({
        url: '/common/readIndepend/getStuCountListByBookId',
        method: 'GET',
        params
    });
}
// 根据书本id查询阅读统计
export function getStuWayListByBookId(args) {
    let params = new URLSearchParams();
    params.append('bookId', args.bookId);
    params.append('classId', args.classId || 0);
    params.append('batchId', args.batchId);
    return fetch({
        url: '/common/readIndepend/getStuWayListByBookId',
        method: 'GET',
        params
    });
}
// 班级id查询书本阅读统计
export function getStuCountListByStuId(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('batchId', args.batchId);

    return fetch({
        url: '/common/readIndepend/getStuCountListByStuId',
        method: 'GET',
        params
    });
}
// 查询当前自主阅读批次
export function getNowReadIndependBatch(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('schoolId', args.schoolId);
    return fetch({
        url: '/common/readIndepend/getNowReadIndependBatch',
        method: 'GET',
        params
    });
}


// 修改自主阅读批次
export function updateReadIndependBatch(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/updateReadIndependBatch',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//修改自主阅读批次状态
export function updateReadIndependBatchStatus(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/updateReadIndependBatchStatus',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//新增自主阅读批次
export function addReadIndependBatch(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/readIndepend/addReadIndependBatch',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 删除自主阅读批次
export function delReadIndependBatch(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: '/structure/readIndepend/delReadIndependBatch',
        method: 'GET',
        params
    });
}

//查询自主阅读批次列表
export function getReadIndependBatchList(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('title', args.title);
    return fetch({
        url: '/structure/readIndepend/getReadIndependBatchList',
        method: 'GET',
        params
    });
}

//根据学校id,学期id,日期，年级id,班级id,学生id,查询书本阅读统计2 2024-03-06
export function getReadIndepenStudBookStatisticalList(args) {
    let params = new URLSearchParams();
    params.append('batchId', args.batchId);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);
    params.append('studentId', args.studentId);
    return fetch({
        url: '/structure/readIndepend/getReadIndepenStudBookStatisticalList',
        method: 'GET',
        params
    });
}
//根据学校id,学期id,日期，年级id,班级id,学生id,查询书本阅读统计2 2024-03-06
export function getReadIndependStuStatisticalList2(args) {
    let params = new URLSearchParams();
    params.append('bookId', args.bookId);
    params.append('classId', args.classId);
    params.append('endDate', args.endDate);
    params.append('gradeId', args.gradeId);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('startDate', args.startDate);
    return fetch({
        url: '/structure/readIndepend/getReadIndependStuStatisticalList2',
        method: 'GET',
        params
    });
}