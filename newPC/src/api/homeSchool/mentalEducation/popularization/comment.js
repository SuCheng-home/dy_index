import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据通知id,用户姓名查询回复列表
export const getHeartEduNoticeCommeList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduNoticeCommeList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据回复id删出回复信息
export const delHeartEduNoticeComme = params =>
    fetch({
        url: 'structure/heartEdu/delHeartEduNoticeComme',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
