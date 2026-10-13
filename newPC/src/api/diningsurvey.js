import fetch from '@/utils/fetch';
//根据学期获取就餐调查列表  
export function queryFireSurvey(query) {
	let params = new URLSearchParams();
	params.append('schoolTimeId', query.schoolTimeId);
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
	return fetch({
		url: 'structure/fire/queryFireSurvey',
		method: 'post',
		params
	});
}
export function queryFireSurveyOrder(query) {
	let params = new URLSearchParams();
	params.append('schoolTimeId', query.schoolTimeId);
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
	return fetch({
		url: 'structure/fire/queryFireSurveyOrder',
		method: 'post',
		params
	});
}
//删除食谱
export function deleteRecipe(surveyId) {
    let params = new URLSearchParams();
    params.append('surveyId', surveyId); 
    return fetch({
        url: 'structure/fire/deleteFireSurveyById',
        method: 'get',
        params
    });
}
export function deleteSurveyOrderAnalysis(surveyOrderId) {
    let params = new URLSearchParams();
    params.append('surveyOrderId', surveyOrderId); 
    return fetch({
        url: 'structure/fire/deleteSurveyOrderAnalysis',
        method: 'get',
        params
    });
}
//新增就餐调查
export function insertFireSurvey(query) {
	let params = new URLSearchParams();
	params.append('departJson', query.departJson);
	params.append('endDate', query.endDate);
	params.append('schoolTimeId', query.schoolTimeId);
    params.append('startDate', query.startDate);
    params.append('state', query.state);
    params.append('type', query.type);
	params.append('breakMeal', query.breakMeal);
	params.append('breakfast', query.breakfast);
	params.append('supper', query.supper);
	params.append('lunch', query.lunch);
	return fetch({
		url: 'structure/fire/insertFireSurvey',
		method: 'post',
		data:params
	});
}

//获取调查学生年级
export function getSurveyGrade(surveyId) {
    let params = new URLSearchParams();
    params.append('surveyId', surveyId); 
    return fetch({
        url: 'structure/fire/getSurveyGrade',
        method: 'get',
        params
    });
}
//获取调查学生班级
export function getSurveyClassByGradeId(surveyId,gradeId) {
    let params = new URLSearchParams();
    params.append('surveyId', surveyId); 
    params.append('gradeId', gradeId); 
    return fetch({
        url: 'structure/fire/getSurveyClassByGradeId',
        method: 'get',
        params
    });
}

//就餐调查学生
export function querySurveyStu(query) {
	let params = new URLSearchParams();
	params.append('classId', query.classId);
    params.append('gradeId', query.gradeId);
    params.append('searchName', query.searchName);
    params.append('surveyId', query.surveyId);
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
    params.append('state', query.type);
	return fetch({
		url: 'structure/fire/querySurveyStu',
		method: 'post',
		params
	});
}
export function querySurveyOrderUser(query) {
	let params = new URLSearchParams();
	params.append('classId', query.classId);
    params.append('gradeId', query.gradeId);
    params.append('searchName', query.searchName);
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
    params.append('surveyOrderId', query.surveyOrderId);
	params.append('confirmState', query.confirmState);
	return fetch({
		url: 'structure/fire/querySurveyOrderUser',
		method: 'post',
		params
	});
}
export function surveyOrderAnalysisGroupByClassId(surveyOrderId) {
	let params = new URLSearchParams();
	params.append('surveyOrderId', surveyOrderId);
	return fetch({
		url: 'structure/fire/surveyOrderAnalysisGroupByClassId',
		method: 'post',
		params
	});
}
export function querySurveyTeacher(query) {
	let params = new URLSearchParams();
    params.append('searchName', query.searchName);
    params.append('surveyId', query.surveyId);
	params.append('pageNo', query.pageNo);
	params.append('pageSize', query.pageSize);
    params.append('state', query.type);
	return fetch({
		url: 'structure/fire/querySurveyTeacher',
		method: 'post',
		params
	});
}
export function finishSurvey(surveyId) {
    let params = new URLSearchParams();
    params.append('surveyId', surveyId); 
    return fetch({
        url: 'structure/fire/finishSurvey',
        method: 'get',
        params
    });
}
export function pushConfirm(surveyOrderId) {
    let params = new URLSearchParams();
    params.append('surveyOrderId', surveyOrderId); 
    return fetch({
        url: 'structure/fire/pushConfirm',
        method: 'get',
        params
    });
}
export function remindUnSubmitUser(surveyId,type) {
    let params = new URLSearchParams();
    params.append('surveyId', surveyId); 
    params.append('type', type);
    return fetch({
        url: 'structure/fire/remindUnSubmitUser',
        method: 'get',
        params
    });
}
export function deleteSurveyUser(surveyUserId) {
    let params = new URLSearchParams();
    params.append('surveyUserId', surveyUserId); 
    return fetch({
        url: 'structure/fire/deleteSurveyUser',
        method: 'get',
        params
    });
}

