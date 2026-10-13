import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 查询志愿服务列表统计
export const getHeartVolunteerListStatic = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteerListStatic',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

//查询志愿服务设置
export const getHeartVolunteerInit = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteerInit',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
// 查询志愿推荐列表统计
export const getHeartVolunteerDarkList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteerDarkList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
//修改志愿服务推荐
export function updateHeartVolunteerDark(data) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/heartEdu/updateHeartVolunteerDark',
        method: 'POST',
        data: JSON.stringify(data)
    })
}
//删除志愿服务推荐
export function delHeartVolunteerDark(params) {
    return fetch({
        url: 'structure/heartEdu/delHeartVolunteerDark',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
}

//修改志愿服务推荐
export function getHeartVolunteerDark(params) {
    return fetch({
        url: 'structure/heartEdu/getHeartVolunteerDark',

        method: 'GET',
        params: filterURLSearchParams(params)
    })
}
// 查询志愿分组列表
export const getHeartVolunteerGroupList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteerGroupList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 查询志愿服务列表
export const getHeartVolunteerList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteerList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 删除志愿服务
export function delHeartVolunteer(params) {
    return fetch({
        url: 'structure/heartEdu/delHeartVolunteer',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
}
// 查询志愿服务详情
export const getHeartVolunteer = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteer',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 家长评价列表
export const getHeartBehStaticList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartBehStaticList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

    // 查询昵称统计
export const getHeartBehNickList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartBehNickList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

     // 查询评价统计
export const getHeartBehStatic = params =>
    fetch({
        url: 'structure/heartEdu/getHeartBehStatic',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
     // 根据学生id查询心育科谱
export const getHearEduNoticeListByStuId = params =>
    fetch({
        url: 'structure/heartEdu/getHearEduNoticeListByStuId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
     // 根据学生id查询家长会
export const getHearJzhListByStuId = params =>
    fetch({
        url: 'structure/heartEdu/getHearJzhListByStuId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

         // 根根据学生id查询心育科谱投稿
export const getHearEduNoticeDarkListByStuId = params =>
    fetch({
        url: 'structure/heartEdu/getHearEduNoticeDarkListByStuId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

         // 根据学生id查询志愿服务
export const getHeartVolunteerListByStuId = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteerListByStuId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

    
         // 根据学生id查询志愿服务推荐
export const getHeartVolunteerDarkListByStuId = params =>
    fetch({
        url: 'structure/heartEdu/getHeartVolunteerDarkListByStuId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

    
         // 根据学生id查询科中育坛
export const getHearKzListByStuId = params =>
    fetch({
        url: 'structure/heartEdu/getHearKzListByStuId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

    // 根查询评价
export const getHeartBeh = params =>
    fetch({
        url: '/structure/heartEdu/getHeartBeh',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
// 新增评价
export function addHeartBeh(data) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/heartEdu/addHeartBeh',
        method: 'POST',
        data: JSON.stringify(data)
    })
}
// 新增评价
export function updateHeartBeh(data) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/heartEdu/updateHeartBeh',
        method: 'POST',
        data: JSON.stringify(data)
    })
}

