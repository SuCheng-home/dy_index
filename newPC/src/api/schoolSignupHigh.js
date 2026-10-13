import fetch from '@/utils/fetch';

export function saveFieldList(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/enrollStudentInfo/saveFieldList',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function saveSchoolMasterRecommend(args) {
    let params = new URLSearchParams();
    params.append('fileId', args.fileId);
    params.append('fileName', args.fileName);
    params.append('fileUrl', args.fileUrl);

    return fetch({
        url: 'structure/enrollStudentInfo/saveSchoolMasterRecommend',
        method: 'POST',
        data: params
    });
}
export function deleteSchoolMasterRecommend() {

    return fetch({
        url: 'structure/enrollStudentInfo/deleteSchoolMasterRecommend',
        method: 'POST',
    });
}

export function getEnrollStuFieldBySchoolId() {
    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollStuFieldBySchoolId',
        method: 'POST',
    });
}
export function newgetEnrollStuFieldBySchoolId(schoolId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    return fetch({
        url: 'common/enrollStudentInfo/getEnrollStuFieldBySchoolId',
        method: 'POST',
        data: params
    });
}
export function enrollStudentInfofun(key) {
    return fetch({
        url: 'common/enrollStudentInfo/' + key,
        method: 'POST'
    });
}
export function getSchoolMasterRecommendInfo() {
    return fetch({
        url: 'structure/enrollStudentInfo/getSchoolMasterRecommendInfo',
        method: 'POST',
    });
}

// 通知
export function getEnrollStuNoticPageList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);

    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollStuNoticPageList',
        method: 'POST',
        data: params
    });
}
export function delNoticeByIds(args) {
    let params = new URLSearchParams();
    params.append('ids', args.ids);

    return fetch({
        url: 'structure/enrollStudentInfo/delNoticeByIds',
        method: 'POST',
        data: params
    });
}
export function addNotice(args) {
    let params = new URLSearchParams();
    params.append('content', args.content);
    params.append('endTime', args.endTime);
    params.append('logoURL', args.logoURL);
    params.append('publishType', args.publishType);
    params.append('startTime', args.startTime);
    params.append('state', args.state);
    params.append('title', args.title);
    params.append('yearNum', args.yearNum);
    if (args.endBirthDate) {
        params.append('endBirthDate', args.endBirthDate);
        params.append('beginBirthDate', args.beginBirthDate);
}
    return fetch({
        url: 'structure/enrollStudentInfo/addNotice',
        method: 'POST',
        data: params
    });
}
export function editNotice(args) {
    let params = new URLSearchParams();
    params.append('content', args.content);
    params.append('endTime', args.endTime);
    params.append('logoURL', args.logoURL);
    params.append('publishType', args.publishType);
    params.append('startTime', args.startTime);
    params.append('state', args.state);
    params.append('title', args.title);
    params.append('yearNum', args.yearNum);
    params.append('id', args.id);
    if (args.endBirthDate) {
         params.append('endBirthDate', args.endBirthDate);
         params.append('beginBirthDate', args.beginBirthDate);
}
    return fetch({
        url: 'structure/enrollStudentInfo/editNotice',
        method: 'POST',
        data: params
    });
}
export function publishNoticeById(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);

    return fetch({
        url: 'structure/enrollStudentInfo/publishNoticeById',
        method: 'POST',
        data: params
    });
}
export function getEnrollStuNoticeById(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);

    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollStuNoticeById',
        method: 'POST',
        data: params
    });
}
// 分组

export function delEnrollGroupById(args) {
    let params = new URLSearchParams();
    params.append('groupId', args.groupId);

    return fetch({
        url: 'structure/enrollStudentInfo/delEnrollGroupById',
        method: 'POST',
        data: params
    });
}
export function addEnrollGroup(args) {
    let params = new URLSearchParams();
    params.append('groupName', args.groupName);
    params.append('groupNo', args.groupNo);

    return fetch({
        url: 'structure/enrollStudentInfo/addEnrollGroup',
        method: 'POST',
        data: params
    });
}
export function getEnrollGroupInfoById(args) {
    let params = new URLSearchParams();
    params.append('groupId', args.groupId);

    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollGroupInfoById',
        method: 'POST',
        data: params
    });
}
export function getSchoolEnrollGroupList() {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/enrollStudentInfo/getSchoolEnrollGroupList',
        method: 'POST',
        data: params
    });
}
export function editEnrollGroup(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    params.append('groupName', args.groupName);
    params.append('groupNo', args.groupNo);

    return fetch({
        url: 'structure/enrollStudentInfo/editEnrollGroup',
        method: 'POST',
        data: params
    });
}
// 短信
export function singleSendMessage(args) {
    const params = {}
    params.noticeId = args.noticeId
    params.receiveUser = args.receiveUser
    params.smsContent = args.smsContent
    params.smsTempId = args.smsTempId
    params.templateParamJson = args.templateParamJson

    return fetch({
        url: 'structure/enrollStudentInfo/singleSendMessage',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(params)
    });
}
export function batchSendMessage(args) {
    const params = {}
    params.noticeId = args.noticeId
    params.tempId = args.tempId
    params.tempContent = args.tempContent
    params.sendType = args.sendType
    params.groupIds = args.groupIds
    params.groupNames = args.groupNames
    params.templateParamJson = args.templateParamJson

    return fetch({
        url: 'structure/enrollStudentInfo/batchSendMessage',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(params)
    });
}
// 报名学生
export function getEnrollStuInfoById(args) {
    let params = new URLSearchParams();
    params.append('infoId', args.infoId);

    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollStuInfoById',
        method: 'POST',
        data: params
    });
}
export function getEnrollStuInfoByIdNoToken(args) {
    let params = new URLSearchParams();
    params.append('enKey', args.enKey);

    return fetch({
        url: 'common/enrollStudentInfo/getEnrollStuInfoById',
        method: 'POST',
        data: params
    })
}
export function getNoticeGroupStudentPageList(args) {
    let params = new URLSearchParams();
    params.append('firBatchFirWishSchoolCode', args.firBatchFirWishSchoolCode);
    params.append('subjectStudentCode', args.subjectStudentCode);
    params.append('graduateSchoolCode', args.graduateSchoolCode);
    params.append('groupId', args.groupId);
    params.append('isHasMidTestPic', args.isHasMidTestPic);
    params.append('isSubjectTalentStu', args.isSubjectTalentStu);
    params.append('isHasWishPic', args.isHasWishPic);
    params.append('noticeId', args.noticeId);
    params.append('orderType', args.orderType);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolCountryCode', args.schoolCountryCode);
    params.append('spareSubStuCode', args.spareSubStuCode);
    params.append('searchTitle', args.searchTitle);
    params.append('state', args.state);
    params.append('isHasTalentPic', args.isHasTalentPic);
    if (args.subjectStuSchoolCode) {
        params.append('subjectStuSchoolCode', args.subjectStuSchoolCode);
    }
    if (args.spareSubStuSchoolCode) {
        params.append('spareSubStuSchoolCode', args.spareSubStuSchoolCode);
    }
    return fetch({
        url: 'structure/enrollStudentInfo/getNoticeGroupStudentPageList',
        method: 'POST',
        data: params
    });
}

export function getApprovalEnrollStuInfoPageList(args) {
    let params = new URLSearchParams();
    params.append('approvalState', args.approvalState);
    params.append('approvalStepId', args.approvalStepId);
    params.append('graduateSchoolCode', args.graduateSchoolCode);
    params.append('noticeId', args.noticeId);
    params.append('orderType', args.orderType);
    params.append('schoolCountryCode', args.schoolCountryCode);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchTitle', args.searchTitle);
    params.append('subjectStudentCode', args.subjectStudentCode);
    if (args.subjectStuSchoolCode) {
        params.append('subjectStuSchoolCode', args.subjectStuSchoolCode);
    }
    return fetch({
        url: 'structure/enrollStudentInfo/getApprovalEnrollStuInfoPageList',
        method: 'POST',
        data: params
    });
}

export function approvalEnrollStuInfo(args) {
    let params = new URLSearchParams();
    params.append('examRemark', args.examRemark);
    params.append('examState', args.examState);
    params.append('examType', args.examType);
    params.append('noticeId', args.noticeId);
    params.append('stuIds', args.stuIds);
    return fetch({
        url: 'structure/enrollStudentInfo/approvalEnrollStuInfo',
        method: 'POST',
        data: params
    });
}

export function getEnrollStuInfoPageList(args) {
    let params = new URLSearchParams();
    params.append('firBatchFirWishSchoolCode', args.firBatchFirWishSchoolCode);
    params.append('subjectStudentCode', args.subjectStudentCode);
    params.append('graduateSchoolCode', args.graduateSchoolCode);
    params.append('isHasMidTestPic', args.isHasMidTestPic);
    params.append('isSubjectTalentStu', args.isSubjectTalentStu);
    params.append('isHasWishPic', args.isHasWishPic);
    params.append('noticeId', args.noticeId);
    params.append('orderType', args.orderType);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolCountryCode', args.schoolCountryCode);
    params.append('searchTitle', args.searchTitle);
    params.append('spareSubStuCode', args.spareSubStuCode);
    params.append('state', args.state);
    params.append('isHasTalentPic', args.isHasTalentPic);
    if (args.subjectStuSchoolCode) {
        params.append('subjectStuSchoolCode', args.subjectStuSchoolCode);
    }
    if (args.spareSubStuSchoolCode) {
        params.append('spareSubStuSchoolCode', args.spareSubStuSchoolCode);
    }
    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollStuInfoPageList',
        method: 'POST',
        data: params
    });
}

export function selectJuniorSchool(args) {
    let params = new URLSearchParams();
    params.append('areaCode', args.areaCode);

    return fetch({
        url: 'structure/enrollStudentInfo/selectJuniorSchool',
        method: 'POST',
        data: params
    });
}

export function moveEnrollStudentsToGroup(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('stuIds', args.stuIds);
    params.append('targetGroupId', args.targetGroupId);

    return fetch({
        url: 'structure/enrollStudentInfo/moveEnrollStudentsToGroup',
        method: 'POST',
        data: params
    });
}

export function exportAllStuAndAllPicList(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('state', args.state);
    return fetch({
        url: 'structure/enrollStudentInfo/exportAllStuAndAllPicList',
        method: 'POST',
        data: params
    });
}
// 咨询会
export function deleteEnrollNoticeActivityById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/enrollStudentInfo/deleteEnrollNoticeActivityById',
        method: 'POST',
        data: params
    });
}
export function deleteNoticeInchargeById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/enrollStudentInfo/deleteNoticeInchargeById',
        method: 'POST',
        data: params
    });
}
export function addEnrollNoticeActivity(args) {
    let params = new URLSearchParams();
    params.append('activityName', args.activityName);
    params.append('noticeId', args.noticeId);
    params.append('signETime', args.signETime);
    params.append('signSTime', args.signSTime);
    params.append('state', args.state);

    return fetch({
        url: 'structure/enrollStudentInfo/addEnrollNoticeActivity',
        method: 'POST',
        data: params
    });
}
export function getNoticeEnrollSpecialistPageList(args) {
    let params = new URLSearchParams();
    params.append('graduateSchoolName', args.graduateSchoolName);
    params.append('noticeId', args.noticeId);
    params.append('pageSize', args.pageSize);
    params.append('pageNo', args.pageNo);
    params.append('schoolCountryCode', args.schoolCountryCode);

    return fetch({
        url: 'structure/enrollStudentInfo/getNoticeEnrollSpecialistPageList',
        method: 'POST',
        data: params
    });
}
export function getEnrollNoticeActivitySignPageList(args) {
    let params = new URLSearchParams();
    if (args.activityId) {
        params.append('activityId', args.activityId);
    }
    if (args.stuId) {
        params.append('stuId', args.stuId);
    }
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('stuName', args.stuName);

    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollNoticeActivitySignPageList',
        method: 'POST',
        data: params
    });
}
export function getNoticeInchargePageList(args) {
    let params = new URLSearchParams();
    params.append('inchargeUserName', args.inchargeUserName);
    params.append('noticeId', args.noticeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('searchSchoolName', args.searchSchoolName);
    return fetch({
        url: 'structure/enrollStudentInfo/getNoticeInchargePageList',
        method: 'POST',
        data: params
    })
}
export function getEnrollNoticeActivityPageList(args) {
    let params = new URLSearchParams();
    params.append('activityName', args.activityName);
    params.append('noticeId', args.noticeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('state', args.state);
    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollNoticeActivityPageList',
        method: 'POST',
        data: params
    });
}
export function getEnrollNoticeActivityById(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollNoticeActivityById',
        method: 'POST',
        data: params
    });
}
export function editEnrollNoticeActivity(args) {
    let params = new URLSearchParams();
    params.append('activityName', args.activityName);
    params.append('id', args.id);
    params.append('signETime', args.signETime);
    params.append('signSTime', args.signSTime);
    params.append('state', args.state);

    return fetch({
        url: 'structure/enrollStudentInfo/editEnrollNoticeActivity',
        method: 'POST',
        data: params
    });
}
export function getSchoolPublishEnrollNoticeList(args) {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/enrollStudentInfo/getSchoolPublishEnrollNoticeList',
        method: 'POST',
        data: params
    });
}
export function getSpecialistManageSchoolList(noticeId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    return fetch({
        url: 'structure/enrollStudentInfo/getSpecialistManageSchoolList',
        method: 'POST',
        data: params
    });
}


export function getDicDetailInfoByCode(args) {
    let params = new URLSearchParams();
    params.append('code', args.code);
    params.append('schoolId', args.schoolId);
    return fetch({
        url: '/common/schoolDictionary/getDicDetailInfoByCode',
        method: 'POST',
        data: params
    });
}


export function getEnrollStuInfoExamineLogList(stuId) {
    let params = new URLSearchParams();
    params.append('stuId', stuId);
    return fetch({
        url: 'structure/enrollStudentInfo/getEnrollStuInfoExamineLogList',
        method: 'POST',
        data: params
    })
}
export function getNoticeCountryListFromDatas(noticeId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);

    return fetch({
        url: `structure/enrollStudentInfo/getNoticeCountryListFromDatas`,
        method: 'GET',
        params
    })
}
export function saveNoticeSpecialist(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/enrollStudentInfo/saveNoticeSpecialist',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function getNoticeEnrollCustomFilterData(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/enrollStudentInfo/getNoticeEnrollCustomFilterData',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function getStudentCommRecordList(stuId) {
    let params = new URLSearchParams();
    params.append('stuId', stuId);
    return fetch({
        url: 'structure/enrollStudentInfo/getStudentCommRecordList',
        method: 'POST',
        data: params
    })
}

export function getNoticeStuCommLastestInfoPageList(args) {
    let params = new URLSearchParams();
    params.append('stuName', args.stuName);
    params.append('noticeId', args.noticeId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('commMarkBm', args.commMarkBm);
    params.append('schoolCountryCode', args.schoolCountryCode);
    params.append('graduateSchoolCode', args.graduateSchoolCode);
    return fetch({
        url: 'structure/enrollStudentInfo/getNoticeStuCommLastestInfoPageList',
        method: 'POST',
        data: params
    });
}
export function getNoticeStuScoreMarkStaticsList(args) {
    let params = new URLSearchParams();
    params.append('noticeId', args.noticeId);
    params.append('quotaStuTypeBm', args.quotaStuTypeBm || '');
    params.append('preferenceACode', args.preferenceACode || '');
    params.append('preferenceBCode', args.preferenceBCode || '');
    params.append('preferenceCCode', args.preferenceCCode || '');
    params.append('promiseLevelBm', args.promiseLevelBm || '');
     params.append('isHasWishPic', args.isHasWishPic);
    return fetch({
        url: `structure/enrollStudentInfo/getNoticeStuScoreMarkStaticsList`,
        method: 'GET',
        params
    })
}
export function addNoticeIncharge(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/enrollStudentInfo/addNoticeIncharge',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function editNoticeIncharge(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/enrollStudentInfo/editNoticeIncharge',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function getNoticeInchargeInfoById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/enrollStudentInfo/getNoticeInchargeInfoById',
        method: 'POST',
        data: params
    })
}
export function getNoticeSchoolCountryList(noticeId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    return fetch({
        url: 'structure/enrollStudentInfo/getNoticeSchoolCountryList',
        method: 'POST',
        data: params
    })
}
export function getNoticeEnrollCustomFilterStuPageList(args, pageNo, pageSize) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/enrollStudentInfo/getNoticeEnrollCustomFilterStuPageList?pageNo=' + pageNo + '&pageSize' + pageSize,
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function deleteStuById(stuId) {
    let params = new URLSearchParams();
    params.append('stuId', stuId);
    return fetch({
        url: 'structure/enrollStudentInfo/deleteStuById',
        method: 'get',
        params
    });
}
export function deleteEnrollGroupStu(args) {
    let params = new URLSearchParams();
    params.append('stuIds', args.stuIds);
    params.append('groupId', args.groupId);
    return fetch({
        url: '/structure/enrollStudentInfo/deleteEnrollGroupStu',
        method: 'get',
        params
    });
}
export function dealNotAllocationStuDatas(noticeId) {
    let params = new URLSearchParams();
    params.append('noticeId', noticeId);
    return fetch({
        url: 'common/enrollStudentInfo/dealNotAllocationStuDatas',
        method: 'get',
        params
    });
}