import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据咨询id查询咨询详情
export const getHeartEduConsultById = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduConsultById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据咨询id查询回复列表
export const getHeartEduConsultReplyListAll = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduConsultReplyListAll',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id查询初始化设置
export const getHeartEduInit = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduInit',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据咨询id删除咨询
export const delHeartEduConsultById = params =>
    fetch({
        url: 'structure/heartEdu/delHeartEduConsultById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 删除咨询回复
export const delHeartEduConsultReply = params =>
    fetch({
        url: 'structure/heartEdu/delHeartEduConsultReply',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 转办咨询
export const complaintHeartEduConsult = data =>
    fetch({
        url: 'structure/heartEdu/complaintHeartEduConsult',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })