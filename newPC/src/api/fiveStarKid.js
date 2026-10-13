import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
import { data } from 'jquery';
// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 查询五星娃娃列表  传参：schoolTimeId 学期id number
export function getSchoolConductStarBabyList(args) {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductStarBabyList',
        method: 'get',
        params: filterURLSearchParams(args)
    });
}

// 新增五星娃娃
/**传参：
 * goalNum	目标数量	number	
studentId	学生id	number	
studentLogo	学生头像	string	
studentName	学生姓名	string	
studentNo	学号	string
 * */
export function addSchoolConductStarBaby(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/addSchoolConductStarBaby',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 修改五星娃娃
/**传参：
 * 	adviceContent建议string	 可不传
behContent	评语	string	可不传
goalNum	目标数量	number	可不传
schoolTimeId	学期Id	number	
studentId	学生id	number	
 * */
export function updateSchoolConductStarBaby(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/updateSchoolConductStarBaby',
        method: 'post',
        data: JSON.stringify(args)
    });
}


// 删除五星娃娃  传参：schoolTimeId 学期id number  studentId	学生id number
export function delSchoolConductStarBaby(args) {
    return fetch({
        url: 'structure/schoolConduct/delSchoolConductStarBaby',
        method: 'get',
        params: filterURLSearchParams(args)
    });
}

// 查询五星娃娃 详情  传参：schoolTimeId 学期id number  studentId	学生id number
export function getSchoolConductStarBaby(args) {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductStarBaby',
        method: 'get',
        params: filterURLSearchParams(args)
    });
}

// 查询五星娃娃统计  传参：schoolTimeId 学期id number studentId	学生id number
export function getSchoolConductStarBabyStatic(args) {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductStarBabyStatic',
        method: 'get',
        params: filterURLSearchParams(args)
    });
}

// 查询五星娃娃 详情  传参：schoolTimeId 学期id number  studentId	学生id number dimensionId	维度id number
export function getSchoolConductTypeListByTypeCode(args) {
    return fetch({
        url: 'structure/schoolConduct/getSchoolConductTypeListByTypeCode',
        method: 'get',
        params: filterURLSearchParams(args)
    });
}

// 查询学生班级列表  hasPic    optionName	  studentId
export function getStuZuJiClassCirclePicPageList(args) {
    return fetch({
        url: 'structure/classCircle/getStuZuJiClassCirclePicPageList',
        method: 'get',
        params: filterURLSearchParams(args)
    });
}


// 新增五星娃娃评语
export function addSchoolConductStarBabyBeh(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/addSchoolConductStarBabyBeh',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 修改五星娃娃评语
export function updateSchoolConductStarBabyBeh(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/updateSchoolConductStarBabyBeh',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 查询五星娃娃学年目标
export function getSchoolYearGalNum(args) {
    return fetch({
        url: 'structure/schoolConduct/getSchoolYearGalNum',
        method: 'get',
        params: filterURLSearchParams(args)
    });
}


// 生成五星娃娃AI评语
export function getAiBehContent(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolConduct/getAiBehContent',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//根据年级ID获得序号
export function getLevelByGradeId(args){
  let params=new URLSearchParams();
  params.append("gradeId",args.gradeId);
  return fetch({
    url: 'depart/getLevelByGradeId',
    method: 'get',
    params
  })
}

//查询学校所有学期列表
export function getSchoolTimeAllList() {
  return fetch({
    url: 'structure/schoolTime/getSchoolTimeAllList',
    method: 'post'
  })
}
