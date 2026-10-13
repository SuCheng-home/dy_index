import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"
import { data } from 'jquery';

// 根据id查询科普通知
export const getHeartEduNoticeById = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduNoticeById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据id查询科普通知根据通知id查询科普通知学生列表 2025-12-05
export const getHeartEduNoticeReadUserStList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduNoticeReadUserStList',
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
