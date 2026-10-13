import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 新增心育科普通知
export const addHeartEduNotice = data =>
    fetch({
        url: 'structure/heartEdu/addHeartEduNotice',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 修改心育科普通知
export const updateHeartEduNotice = data =>
    fetch({
        url: 'structure/heartEdu/updateHeartEduNotice',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })