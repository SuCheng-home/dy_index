import fetch from '@/utils/fetch';

//负责检查的值班表以及对应的检查项列表
export function getCheckCheckItemList(args) {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/composite/getCheckScopeAndCheckItemList',
        method: 'get',
        params
    });
}

/*值班表详情*/
export function getDutyById(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    return fetch({
        url: 'structure/composite/getDutyById',
        method: 'post',
        data: params
    });
}

/*获取检查班级与检查数据*/
export function getCheckClass(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    params.append('itemId', args.itemId);
    return fetch({
        url: 'structure/composite/getCheckClass',
        method: 'post',
        data: params
    });
}


/*全部5分批量保存检查数据*/
export function batchSaveCheckData(args) {
    let params = new URLSearchParams();
    params.append('dataList', args.dataList);

    return fetch({
        url: 'structure/composite/batchSaveCheckData',
        method: 'post',
        data: params
    });
}

//清空检查数据
export function delAllCheckAndCurDate(args) {
    let params = new URLSearchParams();
    params.append('checkIdList', args.checkIdList);
    params.append('isStar', args.isStar);

    return fetch({
        url: 'structure/composite/delAllCheckDataByDutyIdAndCurDate',
        method: 'post',
        data: params
    });
}

//查看检查详情
export function getCheckDateById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    return fetch({
        url: 'structure/composite/getCheckDateById',
        method: 'get',
        params
    });
}

/*获得学校下某个字典的字典值列表*/
export function findSchoolDicsByCode(args) {
    let params = new URLSearchParams();
    params.append('dicCode', args.dicCode);
    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'post',
        data: params
    });
}

/*保存大事记与问题反馈*/
export function saveEvent(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    params.append('itemId', args.itemId);
    params.append('itemName', args.itemName);
    params.append('id', args.id);
    params.append('eventsType', args.eventsType);
    params.append('content', args.content);
    params.append('picJson', args.picJson);

    return fetch({
        url: 'structure/composite/saveEvent',
        method: 'post',
        data: params
    });
}

/*编辑页面获取大事记或反馈详情*/
export function getEventInfoById(args) {
    let params = new URLSearchParams();
    params.append('eventId', args.eventId);

    return fetch({
        url: 'structure/composite/getEventInfoById',
        method: 'post',
        data: params
    });
}

/*删除大事记与问题反馈*/
export function delEvent(args) {
    let params = new URLSearchParams();
    params.append('eventId', args.eventId);

    return fetch({
        url: 'structure/composite/delEvent',
        method: 'post',
        data: params
    });
}

/*跟检查项获取问题反馈列表或大事记列表*/
export function getCheckEventList(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    params.append('itemId', args.itemId);
    params.append('checkTime', args.checkTime);

    return fetch({
        url: 'structure/composite/getCheckEventList',
        method: 'post',
        data: params
    });
}

// 保存检查数据
export function saveCheckData(args) {
    let params = new URLSearchParams();
    params.append('batchContent', args.batchContent);
    params.append('checkItemStr', args.checkItemStr);
    if (args.batchContentCodes) {
        params.append('batchContentCodes', args.batchContentCodes);
    }
    params.append('classId', args.classId);
    params.append('className', args.className);
    params.append('classOrder', args.classOrder);
    params.append('dutyId', args.dutyId);
    params.append('gradeId', args.gradeId);
    params.append('gradeName', args.gradeName);
    params.append('gradeOrder', args.gradeOrder);
    params.append('id', args.id);
    params.append('isStar', args.isStar);
    params.append('itemId', args.itemId);
    params.append('itemName', args.itemName);
    params.append('picJson', args.picJson);
    params.append('score', args.score);
    params.append('teacherUserId', args.teacherUserId);
    params.append('teacherUserName', args.teacherUserName);
    params.append('toWork', args.toWork);
    params.append('toWorks', args.toWorks);
    params.append('isRemindClassHeader', args.isRemindClassHeader);
    if(args.isUpdateHis&&args.isUpdateHis==2){
        params.append('isUpdateHis', args.isUpdateHis);
        params.append('createTime', args.createTime);
        params.append('checkDate', args.checkDate);
    }

    return fetch({
        url: 'structure/composite/saveCheckData',
        method: 'post',
        data: params
    });
}

/*根据ID获取检查项*/
export function getItemById(args) {
    let params = new URLSearchParams();
    params.append('itemId', args.itemId);

    return fetch({
        url: 'structure/composite/getItemById',
        method: 'post',
        data: params
    });
}

//之前留下来的推送

/*推送结果这个右侧列表*/
export function getItemListByDIdAndTime(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    params.append('queryTime', args.queryTime);
    return fetch({
        url: 'structure/composite/getItemListByDIdAndTime',
        method: 'post',
        data: params
    });
}

/*主体详情页*/
export function lookCheckResult(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    params.append('itemId', args.itemId);
    params.append('itemName', args.itemName);
    params.append('queryTime', args.queryTime);
    return fetch({
        url: 'structure/composite/lookCheckResult',
        method: 'post',
        data: params
    });
}

/*获取已读人员,未读人员*/
export function getReadUserList(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    return fetch({
        url: 'structure/composite/getReadUserList',
        method: 'post',
        data: params
    });
}

/*推送页详情列表*/
export function findEventList(args) {
    let params = new URLSearchParams();
    params.append('dutyId', args.dutyId);
    params.append('queryTime', args.queryTime);
    return fetch({
        url: 'structure/composite/findEventList',
        method: 'post',
        data: params
    });
}

//查看检查详情（统计页面）
export function lookDetail(args) {
    let params = new URLSearchParams();
    params.append('checkTime', args.checkTime);
    params.append('classId', args.classId);
    params.append('itemId', args.itemId);
    return fetch({
        url: 'structure/composite/lookDetail',
        method: 'post',
        data: params
    });
}
