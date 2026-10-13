import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';

/**
 * 获取课程列表 /structure/course/getCourseList
 *
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getCourseList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchName);

    return fetch({
        url: 'structure/course/getCourseList',
        method: 'post',
        data: params
    });

}


/**
 * 选择课程列表  /structure/course/getChooseCourseList
 *
 * @export
 * @param {any} listQuery
 * @returns
 */
export function getChooseCourseList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/course/getChooseCourseList',
        method: 'post',
        data: params
    });

}

/**
 * 编辑课程   /structure/course/editCourse
 *
 * @export
 * @param {any} listQuery
 * @returns
 */
export function editCourse(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.id);
    params.append('nickName', listQuery.nickName);
    return fetch({
        url: 'structure/course/editCourse',
        method: 'post',
        data: params
    });

}

/**
 * 新增课程    /structure/course/addCourse
 *
 * @export
 * @param {any}
 * @returns
 */
export function addCourse(courseStr) {
    let params = new URLSearchParams();
    params.append('courseStr', courseStr);
    return fetch({
        url: 'structure/course/addCourse',
        method: 'post',
        data: params
    });

}


/**
 * 删除课程 /structure/course/delCourse
 *
 * @export
 * @param {any}
 * @returns
 */
export function delCourse(idStr) {
    let params = new URLSearchParams();
    params.append('idStr', idStr);
    return fetch({
        url: 'structure/course/delCourse',
        method: 'post',
        data: params
    });

}

/**
 * 根据id获取课程详情 /structure/course/getCourseDetailById
 *
 * @export
 * @param {any}
 * @returns
 */
export function getCourseDetailById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/course/getCourseDetailById',
        method: 'post',
        data: params
    });
}

// 分页获取课程列表
export function curriculumSettingList(args) {
    let params = new URLSearchParams();
    params.append('searchName', args.searchName);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return systemFetch({
        url: 'curriculumSetting/list',
        method: 'post',
        data: params
    });
}

// 获取学校课程详情
export function curriculumSettingDetail(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return systemFetch({
        url: 'curriculumSetting/detail',
        method: 'GET',
        params
    });
}

// 删除课程
export function curriculumSettingDelete(args) {
    let params = new URLSearchParams();
    params.append('idStr', args.idStr);

    return systemFetch({
        url: 'curriculumSetting/delete',
        method: 'GET',
        params
    });
}

// 导入平台课程
export function curriculumSettingImport(args) {
    let params = new URLSearchParams();
    params.append('courseList', args.courseList);

    return systemFetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'curriculumSetting/importCurriculum',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 获取平台国标课程列表
export function listPlatformCurriclumList() {

    return systemFetch({
        url: 'curriculumSetting/listPlatformCurriclumList',
        method: 'GET',
    });
}

// 新增学校课程
export function curriculumSettingAdd(args) {
    let params = new URLSearchParams();
    params.append('examType', args.examType);
    params.append('isMain', args.isMain);
    params.append('level', args.level);
    params.append('name', args.name);
    params.append('logoUrl', args.logoUrl);
    params.append('otherName', args.otherName);
    params.append('order', args.order);
    params.append('classHourFactor', args.classHourFactor);
    return systemFetch({
        url: 'curriculumSetting/add',
        method: 'POST',
        data: params
    });
}

// 编辑学校课程
export function curriculumSettingUpdate(args) {
    let params = new URLSearchParams();
    params.append('examType', args.examType);
    params.append('isMain', args.isMain);
    params.append('level', args.level);
    params.append('name', args.name);
    params.append('logoUrl', args.logoUrl);
    params.append('otherName', args.otherName);
    params.append('order', args.order);
    params.append('id', args.id);
    params.append('classHourFactor', args.classHourFactor);

    return systemFetch({
        url: 'curriculumSetting/update',
        method: 'POST',
        data: params
    });
}
