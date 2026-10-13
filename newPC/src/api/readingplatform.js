import fetch from '@/utils/fetch';
import {systemFetch,wymsFetchNoProcess} from '@/utils/fetch';
//获得学校的阅读平台设置
export function getReadPlatSysSet() {
    return fetch({
        url: 'structure/readPlat/getReadPlatSysSet',
        method: 'get'
    });
}
//保存或编辑阅读平台设置
export function insertOrUpdateReadPlatSysSet(args) {
    let params = new URLSearchParams();
    params.append('bookState', args.bookState);
    params.append('borrowOrReturnState', args.borrowOrReturnState);
    params.append('mapState', args.mapState);
    params.append('pointsState', args.pointsState);
    params.append('readRingState', args.readRingState);
    params.append('recommendState', args.recommendState);
    return fetch({
        url: 'structure/readPlat/insertOrUpdateReadPlatSysSet',
        method: 'post',
        data:params
    });
}
//根据学校Id查询任务封面
export function getReadPlatTaskCover() {
    return fetch({
        url: 'structure/readPlat/getReadPlatTaskCover',
        method: 'get'
    });
}
//新增修改学校任务封面
export function addAndUpdateReadPlatTaskCover(args) {
    let params = new URLSearchParams();
    params.append('stateOneUrl', args.stateOneUrl);
    params.append('stateThreeUrl', args.stateThreeUrl);
    params.append('stateTwoUrl', args.stateTwoUrl);
    return fetch({
        url: 'structure/readPlat/addAndUpdateReadPlatTaskCover',
        method: 'post',
        data:params
    });
}
//获得学校的阅读银行基础设置
export function getSchoolReadPlatSetInfo() {
    return fetch({
        url: 'structure/readPlat/getSchoolReadPlatSetInfo',
        method: 'get'
    });
}
//新增修改学校任务封面
export function readPlatBaseSet(args) {
    let params = new URLSearchParams();
    params.append('digestPoint', args.digestPoint);
    params.append('id', args.id);
    params.append('readResponsePoints', args.readResponsePoints);
    params.append('subExtraPoints',args.subExtraStatus? args.subExtraPoints:0);
    params.append('subExtraStatus', args.subExtraStatus-0);
    return fetch({
        url: 'structure/readPlat/readPlatBaseSet',
        method: 'post',
        data:params
    });
}
//班级管理员列表
export function queryManagerTeacherBySchoolId(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchName', args.searchName);
    return fetch({
        url: 'structure/readPlat/queryManagerTeacherBySchoolId',
        method: 'get',
        params
    });
}
//删除班级管理员
export function deleteManageTeacher(ids) {
    let params = new URLSearchParams();
    params.append('ids', ids);
    return fetch({
        url: 'structure/readPlat/deleteManageTeacher',
        method: 'post',
        data:params
    });
}
//获得班级列表
export function querySchoolClass() {
    return systemFetch({
      url: 'api/depart/querySchoolClass',
      method: 'get'
    });
  }
//新增或编辑班级管理员
export function insertOrEditReadManageTeacher(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/readPlat/insertOrEditReadManageTeacher',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//根据id获取管理人详情
export function getManageTeacherById(readManageTeacherId) {
    let params = new URLSearchParams();
    params.append('readManageTeacherId', readManageTeacherId);
    return fetch({
        url: 'structure/readPlat/getManageTeacherById',
        method: 'get',
        params
    });
}
//删除勋章
export function deleteSchoolMedalByMedalId(medalId) {
    let params = new URLSearchParams();
    params.append('medalId', medalId);
    return fetch({
        url: 'structure/readPlat/deleteSchoolMedalByMedalId',
        method: 'get',
        params
    });
}
//获取勋章详情
export function getSchoolMedalInfoById(medalId) {
    let params = new URLSearchParams();
    params.append('medalId', medalId);
    return fetch({
        url: 'structure/readPlat/getSchoolMedalInfoById',
        method: 'get',
        params
    });
}
//新增勋章设置
export function insertSchoolMedal(args) {
    let params = new URLSearchParams();
    params.append('medalLogo', args.medalLogo);
    params.append('medalName', args.medalName);
    params.append('medalPoint', args.medalPoint);
    return fetch({
        url: 'structure/readPlat/insertSchoolMedal',
        method: 'post',
        data:params
    });
}
//编辑勋章
export function updateSchoolMedal(args) {
    let params = new URLSearchParams();
    params.append('medalLogo', args.medalLogo);
    params.append('medalName', args.medalName);
    params.append('medalPoint', args.medalPoint);
    params.append('id', args.id);
    return fetch({
        url: 'structure/readPlat/updateSchoolMedal',
        method: 'post',
        data:params
    });
}
 /**
 * 获得年级列表
 * **/
  export function querySchoolGrade() {
    return systemFetch({
      url: 'api/depart/querySchoolGrade',
      method: 'get'
    });
  }
  //获取学校地图
export function readPlatMapList() {
    return fetch({
        url: 'structure/readPlat/readPlatMapList',
        method: 'get'
    });
}
//新增地图
export function insertReadPlatMap(args) {
    let params = new URLSearchParams();
    params.append('levelOrder', args.levelOrder);
    params.append('mapLogo', args.mapLogo);
    params.append('mapName', args.mapName);
    params.append('status', args.status);
    return fetch({
        url: 'structure/readPlat/insertReadPlatMap',
        method: 'post',
        data:params
    });
}
//编辑地图
export function updateReadPlatMap(args) {
    let params = new URLSearchParams();
    params.append('levelOrder', args.levelOrder);
    params.append('mapLogo', args.mapLogo);
    params.append('mapName', args.mapName);
    params.append('status', args.status);
    params.append('id', args.id);
    return fetch({
        url: 'structure/readPlat/updateReadPlatMap',
        method: 'post',
        data:params
    });
}
//根据id获取地图详情
export function readPlatMapDetails(mapId) {
    let params = new URLSearchParams();
    params.append('mapId', mapId);
    return fetch({
        url: 'structure/readPlat/readPlatMapDetails',
        method: 'get',
        params
    });
}
//删除地图
export function deleteReadPlatMap(mapId) {
    let params = new URLSearchParams();
    params.append('mapId', mapId);
    return fetch({
        url: 'structure/readPlat/deleteReadPlatMap',
        method: 'get',
        params
    });
}

//删除地图书籍
export function deleteMapBook(mapBookId) {
    let params = new URLSearchParams();
    params.append('mapBookId', mapBookId);
    return fetch({
        url: 'structure/readPlat/deleteMapBook',
        method: 'get',
        params
    });
}
//编辑地图书籍
export function updateMapBook(args) {
    let params = new URLSearchParams();
    params.append('bookId', args.bookId);
    params.append('passOrder', args.passOrder);
    params.append('mapId', args.mapId);
    params.append('id', args.id);
    return fetch({
        url: 'structure/readPlat/updateMapBook',
        method: 'post',
        data:params
    });
}
//新增地图书籍
export function insertMapBook(args) {
    let params = new URLSearchParams();
    params.append('bookId', args.bookId);
    params.append('passOrder', args.passOrder);
    params.append('mapId', args.mapId);
    return fetch({
        url: 'structure/readPlat/insertMapBook',
        method: 'post',
        data:params
    });
}
//获取该年级level不在地图上的书籍
export function getNotInMapBookList(level) {
    let params = new URLSearchParams();
    params.append('level', level);
    return fetch({
        url: 'structure/readPlat/getNotInMapBookList',
        method: 'get',
        params
    });
}
  //年级学校书本map
  export function getReadPlatBookMap() {
    return fetch({
        url: 'structure/readPlat/getReadPlatBookMap',
        method: 'get'
    });
}
 //学校阅读平台书籍
 export function getReadPlatBookList() {
    return fetch({
        url: 'structure/readPlat/getReadPlatBookList',
        method: 'get'
    });
}
 //初始化阅读平台书籍
 export function initReadPlat() {
    return fetch({
        url: 'structure/readPlat/initReadPlat',
        method: 'get'
    });
}
//根据学校书本id删除书本信息
export function delReadPlatBookById(platBookId) {
    let params = new URLSearchParams();
    params.append('platBookId', platBookId);
    return fetch({
        url: 'structure/readPlat/delReadPlatBookById',
        method: 'get',
        params
    });
}
//新增学校书本
export function addReadPlatBook(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/readPlat/addReadPlatBook',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//字典值列表
export function listValue() {
    let params = new URLSearchParams();
    params.append('key', "booktype");
    return wymsFetchNoProcess({
        url: 'sysDic/listValue?pageSize=500',
        method: 'get',
        params
    });
}
//查询书本列表
export function getPlayWordBookList(args) {
    let params = new URLSearchParams();
    params.append('addbookType', args.addbookType);
    params.append('boolName', args.boolName);
    params.append('typeId', args.typeId);
    return fetch({
        url: 'structure/playWord/getPlayWordBookList',
        method: 'post',
        data:params
    });
}
//根据学校书本id查询书本信息
export function getReadPlatBookById(platBookId) {
    let params = new URLSearchParams();
    params.append('platBookId', platBookId);
    return fetch({
        url: 'structure/readPlat/getReadPlatBookById',
        method: 'get',
        params
    });
}
//修改学校书本
export function updateReadPlatBook(args) {
    let params = new URLSearchParams();
    params.append('inventory', args.inventory);
    params.append('level', args.level);
    params.append('levelName', args.levelName);
    params.append('id', args.id);
    params.append('taskRemark', args.taskRemark);
    return fetch({
        url: 'structure/readPlat/updateReadPlatBook',
        method: 'post',
        data:params
    });
}
//根据条件查询任务pc列表
export function getReadPlatBookTaskListPc(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('platBookId', args.platBookId);
    return fetch({
        url: 'structure/readPlat/getReadPlatBookTaskListPc',
        method: 'get',
        params
    });
}
//删除任务
export function delReadPlatBookTask(taskId) {
    let params = new URLSearchParams();
    params.append('taskId', taskId);
    return fetch({
        url: 'structure/readPlat/delReadPlatBookTask',
        method: 'get',
        params
    });
}
//新增任务
export function addReadPlatBookTask(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/readPlat/addReadPlatBookTask',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//修改任务
export function updateReadPlatBookTask(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/readPlat/updateReadPlatBookTask',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//获取书本任务详情
export function getReadPlatBookTaskById(taskId) {
    let params = new URLSearchParams();
    params.append('taskId', taskId);
    return fetch({
        url: 'structure/readPlat/getReadPlatBookTaskById',
        method: 'get',
        params
    });
}
