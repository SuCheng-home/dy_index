import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 新增咨询回复
export const addHeartEduConsultReply = data =>
    fetch({
        url: 'structure/heartEdu/addHeartEduConsultReply',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })