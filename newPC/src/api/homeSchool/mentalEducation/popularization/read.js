import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据通知id查询已读科普通知用户列表
export const getHeartEduNoticeReadUserList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduNoticeReadUserList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })