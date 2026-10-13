import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据通知id查询点赞科普通知用户列表
export const getHeartEduNoticeRraiseUserList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduNoticeRraiseUserList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })