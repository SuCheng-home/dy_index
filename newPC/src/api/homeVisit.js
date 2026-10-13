import fetch from '@/utils/fetch';
import {wymsFetchNoProcess} from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

// 判断该用户是否为管理员
export const possessRole = () => {
  let params = new URLSearchParams();
  params.append('roleConstantId', 2);
  return systemFetch({
      url: '/api/user/role/possessRole',
      method: 'GET',
      params
  });
}

//查询学校家访批次列表（分页）
export function getSchoolHomeVisitBatchPageList(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('batchName', query.batchName);
    return fetch({
        url: 'structure/homevisit/getSchoolHomeVisitBatchPageList',
        method: 'post',
        params
    });
}
//字典值列表
export function listValue(key) {
    let params = new URLSearchParams();
    params.append('key', key);
    return wymsFetchNoProcess({
        url: 'sysDic/listValue?pageSize=500',
        method: 'get',
        params
    });
}
//新增家访批次
export function addHomeVisitBatch(query) {
    let params = new URLSearchParams();
    params.append('content', query.content);
    params.append('batchName', query.batchName);
    params.append('state', query.state);
    params.append('timeType', query.timeType);
    params.append('tuneEndTime', query.tuneEndTime);
    params.append('visitFields', JSON.stringify(query.visitFields));
    params.append('sendScopes', JSON.stringify(query.sendScopes));
    params.append('visitTimes', JSON.stringify(query.visitTimes));
    params.append('visitTypes', JSON.stringify(query.visitTypes));
    return fetch({
        url: 'structure/homevisit/addHomeVisitBatch',
        method: 'post',
        data:params
    });
}
//更新家访批次
export function editHomeVisitBatch(query) {
    let params = new URLSearchParams();
    params.append('content', query.content);
    params.append('batchName', query.batchName);
    params.append('state', query.state);
    params.append('timeType', query.timeType);
    params.append('id', query.id);
    params.append('tuneEndTime', query.tuneEndTime);
    params.append('visitFields', JSON.stringify(query.visitFields));
    params.append('sendScopes', JSON.stringify(query.sendScopes));
    params.append('visitTimes', JSON.stringify(query.visitTimes));
    params.append('visitTypes', JSON.stringify(query.visitTypes));
    return fetch({
        url: 'structure/homevisit/editHomeVisitBatch',
        method: 'post',
        data:params
    });
}
//删除家访批次
export function delHomeVisitBatchById(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/delHomeVisitBatchById',
        method: 'post',
        data:params
    });
}
//根据ID查询家访批次信息
export function getHomeVisitBatchById(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/getHomeVisitBatchById',
        method: 'post',
        data:params
    });
}

//补发家访批次
export function reissueHomeVisitBatch(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('sendScopes', JSON.stringify(query.sendScopes));
    return fetch({
        url: 'structure/homevisit/reissueHomeVisitBatch',
        method: 'post',
        params
    });
}

//根据批次ID直接发布家访批次
export function publishHomeBatchByBatchId(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/publishHomeBatchByBatchId',
        method: 'post',
        data:params
    });
}
//家访进度数据统计
export function getHomeVisitProgressRateDatas(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/getHomeVisitProgressRateDatas',
        method: 'post',
        data:params
    });
}
//前调进度数据统计
export function getHomeVisitPretuneRateDatas(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/getHomeVisitPretuneRateDatas',
        method: 'post',
        data:params
    });
}
//提醒班主任-副班主任填写家访记录
export function remindMasterFillInHomeVisit(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/remindMasterFillInHomeVisit',
        method: 'post',
        data:params
    });
}
//入户时间统计
export function getHomeVisitEntryTimeDatas(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/getHomeVisitEntryTimeDatas',
        method: 'post',
        data:params
    });
}
//提醒家长家访回执
export function remindParentReceiptHomeVisit(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/remindParentReceiptHomeVisit',
        method: 'post',
        data:params
    });
}
//获得批次下年级-班级列表
export function getBatchHomeVisitGradeClassList(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/homevisit/getBatchHomeVisitGradeClassList',
        method: 'post',
        data:params
    });
}