//提交调查
export function submitSurvey(query) {
	let params = new URLSearchParams();
	params.append('breakMeal', query.breakMeal);
    params.append('breakfast', query.breakfast);
    params.append('id', query.id);
	params.append('lunch', query.lunch);
	params.append('repastState', query.repastState);
    params.append('supper', query.supper);
	return fetch({
		url: 'structure/fire/submitSurvey',
		method: 'post',
		data:params
	});
}
export function getSurveyUserByUserId(query) {
	let params = new URLSearchParams();
    params.append('userId', query.userId);
    params.append('type', query.type);
	params.append('surveyId', query.surveyId);
	return fetch({
		url: 'structure/fire/getSurveyUserByUserId',
		method: 'post',
		params
	});
}

//新增就餐调查
export function addSurveyUsers(query) {
	let params = new URLSearchParams();
	params.append('breakMeal', query.breakMeal);
	params.append('breakfast', query.breakfast);
	params.append('lunch', query.lunch);
    params.append('repastDate', query.repastDate);
    params.append('supper', query.supper);
    params.append('surveyId', query.surveyId);
    params.append('type', query.type);
    params.append('userIds', query.userIds);
    params.append('startDate', query.startDate);
    params.append('endDate', query.endDate);
    params.append('state', query.state);
	return fetch({
		url: 'structure/fire/addSurveyUsers',
		method: 'post',
		data:params
	});
}

export function getFireSurveyById(surveyId) {
    let params = new URLSearchParams();
    params.append('surveyId', surveyId); 
    return fetch({
        url: 'structure/fire/getFireSurveyById',
        method: 'get',
        params
    });
}

//生成统计
export function generateAnalysis(query) {
	let params = new URLSearchParams();
	params.append('endDate', query.endDate);
    params.append('startDate', query.startDate);
    params.append('surveyId', query.surveyId);
    params.append('type', query.type);
    params.append('schoolTimeId', query.schoolTimeId);
	return fetch({
		url: 'structure/fire/generateAnalysis',
		method: 'post',
		data:params
	});
}
export function getFireSurveyBySchoolTimeId(schoolTimeId) {
    let params = new URLSearchParams();
    params.append('schoolTimeId', schoolTimeId); 
    return fetch({
        url: 'structure/fire/getFireSurveyBySchoolTimeId',
        method: 'get',
        params
    });
}
export function fireClassSurveyAnalysisByDate(date) {
	let params = new URLSearchParams();
    params.append('date', date);
	return fetch({
		url: 'structure/fire/fireClassSurveyAnalysisByDate',
		method: 'post',
		params
	});
}
export function fireSurveyAnalysisByDate(date) {
	let params = new URLSearchParams();
    params.append('date', date);
	return fetch({
		url: 'structure/fire/fireSurveyAnalysisByDate',
		method: 'post',
		params
	});
}
export function getFireSurveySetByDate(date) {
	let params = new URLSearchParams();
    params.append('date', date);
	return fetch({
		url: 'structure/fire/getFireSurveySetByDate',
		method: 'post',
		params
	});
}
export function stuRepastAnalysisByClassIdAndDate(query) {
	let params = new URLSearchParams();
    params.append('date', query.date);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('classId', query.classId);
	return fetch({
		url: 'structure/fire/stuRepastAnalysisByClassIdAndDate',
		method: 'post',
		params
	});
}
export function teacherRepastAnalysisByDate(query) {
	let params = new URLSearchParams();
    params.append('date', query.date);
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
	return fetch({
		url: 'structure/fire/teacherRepastAnalysisByDate',
		method: 'post',
		params
	});
}


//生成订单
export function generateOrder(query) {
	let params = new URLSearchParams();
	params.append('name', query.name);
	params.append('moduleSn', query.moduleSn);
	params.append('deadlineDate', query.deadlineDate);
    params.append('auditName', query.auditName);
    params.append('auditId', query.auditId);
	return fetch({
		url: 'structure/fire/generateOrder',
		method: 'post',
		data:params
	});
}