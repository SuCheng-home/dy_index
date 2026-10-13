import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据标题，学校id查询科普通知列表
export const getHeartEduDarkList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduDarkList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 删除科谱投搞
export const delHeartEduDark = params =>
    fetch({
        url: 'structure/heartEdu/delHeartEduDark',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 查询科谱投搞
export const getHeartEduDark = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduDark',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

//查询学校所有学期列表
export function getSchoolTimeAllList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'GET',
        params
    })
}

//修改科谱投搞
export function updateHeartEduDark(data) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/heartEdu/updateHeartEduDark',
        method: 'POST',
        data: JSON.stringify(data)
    })
}