//查询批次下的家访记录列表(分页)
export function getBatchStuHomeVisitPageList(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    if (query.batchId) {
         params.append('batchId', query.batchId);
    }

    params.append('classId', query.classId);
    params.append('schoolTimeId', query.schoolTimeId);
    params.append('gradeId', query.gradeId);
    params.append('receiptState', query.receiptState);
    params.append('stuName', query.stuName);
    params.append('visitState', query.visitState);
    params.append('visitTypeId', query.visitTypeId==0?'':query.visitTypeId);
    params.append('addType', query.addType || 1);
    return fetch({
        url: 'structure/homevisit/getBatchStuHomeVisitPageList',
        method: 'post',
        params
    });
}

//查询学生对应批次的家访信息
export function getBatchStuHomeVisitInfo(batchId,stuId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    params.append('stuId', stuId);
    return fetch({
        url: 'structure/homevisit/getBatchStuHomeVisitInfo',
        method: 'post',
        data:params
    });
}

//查询批次下具体班级学生家访明细列表
export function getClassStuHomeVisitInfoList(query) {
    let params = new URLSearchParams();
    params.append('batchId', query.batchId);
    params.append('classId', query.classId);
    params.append('gradeId', query.gradeId);
    return fetch({
        url: 'structure/homevisit/getClassStuHomeVisitInfoList',
        method: 'post',
        params
    });
}
//教师更新家访记录
export function updateStuHomeVisit(query) {
    let params = new URLSearchParams();
    params.append('batchId', query.batchId);
    params.append('parentOpinion', query.parentOpinion);
    params.append('stuId', query.stuId);
    params.append('visitContent', query.visitContent);
    params.append('visitEffect', query.visitEffect);
    params.append('visitPics', query.visitPics);
    params.append('visitSite', query.visitSite);
    params.append('visitState', query.visitState);
    params.append('visitTablePics', query.visitTablePics);
    params.append('visitTeacher', query.visitTeacher);
    params.append('visitTime', query.visitTime);
    return fetch({
        url: 'structure/homevisit/updateStuHomeVisit',
        method: 'post',
        params
    });
}

//字典
export function findSchoolDicsByCode() {
    let params = new URLSearchParams();
    params.append('dicCode', 'homeVisityContent');
    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'post',
        data:params
    });
}

// https://www.zhxiaoyuan.cn/wxcepClient1/common/homeVisit/exportSchoolHomeVistPicList?schoolId=1097&batchId=1698539937793576961

//查询学校家访批次列表（分页）
export function exportSchoolHomeVistPicList(query) {
    let params = new URLSearchParams();
    params.append('schoolId', query.schoolId);
    params.append('batchId', query.batchId);
    return fetch({
        url: 'common/homeVisit/exportSchoolHomeVistPicList',
        method: 'get',
        params
    });
}
export function addUpdateHomeVisitInit(params) {
    return fetch({
        url: 'structure/homevisit/addUpdateHomeVisitInit',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}


export function getHomeVisitInit() {
    return fetch({
        url: 'structure/homevisit/getHomeVisitInit',
        method: 'get',
    });
}

export function addHomeVisitBatchs(params) {
    return fetch({
        url: 'structure/homevisit/addHomeVisitBatchs',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}
export function addHomeVisitRecord(params) {
    return fetch({
        url: 'structure/homevisit/addHomeVisitRecord',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}

export function updateHomeVisitRecord(params) {
    return fetch({
        url: 'structure/homevisit/updateHomeVisitRecord',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}

//查询学校家访批次列表（分页）
export function delHomeVisitRecord(recordId) {
    let params = new URLSearchParams();
    params.append('recordId', recordId);
    return fetch({
        url: 'structure/homevisit/delHomeVisitRecord',
        method: 'get',
        params
    });
}

export function getHomeVisitRecord(recordId) {
    let params = new URLSearchParams();
    params.append('recordId', recordId);
    return fetch({
        url: 'structure/homevisit/getHomeVisitRecord',
        method: 'get',
        params
    });
}