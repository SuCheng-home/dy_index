import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 新增分类
export const addHeartEduGroup = data =>
    fetch({
        url: 'structure/heartEdu/addHeartEduGroup',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 根据id查询分类详情
export const getHeartEduGroup = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduGroup',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 修改分类
export const updateHeartEduGroup = data =>
    fetch({
        url: 'structure/heartEdu/updateHeartEduGroup',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })
