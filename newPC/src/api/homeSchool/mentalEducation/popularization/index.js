import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据标题，学校id查询科普通知列表
export const getHeartEduNoticeListAll = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduNoticeListAll',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 发布心育科普通知
export const sendHeartEduNotice = data =>
    fetch({
        url: 'structure/heartEdu/sendHeartEduNotice',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 根据id删除科普通知
export const delHeartEduNoticeById = params =>
    fetch({
        url: 'structure/heartEdu/delHeartEduNoticeById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })