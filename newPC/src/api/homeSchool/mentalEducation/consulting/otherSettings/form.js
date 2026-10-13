import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据学校id查询初始化设置
export const getHeartEduInit = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduInit',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 新增修改初始化设置
export const addAndUpdateHeartEduInit = data =>
    fetch({
        url: 'structure/heartEdu/addAndUpdateHeartEduInit',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })