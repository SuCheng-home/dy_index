import fetch from '@/utils/fetch';
import {homeworkfetch} from '@/utils/fetch';
// 根据学校id查询学校行为配置
export function getSchoolBehaviorInstallNew() {
    return fetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorInstallNew',
        method: 'get',
    });
}

// 新增课堂行为配置
export function addSchoolBehaviorInstall(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehavior/addSchoolBehaviorInstall',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//编辑课堂行为配置
export function updateSchoolBehaviorInstall(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehavior/updateSchoolBehaviorInstall',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 新增课堂行为类型
export function addSchoolBehaviorType(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehavior/addSchoolBehaviorType',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function updateSchoolBehaviorType(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehavior/updateSchoolBehaviorType',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function addSchoolBehaviorTypeCurrList(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehavior/addSchoolBehaviorTypeCurrList',
        method: 'post',
        data: JSON.stringify(args)
    });
}
// 新增课堂行为科目类型
export function addSchoolBehaviorTypeCurr(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehavior/addSchoolBehaviorTypeCurr',
        method: 'post',
        data: JSON.stringify(args)
    });
}
/**
 * 根据类型查询学校考核项
 */
export function getSchoolBehaviorTypeListBySchoolId(type) {
    return fetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorTypeListBySchoolId?type='+type,
        method: 'get',
    });
}
/**
 * 根据schoolId,科目id及类型查询课堂行为科目类型列表
 */
export function getSchoolBehaviorTypeCurrListBySchoolId(type,curriculumId) {
    return fetch({
        url: 'structure/schoolBehavior/getSchoolBehaviorTypeCurrListBySchoolId?type='+type+'&curriculumId='+curriculumId,
        method: 'get',
    });
}
/**
 * 删除课堂行为类型
 */
export function delSchoolBehaviorType(behTypeIds) {
    return fetch({
        url: 'structure/schoolBehavior/delSchoolBehaviorType?behTypeIds='+behTypeIds,
        method: 'get',
    });
}
/**
 * 删除课堂行为类型
 */
export function delSchoolBehaviorTypeCurr(typeCurrId) {
    return fetch({
        url: 'structure/schoolBehavior/delSchoolBehaviorTypeCurr?typeCurrId='+typeCurrId,
        method: 'get',
    });
}
/**
 * 根据学校Id查询学校各科目考核项列表
 */
export function getCurrListBySchoolId() {
    return fetch({
        url: 'structure/schoolBehavior/getCurrListBySchoolId',
        method: 'get',
    });
}
export function addSchoolBehaviorRankInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolBehaviorRankInit/addSchoolBehaviorRankInit',
        method: 'post',
        data: JSON.stringify(args)
    });
}

export function getSchoolBehaviorRankInitList(type) {
    return fetch({
        url: 'structure/schoolBehaviorRankInit/getSchoolBehaviorRankInitList?type=' + type,
        method: 'get',
    });
}


export function updateSchoolConductBehTitle(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/updateSchoolConductBehTitle',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function addSchoolConductBehTitle(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/addSchoolConductBehTitle',
        method: 'post',
        data: JSON.stringify(args)
    });
}
export function getSchoolConductBehTitleList(moduleType) {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductBehTitleList?moduleType=' + moduleType,
        method: 'get',
    });
}

export function delSchoolConductBehTitle(titleId) {
    return fetch({
        url: 'structure/schoolConduct/delSchoolConductBehTitle?titleId=' + titleId,
        method: 'get',
    });
}