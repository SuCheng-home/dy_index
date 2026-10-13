import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据学校id分页查询学生列表
export const getAllStudentBySchoolId = params =>
    systemFetch({
        url: 'api/user/getAllStudentBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学生查家长
export const queryParent = params =>
    systemFetch({
        url: 'api/user/queryParent',
        method: 'GET',
        params: filterURLSearchParams(params)
    })